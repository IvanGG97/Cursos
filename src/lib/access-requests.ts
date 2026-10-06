import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { courses } from "@/content/registry";

// Solicitudes de admisión (quien no tiene Google). Presencial y manual: la persona pide acceso,
// el admin aprueba en el panel y la pantalla que esperaba entra sola. Ver la migración
// 20261006010000_access_requests.sql. La tabla la usa solo el servidor (clave secreta).

/** Cookie (solo de ese dispositivo) con el código secreto de la pantalla que espera. */
export const REQUEST_COOKIE = "access_request";
export const REQUEST_COOKIE_DAYS = 7;
export const MAX_PENDING = 300;

export const newRequestToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const normalizeEmail = (v: string) => v.trim().toLowerCase();
export const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) && v.length <= 254;
export const cleanName = (v: string) => v.replace(/\s+/g, " ").trim().slice(0, 80);

/** El curso de la solicitud: el que venía en el link, o el único que hay. */
export function requestCourse(slug: string | null | undefined) {
  const found = slug ? courses.find((c) => c.slug === slug) : undefined;
  return found ?? (courses.length === 1 ? courses[0] : undefined);
}
