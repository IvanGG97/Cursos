"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { classStatus, getCourseState, getViewer } from "@/lib/access";
import { grade, type GradeResult } from "@/lib/evaluations";
import { createServiceClient, isServiceConfigured } from "@/lib/supabase/admin";

export type SubmitResult = { error?: string; result?: GradeResult };

/** Corrige en el servidor y guarda el intento (solo el servidor puede escribir intentos). */
export async function submitEvaluation(slug: string, num: number, answers: Record<string, number[]>): Promise<SubmitResult> {
  const viewer = await getViewer();
  if (viewer.kind !== "user") return { error: "Tenés que iniciar sesión para guardar tu evaluación." };

  const course = getCourse(slug);
  const clase = course?.classes.find((c) => c.num === num);
  const ev = clase?.evaluation;
  if (!course || !clase || !ev) return { error: "Evaluación inexistente." };
  if (classStatus(viewer, await getCourseState(slug), clase).kind !== "open") {
    return { error: "Esta clase no está disponible para vos." };
  }

  const missing = ev.questions.filter((q) => !answers[q.id]?.length).length;
  if (missing > 0) return { error: `Te falta responder ${missing} pregunta(s).` };
  if (!isServiceConfigured) return { error: "Las evaluaciones todavía no están configuradas (falta la clave del servidor)." };

  const result = grade(ev, answers);
  const { error } = await createServiceClient().from("evaluation_attempts").insert({
    user_id: viewer.id,
    course_slug: slug,
    class_num: num,
    evaluation_id: ev.id,
    score: result.score,
    total: result.total,
    passed: result.passed,
    answers: Object.fromEntries(result.questions.map((q) => [q.id, q.chosen])),
  });
  if (error) return { error: "No pudimos guardar tu evaluación. Probá de nuevo." };

  revalidatePath(`/cursos/${slug}`);
  return { result };
}
