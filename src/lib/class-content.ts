import "server-only";
import { cache } from "react";
import type { ClassDef, Course, Slide } from "@/content/types";
import { courses as REPO, getCourse, typeset } from "@/content/registry";
import { normalizeSlides } from "./slide-rules";
import { createServiceClient, isServiceConfigured } from "./supabase/admin";

// Contenido VIGENTE de las clases: lo del repo, salvo que la clase se haya editado y publicado desde
// el panel (tabla class_versions: la última versión de cada clase manda; slides = null = volver al
// repo). Todo lo que muestra diapositivas (la clase, el PDF, la clase en vivo, el panel) lee de acá.
// Sin la migración o sin la clave del servidor, queda todo como antes: el repo.

type VersionRow = { id: number; class_num: number; slides: unknown };

/** Última versión publicada de cada clase de un curso (por número de clase). */
const latestVersions = cache(async (slug: string): Promise<Map<number, VersionRow>> => {
  const out = new Map<number, VersionRow>();
  if (!isServiceConfigured) return out;
  const { data, error } = await createServiceClient()
    .from("class_versions")
    .select("id, class_num, slides")
    .eq("course_slug", slug)
    .order("id", { ascending: false });
  if (error || !data) return out;
  for (const r of data as VersionRow[]) if (!out.has(r.class_num)) out.set(r.class_num, r);
  return out;
});

/** Diapositivas guardadas en la base, listas para mostrar (o null si no sirven). */
function fromDb(raw: unknown): Slide[] | null {
  const slides = normalizeSlides(raw);
  return slides ? typeset(slides) : null;
}

/** El curso con el contenido vigente de cada clase. */
export const getLiveCourse = cache(async (slug: string): Promise<Course | undefined> => {
  const course = getCourse(slug);
  if (!course) return undefined;
  const versions = await latestVersions(slug);
  if (versions.size === 0) return course;
  return {
    ...course,
    classes: course.classes.map((c): ClassDef => {
      const v = versions.get(c.num);
      const slides = v?.slides ? fromDb(v.slides) : null;
      return slides ? { ...c, slides } : c;
    }),
  };
});

/** Todos los cursos con su contenido vigente (catálogo y listados). */
export async function getLiveCourses(): Promise<Course[]> {
  return Promise.all(REPO.map(async (c) => (await getLiveCourse(c.slug)) ?? c));
}

/** Id de la versión vigente de una clase (null = la del repo, nunca editada). */
export async function currentVersionId(slug: string, num: number): Promise<number | null> {
  return (await latestVersions(slug)).get(num)?.id ?? null;
}

/**
 * Las diapositivas de una clase tal como estaban en una versión (para las clases en vivo, que guardan
 * sus resultados por número de diapositiva). null = la del repo.
 */
export async function getClassAtVersion(slug: string, num: number, versionId: number | null): Promise<ClassDef | undefined> {
  const repo = getCourse(slug)?.classes.find((c) => c.num === num);
  if (!repo || versionId === null || !isServiceConfigured) return repo;
  const { data } = await createServiceClient()
    .from("class_versions")
    .select("slides")
    .eq("id", versionId)
    .eq("course_slug", slug)
    .eq("class_num", num)
    .maybeSingle();
  const slides = data?.slides ? fromDb(data.slides) : null;
  return slides ? { ...repo, slides } : repo;
}

/**
 * La clase tal como se dio en una clase en vivo (la versión vigente al iniciarla). Así los resultados
 * y el ranking siguen apuntando a las preguntas correctas aunque después la clase se edite.
 */
export async function getSessionClass(sessionId: string, slug: string, num: number): Promise<ClassDef | undefined> {
  const repo = getCourse(slug)?.classes.find((c) => c.num === num);
  if (!repo || !isServiceConfigured) return repo;
  const { data, error } = await createServiceClient().from("live_sessions").select("content_version").eq("id", sessionId).maybeSingle();
  // Sin la migración (no existe la columna): todas las clases en vivo se dieron con la del repo.
  if (error) return repo;
  return getClassAtVersion(slug, num, (data?.content_version as number | null | undefined) ?? null);
}

// ---------------------------------------------------------------------------
// Para el editor del panel (solo admin)
// ---------------------------------------------------------------------------

/** Para la lista de clases del panel: si cada clase está editada y si tiene un borrador pendiente. */
export async function getContentStatus(slug: string) {
  const out = new Map<number, { editedAt: string | null; draftAt: string | null }>();
  if (!isServiceConfigured) return { ready: false, byClass: out };
  const svc = createServiceClient();
  const [v, d] = await Promise.all([
    svc.from("class_versions").select("class_num, slides, created_at").eq("course_slug", slug).order("id", { ascending: false }),
    svc.from("class_drafts").select("class_num, updated_at").eq("course_slug", slug),
  ]);
  if (v.error || d.error) return { ready: false, byClass: out };
  for (const r of v.data ?? []) {
    const num = r.class_num as number;
    if (!out.has(num)) out.set(num, { editedAt: r.slides === null ? null : (r.created_at as string), draftAt: null });
  }
  for (const r of d.data ?? []) {
    const num = r.class_num as number;
    out.set(num, { editedAt: out.get(num)?.editedAt ?? null, draftAt: r.updated_at as string });
  }
  return { ready: true, byClass: out };
}

export type VersionInfo ={ id: number; note: string | null; created_at: string; original: boolean; author: string | null };

export async function getEditorData(slug: string, num: number) {
  const live = (await getLiveCourse(slug))?.classes.find((c) => c.num === num);
  const repo = getCourse(slug)?.classes.find((c) => c.num === num);
  const empty = { draft: null as Slide[] | null, draftUpdatedAt: null as string | null, versions: [] as VersionInfo[], ready: false };
  if (!live || !repo || !isServiceConfigured) return { live, repo, ...empty };
  const svc = createServiceClient();
  const [d, v] = await Promise.all([
    svc.from("class_drafts").select("slides, updated_at").eq("course_slug", slug).eq("class_num", num).maybeSingle(),
    svc
      .from("class_versions")
      .select("id, note, created_at, slides, created_by")
      .eq("course_slug", slug)
      .eq("class_num", num)
      .order("id", { ascending: false })
      .limit(30),
  ]);
  // Sin la migración: el editor avisa que falta correrla.
  if (d.error || v.error) return { live, repo, ...empty };
  const ids = [...new Set((v.data ?? []).map((r) => r.created_by).filter(Boolean))] as string[];
  const { data: people } = ids.length ? await svc.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] };
  const who = new Map((people ?? []).map((p) => [p.id as string, (p.full_name || p.email) as string | null]));
  const versions: VersionInfo[] = (v.data ?? []).map((r) => ({
    id: r.id as number,
    note: r.note as string | null,
    created_at: r.created_at as string,
    original: r.slides === null,
    author: r.created_by ? (who.get(r.created_by as string) ?? null) : null,
  }));
  return {
    live,
    repo,
    draft: d.data?.slides ? normalizeSlides(d.data.slides) : null,
    draftUpdatedAt: (d.data?.updated_at as string | undefined) ?? null,
    versions,
    ready: true,
  };
}
