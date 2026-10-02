"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { SurveyQuestion } from "@/content/types";
import { submitSurvey, type SurveyState } from "./actions";

export function SurveyForm({ slug, questions, courseHref }: { slug: string; questions: SurveyQuestion[]; courseHref: string }) {
  const [state, action, pending] = useActionState<SurveyState, FormData>(submitSurvey.bind(null, slug), {});

  if (state.done) {
    return (
      <div className="notice ok">
        <p style={{ marginTop: 0 }}>
          <strong>¡Gracias por responder!</strong> Tus respuestas nos ayudan a mejorar el curso.
        </p>
        <Link href={courseHref} className="btn">Volver al curso</Link>
      </div>
    );
  }

  return (
    <form action={action} className="survey">
      {questions.map((q, n) => (
        <fieldset key={q.id} className="survey-q">
          <legend>
            <span className="kicker-sm">
              {n + 1}. {q.required ? "" : "Opcional"}
            </span>
            <span className="survey-label">{q.label}</span>
          </legend>

          {q.kind === "scale" && (
            <>
              <div className="survey-scale">
                {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((v) => (
                  <label key={v} className="survey-pill">
                    <input type="radio" name={q.id} value={v} required={q.required} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
              <div className="survey-ends">
                <span>{q.minLabel}</span>
                <span>{q.maxLabel}</span>
              </div>
            </>
          )}

          {q.kind === "choice" && (
            <div className="survey-choices">
              {q.options.map((o) => (
                <label key={o} className="survey-pill wide">
                  <input type="radio" name={q.id} value={o} required={q.required} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          )}

          {q.kind === "text" && (
            <textarea name={q.id} className="input" rows={3} placeholder={q.placeholder} required={q.required} maxLength={2000} />
          )}
        </fieldset>
      ))}

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Enviando…" : "Enviar respuestas"}
      </button>
      {state.error && <p className="live-msg err">{state.error}</p>}
    </form>
  );
}
