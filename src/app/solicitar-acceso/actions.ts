"use server";

import { cookies } from "next/headers";
import {
  MAX_PENDING,
  REQUEST_COOKIE,
  REQUEST_COOKIE_DAYS,
  cleanName,
  hashToken,
  isEmail,
  newRequestToken,
  normalizeEmail,
  requestCourse,
} from "@/lib/access-requests";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient, isServiceConfigured } from "@/lib/supabase/admin";

export type RequestState = { error?: string; sent?: boolean };
export type RequestStatus =
  | { status: "none" }
  | { status: "pending"; name: string; email: string }
  | { status: "rejected" }
  | { status: "in"; next: string };

const MISSING = "Las solicitudes todavía no están configuradas. Avisale a tu docente.";

async function setTokenCookie(token: string) {
  (await cookies()).set(REQUEST_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REQUEST_COOKIE_DAYS * 24 * 3600,
  });
}

/** Deja la solicitud (nombre + mail). Esta pantalla queda esperando la aprobación. */
export async function requestAccess(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const name = cleanName(String(formData.get("name") ?? ""));
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const course = requestCourse(String(formData.get("course") ?? ""));
  if (name.length < 2) return { error: "Escribí tu nombre y apellido." };
  if (!isEmail(email)) return { error: "Revisá el mail: tiene que ser como nombre@ejemplo.com." };
  if (!isServiceConfigured) return { error: MISSING };
  const svc = createServiceClient();

  // Si ese mail ya tiene cuenta de Google, que entre con Google.
  const { data: prof } = await svc.from("profiles").select("id").eq("email", email).maybeSingle();
  if (prof) {
    const { data: u } = await svc.auth.admin.getUserById(prof.id);
    if (u.user?.identities?.some((i) => i.provider === "google")) {
      return { error: "Ese mail ya tiene una cuenta de Google: entrá con el botón «Continuar con Google»." };
    }
  }

  const token = newRequestToken();
  // Una solicitud pendiente por mail: si ya había una, se actualiza (espera este dispositivo).
  const { data: existing, error: e1 } = await svc
    .from("access_requests")
    .select("id")
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();
  if (e1) return { error: /access_requests/.test(e1.message) ? MISSING : "No pudimos enviar la solicitud. Probá de nuevo." };

  if (existing) {
    const { error } = await svc
      .from("access_requests")
      .update({ full_name: name, token_hash: hashToken(token), course_slug: course?.slug ?? null, created_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return { error: "No pudimos enviar la solicitud. Probá de nuevo." };
  } else {
    const { count } = await svc.from("access_requests").select("id", { count: "exact", head: true }).eq("status", "pending");
    if ((count ?? 0) >= MAX_PENDING) return { error: "Hay demasiadas solicitudes pendientes. Avisale a tu docente." };
    if (course) await svc.from("courses").upsert({ slug: course.slug }, { onConflict: "slug", ignoreDuplicates: true });
    const { error } = await svc
      .from("access_requests")
      .insert({ full_name: name, email, course_slug: course?.slug ?? null, token_hash: hashToken(token) });
    if (error) return { error: "No pudimos enviar la solicitud. Probá de nuevo." };
  }
  await setTokenCookie(token);
  return { sent: true };
}

/**
 * Lo consulta cada pocos segundos la pantalla que espera. Si el admin aprobó, inicia la sesión en
 * ESTE dispositivo (sin mail: el servidor genera el acceso y lo canjea él mismo) y avisa adónde ir.
 */
export async function checkAccessRequest(): Promise<RequestStatus> {
  const jar = await cookies();
  const token = jar.get(REQUEST_COOKIE)?.value;
  if (!token || !isServiceConfigured) return { status: "none" };
  const svc = createServiceClient();
  const { data: r } = await svc
    .from("access_requests")
    .select("id, full_name, email, course_slug, status, claimed_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!r) {
    jar.delete(REQUEST_COOKIE);
    return { status: "none" };
  }
  if (r.status === "pending") return { status: "pending", name: r.full_name, email: r.email };
  if (r.status === "rejected") {
    jar.delete(REQUEST_COOKIE);
    return { status: "rejected" };
  }

  const next = r.course_slug ? `/cursos/${r.course_slug}` : "/";
  // Aprobada: se canjea UNA sola vez (marcarla primero evita que dos pantallas la usen).
  const { data: claimed } = await svc
    .from("access_requests")
    .update({ claimed_at: new Date().toISOString() })
    .eq("id", r.id)
    .is("claimed_at", null)
    .select("id")
    .maybeSingle();
  if (!claimed) {
    jar.delete(REQUEST_COOKIE);
    return { status: "none" };
  }

  const { data: link, error: e1 } = await svc.auth.admin.generateLink({ type: "magiclink", email: r.email });
  const supabase = await createClient();
  const hashed = link?.properties?.hashed_token;
  const { error: e2 } = hashed
    ? await supabase.auth.verifyOtp({ type: "magiclink", token_hash: hashed })
    : { error: e1 ?? new Error("Sin acceso generado") };
  if (e2) {
    // No se pudo iniciar la sesión: se libera para reintentar en la próxima consulta.
    await svc.from("access_requests").update({ claimed_at: null }).eq("id", r.id);
    return { status: "pending", name: r.full_name, email: r.email };
  }
  jar.delete(REQUEST_COOKIE);
  return { status: "in", next };
}

/** "No soy yo / quiero corregir el mail": olvida la solicitud en este dispositivo. */
export async function forgetAccessRequest(): Promise<void> {
  (await cookies()).delete(REQUEST_COOKIE);
}
