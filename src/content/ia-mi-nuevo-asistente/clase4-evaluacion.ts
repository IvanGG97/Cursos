import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 4. Cada pregunta sale de algo explicado en la clase (en el comentario,
// la diapositiva de donde sale). No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase4Evaluacion: Evaluation = {
  id: "clase-4-v1",
  title: "Evaluación de la Clase 4",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "Un trámite, paso a paso"
      id: "q1",
      kind: "single",
      question: "¿Para qué sirve la IA en un trámite?",
      options: [
        { text: "Para ordenarlo: qué pasos suele tener, qué papeles preparar y qué preguntar.", correct: true },
        { text: "Para saber con seguridad los costos y turnos de hoy.", correct: false },
        { text: "Para hacer el trámite por vos.", correct: false },
      ],
      explanation: "Te orienta y te ordena. Requisitos, turnos y costos se confirman en la web oficial.",
    },
    {
      // "Llegar preparado a la consulta"
      id: "q2",
      kind: "vf",
      question: "La IA te puede ayudar a armar una lista de preguntas para llevarle al médico.",
      options: VF(true),
      explanation: "Prepararte para la consulta es un muy buen uso: ordenar lo que te pasa y armar preguntas.",
    },
    {
      // "Error común y recomendación" — urgencias
      id: "q3",
      kind: "single",
      question: "Tenés un síntoma fuerte, de golpe. ¿Qué hacés?",
      options: [
        { text: "Le pregunto a la IA qué tomar.", correct: false },
        { text: "Llamo al 911 o voy a la guardia.", correct: true },
        { text: "Espero a ver si se pasa y lo busco en internet.", correct: false },
      ],
      explanation: "Ante una urgencia, no se chatea: 911 o guardia.",
    },
    {
      // "Tapá tus datos"
      id: "q4",
      kind: "multi",
      question: "Antes de mandarle a la IA la foto de una factura, ¿qué conviene tapar? Marcá todas las correctas.",
      options: [
        { text: "Tu nombre.", correct: true },
        { text: "Tu dirección.", correct: true },
        { text: "Tu número de cliente o de medidor.", correct: true },
        { text: "El nombre de la empresa de luz.", correct: false },
      ],
      explanation: "Los datos que te identifican. El nombre de la empresa no es un dato tuyo.",
    },
    {
      // "Un contrato de alquiler, en simple"
      id: "q5",
      kind: "single",
      question: "Querés entender tu contrato de alquiler con la IA. ¿Qué conviene pegarle?",
      options: [
        { text: "El contrato entero, con nombres y DNI.", correct: false },
        { text: "Solo las cláusulas que te importan, sin nombres ni DNI.", correct: true },
        { text: "Nada: los contratos no se pueden explicar.", correct: false },
      ],
      explanation: "Solo la parte que necesitás y sin datos personales. Las dudas serias, con un profesional.",
    },
    {
      // "Lo que hay en la heladera"
      id: "q6",
      kind: "single",
      question: "Para pedirle recetas con lo que hay en tu heladera, ¿qué le contás?",
      options: [
        { text: "Qué ingredientes tenés, para cuántos es y cuánto tiempo tenés.", correct: true },
        { text: "Solo \"tengo hambre\".", correct: false },
        { text: "La marca de tu heladera.", correct: false },
      ],
      explanation: "El mismo truco de siempre: tus datos (qué hay, para cuántos, cuánto tiempo) y el formato.",
    },
    {
      // "Cómo detectar contenido hecho con IA"
      id: "q7",
      kind: "multi",
      question: "¿Cuáles son pistas de que una imagen pudo ser hecha con IA? Marcá todas las correctas.",
      options: [
        { text: "Manos o dedos raros.", correct: true },
        { text: "Letras deformadas.", correct: true },
        { text: "Fondos que no tienen sentido.", correct: true },
        { text: "Que la foto sea a color.", correct: false },
      ],
      explanation: "Manos, letras y fondos raros son pistas. Igual, cada vez fallan más: fijate quién lo publica.",
    },
    {
      // "Las pistas cada vez fallan más"
      id: "q8",
      kind: "vf",
      question: "Ante una noticia dudosa, lo que mejor funciona es buscarla en medios conocidos o en la fuente oficial.",
      options: VF(true),
      explanation: "Las pistas visuales fallan cada vez más; la fuente no. Y ante la duda, no se comparte.",
    },
    {
      // "Cómo reconocer una estafa"
      id: "q9",
      kind: "single",
      question: "Te llega un mensaje del \"banco\" con un link para evitar que bloqueen tu cuenta. ¿Qué hacés?",
      options: [
        { text: "Entro al link rápido, antes de que la bloqueen.", correct: false },
        { text: "No toco el link: llamo al número de mi tarjeta o entro a la app oficial.", correct: true },
        { text: "Respondo el mensaje con mis datos para verificar.", correct: false },
      ],
      explanation: "Urgencia + link es señal de estafa. Se confirma por el canal oficial, nunca por el link.",
    },
    {
      // "Error común y recomendación" — médico y abogado
      id: "q10",
      kind: "vf",
      question: "Para preguntarle a la IA sobre un síntoma, hace falta darle tu nombre, tu DNI y tu número de afiliado.",
      options: VF(false),
      explanation: "Para preguntar no hace falta ningún dato personal: contale lo que te pasa, sin decir quién sos.",
    },
  ],
};
