import "server-only";
import { cache } from "react";
import { getViewer } from "./access";
import { createClient } from "./supabase/server";

// Progreso y evaluaciones del visitante en un curso (para la página del curso).

export type ClassProgress = { last: number; max: number; total: number; completed: boolean };
export type EvalSummary = { attempts: number; best: number; total: number; passed: boolean };

export const getMyCourseProgress = cache(async (slug: string) => {
  const empty = { progress: new Map<number, ClassProgress>(), evals: new Map<number, EvalSummary>(), surveyDone: false };
  const viewer = await getViewer();
  if (viewer.kind !== "user") return empty;

  const supabase = await createClient();
  const [prog, atts, survey] = await Promise.all([
    supabase
      .from("class_progress")
      .select("class_num, last_slide, max_slide, total_slides, completed_at")
      .eq("user_id", viewer.id)
      .eq("course_slug", slug),
    supabase
      .from("evaluation_attempts")
      .select("class_num, score, total, passed")
      .eq("user_id", viewer.id)
      .eq("course_slug", slug),
    supabase.from("survey_responses").select("survey_id").eq("user_id", viewer.id).eq("course_slug", slug),
  ]);

  const progress = new Map<number, ClassProgress>(
    (prog.data ?? []).map((p) => [
      p.class_num as number,
      { last: p.last_slide, max: p.max_slide, total: p.total_slides, completed: Boolean(p.completed_at) },
    ]),
  );

  const evals = new Map<number, EvalSummary>();
  for (const a of atts.data ?? []) {
    const cur = evals.get(a.class_num) ?? { attempts: 0, best: 0, total: a.total, passed: false };
    cur.attempts++;
    if (a.score > cur.best) cur.best = a.score;
    cur.total = a.total;
    cur.passed ||= a.passed;
    evals.set(a.class_num, cur);
  }

  return { progress, evals, surveyDone: (survey.data ?? []).length > 0 };
});
