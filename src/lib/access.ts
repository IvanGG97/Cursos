import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { ClassDef } from "@/content/types";
import { isLocalMode } from "./supabase/config";
import { createClient } from "./supabase/server";

// Única fuente de verdad sobre quién puede ver qué.
// La RLS de la base protege los datos; estas reglas deciden qué contenido (que vive en el repo) se sirve.

export type Viewer =
  | { kind: "local" } // sin Supabase configurado (solo desarrollo): acceso total
  | { kind: "anon" }
  | { kind: "user"; id: string; email: string; name: string | null; isAdmin: boolean; blocked: boolean };

export const getViewer = cache(async (): Promise<Viewer> => {
  // Todo lo que depende del visitante se resuelve por request, nunca en el build.
  await connection();
  if (isLocalMode()) return { kind: "local" };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { kind: "anon" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, full_name")
    .eq("id", claims.sub)
    .maybeSingle();
  const blocked = profile?.status === "blocked";
  return {
    kind: "user",
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    name: profile?.full_name ?? null,
    isAdmin: profile?.role === "admin" && !blocked,
    blocked,
  };
});

/** Admin (o modo local): ve todo, incluidas clases ocultas ("modo presentador"). */
export const canManage = (v: Viewer) => v.kind === "local" || (v.kind === "user" && v.isAdmin);

export type Release = { visible: boolean; visibleFrom: string | null };

export type CourseState = {
  published: boolean;
  /** Curso "Libre": las clases liberadas las ve cualquiera, sin cuenta ni inscripción. */
  isPublic: boolean;
  enrollment: "none" | "active" | "suspended";
  /** Clases a las que este visitante tiene acceso individual (aunque estén ocultas). */
  grants: Set<number>;
  releases: Map<number, Release>;
  /** Encuesta final: habilitada sí/no + desde cuándo (opcional). Mismo criterio que las clases. */
  survey: Release;
};

/** ¿Se puede responder la encuesta ahora? */
export function isSurveyOpen(state: CourseState, now = new Date()) {
  const s = state.survey;
  return Boolean(s.visible && (!s.visibleFrom || new Date(s.visibleFrom) <= now));
}

export const getCourseState = cache(async (slug: string): Promise<CourseState> => {
  const viewer = await getViewer();
  if (viewer.kind === "local") {
    return {
      published: true,
      isPublic: false,
      enrollment: "active",
      grants: new Set(),
      releases: new Map(),
      survey: { visible: true, visibleFrom: null },
    };
  }

  const supabase = await createClient();
  const isUser = viewer.kind === "user";
  const [course, releases, enrollment, grants] = await Promise.all([
    // "*" y no columnas explícitas: si la migración de `access` todavía no corrió, no rompe (queda "con inscripción").
    supabase.from("courses").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("class_releases").select("class_num, visible, visible_from").eq("course_slug", slug),
    isUser
      ? supabase.from("enrollments").select("status").eq("course_slug", slug).eq("user_id", viewer.id).maybeSingle()
      : Promise.resolve({ data: null }),
    isUser
      ? supabase.from("class_grants").select("class_num").eq("course_slug", slug).eq("user_id", viewer.id)
      : Promise.resolve({ data: [] as { class_num: number }[] }),
  ]);

  const published = Boolean(course.data?.published);
  // Sin la migración de la encuesta (columna inexistente) se mantiene como antes: abierta.
  const surveyOpen = course.data?.survey_open as boolean | undefined;
  return {
    survey: { visible: surveyOpen ?? true, visibleFrom: (course.data?.survey_open_from as string | null) ?? null },
    published,
    isPublic: published && course.data?.access === "public",
    enrollment: enrollment.data ? (enrollment.data.status === "suspended" ? "suspended" : "active") : "none",
    grants: new Set((grants.data ?? []).map((g) => g.class_num as number)),
    releases: new Map(
      (releases.data ?? []).map((r) => [r.class_num as number, { visible: r.visible, visibleFrom: r.visible_from }]),
    ),
  };
});

/**
 * Qué cursos puede ver este visitante: los publicados, más aquellos en los que está inscripto
 * o tiene acceso individual a alguna clase (aunque el curso no esté publicado). El admin ve todos.
 */
export const getVisibleCourseSlugs = cache(async (): Promise<Set<string> | "all"> => {
  const viewer = await getViewer();
  if (canManage(viewer)) return "all";
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("slug").eq("published", true);
  const slugs = new Set((data ?? []).map((c) => c.slug as string));

  if (viewer.kind === "user" && !viewer.blocked) {
    const [enr, gr] = await Promise.all([
      supabase.from("enrollments").select("course_slug").eq("user_id", viewer.id).eq("status", "active"),
      supabase.from("class_grants").select("course_slug").eq("user_id", viewer.id),
    ]);
    for (const r of [...(enr.data ?? []), ...(gr.data ?? [])]) slugs.add(r.course_slug as string);
  }
  return slugs;
});

/** Cursos en modo "Libre" (publicados y abiertos sin registro), para marcarlos en el catálogo. */
export const getPublicCourseSlugs = cache(async (): Promise<Set<string>> => {
  const viewer = await getViewer();
  if (viewer.kind === "local") return new Set();
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("*").eq("published", true);
  return new Set((data ?? []).filter((c) => c.access === "public").map((c) => c.slug as string));
});

export type ClassStatus =
  | { kind: "open"; preview: boolean } // preview = el admin la ve aunque los alumnos todavía no
  | { kind: "empty" } // todavía sin contenido
  | { kind: "scheduled"; from: string } // liberada con fecha futura
  | { kind: "hidden" }
  | { kind: "login" }
  | { kind: "enroll" }
  | { kind: "suspended" } // inscripción suspendida
  | { kind: "blocked" }; // cuenta suspendida

export function isReleased(state: CourseState, num: number, now = new Date()) {
  const r = state.releases.get(num);
  return Boolean(state.published && r?.visible && (!r.visibleFrom || new Date(r.visibleFrom) <= now));
}

export function classStatus(viewer: Viewer, state: CourseState, clase: ClassDef): ClassStatus {
  if (clase.slides.length === 0) return { kind: "empty" };
  if (viewer.kind === "local") return { kind: "open", preview: false };

  const released = isReleased(state, clase.num);
  if (canManage(viewer)) return { kind: "open", preview: !released };

  // Curso libre: las clases liberadas las ve cualquiera, con o sin cuenta (incluso una cuenta
  // suspendida: sin sesión la vería igual). Las ocultas siguen ocultas, salvo acceso individual.
  if (state.isPublic) {
    if (released) return { kind: "open", preview: false };
    if (viewer.kind === "user" && !viewer.blocked && state.grants.has(clase.num)) return { kind: "open", preview: false };
    const r = state.releases.get(clase.num);
    if (r?.visible && r.visibleFrom) return { kind: "scheduled", from: r.visibleFrom };
    return { kind: "hidden" };
  }

  if (viewer.kind === "anon") return { kind: "login" };
  if (viewer.blocked) return { kind: "blocked" };

  // El acceso individual habilita la clase aunque esté oculta y aunque no haya inscripción.
  if (state.grants.has(clase.num)) return { kind: "open", preview: false };

  if (state.enrollment === "suspended") return { kind: "suspended" };
  if (state.enrollment === "none") return { kind: "enroll" };
  if (released) return { kind: "open", preview: false };

  const r = state.releases.get(clase.num);
  if (state.published && r?.visible && r.visibleFrom) return { kind: "scheduled", from: r.visibleFrom };
  return { kind: "hidden" };
}
