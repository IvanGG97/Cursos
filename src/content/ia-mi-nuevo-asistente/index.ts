import type { Course } from "@/content/types";
import { clase1Slides } from "./clase1";
import { clase1Evaluacion } from "./clase1-evaluacion";
import { clase2Slides } from "./clase2";
import { clase2Evaluacion } from "./clase2-evaluacion";
import { clase3Slides } from "./clase3";
import { clase3Evaluacion } from "./clase3-evaluacion";
import { clase4Slides } from "./clase4";
import { clase4Evaluacion } from "./clase4-evaluacion";
import { encuestaCurso } from "./encuesta";

// Curso "IA, desde 0" (antes "IA, mi nuevo asistente"; el slug quedó igual). Tiempos tomados del resumen del curso (PDF).
// Una clase con `slides: []` aparece como "En preparación".

export const iaMiNuevoAsistente: Course = {
  slug: "ia-mi-nuevo-asistente",
  title: "IA, desde 0",
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
      summary: "Ideas, voz, fotos, archivos y mensajes — también para tu trabajo",
      accent: "#FF6A3D",
      blocks: [
        // v2 (2026-10-07): se suma el bloque de voz, fotos, archivos y enlaces; se redistribuyen los minutos.
        { name: "Apertura: repaso y presentación del día", min: 10 },
        { name: "Creativa: generar ideas", min: 20 },
        { name: "Hablarle y mostrarle cosas: voz, fotos, archivos y enlaces", min: 25 },
        { name: "Entender y comunicar", min: 20 },
        { name: "Aplicarlo a tu trabajo o emprendimiento", min: 20 },
        { name: "Práctica integradora", min: 15 },
        { name: "Cierre", min: 10 },
      ],
      slides: clase2Slides,
      evaluation: clase2Evaluacion,
    },
    {
      num: 3,
      title: "Organización de la vida diaria",
      summary: "Buscar, armar tablas y archivos, recordar y crear imágenes",
      accent: "#7C5CFF",
      blocks: [
        // v2 (2026-10-08): rearmada por funciones de las tres IA.
        { name: "Apertura: repaso y presentación del día", min: 10 },
        { name: "Los botones de cada respuesta", min: 15 },
        { name: "Buscar en internet, con fuentes", min: 20 },
        { name: "Tablas y archivos (de Word a PDF)", min: 20 },
        { name: "Memoria e instrucciones", min: 15 },
        { name: "Crear imágenes: tu caricatura o tu logo", min: 30 },
        { name: "Cierre", min: 10 },
      ],
      slides: clase3Slides,
      evaluation: clase3Evaluacion,
    },
    {
      num: 4,
      title: "Automatizar y cuidarte",
      summary: "Tu agenda, tu Drive y tus recordatorios con IA, sin caer en estafas",
      accent: "#2EE6A8",
      blocks: [
        // v2 (2026-10-09): rearmada alrededor de la automatización y las estafas.
        { name: "Apertura: repaso y qué es automatizar", min: 15 },
        { name: "Conectar la IA con tus apps (paso a paso)", min: 25 },
        { name: "Tu agenda desde el chat", min: 15 },
        { name: "Archivos que van solos a tu Drive", min: 10 },
        { name: "Recordatorios que te avisan", min: 10 },
        { name: "Menú de automatizaciones", min: 15 },
        { name: "Cuidarte: estafas y permisos", min: 20 },
        { name: "Cierre del curso", min: 10 },
      ],
      slides: clase4Slides,
      evaluation: clase4Evaluacion,
    },
  ],
};
