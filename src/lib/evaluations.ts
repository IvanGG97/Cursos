import "server-only";
import { cache } from "react";
import type { Evaluation } from "@/content/types";
import { getCourse, typeset } from "@/content/registry";
import { evaluationProblems } from "./evaluation-rules";
import { createServiceClient, isServiceConfigured } from "./supabase/admin";

// Corrección de evaluaciones. Las respuestas correctas nunca salen del servidor antes de entregar.

/** La evaluación vigente de una clase: la del repo o la editada en el panel, y si está habilitada. */
export type ClassEvaluation = {
  ev: Evaluation;
  /** Preguntas editadas desde el panel (si no, son las originales del repo). */
  edited: boolean;
  /** Las preguntas originales del repo (para "Restaurar la versión original"). */
  original: Evaluation;
  /** Habilitada sí/no + desde cuándo (opcional), igual que la liberación de clases. */
  visible: boolean;
  visibleFrom: string | null;
  isOpen: boolean;
  updatedAt: string | null;
};

/**
 * Evaluaciones de un curso, por número de clase. La tabla `evaluation_settings` la lee solo el
 * servidor (tiene las respuestas correctas). Sin la migración (o sin la clave del servidor), todo
 * queda como antes: preguntas del repo y habilitadas.
 */
export const getCourseEvaluations = cache(async (slug: string): Promise<Map<number, ClassEvaluation>> => {
  const course = getCourse(slug);
  const out = new Map<number, ClassEvaluation>();
  if (!course) return out;

  let rows: { class_num: number; open: boolean; open_from: string | null; content: unknown; updated_at: string }[] | null = null;
  if (isServiceConfigured) {
    const { data, error } = await createServiceClient()
      .from("evaluation_settings")
      .select("class_num, open, open_from, content, updated_at")
      .eq("course_slug", slug);
    if (!error) rows = data ?? [];
  }
  const byNum = new Map((rows ?? []).map((r) => [r.class_num, r]));
  const now = new Date();

  for (const c of course.classes) {
    if (!c.evaluation) continue;
    const r = byNum.get(c.num);
    const custom = r?.content ? typeset(r.content as Evaluation) : null;
    // Una versión editada que no cumple las reglas (no debería pasar) no se usa: queda el original.
    const ev = custom && evaluationProblems(custom).length === 0 ? custom : c.evaluation;
    // Sin la tabla todavía: habilitadas, como antes. Con la tabla y sin fila: deshabilitada.
    const visible = rows === null ? true : Boolean(r?.open);
    const visibleFrom = r?.open_from ?? null;
    out.set(c.num, {
      ev,
      edited: ev !== c.evaluation,
      original: c.evaluation,
      visible,
      visibleFrom,
      isOpen: visible && (!visibleFrom || new Date(visibleFrom) <= now),
      updatedAt: r?.updated_at ?? null,
    });
  }
  return out;
});

export type PublicQuestion = { id: string; kind: "vf" | "single" | "multi"; question: string; options: string[] };

/** Las preguntas sin las respuestas correctas (lo único que viaja al navegador antes de entregar). */
export function publicQuestions(ev: Evaluation): PublicQuestion[] {
  return ev.questions.map((q) => ({ id: q.id, kind: q.kind, question: q.question, options: q.options.map((o) => o.text) }));
}

export type QuestionResult = { id: string; chosen: number[]; correct: number[]; right: boolean; explanation: string };
export type GradeResult = { score: number; total: number; passed: boolean; percent: number; questions: QuestionResult[] };

/** Corrige: una pregunta suma solo si se marcaron exactamente las opciones correctas. */
export function grade(ev: Evaluation, answers: Record<string, number[]>): GradeResult {
  const questions = ev.questions.map((q) => {
    const correct = q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
    const raw = Array.isArray(answers[q.id]) ? answers[q.id] : [];
    const chosen = [...new Set(raw.filter((i) => Number.isInteger(i) && i >= 0 && i < q.options.length))].sort();
    const right = chosen.length === correct.length && correct.every((i) => chosen.includes(i));
    return { id: q.id, chosen, correct, right, explanation: q.explanation };
  });
  const score = questions.filter((q) => q.right).length;
  const total = questions.length;
  const percent = Math.round((score / total) * 100);
  return { score, total, percent, passed: percent >= ev.passPercent, questions };
}
