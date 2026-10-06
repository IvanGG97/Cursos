"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Evaluation, EvaluationQuestion } from "@/content/types";
import { LIMITS, VF_OPTIONS, evaluationProblems, questionProblems } from "@/lib/evaluation-rules";
import { restoreEvaluation, saveEvaluation } from "@/app/admin/evaluation-actions";

// Editor de las preguntas de una evaluación. Todo se valida acá mientras se escribe (para avisar)
// y de nuevo en el servidor al guardar.

type Kind = EvaluationQuestion["kind"];
const KINDS: { k: Kind; label: string }[] = [
  { k: "vf", label: "Verdadero o falso" },
  { k: "single", label: "Una opción correcta" },
  { k: "multi", label: "Varias correctas" },
];
const LETTERS = "ABCDEF";

const newId = () => `q-${Math.random().toString(36).slice(2, 9)}`;

function blankQuestion(): EvaluationQuestion {
  return {
    id: newId(),
    kind: "single",
    question: "",
    options: [
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
    explanation: "",
  };
}

/** Cambiar el tipo sin perder lo que se pueda. */
function withKind(q: EvaluationQuestion, kind: Kind): EvaluationQuestion {
  if (kind === q.kind) return q;
  if (kind === "vf") {
    const firstCorrect = q.options.findIndex((o) => o.correct);
    return { ...q, kind, options: VF_OPTIONS.map((text, i) => ({ text, correct: i === (firstCorrect === 1 ? 1 : 0) })) };
  }
  let options = q.kind === "vf" ? [{ text: "", correct: true }, { text: "", correct: false }, { text: "", correct: false }] : q.options;
  if (kind === "single") {
    const first = Math.max(0, options.findIndex((o) => o.correct));
    options = options.map((o, i) => ({ ...o, correct: i === first }));
  }
  return { ...q, kind, options };
}

type Props = {
  slug: string;
  num: number;
  initial: Evaluation;
  edited: boolean;
  attempts: number;
  previewHref: string;
};

export function EvaluationEditor({ slug, num, initial, edited, attempts, previewHref }: Props) {
  const router = useRouter();
  const [ev, setEv] = useState<Evaluation>(initial);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [showProblems, setShowProblems] = useState(false);
  const problems = useMemo(() => evaluationProblems(ev), [ev]);

  // Al guardar, el servidor manda la versión nueva: arrancar de ahí.
  useEffect(() => {
    setEv(initial);
    setDirty(false);
  }, [initial]);

  // Avisar si se va de la página con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const change = (next: Evaluation) => {
    setEv(next);
    setDirty(true);
    setMsg({});
    setConfirmRestore(false);
  };
  const setQ = (i: number, q: EvaluationQuestion) => change({ ...ev, questions: ev.questions.map((x, j) => (j === i ? q : x)) });
  const moveQ = (i: number, d: number) => {
    const qs = [...ev.questions];
    const j = i + d;
    if (j < 0 || j >= qs.length) return;
    [qs[i], qs[j]] = [qs[j], qs[i]];
    change({ ...ev, questions: qs });
  };
  const removeQ = (i: number) => change({ ...ev, questions: ev.questions.filter((_, j) => j !== i) });
  const duplicateQ = (i: number) => {
    const qs = [...ev.questions];
    qs.splice(i + 1, 0, { ...structuredClone(ev.questions[i]), id: newId() });
    change({ ...ev, questions: qs });
  };

  const save = async () => {
    if (problems.length) {
      setShowProblems(true);
      setMsg({ error: "Hay cosas para corregir antes de guardar (están marcadas en rojo)." });
      return;
    }
    setBusy(true);
    setMsg({});
    const res = await saveEvaluation(slug, num, ev);
    setBusy(false);
    if (res.error) return setMsg({ error: res.error });
    setDirty(false);
    setMsg({ ok: res.ok });
    router.refresh();
  };

  const restore = async () => {
    if (!confirmRestore) return setConfirmRestore(true);
    setBusy(true);
    const res = await restoreEvaluation(slug, num);
    setBusy(false);
    setConfirmRestore(false);
    if (res.error) return setMsg({ error: res.error });
    setDirty(false);
    setMsg({ ok: res.ok });
    router.refresh();
  };

  return (
    <div className="ev-editor">
      <section className="panel">
        <div className="panel-head">
          <h2>Datos generales</h2>
          <span className={`tag ${edited ? "warn" : ""}`}>{edited ? "Versión editada en el panel" : "Versión original"}</span>
        </div>
        {attempts > 0 && (
          <p className="notice warn ev-note">
            Ya hay <strong>{attempts} intento(s)</strong> con estas preguntas. Al guardar cambios, las notas de los alumnos se
            conservan, pero el “acierto por pregunta” de Seguimiento empieza de cero para la versión nueva.
          </p>
        )}
        <label className="field">
          <span>Título</span>
          <input className="input" value={ev.title} maxLength={LIMITS.title} onChange={(e) => change({ ...ev, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Introducción (la ven antes de empezar)</span>
          <textarea
            className="input"
            rows={3}
            value={ev.intro}
            maxLength={LIMITS.intro}
            onChange={(e) => change({ ...ev, intro: e.target.value })}
          />
        </label>
        <label className="field ev-pass">
          <span>Porcentaje para aprobar</span>
          <span className="ev-pass-row">
            <input
              className="input"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={Number.isFinite(ev.passPercent) ? ev.passPercent : ""}
              onChange={(e) => change({ ...ev, passPercent: Number(e.target.value) })}
            />
            <span className="muted">
              % · con {ev.questions.length} pregunta(s): {Math.ceil((ev.questions.length * (ev.passPercent || 0)) / 100)} bien para
              aprobar
            </span>
          </span>
        </label>
      </section>

      <ol className="ev-questions">
        {ev.questions.map((q, i) => {
          const qProblems = showProblems ? questionProblems(q) : [];
          return (
            <li key={q.id} className={`panel ev-q${qProblems.length ? " has-error" : ""}`}>
              <div className="ev-q-head">
                <strong className="ev-q-n">Pregunta {i + 1}</strong>
                <div className="ev-q-tools">
                  <button type="button" onClick={() => moveQ(i, -1)} disabled={i === 0} aria-label="Subir" title="Subir">↑</button>
                  <button type="button" onClick={() => moveQ(i, 1)} disabled={i === ev.questions.length - 1} aria-label="Bajar" title="Bajar">↓</button>
                  <button type="button" onClick={() => duplicateQ(i)} title="Duplicar">Duplicar</button>
                  <button type="button" onClick={() => removeQ(i)} className="danger" title="Quitar la pregunta">Quitar</button>
                </div>
              </div>

              <div className="ev-kinds" role="radiogroup" aria-label={`Tipo de la pregunta ${i + 1}`}>
                {KINDS.map((k) => (
                  <button
                    key={k.k}
                    type="button"
                    role="radio"
                    aria-checked={q.kind === k.k}
                    className={q.kind === k.k ? "on" : ""}
                    onClick={() => setQ(i, withKind(q, k.k))}
                  >
                    {k.label}
                  </button>
                ))}
              </div>

              <label className="field">
                <span>Pregunta</span>
                <textarea
                  className="input"
                  rows={2}
                  value={q.question}
                  maxLength={LIMITS.question}
                  onChange={(e) => setQ(i, { ...q, question: e.target.value })}
                />
              </label>

              <fieldset className="ev-opts">
                <legend>
                  {q.kind === "vf" ? "Cuál es la correcta" : q.kind === "multi" ? "Opciones (marcá todas las correctas)" : "Opciones (marcá la correcta)"}
                </legend>
                {q.options.map((o, j) => (
                  <div key={j} className={`ev-opt${o.correct ? " correct" : ""}`}>
                    <label className="ev-mark" title={o.correct ? "Correcta" : "Marcar como correcta"}>
                      <input
                        type={q.kind === "multi" ? "checkbox" : "radio"}
                        name={`correct-${q.id}`}
                        checked={o.correct}
                        onChange={(e) =>
                          setQ(i, {
                            ...q,
                            options: q.options.map((x, k) =>
                              q.kind === "multi" ? (k === j ? { ...x, correct: e.target.checked } : x) : { ...x, correct: k === j },
                            ),
                          })
                        }
                      />
                      <span>{LETTERS[j]}</span>
                    </label>
                    {q.kind === "vf" ? (
                      <span className="ev-vf-text">{o.text}</span>
                    ) : (
                      <input
                        className="input"
                        value={o.text}
                        maxLength={LIMITS.option}
                        placeholder={`Opción ${LETTERS[j]}`}
                        aria-label={`Opción ${LETTERS[j]}`}
                        onChange={(e) => setQ(i, { ...q, options: q.options.map((x, k) => (k === j ? { ...x, text: e.target.value } : x)) })}
                      />
                    )}
                    {q.kind !== "vf" && q.options.length > 2 && (
                      <button
                        type="button"
                        className="ev-opt-del"
                        aria-label={`Quitar la opción ${LETTERS[j]}`}
                        title="Quitar la opción"
                        onClick={() => setQ(i, { ...q, options: q.options.filter((_, k) => k !== j) })}
                      >
                        ✕
                      </button>
                    )}
                    {o.correct && <span className="ev-ok">Correcta</span>}
                  </div>
                ))}
                {q.kind !== "vf" && q.options.length < LIMITS.options && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => setQ(i, { ...q, options: [...q.options, { text: "", correct: false }] })}
                  >
                    + Agregar opción
                  </button>
                )}
              </fieldset>

              <label className="field">
                <span>Explicación (la ven después de entregar: por qué es así)</span>
                <textarea
                  className="input"
                  rows={2}
                  value={q.explanation}
                  maxLength={LIMITS.explanation}
                  onChange={(e) => setQ(i, { ...q, explanation: e.target.value })}
                />
              </label>

              {qProblems.length > 0 && (
                <ul className="ev-problems">
                  {qProblems.map((p) => (
                    <li key={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      {ev.questions.length < LIMITS.questions && (
        <button type="button" className="btn ev-add" onClick={() => change({ ...ev, questions: [...ev.questions, blankQuestion()] })}>
          + Agregar pregunta
        </button>
      )}

      {showProblems && problems.filter((p) => !p.startsWith("Pregunta")).length > 0 && (
        <ul className="ev-problems">
          {problems
            .filter((p) => !p.startsWith("Pregunta"))
            .map((p) => (
              <li key={p}>{p}</li>
            ))}
        </ul>
      )}

      <div className="ev-bar">
        <div className="ev-bar-msg" role="status">
          {msg.error ? (
            <span className="aform-msg err">{msg.error}</span>
          ) : msg.ok ? (
            <span className="aform-msg ok">{msg.ok}</span>
          ) : dirty ? (
            <span className="muted">Cambios sin guardar · {ev.questions.length} pregunta(s)</span>
          ) : (
            <span className="muted">Sin cambios · {ev.questions.length} pregunta(s)</span>
          )}
        </div>
        <div className="ev-bar-actions">
          {edited && (
            <button type="button" className="btn btn-sm" onClick={restore} disabled={busy}>
              {confirmRestore ? "¿Seguro? Tocá de nuevo" : "Restaurar la versión original"}
            </button>
          )}
          {dirty && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setEv(initial);
                setDirty(false);
                setMsg({});
                setShowProblems(false);
              }}
              disabled={busy}
            >
              Descartar cambios
            </button>
          )}
          <Link href={previewHref} className="btn btn-sm">Probar</Link>
          <button type="button" className="btn btn-sm btn-primary" onClick={save} disabled={busy || !dirty}>
            {busy ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
