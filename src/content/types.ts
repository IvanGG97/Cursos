// Contrato entre el contenido (src/content/<curso>/*) y la plataforma.
// Para agregar contenido no hace falta tocar el motor: alcanza con escribir objetos Slide.

export type Media = {
  /**
   * Identificador fijo del lugar (ej. "c1-login-claude"). Con él, el admin sube o reemplaza el
   * archivo desde el panel (Admin → curso → Imágenes). No cambiarlo una vez que hay archivo subido.
   */
  id: string;
  kind: "IMAGEN" | "GIF";
  /** Qué buscar / mostrar. Se ve como placeholder mientras no haya archivo. */
  caption: string;
  /** Archivo por defecto en /public (ej. "/img/ia-mi-nuevo-asistente/x.svg"). Lo subido desde el panel tiene prioridad. */
  src?: string;
  /** Tipo de archivo (lo completa el panel; "video/mp4" se muestra como video en bucle, sin sonido). */
  mime?: string;
  /**
   * Galería (la completa el panel cuando hay más de una imagen en el lugar). La primera es la
   * portada (= `src`). En la diapositiva se ve como un abanico y se abre en pantalla completa.
   */
  gallery?: { src: string; mime?: string }[];
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
  /** Evaluación de la clase (opcional). Solo preguntas sobre lo que la clase explica. */
  evaluation?: Evaluation;
};

export type EvaluationQuestion = {
  /** Identificador estable: se guarda en los resultados. No cambiarlo una vez publicada. */
  id: string;
  kind: "vf" | "single" | "multi";
  question: string;
  options: QuizOption[];
  /** Se muestra después de entregar: por qué es así. */
  explanation: string;
};

export type Evaluation = {
  /** Identificador estable (ej. "clase-1-v1"). Si se cambian las preguntas a fondo, usar uno nuevo. */
  id: string;
  title: string;
  intro: string;
  /** Porcentaje mínimo para aprobar (0-100). */
  passPercent: number;
  questions: EvaluationQuestion[];
};

export type SurveyQuestion =
  | { id: string; kind: "scale"; label: string; min: number; max: number; minLabel: string; maxLabel: string; required: boolean }
  | { id: string; kind: "choice"; label: string; options: string[]; required: boolean }
  | { id: string; kind: "text"; label: string; placeholder?: string; required: boolean };

export type Survey = {
  id: string;
  title: string;
  intro: string;
  questions: SurveyQuestion[];
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
  /** Encuesta de satisfacción del curso (opcional). */
  survey?: Survey;
};
