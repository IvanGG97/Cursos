"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";
import {
  computeRanking,
  liveTopic,
  type LiveAnswerRow,
  type LiveBroadcastState,
  type LiveParticipantRow,
  type LiveQuestionRow,
  type RankRow,
} from "@/lib/live-score";
import { endLive, startLive, type LiveSession } from "@/app/cursos/[curso]/[clase]/live-actions";

// Clase en vivo, lado presentador (solo admin), estilo Kahoot.
// Sincronización con los celulares: mensajes directos (Broadcast, instantáneos y sin depender
// de la sesión de cada uno) + consulta a la base cada pocos segundos como respaldo.

export type LiveConfig = { slug: string; num: number; initial: LiveSession | null; joinBase: string };

export type SlideCounts = { opts: number[]; n: number };

const POLL_MS = 3000;
const HEARTBEAT_MS = 4000;

export function useLivePresenter(
  cfg: LiveConfig | undefined,
  slide: number,
  revealed: boolean,
  correctBySlide: Record<number, number[]>,
) {
  const [session, setSession] = useState<LiveSession | null>(cfg?.initial ?? null);
  const [answers, setAnswers] = useState<LiveAnswerRow[]>([]);
  const [participants, setParticipants] = useState<LiveParticipantRow[]>([]);
  const [questions, setQuestions] = useState<LiveQuestionRow[]>([]);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const channel = useRef<RealtimeChannel | null>(null);

  // --- Datos desde la base (fuente de verdad) ---
  const refresh = useCallback(async () => {
    if (!session) return;
    const sb = getBrowserClient();
    const [a, p, q] = await Promise.all([
      sb.from("live_answers").select("slide, participant_id, choices, created_at").eq("session_id", session.id),
      sb.from("live_participants").select("participant_id, nickname, user_id").eq("session_id", session.id),
      sb.from("live_questions").select("slide, started_at").eq("session_id", session.id),
    ]);
    if (a.data) setAnswers(a.data as LiveAnswerRow[]);
    if (p.data) setParticipants(p.data as LiveParticipantRow[]);
    if (q.data) setQuestions(q.data as LiveQuestionRow[]);
  }, [session]);

  // --- Canal de mensajes + respaldo por consulta periódica ---
  useEffect(() => {
    if (!session) return;
    const sb = getBrowserClient();
    let t: ReturnType<typeof setTimeout> | undefined;
    const soon = () => {
      clearTimeout(t);
      t = setTimeout(refresh, 250);
    };
    const ch = sb
      .channel(liveTopic(session.id), { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "answered" }, soon)
      .on("broadcast", { event: "joined" }, soon)
      .subscribe();
    channel.current = ch;
    refresh();
    const poll = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(t);
      clearInterval(poll);
      channel.current = null;
      sb.removeChannel(ch);
    };
  }, [session, refresh]);

  const ranking: RankRow[] = useMemo(
    () => computeRanking(correctBySlide, questions, answers, participants),
    [correctBySlide, questions, answers, participants],
  );

  // --- Estado que ven los celulares ---
  const broadcastState = useCallback(
    (open = true) => {
      if (!session || !channel.current) return;
      const payload: LiveBroadcastState = {
        slide,
        revealed,
        open,
        title: session.title,
        top: ranking.slice(0, 10).map((r) => ({ nickname: r.nickname, points: r.points, rank: r.rank })),
        me: Object.fromEntries(ranking.map((r) => [r.participantId, { rank: r.rank, points: r.points }])),
        players: ranking.length,
      };
      channel.current.send({ type: "broadcast", event: "state", payload });
    },
    [session, slide, revealed, ranking],
  );

  // Cambio de diapositiva o "revelar": se guarda en la base, se avisa al instante y,
  // si es una pregunta nueva, se marca su hora de inicio (para puntuar por rapidez).
  const last = useRef("");
  useEffect(() => {
    if (!session) return;
    const key = `${slide}:${revealed}`;
    if (key === last.current) return;
    last.current = key;
    const sb = getBrowserClient();
    sb.from("live_sessions").update({ current_slide: slide, revealed }).eq("id", session.id).then();
    if (correctBySlide[slide] && !revealed) {
      sb.from("live_questions").insert({ session_id: session.id, slide }).then(() => refresh());
    }
    broadcastState();
  }, [session, slide, revealed, correctBySlide, broadcastState, refresh]);

  // Latido: cada pocos segundos se reenvía el estado (para quien entra tarde o perdió un mensaje).
  const beat = useRef(broadcastState);
  beat.current = broadcastState;
  useEffect(() => {
    if (!session) return;
    const i = setInterval(() => beat.current(), HEARTBEAT_MS);
    return () => clearInterval(i);
  }, [session]);

  const start = async (title: string) => {
    if (!cfg) return;
    setBusy(true);
    setError(undefined);
    const res = await startLive(cfg.slug, cfg.num, title);
    setBusy(false);
    if ("error" in res) setError(res.error);
    else setSession(res);
  };

  const end = async () => {
    if (!session) return;
    setBusy(true);
    broadcastState(false);
    const res = await endLive(session.id);
    setBusy(false);
    if (res.error) setError(res.error);
    else {
      setSession(null);
      setAnswers([]);
      setParticipants([]);
      setQuestions([]);
    }
  };

  const counts = (s: number): SlideCounts => {
    const here = answers.filter((a) => a.slide === s);
    const opts: number[] = [];
    for (const a of here) for (const c of a.choices) opts[c] = (opts[c] ?? 0) + 1;
    return { opts, n: here.length };
  };

  return { enabled: Boolean(cfg), session, counts, players: participants.length, ranking, error, busy, start, end };
}

/** Diálogo para nombrar la partida antes de abrirla. */
export function StartDialog({ defaultTitle, busy, onStart, onCancel }: { defaultTitle: string; busy: boolean; onStart: (t: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(defaultTitle);
  return (
    <div className="join-overlay" role="dialog" aria-label="Iniciar clase en vivo">
      <form
        className="start-card"
        onSubmit={(e) => {
          e.preventDefault();
          onStart(title);
        }}
      >
        <div className="join-kicker">Clase en vivo</div>
        <label htmlFor="live-title" className="start-label">Nombre de la partida</label>
        <input
          id="live-title"
          className="input"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Comisión martes 16 hs"
          autoFocus
        />
        <p className="start-hint">Con este nombre la vas a encontrar después en el panel, con la fecha, la hora y el ranking.</p>
        <div className="start-actions">
          <button type="button" className="join-close" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="start-go" disabled={busy}>{busy ? "Abriendo…" : "Iniciar"}</button>
        </div>
      </form>
    </div>
  );
}

/** Pantalla completa con el código y el QR para que los alumnos se unan. */
export function JoinOverlay({ code, title, joinBase, players, onClose }: { code: string; title: string | null; joinBase: string; players: number; onClose: () => void }) {
  const [svg, setSvg] = useState("");
  const url = `${joinBase}/vivo?c=${code}`;

  useEffect(() => {
    QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0b0f14", light: "#ffffff" } })
      .then(setSvg)
      .catch(() => setSvg(""));
  }, [url]);

  return (
    <div className="join-overlay" role="dialog" aria-label="Código para unirse a la clase">
      <div className="join-card">
        <div className="join-text">
          <div className="join-kicker">{title ?? "Clase en vivo"} · sumate desde el celular</div>
          <p className="join-step">
            1. Escaneá el código QR, o entrá a <strong>{joinBase.replace(/^https?:\/\//, "")}/vivo</strong>
          </p>
          <p className="join-step">2. Escribí este número:</p>
          <div className="join-code">{code}</div>
          <p className="join-present">{players} conectado(s)</p>
        </div>
        {svg && <div className="join-qr" dangerouslySetInnerHTML={{ __html: svg }} />}
      </div>
      <button type="button" className="join-close" onClick={onClose}>
        Volver a la clase
      </button>
    </div>
  );
}

/** Ranking en pantalla completa (tecla T). */
export function RankingOverlay({ title, ranking, onClose }: { title: string | null; ranking: RankRow[]; onClose: () => void }) {
  const top = ranking.slice(0, 10);
  return (
    <div className="join-overlay" role="dialog" aria-label="Ranking">
      <div className="rank-card">
        <div className="join-kicker">{title ?? "Clase en vivo"} · ranking</div>
        {top.length === 0 ? (
          <p className="join-step">Todavía no hay participantes.</p>
        ) : (
          <ol className="rank-list">
            {top.map((r) => (
              <li key={r.participantId} className={r.rank <= 3 ? `podium p${r.rank}` : ""}>
                <span className="rank-pos">{r.rank}</span>
                <span className="rank-name">{r.nickname}</span>
                <span className="rank-pts">{r.points.toLocaleString("es-AR")}</span>
              </li>
            ))}
          </ol>
        )}
        <p className="join-present">{ranking.length} participante(s)</p>
      </div>
      <button type="button" className="join-close" onClick={onClose}>
        Volver a la clase
      </button>
    </div>
  );
}
