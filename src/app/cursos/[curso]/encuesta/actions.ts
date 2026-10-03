"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { getCourseState, getViewer, getVisibleCourseSlugs, isSurveyOpen } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export type SurveyState = { error?: string; done?: boolean };

export async function submitSurvey(slug: string, _prev: SurveyState, formData: FormData): Promise<SurveyState> {
  const viewer = await getViewer();
  if (viewer.kind !== "user") return { error: "Tenés que iniciar sesión." };
  const course = getCourse(slug);
  const survey = course?.survey;
  if (!course || !survey) return { error: "Encuesta inexistente." };
  const visible = await getVisibleCourseSlugs();
  if (visible !== "all" && !visible.has(slug)) return { error: "Este curso no está disponible para vos." };
  // La base también lo rechaza (política de la tabla), pero así el mensaje es claro.
  if (!isSurveyOpen(await getCourseState(slug))) return { error: "La encuesta no está habilitada en este momento." };

  const answers: Record<string, string | number> = {};
  for (const q of survey.questions) {
    const raw = String(formData.get(q.id) ?? "").trim();
    if (!raw) {
      if (q.required) return { error: `Falta responder: “${q.label}”.` };
      continue;
    }
    if (q.kind === "scale") {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < q.min || n > q.max) return { error: `Respuesta inválida en “${q.label}”.` };
      answers[q.id] = n;
    } else if (q.kind === "choice") {
      if (!q.options.includes(raw)) return { error: `Respuesta inválida en “${q.label}”.` };
      answers[q.id] = raw;
    } else {
      answers[q.id] = raw.slice(0, 2000);
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("survey_responses")
    .insert({ user_id: viewer.id, course_slug: slug, survey_id: survey.id, answers });
  if (error && error.code !== "23505") return { error: "No pudimos guardar tus respuestas. Probá de nuevo." };

  revalidatePath(`/cursos/${slug}`);
  return { done: true };
}
