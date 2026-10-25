import type { Course } from "@/content/types";
import { cdClase1Slides } from "./clase1";

// Curso "Creación de documentación con IA" (capacitación interna para el personal de la
// Municipalidad de Salta; miércoles 28/10/2026, 10 a 12 hs, Sala de Capacitación).
// Una sola clase de 2 h: con cuenta de Google, Gemini gratis (crea el archivo en Word/PDF o lo exporta
// a Documentos); sin cuenta de Google, Claude gratis con cualquier mail (crea y modifica archivos);
// sin ninguna cuenta, Gemini sin sesión + copiar a Word (último recurso).
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
      title: "Creación de documentación con IA",
      summary: "Del pedido al archivo terminado: nota, memorando, acta e informe",
      accent: "#FFB020",
      blocks: [
        { name: "Apertura: entrar a Gemini (Google) o a Claude (mail)", min: 15 },
        { name: "La receta de un buen pedido", min: 15 },
        { name: "La nota formal", min: 20 },
        { name: "Memorando y acta", min: 20 },
        { name: "Informe o proyecto", min: 15 },
        { name: "Del chat al archivo: crear y modificar Word y PDF", min: 20 },
        { name: "Cuidados y cierre", min: 15 },
      ],
      slides: cdClase1Slides,
    },
  ],
};
