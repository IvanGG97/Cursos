// Puntaje y ranking de la clase en vivo (estilo Kahoot). Se usa en el proyector (navegador)
// y en el panel (servidor), así los dos calculan exactamente lo mismo.

/** Canal de mensajes de una sesión en vivo (proyector ↔ celulares). */
export const liveTopic = (id: string) => `live:${id}`;

/** Lo que el proyector manda a los celulares. */
export type LiveBroadcastState = {
  slide: number;
  revealed: boolean;
  open: boolean;
  title: string | null;
  /** Top 10 del ranking. */
  top: { nickname: string; points: number; rank: number }[];
  /** Puesto y puntos de cada participante (por participant_id). */
  me: Record<string, { rank: number; points: number }>;
  players: number;
};

/** Ventana de tiempo para el bonus por rapidez. */
export const SPEED_WINDOW_MS = 30_000;
export const MAX_POINTS = 1000;
export const MIN_POINTS = 500;

/** Correcta: de 1000 (al instante) a 500 (a los 30 s o más). Incorrecta: 0. */
export function pointsFor(correct: boolean, responseMs: number) {
  if (!correct) return 0;
  const t = Math.min(Math.max(responseMs, 0), SPEED_WINDOW_MS) / SPEED_WINDOW_MS;
  return Math.round(MAX_POINTS - (MAX_POINTS - MIN_POINTS) * t);
}

export function isExact(correct: number[], chosen: number[]) {
  return correct.length === chosen.length && correct.every((i) => chosen.includes(i));
}

export type LiveAnswerRow = { slide: number; participant_id: string; choices: number[]; created_at: string };
export type LiveQuestionRow = { slide: number; started_at: string };
export type LiveParticipantRow = { participant_id: string; nickname: string; user_id?: string | null };

export type RankRow = {
  participantId: string;
  nickname: string;
  userId: string | null;
  points: number;
  correct: number;
  answered: number;
  /** Suma de tiempos de respuesta de las correctas (desempata). */
  timeMs: number;
  rank: number;
};

/**
 * Ranking: suma de puntos por pregunta. Empate → menos tiempo total en las correctas.
 * `correctBySlide`: índices correctos de cada quiz (por número de diapositiva, base 1).
 */
export function computeRanking(
  correctBySlide: Record<number, number[]>,
  questions: LiveQuestionRow[],
  answers: LiveAnswerRow[],
  participants: LiveParticipantRow[],
): RankRow[] {
  const start = new Map(questions.map((q) => [q.slide, new Date(q.started_at).getTime()]));
  const rows = new Map<string, RankRow>();
  const row = (pid: string) => {
    let r = rows.get(pid);
    if (!r) {
      const p = participants.find((x) => x.participant_id === pid);
      r = { participantId: pid, nickname: p?.nickname ?? "Sin nombre", userId: p?.user_id ?? null, points: 0, correct: 0, answered: 0, timeMs: 0, rank: 0 };
      rows.set(pid, r);
    }
    return r;
  };

  for (const p of participants) row(p.participant_id);
  for (const a of answers) {
    const correct = correctBySlide[a.slide];
    if (!correct) continue;
    const r = row(a.participant_id);
    const ok = isExact(correct, a.choices);
    const t0 = start.get(a.slide);
    const ms = t0 ? new Date(a.created_at).getTime() - t0 : SPEED_WINDOW_MS;
    r.answered++;
    if (ok) {
      r.correct++;
      r.points += pointsFor(true, ms);
      r.timeMs += Math.max(ms, 0);
    }
  }

  const list = [...rows.values()].sort((a, b) => b.points - a.points || a.timeMs - b.timeMs || a.nickname.localeCompare(b.nickname));
  list.forEach((r, i) => {
    // Mismo puntaje y tiempo → mismo puesto.
    const prev = list[i - 1];
    r.rank = prev && prev.points === r.points && prev.timeMs === r.timeMs ? prev.rank : i + 1;
  });
  return list;
}
