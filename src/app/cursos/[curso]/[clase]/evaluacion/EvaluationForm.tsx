"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { GradeResult } from "@/lib/evaluations";
import { submitEvaluation } from "./actions";

type Q = { id: string; kind: "vf" | "single" | "multi"; question: string; options: string[] };

const LETTERS = "ABCDEFGH";
const KIND: Record<Q["kind"], string> = {
  vf: "Verdadero o falso",
  single: "Elegí una opción",
  multi: "Marcá todas las correctas",
};

export function EvaluationForm(p: { slug: string; num: number; questions: Q[]; passPercent: number; courseHref: string }) {
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<GradeResult>();
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const toggle = (q: Q, i: number) => {
    if (result) return;
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      const next = q.kind === "multi" ? (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]) : [i];
      return { ...a, [q.id]: next };
    });
  };

  const answeredCount = p.questions.filter((q) => answers[q.id]?.length).length;

  const submit = () => {
    setError(undefined);
    start(async () => {
      const res = await submitEvaluation(p.slug, p.num, answers);
      if (res.error) setError(res.error);
      else if (res.result) {
        setResult(res.result);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const retry = () => {
    setAnswers({});
    setResult(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const byId = new Map(result?.questions.map((q) => [q.id, q]));

  return (
    <div className="eval">
      {result && (
        <div className={`notice ${result.passed ? "ok" : "err"} eval-score`} role="status">
          <div className="eval-score-n">
            {result.score} / {result.total}
          </div>
          <div>
            <strong>{result.passed ? "¡Aprobaste!" : "Esta vez no alcanzó."}</strong>{" "}
            {result.passed
              ? "Abajo podés ver las respuestas correctas y por qué."
              : `Necesitás ${p.passPercent}% para aprobar. Mirá las correcciones y probá de nuevo cuando quieras.`}
          </div>
          <div className="btn-row">
            <button type="button" className="btn" onClick={retry}>Hacerla de nuevo</button>
            <Link href={p.courseHref} className="btn">Volver al curso</Link>
          </div>
        </div>
      )}

      <ol className="eval-list">
        {p.questions.map((q, n) => {
          const r = byId.get(q.id);
          const mine = r ? r.chosen : (answers[q.id] ?? []);
          return (
            <li key={q.id} className={`eval-q${r ? (r.right ? " right" : " wrong") : ""}`}>
              <div className="kicker-sm">
                Pregunta {n + 1} · {KIND[q.kind]}
                {r && <span className={r.right ? "eval-tag ok" : "eval-tag err"}>{r.right ? "Bien" : "Revisar"}</span>}
              </div>
              <p className="eval-question">{q.question}</p>
              <div className="eval-opts">
                {q.options.map((o, i) => {
                  const chosen = mine.includes(i);
                  let state = chosen ? "selected" : "";
                  if (r) state = r.correct.includes(i) ? "correct" : chosen ? "wrong" : "dim";
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`live-opt ${state}`}
                      onClick={() => toggle(q, i)}
                      disabled={Boolean(r)}
                      aria-pressed={chosen}
                    >
                      <span className="live-mark">{r && r.correct.includes(i) ? "✓" : r && chosen ? "✕" : LETTERS[i]}</span>
                      <span>{o}</span>
                    </button>
                  );
                })}
              </div>
              {r && <p className="eval-explain">{r.explanation}</p>}
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="eval-submit">
          <p className="muted">
            Respondiste {answeredCount} de {p.questions.length}.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={submit}
            disabled={pending || answeredCount < p.questions.length}
          >
            {pending ? "Corrigiendo…" : "Entregar evaluación"}
          </button>
          {error && <p className="live-msg err">{error}</p>}
        </div>
      )}
    </div>
  );
}
