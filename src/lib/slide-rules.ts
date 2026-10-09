import type { Media, QuizOption, Row, Slide } from "@/content/types";

// Reglas de las diapositivas para el editor de clases. Las usa el editor (para avisar mientras se
// escribe) y el servidor (que es el que decide al guardar). Sin dependencias del servidor.
//
// · problemas: impiden publicar (un campo obligatorio vacío, una pregunta mal armada).
// · avisos: límites de diseño aprendidos al revisar las clases en el proyector (más filas de las
//   que entran, una pregunta de 4 opciones demasiado larga). Se puede publicar igual.

export type SlideType = Slide["type"];

export const SLIDE_TYPES: { type: SlideType; label: string; help: string }[] = [
  { type: "concept", label: "Concepto", help: "Un título, un texto y una analogía (con imagen opcional)." },
  { type: "content", label: "Filas", help: "Título y filas de \"título: descripción\" (hasta 4; con imagen, 3)." },
  { type: "steps", label: "Paso a paso", help: "Hasta 4 pasos numerados (con imagen opcional)." },
  { type: "quote", label: "Ejemplo o plantilla", help: "Un pedido destacado, con su etiqueta y una nota abajo." },
  { type: "practice", label: "Tarea", help: "Una actividad para hacer en clase." },
  { type: "quiz", label: "Pregunta", help: "Verdadero o falso, una opción o varias correctas." },
  { type: "compare", label: "Comparación", help: "Dos columnas: una forma vs. otra." },
  { type: "checkpoint", label: "Te llevás", help: "Una lista de hasta 4 cosas para el cierre." },
  { type: "divider", label: "Divisor de bloque", help: "Abre un bloque: etiqueta, título y subtítulo." },
  { type: "agenda", label: "Agenda", help: "La lista de temas de la clase (hasta 6)." },
  { type: "title", label: "Portada", help: "La primera diapositiva de la clase." },
];

export const typeLabel = (t: SlideType) => SLIDE_TYPES.find((x) => x.type === t)?.label ?? t;

export const LIMITS = {
  slides: 200,
  short: 160, // títulos, etiquetas, filas
  long: 1200, // textos, consignas
  list: 12,
  quizOptions: 4,
};

/** Diapositiva nueva de un tipo, con textos de ejemplo para reemplazar. */
export function newSlide(type: SlideType): Slide {
  switch (type) {
    case "title":
      return { type, claseLine: "Clase N — Título de la clase", subtitle: "Subtítulo", duracion: "Clase de 2 horas" };
    case "agenda":
      return { type, items: ["Primer tema", "Segundo tema", "Tercer tema"] };
    case "divider":
      return { type, badge: "BLOQUE N · 20 MIN", title: "Título del bloque", subtitle: "Subtítulo" };
    case "concept":
      return { type, kicker: "Etiqueta", title: "Título", body: "Explicación.", analogy: "Es como..." };
    case "content":
      return { type, kicker: "Etiqueta", title: "Título", rows: [{ h: "Título de la fila", d: "descripción." }] };
    case "quiz":
      return {
        type,
        kind: "single",
        question: "¿Pregunta?",
        options: [
          { text: "Opción correcta", correct: true },
          { text: "Otra opción", correct: false },
          { text: "Otra opción", correct: false },
        ],
        explanation: "Por qué es así.",
      };
    case "quote":
      return { type, kicker: "Ejemplo", title: "Título", quoteLabel: "LE PEDIMOS", quoteText: "\"El pedido.\"", caption: "Una nota." };
    case "steps":
      return { type, kicker: "Paso a paso", title: "Título", steps: ["Primer paso.", "Segundo paso."] };
    case "practice":
      return { type, title: "Tarea N · Nombre", instructions: "Qué tienen que hacer." };
    case "compare":
      return { type, kicker: "Etiqueta", title: "Una forma vs. otra", left: "Así no.", right: "Así sí.", leftLabel: "Vago", rightLabel: "Claro" };
    case "checkpoint":
      return { type, title: "Hoy te llevás...", items: ["Una cosa.", "Otra cosa."] };
  }
}

/** Texto corto para la lista de diapositivas del editor. */
export function slideSummary(s: Slide): string {
  switch (s.type) {
    case "title":
      return s.claseLine;
    case "agenda":
      return "Agenda de la clase";
    case "quiz":
      return s.question;
    case "practice":
    case "checkpoint":
    case "divider":
    case "concept":
    case "content":
    case "quote":
    case "steps":
    case "compare":
      return s.title;
  }
}

// ---------------------------------------------------------------------------
// Problemas (impiden publicar) y avisos (de diseño)
// ---------------------------------------------------------------------------

const empty = (v: string | undefined) => !v || !v.trim();

export function slideProblems(s: Slide): string[] {
  const out: string[] = [];
  const need = (v: string | undefined, name: string) => empty(v) && out.push(`falta ${name}.`);
  switch (s.type) {
    case "title":
      need(s.claseLine, "la línea de la clase");
      break;
    case "agenda":
      if (!s.items.length || s.items.some((x) => empty(x))) out.push("hay un tema de la agenda vacío.");
      break;
    case "divider":
      need(s.title, "el título");
      break;
    case "concept":
      need(s.title, "el título");
      need(s.body, "el texto");
      break;
    case "content":
      need(s.title, "el título");
      if (!s.rows.length) out.push("tiene que tener al menos una fila.");
      if (s.rows.some((r) => empty(r.h))) out.push("hay una fila sin título.");
      break;
    case "steps":
      need(s.title, "el título");
      if (!s.steps.length || s.steps.some((x) => empty(x))) out.push("hay un paso vacío.");
      break;
    case "quote":
      need(s.title, "el título");
      need(s.quoteText, "el texto destacado");
      break;
    case "practice":
      need(s.title, "el título");
      need(s.instructions, "la consigna");
      break;
    case "compare":
      need(s.title, "el título");
      need(s.left, "el texto de la izquierda");
      need(s.right, "el texto de la derecha");
      break;
    case "checkpoint":
      need(s.title, "el título");
      if (!s.items.length || s.items.some((x) => empty(x))) out.push("hay un ítem vacío.");
      break;
    case "quiz": {
      need(s.question, "la pregunta");
      const correct = s.options.filter((o) => o.correct).length;
      if (s.options.some((o) => empty(o.text))) out.push("hay una opción vacía.");
      if (s.kind === "vf") {
        if (s.options.length !== 2) out.push("verdadero o falso lleva 2 opciones.");
        if (correct !== 1) out.push("marcá cuál es la correcta.");
      } else {
        if (s.options.length < 2) out.push("tiene que tener al menos 2 opciones.");
        if (s.options.length > LIMITS.quizOptions) out.push(`máximo ${LIMITS.quizOptions} opciones.`);
        if (s.kind === "single" && correct !== 1) out.push("\"una opción\" tiene que tener exactamente 1 correcta.");
        if (s.kind === "multi" && correct < 1) out.push("marcá al menos una correcta.");
        if (s.kind === "multi" && correct === s.options.length) out.push("no pueden ser todas correctas.");
      }
      break;
    }
  }
  return out;
}

export function slideWarnings(s: Slide): string[] {
  const out: string[] = [];
  const long = (v: string | undefined, max: number, name: string) => v && v.length > max && out.push(`${name}: ${v.length} letras, es mucho para el proyector (mejor menos de ${max}).`);
  if ("title" in s && typeof s.title === "string") long(s.title, 70, "El título");
  switch (s.type) {
    case "agenda":
      if (s.items.length > 6) out.push("la agenda tiene más de 6 temas: no entran.");
      break;
    case "content":
      if (s.media && s.rows.length > 3) out.push("con imagen entran 3 filas como máximo.");
      else if (s.rows.length > 4) out.push("entran 4 filas como máximo.");
      break;
    case "steps":
      if (s.steps.length > 4) out.push("entran 4 pasos como máximo.");
      break;
    case "checkpoint":
      if (s.items.length > 4) out.push("entran 4 ítems como máximo.");
      break;
    case "concept":
      long(s.body, s.media ? 280 : 340, "El texto");
      break;
    case "quote":
      long(s.quoteText, 260, "El texto destacado");
      break;
    case "practice":
      long(s.instructions, 420, "La consigna");
      break;
    case "quiz":
      if (s.options.length === 4 && s.question.length > 55) out.push("con 4 opciones, la pregunta tiene que entrar en una línea (menos de 55 letras).");
      else long(s.question, 140, "La pregunta");
      break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Normalizar lo que llega del navegador (no se confía en nada)
// ---------------------------------------------------------------------------

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const opt = (v: unknown, max: number) => {
  const s = str(v, max);
  return s.trim() ? s : undefined;
};
const strList = (v: unknown) => (Array.isArray(v) ? v.slice(0, LIMITS.list).map((x) => str(x, LIMITS.long)) : []);

function media(v: unknown): Media | undefined {
  const m = v as Partial<Media> | null | undefined;
  if (!m || typeof m !== "object") return undefined;
  const id = typeof m.id === "string" && /^[\w-]{1,60}$/.test(m.id) ? m.id : null;
  if (!id) return undefined;
  return {
    id,
    kind: m.kind === "GIF" ? "GIF" : "IMAGEN",
    caption: str(m.caption, LIMITS.long),
    ...(typeof m.src === "string" && /^\/img\/[\w./-]+$/.test(m.src) ? { src: m.src } : {}),
  };
}

function one(raw: unknown): Slide | null {
  const r = raw as Record<string, unknown> | null;
  if (!r || typeof r !== "object") return null;
  const S = LIMITS.short;
  const L = LIMITS.long;
  switch (r.type) {
    case "title":
      return { type: "title", claseLine: str(r.claseLine, S), subtitle: str(r.subtitle, S), duracion: str(r.duracion, S) };
    case "agenda":
      return { type: "agenda", items: strList(r.items) };
    case "divider":
      return { type: "divider", badge: str(r.badge, S), title: str(r.title, S), ...(opt(r.subtitle, S) ? { subtitle: opt(r.subtitle, S) } : {}) };
    case "concept": {
      const m = media(r.media);
      return { type: "concept", kicker: str(r.kicker, S), title: str(r.title, S), body: str(r.body, L), ...(opt(r.analogy, L) ? { analogy: opt(r.analogy, L) } : {}), ...(m ? { media: m } : {}) };
    }
    case "content": {
      const m = media(r.media);
      const rows: Row[] = Array.isArray(r.rows) ? r.rows.slice(0, LIMITS.list).map((x) => ({ h: str((x as Row)?.h, S), d: str((x as Row)?.d, L) })) : [];
      return { type: "content", kicker: str(r.kicker, S), title: str(r.title, S), rows, ...(m ? { media: m } : {}) };
    }
    case "steps": {
      const m = media(r.media);
      return { type: "steps", kicker: str(r.kicker, S), title: str(r.title, S), steps: strList(r.steps), ...(m ? { media: m } : {}) };
    }
    case "quote":
      return { type: "quote", kicker: str(r.kicker, S), title: str(r.title, S), quoteLabel: str(r.quoteLabel, S), quoteText: str(r.quoteText, L), ...(opt(r.caption, L) ? { caption: opt(r.caption, L) } : {}) };
    case "practice":
      return { type: "practice", title: str(r.title, S), instructions: str(r.instructions, L) };
    case "compare":
      return {
        type: "compare",
        kicker: str(r.kicker, S),
        title: str(r.title, S),
        left: str(r.left, L),
        right: str(r.right, L),
        ...(opt(r.leftLabel, S) ? { leftLabel: opt(r.leftLabel, S) } : {}),
        ...(opt(r.rightLabel, S) ? { rightLabel: opt(r.rightLabel, S) } : {}),
      };
    case "checkpoint":
      return { type: "checkpoint", title: str(r.title, S), items: strList(r.items) };
    case "quiz": {
      const kind = r.kind === "vf" || r.kind === "multi" ? r.kind : "single";
      const options: QuizOption[] = Array.isArray(r.options)
        ? r.options.slice(0, 8).map((o) => ({ text: str((o as QuizOption)?.text, L), correct: Boolean((o as QuizOption)?.correct) }))
        : [];
      return { type: "quiz", kind, question: str(r.question, L), options, ...(opt(r.explanation, L) ? { explanation: opt(r.explanation, L) } : {}) };
    }
    default:
      return null;
  }
}

/** Devuelve las diapositivas limpias, o null si algo no tiene la forma esperada. */
export function normalizeSlides(raw: unknown): Slide[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > LIMITS.slides) return null;
  const out: Slide[] = [];
  for (const r of raw) {
    const s = one(r);
    if (!s) return null;
    out.push(s);
  }
  return out;
}

/** Todos los problemas de la clase, con el número de diapositiva. Vacío = se puede publicar. */
export function classProblems(slides: Slide[]): string[] {
  return slides.flatMap((s, i) => slideProblems(s).map((p) => `Diapositiva ${i + 1}: ${p}`));
}

/** Identificador nuevo para un lugar de imagen (no se repite). */
export function newMediaId(classNum: number) {
  return `c${classNum}-img-${Math.random().toString(36).slice(2, 7)}`;
}
