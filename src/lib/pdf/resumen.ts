import type { Row, Slide } from "@/content/types";

// Convierte las diapositivas de una clase en un resumen de lectura.
// Sin contenido nuevo: todo sale de los slides. Los quizzes van al final como autoevaluación.

export type ResumenItem =
  | { kind: "concept"; title: string; body: string; analogy?: string }
  | { kind: "rows"; title: string; rows: Row[] }
  | { kind: "steps"; title: string; steps: string[] }
  | { kind: "quote"; title: string; label: string; text: string; caption?: string }
  | { kind: "compare"; title: string; left: string; right: string; leftLabel: string; rightLabel: string }
  | { kind: "practice"; title: string; text: string }
  | { kind: "list"; title: string; items: string[] };

export type ResumenSection = { badge?: string; title: string; subtitle?: string; items: ResumenItem[] };

export type ResumenQuiz = { question: string; answers: string[]; multi: boolean };

export type Resumen = { agenda: string[]; sections: ResumenSection[]; quiz: ResumenQuiz[] };

export function buildResumen(slides: Slide[]): Resumen {
  const agenda: string[] = [];
  const quiz: ResumenQuiz[] = [];
  const sections: ResumenSection[] = [{ title: "Introducción", items: [] }];
  const current = () => sections[sections.length - 1];

  for (const s of slides) {
    switch (s.type) {
      case "title":
        break;
      case "agenda":
        agenda.push(...s.items);
        break;
      case "divider":
        sections.push({ badge: s.badge, title: s.title, subtitle: s.subtitle, items: [] });
        break;
      case "concept":
        current().items.push({ kind: "concept", title: s.title, body: s.body, analogy: s.analogy });
        break;
      case "content":
        current().items.push({ kind: "rows", title: s.title, rows: s.rows });
        break;
      case "steps":
        current().items.push({ kind: "steps", title: s.title, steps: s.steps });
        break;
      case "quote":
        current().items.push({ kind: "quote", title: s.title, label: s.quoteLabel, text: s.quoteText, caption: s.caption });
        break;
      case "compare":
        current().items.push({
          kind: "compare",
          title: s.title,
          left: s.left,
          right: s.right,
          leftLabel: s.leftLabel ?? "Vago",
          rightLabel: s.rightLabel ?? "Claro",
        });
        break;
      case "practice":
        current().items.push({ kind: "practice", title: s.title, text: s.instructions });
        break;
      case "checkpoint":
        current().items.push({ kind: "list", title: s.title, items: s.items });
        break;
      case "quiz":
        quiz.push({
          question: s.question,
          answers: s.options.filter((o) => o.correct).map((o) => o.text),
          multi: s.kind === "multi",
        });
        break;
    }
  }

  // Secciones sin contenido (ej. el divisor "La próxima clase") no van al resumen.
  return { agenda, sections: sections.filter((x) => x.items.length > 0), quiz };
}
