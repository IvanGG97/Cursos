import path from "node:path";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resumen, ResumenItem } from "./resumen";

// Resumen imprimible de una clase: fondo blanco, misma tipografía que las diapositivas.
// El acento de la clase se usa solo en barras y marcas (en texto sobre blanco no tiene contraste).

const FONTS = path.join(process.cwd(), "src/lib/pdf/fonts");
let fontsReady = false;

function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: "Space Grotesk",
    fonts: [
      { src: path.join(FONTS, "space-grotesk-latin-600-normal.ttf"), fontWeight: 600 },
      { src: path.join(FONTS, "space-grotesk-latin-700-normal.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "IBM Plex Sans",
    fonts: [
      { src: path.join(FONTS, "ibm-plex-sans-latin-400-normal.ttf"), fontWeight: 400 },
      { src: path.join(FONTS, "ibm-plex-sans-latin-400-italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(FONTS, "ibm-plex-sans-latin-600-normal.ttf"), fontWeight: 600 },
    ],
  });
  Font.register({
    family: "IBM Plex Mono",
    fonts: [
      { src: path.join(FONTS, "ibm-plex-mono-latin-500-normal.ttf"), fontWeight: 500 },
      { src: path.join(FONTS, "ibm-plex-mono-latin-600-normal.ttf"), fontWeight: 600 },
    ],
  });
  // Sin guiones de corte: la separación silábica por defecto es la del inglés.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const INK = "#0B0F14";
const TEXT = "#1F2733";
const MUTED = "#5B6577";
const LINE = "#D9DEE7";
const SOFT = "#F3F5F8";

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 56, paddingHorizontal: 50, fontFamily: "IBM Plex Sans", fontSize: 10.5, color: TEXT, lineHeight: 1.45 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 6 },
  kicker: { fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 8.5, letterSpacing: 1.2, textTransform: "uppercase", color: MUTED },
  h1: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 24, lineHeight: 1.15, color: INK, marginTop: 8, marginBottom: 6 },
  summary: { fontSize: 12, color: TEXT, marginBottom: 4 },
  org: { fontSize: 9, color: MUTED },
  box: { backgroundColor: SOFT, padding: 12, marginTop: 18 },
  agendaItem: { flexDirection: "row", marginTop: 3 },
  num: { fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 9, width: 22, color: INK },
  section: { marginTop: 26 },
  sectionHead: { borderBottomWidth: 1, borderBottomColor: LINE, paddingBottom: 6, marginBottom: 4 },
  h2: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 17, lineHeight: 1.3, color: INK, marginTop: 3 },
  sub: { fontSize: 10, color: MUTED, marginTop: 3 },
  item: { marginTop: 12 },
  h3: { fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 12.5, color: INK, marginBottom: 4 },
  analogy: { borderWidth: 1, borderColor: LINE, padding: 9, marginTop: 6 },
  label: { fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 7.5, letterSpacing: 1, textTransform: "uppercase", color: MUTED, marginBottom: 3 },
  row: { flexDirection: "row", borderTopWidth: 1, borderTopColor: LINE, paddingVertical: 5 },
  rowH: { width: "38%", fontWeight: 600, color: INK, paddingRight: 10 },
  rowD: { width: "62%" },
  bullet: { flexDirection: "row", marginTop: 3 },
  dot: { width: 12 },
  cols: { flexDirection: "row", gap: 10, marginTop: 4 },
  col: { flex: 1, borderWidth: 1, borderColor: LINE, padding: 9 },
  quizItem: { marginTop: 10 },
  answer: { marginTop: 3, flexDirection: "row" },
  footerLine: { position: "absolute", bottom: 38, left: 50, right: 50, height: 1, backgroundColor: LINE },
  footerText: { position: "absolute", bottom: 24, left: 50, right: 50, fontFamily: "IBM Plex Mono", fontSize: 7.5, color: MUTED },
});

type Props = {
  course: { title: string; org: string };
  clase: { num: number; title: string; summary: string; accent: string };
  resumen: Resumen;
};

export function ResumenDocument({ course, clase, resumen }: Props) {
  registerFonts();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Document title={`${course.title} — Clase ${clase.num}: ${clase.title}`} author={course.org} language="es">
      <Page size="A4" style={s.page}>
        {/* Elementos fijos al principio de la página: así se repiten en todas. */}
        <View fixed style={[s.bar, { backgroundColor: clase.accent }]} />
        <View fixed style={s.footerLine} />
        {/* Sin número de página: los textos con `render` de react-pdf se posicionan mal con este layout. */}
        <Text fixed style={s.footerText}>
          {course.title} · Clase {clase.num} · {course.org}
        </Text>

        <Text style={s.kicker}>{course.title} · Resumen de la clase {clase.num}</Text>
        <Text style={s.h1}>{clase.title}</Text>
        <Text style={s.summary}>{clase.summary}</Text>
        <Text style={s.org}>{course.org}</Text>

        {resumen.agenda.length > 0 && (
          <View style={s.box} wrap={false}>
            <Text style={s.label}>Qué vimos</Text>
            {resumen.agenda.map((a, i) => (
              <View key={i} style={s.agendaItem}>
                <Text style={s.num}>{pad(i + 1)}</Text>
                <Text style={{ flex: 1 }}>{a}</Text>
              </View>
            ))}
          </View>
        )}

        {resumen.sections.map((sec, i) => (
          <View key={i} style={s.section}>
            <View style={s.sectionHead} minPresenceAhead={90}>
              {sec.badge && <Text style={s.kicker}>{sec.badge}</Text>}
              <Text style={s.h2}>{sec.title}</Text>
              {sec.subtitle && <Text style={s.sub}>{sec.subtitle}</Text>}
            </View>
            {sec.items.map((item, j) => (
              <Item key={j} item={item} />
            ))}
          </View>
        ))}

        {resumen.quiz.length > 0 && (
          <View style={s.section} break>
            <View style={s.sectionHead}>
              <Text style={s.kicker}>Para repasar</Text>
              <Text style={s.h2}>Autoevaluación</Text>
              <Text style={s.sub}>Las preguntas de la clase, con su respuesta.</Text>
            </View>
            {resumen.quiz.map((q, i) => (
              <View key={i} style={s.quizItem} wrap={false}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={s.num}>{pad(i + 1)}</Text>
                  <Text style={{ flex: 1, fontWeight: 600, color: INK }}>{q.question}</Text>
                </View>
                {q.answers.map((a, j) => (
                  <View key={j} style={[s.answer, { paddingLeft: 22 }]}>
                    <Text style={{ width: 70, fontFamily: "IBM Plex Mono", fontSize: 8, color: MUTED }}>
                      {q.multi ? "CORRECTA" : "RESPUESTA"}
                    </Text>
                    <Text style={{ flex: 1 }}>{a}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

function Item({ item }: { item: ResumenItem }) {
  switch (item.kind) {
    case "concept":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          <Text>{item.body}</Text>
          {item.analogy && (
            <View style={s.analogy}>
              <Text style={s.label}>Analogía</Text>
              <Text>{item.analogy}</Text>
            </View>
          )}
        </View>
      );
    case "rows":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          {item.rows.map((r, i) => (
            <View key={i} style={s.row}>
              <Text style={s.rowH}>{r.h}</Text>
              <Text style={s.rowD}>{r.d}</Text>
            </View>
          ))}
        </View>
      );
    case "steps":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          {item.steps.map((st, i) => (
            <View key={i} style={s.bullet}>
              <Text style={s.num}>{i + 1}.</Text>
              <Text style={{ flex: 1 }}>{st}</Text>
            </View>
          ))}
        </View>
      );
    case "quote":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          <View style={s.analogy}>
            <Text style={s.label}>{item.label}</Text>
            <Text>{item.text}</Text>
          </View>
          {item.caption && <Text style={{ marginTop: 6, fontWeight: 600, color: INK }}>{item.caption}</Text>}
        </View>
      );
    case "compare":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          <View style={s.cols}>
            <View style={s.col}>
              <Text style={s.label}>{item.leftLabel}</Text>
              <Text>{item.left}</Text>
            </View>
            <View style={[s.col, { borderColor: INK }]}>
              <Text style={[s.label, { color: INK }]}>{item.rightLabel}</Text>
              <Text>{item.right}</Text>
            </View>
          </View>
        </View>
      );
    case "practice":
      return (
        <View style={[s.item, s.box, { marginTop: 12 }]} wrap={false}>
          <Text style={s.label}>Práctica</Text>
          <Text style={s.h3}>{item.title}</Text>
          <Text>{item.text}</Text>
        </View>
      );
    case "list":
      return (
        <View style={s.item} wrap={false}>
          <Text style={s.h3}>{item.title}</Text>
          {item.items.map((it, i) => (
            <View key={i} style={s.bullet}>
              <Text style={s.dot}>–</Text>
              <Text style={{ flex: 1 }}>{it}</Text>
            </View>
          ))}
        </View>
      );
  }
}
