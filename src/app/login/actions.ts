"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrigin, safeNext } from "@/lib/urls";

export type LoginState = { error?: string; sent?: string };

async function callbackUrl(next: string) {
  return `${await getOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Revisá que el mail esté bien escrito." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: await callbackUrl(safeNext(formData.get("next"))) },
  });

  if (error) {
    return error.status === 429
      ? { error: "Pediste varios links seguidos. Esperá un minuto y probá de nuevo." }
      : { error: "No pudimos mandar el mail. Probá de nuevo en un rato." };
  }
  return { sent: email };
}

/** Login con el token que devuelve el botón de Google (Google Identity Services). */
export async function signInWithGoogleToken(credential: string, nonce: string, next: string): Promise<LoginState> {
  if (!credential || !nonce) return { error: "No pudimos completar el ingreso con Google. Probá de nuevo." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: credential, nonce });
  if (error) return { error: "No pudimos completar el ingreso con Google. Probá de nuevo." };

  redirect(safeNext(next));
}

/** Login con Google por redirección a través de Supabase (alternativa si no hay ID de cliente). */
export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl(safeNext(formData.get("next"))) },
  });
  if (error || !data.url) redirect("/login?error=google");
  redirect(data.url);
}
