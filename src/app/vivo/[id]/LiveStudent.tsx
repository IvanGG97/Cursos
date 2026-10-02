"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { QuizOption } from "@/content/types";
import { getBrowserClient } from "@/lib/supabase/client";
import { liveTopic, type LiveBroadcastState } from "@/lib/live-score";

// Clase en vivo, lado alumno (estilo Kahoot). Sigue la diapositiva que proyecta el docente:
// mensajes directos (instantáneos) + consulta a la base cada pocos segundos como respaldo.

export type LiveQuiz = { kind: "vf" | "single" | "multi"; question: string; options: QuizOption[]; explanation?: string };

type Props = {
  sessionId: string;
  sessionTitle: string | null;
  initial: { slide: number; revealed: boolean; open: boolean };
  total: number;
  quizzes: Record<number, LiveQuiz>;
  userId: string | null;
  defaultName: string;
  classTitle: string;
  accent: string;
  courseHref: string;
};

const LETTERS = "ABCDEFGH";
const POLL_MS = 4000;

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

const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function LiveStudent(p: Props) {
  const [pid, setPid] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [slide, setSlide] = useState(p.initial.slide);
  const [revealed, setRevealed] = useState(p.initial.revealed);
  const [open, setOpen] = useState(p.initial.open);
  const [board, setBoard] = useState<LiveBroadcastState | null>(null);
  const [answered, setAnswered] = useState<Record<number, number[]>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const channel = useRef<RealtimeChannel | null>(null);
  const kAnswers = `live-answers-${p.sessionId}`;
  const kName = `live-name-${p.sessionId}`;

  useEffect(() => {
    setPid(participantId(p.userId));
    setAnswered(read(kAnswers, {}));
    setName(read<string | null>(kName, null));
  }, [p.userId, kAnswers, kName]);

  const apply = useCallback((s: { current_slide?: number; slide?: number; revealed: boolean; status?: string; open?: boolean }) => {
    setSlide(s.slide ?? s.current_slide ?? 1);
    setRevealed(s.revealed);
    setOpen(s.open ?? s.status === "open");
  }, []);

  // Mensajes del proyector + respaldo: consulta periódica del estado de la sesión.
  useEffect(() => {
    const sb = getBrowserClient();
    const ch = sb
      .channel(liveTopic(p.sessionId), { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "state" }, ({ payload }) => {
        const s = payload as LiveBroadcastState;
        apply(s);
        setBoard(s);
      })
      .subscribe();
    channel.current = ch;

    const poll = setInterval(async () => {
      const { data, error: e } = await sb
        .from("live_sessions")
        .select("current_slide, revealed, status")
        .eq("id", p.sessionId)
        .maybeSingle();
      if (e) return; // sin conexión por un momento: no asumir nada
      if (data) apply(data);
      else setOpen(false); // cerrada: la política solo deja ver sesiones abiertas
    }, POLL_MS);

    return () => {
      clearInterval(poll);
      channel.current = null;
      sb.removeChannel(ch);
    };
  }, [p.sessionId, apply]);

  // Registrarse con apodo (o volver a registrarse si recargó la página).
  const join = useCallback(
    async (nickname: string) => {
      if (!pid) return false;
      const clean = nickname.trim().slice(0, 30);
      const { error: e } = await getBrowserClient()
        .from("live_participants")
        .upsert({ session_id: p.sessionId, participant_id: pid, user_id: p.userId, nickname: clean }, { onConflict: "session_id,participant_id" });
      if (e) return false;
      write(kName, clean);
      setName(clean);
      channel.current?.send({ type: "broadcast", event: "joined", payload: {} });
      return true;
    },
    [pid, p.sessionId, p.userId, kName],
  );

  // Al volver con un nombre guardado, se re-registra (por si la fila no existía todavía).
  const rejoined = useRef(false);
  useEffect(() => {
    if (pid && name && !rejoined.current) {
      rejoined.current = true;
      join(name);
    }
  }, [pid, name, join]);

  useEffect(() => {
    setSelected([]);
    setError(undefined);
  }, [slide]);

  const quiz = p.quizzes[slide];
  const mine = answered[slide];
  const me = board?.me[pid];
  const style = { "--accent": p.accent } as CSSProperties;

  const toggle = (i: number) => {
    if (mine || revealed) return;
    setSelected((prev) => (quiz?.kind === "multi" ? (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]) : [i]));
  };

  const send = async () => {
    if (!quiz || selected.length === 0 || !pid) return;
    setSending(true);
    setError(undefined);
    const choices = [...selected].sort();
    const { error: e } = await getBrowserClient()
      .from("live_answers")
      .insert({ session_id: p.sessionId, slide, participant_id: pid, user_id: p.userId, choices });
    setSending(false);
    if (e && e.code !== "23505") {
      setError("No se pudo enviar. Revisá tu conexión y probá de nuevo.");
      return;
    }
    const next = { ...answered, [slide]: choices };
    setAnswered(next);
    write(kAnswers, next);
    channel.current?.send({ type: "broadcast", event: "answered", payload: { slide } });
  };

  if (!open) {
    return (
      <div className="live-wrap" style={style}>
        <h1 className="live-h1">La clase en vivo terminó</h1>
        {me && (
          <p className="live-score-big">
            Terminaste en el puesto <strong>{me.rank}</strong> de {board?.players} con <strong>{me.points.toLocaleString("es-AR")}</strong> puntos.
          </p>
        )}
        <p className="muted">¡Gracias por participar! Podés repasar la clase desde la página del curso.</p>
        <Link href={p.courseHref} className="btn btn-primary">Ir al curso</Link>
      </div>
    );
  }

  if (!name) return <NameForm defaultName={p.defaultName} title={p.sessionTitle} classTitle={p.classTitle} style={style} onJoin={join} />;

  return (
    <div className="live-wrap" style={style}>
      <div className="live-head">
        <span className="kicker-sm">En vivo · {p.sessionTitle ?? p.classTitle}</span>
        <span className="live-pos">
          {name} · {me ? `${me.points.toLocaleString("es-AR")} pts · puesto ${me.rank}` : "0 pts"}
        </span>
      </div>

      {!quiz ? (
        <div className="live-wait">
          <p className="live-wait-big">Seguí la clase en la pantalla.</p>
          <p className="muted">Cuando haya una pregunta, aparece acá. Cuanto más rápido respondas bien, más puntos sumás.</p>
          <p className="live-pos">
            Diapositiva {slide} de {p.total}
          </p>
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
              {me && (
                <p className="live-score-big">
                  Vas <strong>{me.rank}°</strong> de {board?.players} · <strong>{me.points.toLocaleString("es-AR")}</strong> puntos
                </p>
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

function NameForm(p: { defaultName: string; title: string | null; classTitle: string; style: CSSProperties; onJoin: (n: string) => Promise<boolean> }) {
  const [value, setValue] = useState(p.defaultName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  return (
    <div className="live-wrap" style={p.style}>
      <div className="kicker-sm">En vivo · {p.title ?? p.classTitle}</div>
      <h1 className="live-h1">¿Cómo te llamamos?</h1>
      <p className="muted">Tu nombre aparece en el ranking de la clase.</p>
      <form
        className="live-join"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!value.trim()) return;
          setBusy(true);
          const ok = await p.onJoin(value);
          setBusy(false);
          if (!ok) setError("No pudimos sumarte. Revisá tu conexión y probá de nuevo.");
        }}
      >
        <input
          className="input live-name-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={30}
          placeholder="Tu nombre o apodo"
          autoComplete="nickname"
          required
          autoFocus
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={busy || !value.trim()}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
        {error && <p className="live-msg err">{error}</p>}
      </form>
    </div>
  );
}

function isRight(q: LiveQuiz, chosen: number[]) {
  const correct = q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  return correct.length === chosen.length && correct.every((i) => chosen.includes(i));
}
