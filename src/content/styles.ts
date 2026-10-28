import type { CSSProperties } from "react";

// Estilos de las diapositivas: cada clase elige uno (desde el editor de la clase, o con `style` en su
// archivo de contenido). Un estilo trae sus fuentes, su color de acento y su paleta para el modo
// oscuro y para el claro: el botón sol/luna sigue funcionando en todas las clases.
// "original" es la identidad del sitio (Main.dc.html) con el acento propio de cada clase.
//
// Reglas para agregar uno (ver DECISIONES.md):
// · Fuentes iguales o más angostas que Space Grotesk (títulos) e IBM Plex Sans (texto), así lo que ya
//   entra en el proyector sigue entrando. Nunca Inter, Roboto ni Arial.
// · Contraste alto: texto sobre fondo y sobre panel, metadatos legibles, acento legible como texto en
//   oscuro y (oscurecido) en claro. El acento lleva texto oscuro encima (divisores, marcas del quiz).
// · Sin rojos ni verde lima de acento: son los colores de "Incorrecta" y "Correcta".
// · Las fuentes se cargan en src/components/deck/style-fonts.ts.

type Palette = {
  bg: string;
  panel: string;
  line: string;
  text: string;
  text2: string;
  muted: string;
  letterbox: string;
  /** Color de acento para este modo, si el general casi no se distingue del fondo (amarillos sobre blanco). */
  accent?: string;
  /** Solo si el acento oscurecido automáticamente no tiene contraste suficiente. */
  accentText?: string;
};

export type ClassStyle = {
  id: string;
  name: string;
  /** Para elegirlo: cómo es, en pocas palabras. */
  about: string;
  fonts?: { title: string; body: string; mono: string };
  /** Sin acento: usa el de la clase. */
  accent?: string;
  dark?: Palette;
  light?: Palette;
};

const SANS = `"Segoe UI", system-ui, sans-serif`;
const SERIF = `Georgia, "Times New Roman", serif`;
const MONO = `ui-monospace, Consolas, monospace`;
const f = (title: string, body: string, mono: string, titleFallback = SANS, bodyFallback = SANS) => ({
  title: `"${title}", ${titleFallback}`,
  body: `"${body}", ${bodyFallback}`,
  mono: `"${mono}", ${MONO}`,
});

export const DEFAULT_STYLE = "original";

export const CLASS_STYLES: ClassStyle[] = [
  {
    id: "original",
    name: "Original",
    about: "La identidad del sitio: azul noche, Space Grotesk e IBM Plex, con el color propio de la clase.",
  },
  {
    id: "lectura",
    name: "Lectura fácil",
    about: "Letra diseñada para leer sin esfuerzo y contraste máximo. Ideal si cuesta ver de lejos.",
    fonts: f("Atkinson Hyperlegible Next Variable", "Atkinson Hyperlegible Next Variable", "Atkinson Hyperlegible Mono Variable"),
    accent: "#FFD60A",
    dark: { bg: "#000000", panel: "#141414", line: "#3D3D3D", text: "#FFFFFF", text2: "#F0F0F0", muted: "#BDBDBD", letterbox: "#000000" },
    light: { bg: "#FFFFFF", panel: "#F3F3F3", line: "#A3A3A3", text: "#000000", text2: "#141414", muted: "#474747", letterbox: "#E0E0E0", accent: "#F5B800", accentText: "#665400" },
  },
  {
    id: "diario",
    name: "Diario",
    about: "Títulos con serifa de diario, texto sobrio y papel de periódico en el modo claro.",
    fonts: f("Playfair Display Variable", "Source Sans 3 Variable", "Source Code Pro Variable", SERIF),
    accent: "#FF7A59",
    dark: { bg: "#141210", panel: "#1F1C18", line: "#3A342C", text: "#F3EEE6", text2: "#D6CDBF", muted: "#A69A88", letterbox: "#0A0908" },
    light: { bg: "#F3EFE6", panel: "#FBF9F4", line: "#D3C9B6", text: "#16130F", text2: "#3B342B", muted: "#655B4B", letterbox: "#E2DCCF", accentText: "#9A3A1E" },
  },
  {
    id: "pizarra",
    name: "Pizarra",
    about: "Verde de pizarrón con tiza amarilla. Títulos con serifa recta, como de escuela.",
    fonts: f("Zilla Slab", "Nunito Sans Variable", "Courier Prime", SERIF),
    accent: "#F6E27F",
    dark: { bg: "#10211A", panel: "#162C23", line: "#2B4538", text: "#F1F6EF", text2: "#CCDCCF", muted: "#97AFA0", letterbox: "#08130E" },
    light: { bg: "#EEF4EF", panel: "#FAFDFA", line: "#C3D5C8", text: "#0E1D16", text2: "#2C4136", muted: "#52675B", letterbox: "#DCE6DE", accent: "#E0B520", accentText: "#665800" },
  },
  {
    id: "oceano",
    name: "Océano",
    about: "Azules profundos y celeste. Letras redondeadas y modernas.",
    fonts: f("Outfit Variable", "Figtree Variable", "Geist Mono Variable"),
    accent: "#38BDF8",
    dark: { bg: "#06141F", panel: "#0C1F2E", line: "#1D3648", text: "#EAF5FB", text2: "#C0D5E2", muted: "#88A3B6", letterbox: "#030B12" },
    light: { bg: "#EEF5FA", panel: "#FFFFFF", line: "#BCD1E0", text: "#07131C", text2: "#243A4A", muted: "#506C80", letterbox: "#DCE7EF", accentText: "#0B5E86" },
  },
  {
    id: "amable",
    name: "Amable",
    about: "Ciruela y rosa, con letra redonda y cercana.",
    fonts: f("Nunito Variable", "Nunito Variable", "Red Hat Mono Variable"),
    accent: "#FF8FB1",
    dark: { bg: "#17111B", panel: "#221A28", line: "#3C3046", text: "#F7F0F8", text2: "#DCCFE2", muted: "#AA9AB6", letterbox: "#0D0910" },
    light: { bg: "#FBF5F8", panel: "#FFFFFF", line: "#E2CFDB", text: "#1B1020", text2: "#3F2F47", muted: "#6A5874", letterbox: "#EEE3EA", accentText: "#A3284F" },
  },
  {
    id: "terracota",
    name: "Terracota",
    about: "Marrones de barro cocido y títulos con serifa suave. Cálido.",
    fonts: f("Fraunces Variable", "Source Sans 3 Variable", "IBM Plex Mono", SERIF),
    accent: "#F2A07B",
    dark: { bg: "#1B130F", panel: "#271C16", line: "#433126", text: "#F8EEE7", text2: "#DECBBD", muted: "#B09888", letterbox: "#0F0A07" },
    light: { bg: "#F8F1EB", panel: "#FFFCF9", line: "#E0CEBF", text: "#1D130D", text2: "#43332A", muted: "#6F5B4D", letterbox: "#EADDD2", accentText: "#94431F" },
  },
  {
    id: "bosque",
    name: "Bosque",
    about: "Verde oscuro de monte con ámbar. Letra firme, de cartel.",
    fonts: f("Archivo Variable", "Archivo Variable", "JetBrains Mono Variable"),
    accent: "#F5B83D",
    dark: { bg: "#0C150F", panel: "#13221A", line: "#253B2D", text: "#EDF6EF", text2: "#C4D8CA", muted: "#8DA896", letterbox: "#060C08" },
    light: { bg: "#F0F5F1", panel: "#FFFFFF", line: "#BDD3C3", text: "#0B1A10", text2: "#273D2F", muted: "#506657", letterbox: "#DDE7DF", accentText: "#7A5200" },
  },
  {
    id: "institucional",
    name: "Institucional",
    about: "Gris pizarra y azul, prolijo y serio. Para presentar en una oficina.",
    fonts: f("Red Hat Display Variable", "Red Hat Text Variable", "Red Hat Mono Variable"),
    accent: "#6AA8FF",
    dark: { bg: "#0E1218", panel: "#161C25", line: "#2B3442", text: "#EEF2F7", text2: "#CAD2DD", muted: "#909BAB", letterbox: "#07090D" },
    light: { bg: "#F5F7FA", panel: "#FFFFFF", line: "#C8D0DC", text: "#0E141C", text2: "#2E3846", muted: "#596577", letterbox: "#E2E7EE", accentText: "#1F57B3" },
  },
  {
    id: "senaletica",
    name: "Señalética",
    about: "Asfalto y naranja de cartel de ruta. Letra angosta y muy clara de lejos.",
    fonts: f("Barlow", "Barlow", "DM Mono"),
    accent: "#FF9500",
    dark: { bg: "#121212", panel: "#1C1C1C", line: "#363636", text: "#F5F5F5", text2: "#D5D5D5", muted: "#A3A3A3", letterbox: "#0A0A0A" },
    light: { bg: "#F6F6F4", panel: "#FFFFFF", line: "#D3D3CF", text: "#111111", text2: "#333333", muted: "#5E5E5E", letterbox: "#E4E4E0", accentText: "#8A4B00" },
  },
  {
    id: "lavanda",
    name: "Lavanda",
    about: "Violetas suaves y letra limpia. Tranquilo.",
    fonts: f("Hanken Grotesk Variable", "Hanken Grotesk Variable", "Spline Sans Mono Variable"),
    accent: "#B69CFF",
    dark: { bg: "#120F1C", panel: "#1B1729", line: "#322C4A", text: "#F2EFFB", text2: "#D0C9E7", muted: "#9F97BC", letterbox: "#0A0811" },
    light: { bg: "#F6F4FC", panel: "#FFFFFF", line: "#D8D1EC", text: "#130F21", text2: "#342D4C", muted: "#5E567B", letterbox: "#E7E3F3", accentText: "#5B3FC4" },
  },
  {
    id: "medianoche",
    name: "Medianoche",
    about: "Casi negro azulado con acento color luna. Elegante y sin distracciones.",
    fonts: f("Manrope Variable", "Instrument Sans Variable", "Geist Mono Variable"),
    accent: "#C7D2FE",
    dark: { bg: "#05070D", panel: "#0C111C", line: "#232C40", text: "#E9EEF8", text2: "#C1CADC", muted: "#8792A9", letterbox: "#020306" },
    light: { bg: "#F3F5FB", panel: "#FFFFFF", line: "#C6CEE2", text: "#0A0F1C", text2: "#29324A", muted: "#56607A", letterbox: "#E1E5F0", accent: "#9FAEF8", accentText: "#3F46B8" },
  },
  {
    id: "afiche",
    name: "Afiche",
    about: "Blanco y negro con magenta, títulos con personalidad. Llama la atención.",
    fonts: f("Bricolage Grotesque Variable", "Public Sans Variable", "Space Mono"),
    accent: "#F472D0",
    dark: { bg: "#0A0A0A", panel: "#161616", line: "#303030", text: "#FAFAFA", text2: "#DADADA", muted: "#A8A8A8", letterbox: "#000000" },
    light: { bg: "#FAFAF7", panel: "#FFFFFF", line: "#D6D6D1", text: "#0A0A0A", text2: "#2E2E2E", muted: "#5B5B5B", letterbox: "#EAEAE5", accentText: "#A1197F" },
  },
  {
    id: "libro",
    name: "Libro",
    about: "Sepia y dorado, todo con serifa de libro. Para clases tranquilas, de lectura.",
    fonts: f("Lora Variable", "Lora Variable", "IBM Plex Mono", SERIF, SERIF),
    accent: "#E3C27A",
    dark: { bg: "#17130E", panel: "#221C15", line: "#3D3327", text: "#F5EEE2", text2: "#DACDB8", muted: "#AA9A82", letterbox: "#0D0A07" },
    light: { bg: "#F5EFE3", panel: "#FCF8F0", line: "#D9CCB5", text: "#1C160E", text2: "#43392B", muted: "#6A5D49", letterbox: "#E7DECD", accent: "#D4A64A", accentText: "#7A5A12" },
  },
  {
    id: "menta",
    name: "Menta",
    about: "Verde agua fresco con letra humanista, de las que se leen fácil.",
    fonts: f("Fira Sans", "Fira Sans", "Fira Code Variable"),
    accent: "#5EEAD4",
    dark: { bg: "#0B1716", panel: "#112321", line: "#233A37", text: "#ECF7F5", text2: "#C3DBD7", muted: "#8BAAA5", letterbox: "#050D0C" },
    light: { bg: "#EFF7F5", panel: "#FFFFFF", line: "#BCD5CF", text: "#0A1A18", text2: "#263E3A", muted: "#4D6762", letterbox: "#DCEBE7", accent: "#2CC9B0", accentText: "#0E6B5D" },
  },
  {
    id: "grafito",
    name: "Grafito",
    about: "Grises neutros y acento plateado, letra minimalista. Que mande el contenido.",
    fonts: f("Geist Variable", "Geist Variable", "Geist Mono Variable"),
    accent: "#E5E7EB",
    dark: { bg: "#18181B", panel: "#222226", line: "#3C3C43", text: "#F4F4F5", text2: "#D4D4D8", muted: "#A1A1AA", letterbox: "#0E0E10" },
    light: { bg: "#F4F4F5", panel: "#FFFFFF", line: "#D1D1D6", text: "#18181B", text2: "#3F3F46", muted: "#5F5F68", letterbox: "#E4E4E7", accent: "#A1A1AA", accentText: "#46464F" },
  },
];

const BY_ID = new Map(CLASS_STYLES.map((s) => [s.id, s]));

/** El estilo con ese id (o el original si no existe o no hay ninguno). */
export function getStyle(id: string | null | undefined): ClassStyle {
  return (id && BY_ID.get(id)) || BY_ID.get(DEFAULT_STYLE)!;
}

export const isStyleId = (id: unknown): id is string => typeof id === "string" && BY_ID.has(id);

/** El color de acento con el que se ve la clase (el del estilo, o el de la clase si el estilo no trae). */
export function styleAccent(id: string | null | undefined, classAccent: string): string {
  return getStyle(id).accent ?? classAccent;
}

/**
 * Clase y variables para el contenedor de las diapositivas (`.deck`). El CSS (deck.css, `.deck.styled`)
 * elige la paleta oscura o la clara según el botón sol/luna.
 */
export function deckLook(id: string | null | undefined, classAccent: string): { className: string; style: CSSProperties } {
  const s = getStyle(id);
  if (!s.dark || !s.light || !s.fonts) return { className: "", style: { "--accent": s.accent ?? classAccent } as CSSProperties };
  // El acento no va directo en --accent: el CSS lo toma del modo (oscuro o claro) que esté activo.
  const vars: Record<string, string> = {};
  vars["--f-title"] = s.fonts.title;
  vars["--f-body"] = s.fonts.body;
  vars["--f-mono"] = s.fonts.mono;
  for (const [k, p] of [["d", s.dark], ["l", s.light]] as const) {
    vars[`--s${k}-accent`] = p.accent ?? s.accent ?? classAccent;
    vars[`--s${k}-bg`] = p.bg;
    vars[`--s${k}-panel`] = p.panel;
    vars[`--s${k}-line`] = p.line;
    vars[`--s${k}-text`] = p.text;
    vars[`--s${k}-text-2`] = p.text2;
    vars[`--s${k}-muted`] = p.muted;
    vars[`--s${k}-letterbox`] = p.letterbox;
    if (p.accentText) vars[`--s${k}-accent-text`] = p.accentText;
  }
  return { className: " styled", style: vars as CSSProperties };
}
