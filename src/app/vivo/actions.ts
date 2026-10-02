"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/access";
import { openSessionByCode } from "./sessions";

export type JoinState = { error?: string };

/** Unirse a la clase en vivo con el código de 4 números (registra asistencia si hay sesión iniciada). */
export async function joinLive(_prev: JoinState, formData: FormData): Promise<JoinState> {
  const code = String(formData.get("code") ?? "").replace(/\D/g, "");
  if (code.length !== 4) return { error: "El código tiene 4 números." };

  // El admin no se registra como alumno: va a la partida, donde elige volver a presentar.
  const viewer = await getViewer();
  if (viewer.kind === "user" && viewer.isAdmin) {
    const id = await openSessionByCode(code);
    if (id) redirect(`/vivo/${id}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_live", { p_code: code });
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) {
    return error?.code === "P0002"
      ? { error: "Ese código no corresponde a ninguna clase en vivo. Revisalo en la pantalla." }
      : { error: "No pudimos conectarte. Probá de nuevo." };
  }
  redirect(`/vivo/${row.session_id}`);
}
