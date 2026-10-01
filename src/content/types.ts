// Contrato entre el contenido (src/content/<curso>/*) y la plataforma.
// Para agregar contenido no hace falta tocar el motor: alcanza con escribir objetos Slide.

export type Media = {
  kind: "IMAGEN" | "GIF";
  /** Qué buscar / mostrar. Se ve como placeholder mientras no haya `src`. */
  caption: string;
  /** Ruta a un archivo en /public (ej. "/img/ia-mi-nuevo-asistente/login-claude.png"). */
  src?: string;
};

export type Row = { h: string; d: string };

export type QuizOption = { text: string; correct: boolean };

export type Slide =
  | { type: "title"; claseLine: string; subtitle: string; duracion: string }
  | { type: "agenda"; items: string[] }
  | { type: "divider"; badge: string; title: string; subtitle?: string }
  | { type: "concept"; kicker: string; title: string; body: string; analogy?: string; media?: Media }
  | { type: "content"; kicker: string; title: string; rows: Row[]; media?: Media }
  | {
      type: "quiz";
      /** vf = verdadero/falso, single = una correcta, multi = varias correctas */
      kind: "vf" | "single" | "multi";
      question: string;
      options: QuizOption[];
      /** Se muestra al revelar la respuesta. */
      explanation?: string;
    }
  | { type: "quote"; kicker: string; title: string; quoteLabel: string; quoteText: string; caption?: string }
  | { type: "steps"; kicker: string; title: string; steps: string[]; media?: Media }
  | { type: "practice"; title: string; instructions: string }
  | {
      type: "compare";
      kicker: string;
      title: string;
      left: string;
      right: string;
      leftLabel?: string;
      rightLabel?: string;
    }
  | { type: "checkpoint"; title: string; items: string[] };

export type ClassDef = {
  /** Número de clase dentro del curso (1, 2, 3...). Es la clave en la base de datos. */
  num: number;
  title: string;
  /** Línea corta para listados. */
  summary: string;
  /** Color de acento de la clase (hex). */
  accent: string;
  /** Bloques con tiempos. */
  blocks: { name: string; min: number }[];
  /** Vacío = clase todavía no escrita ("En preparación"). */
  slides: Slide[];
};

export type Course = {
  /** Identificador en URL y en la base de datos. No cambiar una vez publicado. */
  slug: string;
  title: string;
  tagline: string;
  /** Institución / programa para el que se dicta. */
  org: string;
  /** Color de acento del curso en el catálogo (hex). */
  accent: string;
  classes: ClassDef[];
};
