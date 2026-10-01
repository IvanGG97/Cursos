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
  | { kind: "user"; id: string; email: string; isAdmin: boolean };

export const getViewer = cache(async (): Promise<Viewer> => {
  // Todo lo que depende del visitante se resuelve por request, nunca en el build.
  await connection();
  if (isLocalMode()) return { kind: "local" };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { kind: "anon" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", claims.sub).maybeSingle();
  return {
    kind: "user",
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    isAdmin: profile?.role === "admin",
  };
});

/** Admin (o modo local): ve todo, incluidas clases ocultas ("modo presentador"). */
export const canManage = (v: Viewer) => v.kind === "local" || (v.kind === "user" && v.isAdmin);

export type Release = { visible: boolean; visibleFrom: string | null };

export type CourseState = {
  published: boolean;
  enrolled: boolean;
  releases: Map<number, Release>;
};

export const getCourseState = cache(async (slug: string): Promise<CourseState> => {
  const viewer = await getViewer();
  if (viewer.kind === "local") return { published: true, enrolled: true, releases: new Map() };

  const supabase = await createClient();
  const [course, releases, enrollment] = await Promise.all([
    supabase.from("courses").select("published").eq("slug", slug).maybeSingle(),
    supabase.from("class_releases").select("class_num, visible, visible_from").eq("course_slug", slug),
    viewer.kind === "user"
      ? supabase
          .from("enrollments")
          .select("course_slug")
          .eq("course_slug", slug)
          .eq("user_id", viewer.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    published: Boolean(course.data?.published),
    enrolled: Boolean(enrollment.data),
    releases: new Map(
      (releases.data ?? []).map((r) => [r.class_num as number, { visible: r.visible, visibleFrom: r.visible_from }]),
    ),
  };
});

/** Qué cursos aparecen en el catálogo para este visitante. */
export const getPublishedSlugs = cache(async (): Promise<Set<string> | "all"> => {
  const viewer = await getViewer();
  if (canManage(viewer)) return "all";
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("slug").eq("published", true);
  return new Set((data ?? []).map((c) => c.slug as string));
});

export type ClassStatus =
  | { kind: "open"; preview: boolean } // preview = el admin la ve aunque los alumnos todavía no
  | { kind: "empty" } // todavía sin contenido
  | { kind: "scheduled"; from: string } // liberada con fecha futura
  | { kind: "hidden" }
  | { kind: "login" }
  | { kind: "enroll" };

export function isReleased(state: CourseState, num: number, now = new Date()) {
  const r = state.releases.get(num);
  return Boolean(state.published && r?.visible && (!r.visibleFrom || new Date(r.visibleFrom) <= now));
}

export function classStatus(viewer: Viewer, state: CourseState, clase: ClassDef): ClassStatus {
  if (clase.slides.length === 0) return { kind: "empty" };
  if (viewer.kind === "local") return { kind: "open", preview: false };

  const released = isReleased(state, clase.num);
  if (canManage(viewer)) return { kind: "open", preview: !released };
  if (viewer.kind === "anon") return { kind: "login" };
  if (!state.enrolled) return { kind: "enroll" };
  if (released) return { kind: "open", preview: false };

  const r = state.releases.get(clase.num);
  if (state.published && r?.visible && r.visibleFrom) return { kind: "scheduled", from: r.visibleFrom };
  return { kind: "hidden" };
}
