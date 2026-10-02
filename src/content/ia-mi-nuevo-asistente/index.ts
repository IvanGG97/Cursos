import type { Course } from "@/content/types";
import { clase1Slides } from "./clase1";
import { clase1Evaluacion } from "./clase1-evaluacion";
import { encuestaCurso } from "./encuesta";

// Curso "IA, mi nuevo asistente". Tiempos tomados del resumen del curso (PDF).
// Una clase con `slides: []` aparece como "En preparación".

export const iaMiNuevoAsistente: Course = {
  slug: "ia-mi-nuevo-asistente",
  title: "IA, mi nuevo asistente",
  tagline: "Perderle el miedo a la Inteligencia Artificial y usarla en la vida diaria",
  org: "Escuela de Emprendedores — Municipalidad de la Ciudad de Salta",
  accent: "#22D3EE",
  survey: encuestaCurso,
  classes: [
    {
      num: 1,
      title: "Qué es esto y cómo le hablo",
      summary: "Conceptos base, límites de la IA y tu primer mensaje",
      accent: "#22D3EE",
      blocks: [
        { name: "Qué es la IA + panorama de opciones", min: 15 },
        { name: "Conceptos clave: tokens, contexto, chats, proyectos", min: 25 },
        { name: "Límites: alucinaciones", min: 15 },
        { name: "Primer contacto: crear cuenta", min: 20 },
        { name: "Cómo pedir bien las cosas", min: 35 },
        { name: "Cierre: reglas de oro", min: 10 },
      ],
      slides: clase1Slides,
      evaluation: clase1Evaluacion,
    },
    {
      num: 2,
      title: "Crear, entender y comunicarte",
      summary: "Ideas, textos y mensajes — también para tu changa",
      accent: "#FF6A3D",
      blocks: [
        { name: "Apertura: repaso y presentación del día", min: 15 },
        { name: "Creativa: generar ideas", min: 25 },
        { name: "Entender y comunicar", min: 25 },
        { name: "Aplicarlo a tu changa o emprendimiento", min: 25 },
        { name: "Práctica integradora", min: 20 },
        { name: "Cierre", min: 10 },
      ],
      slides: [],
    },
    {
      num: 3,
      title: "Organización de la vida diaria",
      summary: "Listas, planes, presupuestos y comparar opciones",
      accent: "#7C5CFF",
      blocks: [
        { name: "Apertura: repaso y presentación del día", min: 10 },
        { name: "Armar listas y planes", min: 30 },
        { name: "Presupuestos básicos", min: 30 },
        { name: "Comparar opciones con criterios", min: 35 },
        { name: "Cierre", min: 15 },
      ],
      slides: [],
    },
    {
      num: 4,
      title: "Decisiones y cuidado digital",
      summary: "Trámites, casa y bolsillo, y sentido crítico",
      accent: "#2EE6A8",
      blocks: [
        { name: "Apertura: repaso y presentación del día", min: 15 },
        { name: "Decisiones importantes", min: 25 },
        { name: "Casa y bolsillo", min: 25 },
        { name: "Cuidado y sentido crítico", min: 25 },
        { name: "Repaso general del curso", min: 20 },
        { name: "Cierre del curso", min: 10 },
      ],
      slides: [],
    },
  ],
};
