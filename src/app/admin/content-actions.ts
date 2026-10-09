"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit } from "@/lib/admin";
import { currentVersionId, getClassAtVersion } from "@/lib/class-content";
import { classProblems, normalizeSlides } from "@/lib/slide-rules";
import { createServiceClient } from "@/lib/supabase/admin";

// Editor de clases: borrador → publicar (versión nueva). Las tablas las usa solo el servidor,
// después de verificar que quien edita es admin. Ver la migración 20261010000000_class_content.sql.

type Result = { error?: string; ok?: string };
const MISSING = "Falta correr la migración 20261010000000_class_content.sql en Supabase.";
const missing = (e: { message: string; code?: string } | null) =>
  Boolean(e && (/class_drafts|class_versions|content_version/.test(e.message) || e.code === "42P01" || e.code === "PGRST205"));

function target(slug: string, num: number) {
  const course = getCourse(slug);
  const clase = course?.classes.find((c) => c.num === num);
  if (!course || !clase) throw new Error("Clase inexistente.");
  return { course, clase };
}

async function run(fn: () => Promise<Result>): Promise<Result> {
  try {
    return await fn();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal. Probá de nuevo." };
  }
}

/** Guarda el borrador (lo que se está editando). Los alumnos no lo ven. */
export async function saveClassDraft(slug: string, num: number, data: unknown): Promise<Result> {
  return run(async () => {
    const ctx = await adminCtx();
    const { course } = target(slug, num);
    const slides = normalizeSlides(data);
    if (!slides) return { error: "Las diapositivas no tienen un formato válido." };
    await ctx.supabase.from("courses").upsert({ slug: course.slug }, { onConflict: "slug", ignoreDuplicates: true });
    const { error } = await createServiceClient()
      .from("class_drafts")
      .upsert(
        { course_slug: slug, class_num: num, slides, base_version: await currentVersionId(slug, num), updated_at: new Date().toISOString(), updated_by: ctx.viewer.id },
        { onConflict: "course_slug,class_num" },
      );
    if (error) return { error: missing(error) ? MISSING : error.message };
    await audit(ctx, "content.draft", `${slug}/clase-${num}`, { slides: slides.length });
    return { ok: "Borrador guardado. Los alumnos todavía no lo ven." };
  });
}

/** Publica el borrador: queda como versión nueva y es lo que ven todos. */
export async function publishClass(slug: string, num: number, data: unknown, note: string): Promise<Result> {
  return run(async () => {
    const ctx = await adminCtx();
    const { course } = target(slug, num);
    const slides = normalizeSlides(data);
    if (!slides) return { error: "Las diapositivas no tienen un formato válido." };
    const problems = classProblems(slides);
    if (problems.length) return { error: `Antes de publicar, corregí: ${problems.slice(0, 4).join(" · ")}` };

    const svc = createServiceClient();
    // Con una clase en vivo abierta no se publica: sus resultados van por número de diapositiva.
    const { data: open } = await svc
      .from("live_sessions")
      .select("id")
      .eq("course_slug", slug)
      .eq("class_num", num)
      .eq("status", "open")
      .limit(1);
    if (open?.length) return { error: "Hay una clase en vivo abierta de esta clase. Terminala y después publicá." };

    await ctx.supabase.from("courses").upsert({ slug: course.slug }, { onConflict: "slug", ignoreDuplicates: true });
    const { error } = await svc
      .from("class_versions")
      .insert({ course_slug: slug, class_num: num, slides, note: note.trim().slice(0, 200) || null, created_by: ctx.viewer.id });
    if (error) return { error: missing(error) ? MISSING : error.message };
    await svc.from("class_drafts").delete().eq("course_slug", slug).eq("class_num", num);
    await audit(ctx, "content.publish", `${slug}/clase-${num}`, { slides: slides.length, note: note.trim() || null });
    revalidatePath("/", "layout");
    return { ok: "¡Publicado! Los alumnos ya ven esta versión." };
  });
}

/** Descarta el borrador: vuelve a lo publicado. */
export async function discardClassDraft(slug: string, num: number): Promise<Result> {
  return run(async () => {
    const ctx = await adminCtx();
    target(slug, num);
    const { error } = await createServiceClient().from("class_drafts").delete().eq("course_slug", slug).eq("class_num", num);
    if (error) return { error: missing(error) ? MISSING : error.message };
    await audit(ctx, "content.discard", `${slug}/clase-${num}`);
    return { ok: "Borrador descartado." };
  });
}

/**
 * Trae una versión anterior (o la original del repo, con versionId = null) al borrador, para revisarla
 * y publicarla. No cambia nada para los alumnos hasta que se publique.
 */
export async function restoreClassVersion(slug: string, num: number, versionId: number | null): Promise<Result & { slides?: unknown }> {
  try {
    const ctx = await adminCtx();
    const { clase: repo } = target(slug, num);
    const clase = versionId === null ? repo : await getClassAtVersion(slug, num, versionId);
    if (!clase) return { error: "Esa versión no existe." };
    const { error } = await createServiceClient()
      .from("class_drafts")
      .upsert(
        { course_slug: slug, class_num: num, slides: clase.slides, base_version: await currentVersionId(slug, num), updated_at: new Date().toISOString(), updated_by: ctx.viewer.id },
        { onConflict: "course_slug,class_num" },
      );
    if (error) return { error: missing(error) ? MISSING : error.message };
    await audit(ctx, "content.restore", `${slug}/clase-${num}`, { version: versionId ?? "original" });
    return {
      ok: versionId === null ? "Se cargó la versión original en el borrador. Revisala y publicala." : "Se cargó esa versión en el borrador. Revisala y publicala.",
      slides: clase.slides,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo restaurar." };
  }
}
