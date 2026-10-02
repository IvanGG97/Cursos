import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 2. Cada pregunta sale de algo explicado en la clase (en el comentario,
// la diapositiva de donde sale). No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase2Evaluacion: Evaluation = {
  id: "clase-2-v1",
  title: "Evaluación de la Clase 2",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "\"Dame 10 ideas para...\" + tus criterios"
      id: "q1",
      kind: "vf",
      question: "Al pedir ideas, conviene decir cuántas querés, para quién son y qué condiciones tienen que cumplir.",
      options: VF(true),
      explanation: "Esa es la receta: cuántas, para quién, qué condiciones y cómo te las da.",
    },
    {
      // "Error común y recomendación" — ideas
      id: "q2",
      kind: "single",
      question: "Le pediste nombres para tu emprendimiento y te dio nombres muy comunes. ¿Qué conviene hacer?",
      options: [
        { text: "Quedarte con el primero: total, son todos parecidos.", correct: false },
        { text: "Decirle que son muy comunes y pedirle 10 más originales, con tus criterios.", correct: true },
        { text: "Dejar de usar la IA para ideas.", correct: false },
      ],
      explanation: "Pedile otra vuelta con tus criterios: \"estas son muy comunes, dame 10 más originales\".",
    },
    {
      // "\"Explicámelo como si tuviera 10 años\""
      id: "q3",
      kind: "single",
      question: "¿Para qué sirve pedirle a la IA \"explicámelo como si tuviera 10 años\"?",
      options: [
        { text: "Para que te explique en palabras simples un texto difícil.", correct: true },
        { text: "Para que la respuesta sea más larga.", correct: false },
        { text: "Para que el texto sea apto para chicos.", correct: false },
      ],
      explanation: "Es una forma de pedir que te explique algo difícil (una nota del banco, un reglamento) en simple.",
    },
    {
      // "Un pedido para entender" (caption)
      id: "q4",
      kind: "vf",
      question: "Antes de pegar en el chat una nota del banco, conviene borrar o tapar tu número de cuenta y tu DNI completo.",
      options: VF(true),
      explanation: "Para entender la nota no necesita tus datos sensibles: borralos o tapalos antes.",
    },
    {
      // "Resumir un PDF largo"
      id: "q5",
      kind: "multi",
      question: "Vas a pedirle el resumen de un PDF largo. ¿Qué conviene decirle? Marcá todas las correctas.",
      options: [
        { text: "Qué querés sacar: \"los 5 puntos principales\".", correct: true },
        { text: "En qué formato: \"una lista corta\".", correct: true },
        { text: "Que invente lo que no entienda.", correct: false },
      ],
      explanation: "Qué querés sacar y en qué formato. Y después, fechas y montos se chequean en el original.",
    },
    {
      // "Reescribir todo vs. mejorar lo tuyo"
      id: "q6",
      kind: "single",
      question: "¿Qué suele pasar cuando le pedís a la IA que \"reescriba todo\" tu mensaje?",
      options: [
        { text: "Queda prolijo, pero puede dejar de sonar a vos.", correct: true },
        { text: "Queda igual que lo escribiste.", correct: false },
        { text: "Se borra el mensaje original.", correct: false },
      ],
      explanation: "Por eso conviene pedir \"mejorá esto, pero mantené mi forma de escribir\".",
    },
    {
      // "Qué decirle en cada caso"
      id: "q7",
      kind: "single",
      question: "¿Cómo conviene pedir un WhatsApp para un cliente?",
      options: [
        { text: "Largo y muy formal, para quedar bien.", correct: false },
        { text: "Corto, amable y con la información justa: precio, día y hora.", correct: true },
        { text: "Sin datos, para que el cliente pregunte.", correct: false },
      ],
      explanation: "En un WhatsApp a un cliente: corto, amable y con la información justa.",
    },
    {
      // "Error común y recomendación" — tu negocio
      id: "q8",
      kind: "vf",
      question: "Si la IA agrega en tu mensaje una garantía que no ofrecés, igual lo podés mandar: total, lo escribió la IA.",
      options: VF(false),
      explanation: "Lo que dice el mensaje lo tenés que cumplir vos: precios, plazos y garantías los ponés vos.",
    },
    {
      // "Avisar una demora sin perder al cliente"
      id: "q9",
      kind: "single",
      question: "Para avisarle una demora a un cliente, ¿qué le conviene contar a la IA?",
      options: [
        { text: "Solo \"escribí un mensaje de disculpas\".", correct: false },
        { text: "Qué pasó, qué le ofrecés (nuevos horarios) y en qué tono.", correct: true },
        { text: "El nombre completo y el DNI del cliente.", correct: false },
      ],
      explanation: "Con la situación, lo que ofrecés y el tono, la IA no tiene que adivinar nada.",
    },
    {
      // "Ideas para vender más"
      id: "q10",
      kind: "multi",
      question: "¿Qué cosas le podés pedir a la IA para vender más? Marcá todas las correctas.",
      options: [
        { text: "Ideas de promociones para los días de poco movimiento.", correct: true },
        { text: "Qué ofrecer en fechas especiales, como el Día de la Madre.", correct: true },
        { text: "Respuestas listas para las preguntas que te hacen siempre.", correct: true },
        { text: "Que decida tus precios sin que le digas tus costos.", correct: false },
      ],
      explanation: "Promos, fechas especiales y preguntas frecuentes. Los datos de tu negocio (precios) los ponés vos.",
    },
  ],
};
