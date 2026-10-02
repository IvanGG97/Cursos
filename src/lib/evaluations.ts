import "server-only";
import type { Evaluation } from "@/content/types";

// Corrección de evaluaciones. Las respuestas correctas nunca salen del servidor antes de entregar.

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
