import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Partida abierta con ese código (sin registrar asistencia). Para el admin, que puede ver todas. */
export async function openSessionByCode(code: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("live_sessions")
    .select("id")
    .eq("code", code)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}
