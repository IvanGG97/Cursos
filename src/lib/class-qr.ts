import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "./supabase/server";
import { createServiceClient, isServiceConfigured } from "./supabase/admin";

// QR de una clase (fuera de la clase en vivo): el link abre la clase en el celular. En un curso con
// inscripción, el link lleva un permiso (?k=) sacado del código de inscripción del curso: quien lo
// escanea entra con su cuenta y queda inscripto solo, como si hubiera escrito el código. El código no
// queda a la vista, y si el admin lo cambia o lo desactiva, los QR viejos dejan de inscribir.

/** Permiso del QR para un curso (depende de su código de inscripción). */
export function qrToken(slug: string, code: string) {
  return createHash("sha256").update(`qr-clase:${slug}:${code}`).digest("base64url").slice(0, 16);
}

/** Código de inscripción del curso (solo el servidor lo lee). */
export async function courseCode(slug: string): Promise<string | null> {
  if (!isServiceConfigured) return null;
  const { data } = await createServiceClient().from("course_codes").select("code").eq("course_slug", slug).maybeSingle();
  return (data?.code as string | undefined) ?? null;
}

/** Si el permiso del QR es válido, inscribe a quien tiene la sesión iniciada. true = quedó inscripto. */
export async function joinWithQr(slug: string, k: string): Promise<boolean> {
  const code = await courseCode(slug);
  if (!code) return false;
  const want = Buffer.from(qrToken(slug, code));
  const got = Buffer.from(k);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return false;
  // Igual que escribir el código: la base rechaza cuentas suspendidas y cursos sin publicar.
  const { error } = await (await createClient()).rpc("join_course", { p_code: code });
  return !error;
}
