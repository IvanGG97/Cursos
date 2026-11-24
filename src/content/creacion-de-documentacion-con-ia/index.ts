import type { Course } from "@/content/types";
import { cdClase1Slides } from "./clase1";
import { cdClase2Slides } from "./clase2";

// Curso "Creación de documentación con IA" (capacitación interna para el personal de la
// Municipalidad de Salta). Se dio una vez como clase única de 2 h (miércoles 28/10/2026, 10 a 12 hs);
// desde el martes 24/11/2026 son **dos clases de 2 h** (martes 24 y miércoles 25/11, 14 a 16 hs):
// la 1 escribe adentro del chat; la 2 lo convierte en archivos (Word, PDF y Google Drive).
// Con cuenta de Google, Gemini gratis; sin cuenta de Google, Claude gratis con cualquier mail; sin
// ninguna cuenta, Gemini sin sesión + copiar a Word (último recurso).
// Sin evaluación ni encuesta por ahora: se pueden sumar después con `evaluation` y `survey`.

export const creacionDeDocumentacionConIa: Course = {
  slug: "creacion-de-documentacion-con-ia",
  title: "Creación de documentación con IA",
  tagline: "Notas, memorandos, actas e informes con Gemini o Claude, listos en Word o PDF",
  org: "Capacitación interna — Municipalidad de la Ciudad de Salta",
  accent: "#FFB020",
  classes: [
    {
      num: 1,
      title: "Escribir con IA",
      summary: "Notas, memorandos, actas e informes: pedirlos bien y corregirlos conversando",
      accent: "#FFB020",
      blocks: [
        { name: "Apertura: entrar a Gemini (Google) o a Claude (mail)", min: 15 },
        { name: "La receta de un buen pedido, y lo que no se pega", min: 20 },
        { name: "La nota formal", min: 25 },
        { name: "Memorando y acta", min: 25 },
        { name: "Informe o proyecto", min: 20 },
        { name: "Tu documento de la semana, y cierre", min: 15 },
      ],
      slides: cdClase1Slides,
    },
    {
      num: 2,
      title: "Del chat al archivo",
      summary: "Resumir archivos, crear y modificar Word y PDF, y conectar tu Google Drive",
      accent: "#38BDF8",
      blocks: [
        { name: "Apertura: volver a entrar y repaso", min: 15 },
        { name: "Un archivo que ya tenés: resumirlo", min: 20 },
        { name: "Del chat al archivo: crear y modificar Word y PDF", min: 30 },
        { name: "Conectar con Google Drive", min: 25 },
        { name: "Tu documento, de principio a fin", min: 20 },
        { name: "Cuidados y cierre", min: 10 },
      ],
      slides: cdClase2Slides,
    },
  ],
};
