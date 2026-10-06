import type { Evaluation, EvaluationQuestion } from "@/content/types";

// Reglas de una evaluación bien armada. Las usa el editor del panel (para avisar mientras se
// escribe) y el servidor (que es el que decide al guardar). Sin dependencias del servidor.

export const LIMITS = {
  title: 120,
  intro: 600,
  questions: 30,
  question: 400,
  option: 200,
  options: 6,
  explanation: 600,
};

export const VF_OPTIONS = ["Verdadero", "Falso"];

/** Problemas de una evaluación, en castellano, listos para mostrar. Vacío = se puede guardar. */
export function evaluationProblems(ev: Evaluation): string[] {
  const out: string[] = [];
  if (!ev.title.trim()) out.push("Falta el título.");
  if (ev.title.length > LIMITS.title) out.push(`El título es muy largo (máximo ${LIMITS.title} caracteres).`);
  if (ev.intro.length > LIMITS.intro) out.push(`La introducción es muy larga (máximo ${LIMITS.intro} caracteres).`);
  if (!Number.isInteger(ev.passPercent) || ev.passPercent < 1 || ev.passPercent > 100) {
    out.push("El porcentaje para aprobar tiene que ser un número entre 1 y 100.");
  }
  if (ev.questions.length === 0) out.push("Tiene que haber al menos una pregunta.");
  if (ev.questions.length > LIMITS.questions) out.push(`Máximo ${LIMITS.questions} preguntas.`);
  ev.questions.forEach((q, i) => out.push(...questionProblems(q).map((p) => `Pregunta ${i + 1}: ${p}`)));
  return out;
}

export function questionProblems(q: EvaluationQuestion): string[] {
  const out: string[] = [];
  const correct = q.options.filter((o) => o.correct).length;
  if (!q.question.trim()) out.push("falta el texto de la pregunta.");
  if (q.question.length > LIMITS.question) out.push(`la pregunta es muy larga (máximo ${LIMITS.question} caracteres).`);
  if (q.explanation.length > LIMITS.explanation) out.push(`la explicación es muy larga (máximo ${LIMITS.explanation}).`);
  if (q.kind === "vf") {
    if (q.options.length !== 2) out.push("verdadero o falso lleva exactamente 2 opciones.");
    if (correct !== 1) out.push("marcá cuál es la correcta (Verdadero o Falso).");
  } else {
    if (q.options.length < 2) out.push("tiene que tener al menos 2 opciones.");
    if (q.options.length > LIMITS.options) out.push(`máximo ${LIMITS.options} opciones.`);
    if (q.options.some((o) => !o.text.trim())) out.push("hay una opción vacía.");
    if (q.options.some((o) => o.text.length > LIMITS.option)) out.push(`hay una opción muy larga (máximo ${LIMITS.option}).`);
    const texts = q.options.map((o) => o.text.trim().toLowerCase()).filter(Boolean);
    if (new Set(texts).size !== texts.length) out.push("hay dos opciones iguales.");
    if (q.kind === "single" && correct !== 1) out.push("“una opción correcta” tiene que tener exactamente 1 correcta.");
    if (q.kind === "multi" && correct < 1) out.push("marcá al menos una opción correcta.");
    if (q.kind === "multi" && correct === q.options.length) out.push("no pueden ser todas correctas.");
  }
  return out;
}

/**
 * Normaliza lo que llega del navegador a una Evaluation (sin confiar en nada): recorta textos,
 * descarta campos de más y genera ids para las preguntas nuevas.
 */
export function normalizeEvaluation(raw: unknown, id: string): Evaluation | null {
  const r = raw as Partial<Evaluation> | null;
  if (!r || typeof r !== "object" || !Array.isArray(r.questions)) return null;
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const ids = new Set<string>();
  const questions: EvaluationQuestion[] = r.questions.map((q) => {
    const kind = q?.kind === "vf" || q?.kind === "multi" ? q.kind : "single";
    let qid = typeof q?.id === "string" && /^[\w-]{1,40}$/.test(q.id) ? q.id : "";
    if (!qid || ids.has(qid)) qid = `q-${Math.random().toString(36).slice(2, 9)}`;
    ids.add(qid);
    const options = Array.isArray(q?.options) ? q.options : [];
    return {
      id: qid,
      kind,
      question: s(q?.question),
      options:
        kind === "vf"
          ? VF_OPTIONS.map((text, i) => ({ text, correct: Boolean(options[i]?.correct) }))
          : options.map((o) => ({ text: s(o?.text), correct: Boolean(o?.correct) })),
      explanation: s(q?.explanation),
    };
  });
  return {
    id,
    title: s(r.title),
    intro: s(r.intro),
    passPercent: Math.round(Number(r.passPercent)),
    questions,
  };
}
