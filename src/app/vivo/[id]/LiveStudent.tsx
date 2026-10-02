"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { QuizOption } from "@/content/types";
import { getBrowserClient } from "@/lib/supabase/client";

// Clase en vivo, lado alumno: sigue en tiempo real la diapositiva que proyecta el docente.
// Cuando es una pregunta, se responde desde acá; cuando el docente la revela, se ve si acertó.

export type LiveQuiz = { kind: "vf" | "single" | "multi"; question: string; options: QuizOption[]; explanation?: string };

type Props = {
  sessionId: string;
  initial: { slide: number; revealed: boolean; open: boolean };
  total: number;
  quizzes: Record<number, LiveQuiz>;
  userId: string | null;
  courseTitle: string;
  classTitle: string;
  accent: string;
  courseHref: string;
};

const LETTERS = "ABCDEFGH";

/** Identificador del participante: su usuario o, sin cuenta, uno fijo de este dispositivo. */
function participantId(userId: string | null) {
  if (userId) return userId;
  try {
    let id = localStorage.getItem("live-participant");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("live-participant", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function LiveStudent(p: Props) {
  const [slide, setSlide] = useState(p.initial.slide);
  const [revealed, setRevealed] = useState(p.initial.revealed);
  const [open, setOpen] = useState(p.initial.open);
  const [answered, setAnswered] = useState<Record<number, number[]>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const storeKey = `live-answers-${p.sessionId}`;

  // Respuestas ya enviadas en esta sesión (sobreviven a recargar la página).
  useEffect(() => {
    try {
      setAnswered(JSON.parse(localStorage.getItem(storeKey) ?? "{}"));
    } catch {}
  }, [storeKey]);

  // Tiempo real: diapositiva actual, revelar y fin de la clase.
  useEffect(() => {
    const sb = getBrowserClient();
    const ch = sb
      .channel(`live-student-${p.sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_sessions", filter: `id=eq.${p.sessionId}` },
        (msg) => {
          const s = msg.new as { current_slide: number; revealed: boolean; status: string };
          setSlide(s.current_slide);
          setRevealed(s.revealed);
          setOpen(s.status === "open");
        },
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [p.sessionId]);

  // Al cambiar de pregunta, se limpia la selección.
  useEffect(() => {
    setSelected([]);
    setError(undefined);
  }, [slide]);

  const quiz = p.quizzes[slide];
  const mine = answered[slide];
  const style = { "--accent": p.accent } as CSSProperties;

  const toggle = (i: number) => {
    if (mine || revealed) return;
    setSelected((prev) => (quiz?.kind === "multi" ? (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]) : [i]));
  };

  const send = async () => {
    if (!quiz || selected.length === 0) return;
    setSending(true);
    setError(undefined);
    const choices = [...selected].sort();
    const { error: e } = await getBrowserClient()
      .from("live_answers")
      .insert({ session_id: p.sessionId, slide, participant_id: participantId(p.userId), user_id: p.userId, choices });
    setSending(false);
    if (e && e.code !== "23505") {
      setError("No se pudo enviar. Revisá tu conexión y probá de nuevo.");
      return;
    }
    const next = { ...answered, [slide]: choices };
    setAnswered(next);
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch {}
  };

  if (!open) {
    return (
      <div className="live-wrap" style={style}>
        <h1 className="live-h1">La clase en vivo terminó</h1>
        <p className="muted">¡Gracias por participar! Podés repasar la clase desde la página del curso.</p>
        <Link href={p.courseHref} className="btn btn-primary">Ir al curso</Link>
      </div>
    );
  }

  return (
    <div className="live-wrap" style={style}>
      <div className="live-head">
        <span className="kicker-sm">En vivo · {p.classTitle}</span>
        <span className="live-pos">
          Diapositiva {slide} de {p.total}
        </span>
      </div>

      {!quiz ? (
        <div className="live-wait">
          <p className="live-wait-big">Seguí la clase en la pantalla.</p>
          <p className="muted">Cuando haya una pregunta, aparece acá para que respondas.</p>
        </div>
      ) : (
        <div className="live-quiz">
          <div className="kicker-sm">
            {quiz.kind === "vf" ? "Verdadero o falso" : quiz.kind === "multi" ? "Marcá todas las correctas" : "Elegí una opción"}
          </div>
          <h1 className="live-question">{quiz.question}</h1>

          <div className="live-opts">
            {quiz.options.map((o, i) => {
              const chosen = (mine ?? selected).includes(i);
              let state = chosen ? "selected" : "";
              if (revealed) state = o.correct ? "correct" : chosen ? "wrong" : "dim";
              return (
                <button
                  key={i}
                  type="button"
                  className={`live-opt ${state}`}
                  onClick={() => toggle(i)}
                  disabled={Boolean(mine) || revealed}
                  aria-pressed={chosen}
                >
                  <span className="live-mark">{revealed && o.correct ? "✓" : revealed && chosen ? "✕" : LETTERS[i]}</span>
                  <span>{o.text}</span>
                </button>
              );
            })}
          </div>

          {revealed ? (
            <div className="live-result">
              {mine ? (
                <p className={isRight(quiz, mine) ? "live-msg ok" : "live-msg err"}>
                  {isRight(quiz, mine) ? "¡Bien! Respondiste correctamente." : "Esta vez no. Mirá cuál era la correcta."}
                </p>
              ) : (
                <p className="live-msg">No llegaste a responder esta pregunta.</p>
              )}
              {quiz.explanation && <p className="muted">{quiz.explanation}</p>}
            </div>
          ) : mine ? (
            <p className="live-msg ok">Respuesta enviada. Esperá a que el docente muestre la correcta.</p>
          ) : (
            <button type="button" className="btn btn-primary btn-block live-send" onClick={send} disabled={sending || selected.length === 0}>
              {sending ? "Enviando…" : "Enviar respuesta"}
            </button>
          )}
          {error && <p className="live-msg err">{error}</p>}
        </div>
      )}
    </div>
  );
}

function isRight(q: LiveQuiz, chosen: number[]) {
  const correct = q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  return correct.length === chosen.length && correct.every((i) => chosen.includes(i));
}
