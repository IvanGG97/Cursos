import "server-only";
import type { ClassDef } from "@/content/types";
import { computeRanking, type LiveAnswerRow, type LiveParticipantRow, type LiveQuestionRow } from "./live-score";
import { createClient } from "./supabase/server";

// Resultados guardados de una clase en vivo (panel y CSV): mismo cálculo que el proyector.

export function correctBySlide(clase: ClassDef) {
  const m: Record<number, number[]> = {};
  clase.slides.forEach((s, i) => {
    if (s.type === "quiz") m[i + 1] = s.options.map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0);
  });
  return m;
}

export async function loadLiveResults(sessionId: string, clase: ClassDef | undefined) {
  const supabase = await createClient();
  const [a, p, q] = await Promise.all([
    supabase.from("live_answers").select("slide, participant_id, choices, created_at").eq("session_id", sessionId),
    supabase.from("live_participants").select("participant_id, nickname, user_id").eq("session_id", sessionId),
    supabase.from("live_questions").select("slide, started_at").eq("session_id", sessionId),
  ]);
  const answers = (a.data ?? []) as LiveAnswerRow[];
  const participants = (p.data ?? []) as LiveParticipantRow[];
  const questions = (q.data ?? []) as LiveQuestionRow[];
  const ranking = clase ? computeRanking(correctBySlide(clase), questions, answers, participants) : [];
  return { answers, participants, questions, ranking };
}
