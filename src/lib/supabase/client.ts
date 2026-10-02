"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cliente de Supabase para el navegador (tiempo real de la clase en vivo). Comparte la sesión
// con el servidor a través de las cookies. Una sola instancia por pestaña.

let client: SupabaseClient | null = null;

export function getBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    );
  }
  return client;
}
