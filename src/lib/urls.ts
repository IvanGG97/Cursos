import { headers } from "next/headers";

/** Solo rutas internas ("/algo"), para que ?next= no se pueda usar como redirección abierta. */
export function safeNext(value: FormDataEntryValue | string | null | undefined, fallback = "/") {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}

/** URL base del sitio: NEXT_PUBLIC_SITE_URL si está, si no la del request. */
export async function getOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
