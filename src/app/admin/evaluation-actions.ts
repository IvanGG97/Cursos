"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit } from "@/lib/admin";
import { evaluationProblems, normalizeEvaluation } from "@/lib/evaluation-rules";
import { createServiceClient } from "@/lib/supabase/admin";

// Editar las preguntas de una evaluación desde el panel. Lo editado reemplaza a lo del repo
// (que queda como "versión original" y se puede restaurar). La tabla tiene las respuestas
// correctas: solo la escribe el servidor, después de verificar que es un admin.

type Result = { error?: string; ok?: string };
const MISSING = "Falta correr la migración 20261006000000_evaluation_settings.sql en Supabase.";

function target(slug: string, num: number) {
  const course = getCourse(slug);
  const clase = course?.classes.find((c) => c.num === num);
  if (!course || !clase?.evaluation) throw new Error("Esta clase no tiene evaluación.");
  return { course, clase, original: clase.evaluation };
}

/** Guarda las preguntas editadas. Cada guardado es una versión nueva (id nuevo). */
export async function saveEvaluation(slug: string, num: number, data: unknown): Promise<Result> {
  try {
    const ctx = await adminCtx();
    const { course, original } = target(slug, num);
    // Id nuevo por versión: así el acierto por pregunta no mezcla preguntas viejas con nuevas.
    const id = `${original.id}-e${Date.now().toString(36)}`;
    const ev = normalizeEvaluation(data, id);
    if (!ev) return { error: "Los datos de la evaluación no son válidos." };
    const problems = evaluationProblems(ev);
    if (problems.length) return { error: problems.slice(0, 5).join(" ") };

    await ctx.supabase.from("courses").upsert({ slug: course.slug }, { onConflict: "slug", ignoreDuplicates: true });
    const { error } = await createServiceClient()
      .from("evaluation_settings")
      .upsert(
        { course_slug: course.slug, class_num: num, content: ev, updated_at: new Date().toISOString(), updated_by: ctx.viewer.id },
        { onConflict: "course_slug,class_num" },
      );
    if (error) return { error: /evaluation_settings|42P01|PGRST205/.test(`${error.code} ${error.message}`) ? MISSING : error.message };
    await audit(ctx, "evaluation.edit", `${course.slug}/clase-${num}`, { id, questions: ev.questions.length });
    revalidatePath("/", "layout");
    return { ok: "Cambios guardados. Los alumnos ya ven esta versión." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

/** Vuelve a las preguntas originales (las del repo). */
export async function restoreEvaluation(slug: string, num: number): Promise<Result> {
  try {
    const ctx = await adminCtx();
    const { course } = target(slug, num);
    const { error } = await createServiceClient()
      .from("evaluation_settings")
      .update({ content: null, updated_at: new Date().toISOString(), updated_by: ctx.viewer.id })
      .eq("course_slug", course.slug)
      .eq("class_num", num);
    if (error) return { error: /42P01|PGRST205/.test(`${error.code}`) ? MISSING : error.message };
    await audit(ctx, "evaluation.restore", `${course.slug}/clase-${num}`);
    revalidatePath("/", "layout");
    return { ok: "Se restauraron las preguntas originales." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo restaurar." };
  }
}
