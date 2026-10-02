import type { Survey } from "@/content/types";

// Encuesta de satisfacción del curso. Corta: 6 preguntas, 2 abiertas opcionales.

export const encuestaCurso: Survey = {
  id: "satisfaccion-v1",
  title: "¿Cómo te fue con el curso?",
  intro: "Son 6 preguntas cortas. Los resultados se ven en conjunto y sin tu nombre. Nos ayudan a mejorar las próximas ediciones.",
  questions: [
    {
      id: "general",
      kind: "scale",
      label: "En general, ¿qué te pareció el curso?",
      min: 1,
      max: 5,
      minLabel: "Nada bueno",
      maxLabel: "Excelente",
      required: true,
    },
    {
      id: "utilidad",
      kind: "scale",
      label: "¿Qué tan útil te resulta para tu día a día o tu emprendimiento?",
      min: 1,
      max: 5,
      minLabel: "Nada útil",
      maxLabel: "Muy útil",
      required: true,
    },
    {
      id: "claridad",
      kind: "scale",
      label: "¿Las explicaciones fueron claras?",
      min: 1,
      max: 5,
      minLabel: "Nada claras",
      maxLabel: "Muy claras",
      required: true,
    },
    {
      id: "ritmo",
      kind: "choice",
      label: "El ritmo de las clases fue…",
      options: ["Muy lento", "Justo", "Muy rápido"],
      required: true,
    },
    {
      id: "mejor",
      kind: "text",
      label: "¿Qué fue lo que más te sirvió?",
      placeholder: "Por ejemplo: aprender a pedir bien las cosas…",
      required: false,
    },
    {
      id: "mejorar",
      kind: "text",
      label: "¿Qué cambiarías o agregarías?",
      required: false,
    },
  ],
};
