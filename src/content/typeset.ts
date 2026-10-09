/** Convierte "comillas rectas" en “comillas tipográficas” (Space Grotesk dibuja mal las rectas). */
export function typeset<T>(value: T): T {
  if (typeof value === "string") return value.replace(/"([^"\n]*)"/g, "“$1”") as T;
  if (Array.isArray(value)) return value.map(typeset) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typeset(v)])) as T;
  }
  return value;
}
