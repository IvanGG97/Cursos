import "server-only";
import { notFound, redirect } from "next/navigation";
import { getViewer, type Viewer } from "./access";
import { createClient } from "./supabase/server";

// Utilidades del panel de administración (solo servidor).

type Supabase = Awaited<ReturnType<typeof createClient>>;
type AdminViewer = Extract<Viewer, { kind: "user" }>;
export type AdminCtx = { supabase: Supabase; viewer: AdminViewer };

/** Resultado de toda acción del panel: el formulario muestra `ok` o `error`. */
export type ActionResult = { ok?: string; error?: string };

/**
 * Para páginas del panel. Sin sesión → login; sin permisos → 404.
 * En modo local (sin Supabase) devuelve null: el layout ya muestra el aviso.
 */
export async function requireAdmin(next = "/admin"): Promise<AdminCtx | null> {
  const viewer = await getViewer();
  if (viewer.kind === "local") return null;
  if (viewer.kind === "anon") redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!viewer.isAdmin) notFound();
  return { supabase: await createClient(), viewer };
}

/** Para Server Actions: verifica admin acá (además de la RLS en la base). */
export async function adminCtx(): Promise<AdminCtx> {
  const viewer = await getViewer();
  if (viewer.kind !== "user" || !viewer.isAdmin) throw new Error("Solo administradores.");
  return { supabase: await createClient(), viewer };
}

/** Deja constancia de una acción en el registro de actividad. Nunca hace fallar la acción. */
export async function audit(ctx: AdminCtx, action: string, target: string, details: Record<string, unknown> = {}) {
  await ctx.supabase.from("admin_audit").insert({ actor: ctx.viewer.id, action, target, details });
}

/** Normaliza y valida una lista de mails pegada en un textarea (separados por coma, espacio o renglón). */
export function parseEmails(raw: string) {
  const all = raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const valid = [...new Set(all.filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))];
  const invalid = all.filter((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  return { valid, invalid };
}

/** Código de inscripción legible: sin letras ni números que se confunden (0/O, 1/I/L). */
export function randomCode(length = 8) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const AUDIT_LABELS: Record<string, string> = {
  "course.publish": "Publicó el curso",
  "course.unpublish": "Despublicó el curso",
  "course.mode.hidden": "Despublicó el curso",
  "course.mode.enrolled": "Publicó el curso (con inscripción)",
  "course.mode.public": "Liberó el curso (libre, sin registro)",
  "class.release_all": "Liberó todas las clases",
  "live.start": "Inició una clase en vivo",
  "live.end": "Terminó una clase en vivo",
  "live.rename": "Renombró una clase en vivo",
  "media.set": "Subió una imagen o video",
  "media.link": "Puso un enlace de imagen o video",
  "media.remove": "Quitó una imagen o video",
  "media.annotate": "Señaló sobre una imagen (flechas y recuadros)",
  "course.code.set": "Cambió el código de inscripción",
  "course.code.remove": "Desactivó el código de inscripción",
  "class.release": "Cambió la liberación de una clase",
  "survey.open": "Habilitó la encuesta final",
  "survey.close": "Deshabilitó la encuesta final",
  "enrollment.add": "Inscribió a una persona",
  "enrollment.invite": "Invitó por mail",
  "enrollment.suspend": "Suspendió una inscripción",
  "enrollment.activate": "Reactivó una inscripción",
  "enrollment.remove": "Quitó una inscripción",
  "invite.cancel": "Canceló una invitación",
  "grant.add": "Dio acceso individual a una clase",
  "grant.remove": "Quitó un acceso individual",
  "user.role": "Cambió el rol de una persona",
  "user.block": "Suspendió una cuenta",
  "user.unblock": "Reactivó una cuenta",
};
