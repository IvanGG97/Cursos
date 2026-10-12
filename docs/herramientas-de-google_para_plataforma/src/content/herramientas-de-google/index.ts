import type { Course } from "@/content/types";
import { hgClase1Slides } from "./clase1";
import { hgClase2Slides } from "./clase2";
import { hgClase3Slides } from "./clase3";
import { hgClase4Slides } from "./clase4";

// Curso "Herramientas de Google" (dictado del 21 al 24 de septiembre de 2026, Teatro Municipal, 14 a 16 hs).
// Porteado desde los pptx de cada día; tiempos por bloque tomados del resumen del curso (PDF).
// Sin evaluaciones ni encuesta todavía (el curso ya se dictó): se pueden sumar después con `evaluation` y `survey`.

export const herramientasDeGoogle: Course = {
  slug: "herramientas-de-google",
  title: "Herramientas de Google",
  tagline: "Gmail, Calendar, Documentos, Hojas, Presentaciones, Formularios y Drive — y un asistente de IA que los conecta",
  org: "Escuela de Emprendedores — Municipalidad de la Ciudad de Salta",
  accent: "#4285F4",
  classes: [
    {
      num: 1,
      title: "Gmail + Google Calendar",
      summary: "Ordenar tu correo y empezar tu agenda digital",
      accent: "#4285F4",
      blocks: [
        { name: "Gmail (repaso express)", min: 30 },
        { name: "Google Calendar — primeros pasos", min: 45 },
        { name: "Google Calendar — recordatorios y eventos recurrentes", min: 45 },
      ],
      slides: hgClase1Slides,
    },
    {
      num: 2,
      title: "Google Documentos + Google Hojas de cálculo",
      summary: "Escribir, compartir y calcular en la nube",
      accent: "#EA4335",
      blocks: [
        { name: "Google Documentos", min: 60 },
        { name: "Google Hojas de cálculo", min: 60 },
      ],
      slides: hgClase2Slides,
    },
    {
      num: 3,
      title: "Google Presentaciones + Google Formularios",
      summary: "Mostrar tus ideas y juntar respuestas de otras personas",
      accent: "#FBBC04",
      blocks: [
        { name: "Google Presentaciones", min: 60 },
        { name: "Google Formularios", min: 60 },
      ],
      slides: hgClase3Slides,
    },
    {
      num: 4,
      title: "Google Drive + Google Calendar + Asistentes de IA (Claude)",
      summary: "Tus archivos en Drive, tu agenda compartida y Claude conectado a todo",
      accent: "#34A853",
      blocks: [
        { name: "Google Drive", min: 30 },
        { name: "Google Calendar conectado con el resto de tu vida digital", min: 30 },
        { name: "Asistentes de IA conectados a Google (Claude)", min: 60 },
      ],
      slides: hgClase4Slides,
    },
  ],
};
