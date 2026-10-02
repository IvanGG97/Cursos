// Datos generales de la plataforma.

/** Nombre provisorio de la plataforma (pendiente de definir). */
export const SITE_NAME = "Cursos · Iván Gutiérrez";

/** Modo de color. El oscuro es el de la identidad y el valor por defecto. */
export type Theme = "dark" | "light";
export const THEME_COOKIE = "theme";

/** Zona horaria en la que se cargan y muestran las fechas de liberación de clases. */
export const TIME_ZONE = "America/Argentina/Salta";
/** Argentina no tiene horario de verano: el offset es fijo. */
export const TZ_OFFSET = "-03:00";

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** ISO → valor para <input type="datetime-local"> en hora de Argentina. */
export function toLocalInput(iso: string | null) {
  if (!iso) return "";
  // sv-SE formatea como "2026-10-01 16:00:00".
  const s = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
  return s.replace(" ", "T").slice(0, 16);
}

/** Valor de <input type="datetime-local"> (hora de Argentina) → ISO, o null si está vacío. */
export function fromLocalInput(value: string) {
  return value ? new Date(`${value}:00${TZ_OFFSET}`).toISOString() : null;
}
