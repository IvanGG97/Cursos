export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/**
 * "Modo local": sin Supabase configurado y fuera de producción, la plataforma
 * funciona sin login y con acceso de admin, para poder trabajar el contenido.
 * En producción, la falta de configuración es un error.
 */
export function isLocalMode() {
  if (isSupabaseConfigured) return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver .env.example).",
    );
  }
  return true;
}

export const googleAuthEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "on";
