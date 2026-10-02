import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// Cliente con la clave SECRETA de Supabase: salta la RLS. Usarlo solo en el servidor y solo para
// lo que los usuarios no pueden escribir por su cuenta (hoy: los intentos de evaluación, que
// corrige el servidor). La clave nunca va en una variable NEXT_PUBLIC_.

const SECRET = process.env.SUPABASE_SECRET_KEY ?? "";

export const isServiceConfigured = Boolean(SUPABASE_URL && SECRET);

export function createServiceClient() {
  if (!isServiceConfigured) throw new Error("Falta SUPABASE_SECRET_KEY (ver .env.example).");
  return createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false, autoRefreshToken: false } });
}
