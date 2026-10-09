import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 4 (v2: acompaña la clase "Automatizar y cuidarte").
// Cada pregunta sale de algo explicado en la clase (en el comentario, la diapositiva de donde sale).
// No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase4Evaluacion: Evaluation = {
  id: "clase-4-v2",
  title: "Evaluación de la Clase 4",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "Explicarlo una vez, y que se haga solo"
      id: "q1",
      kind: "single",
      question: "¿Qué es automatizar?",
      options: [
        { text: "Explicar una vez lo que querés, para que después se haga solo o casi solo.", correct: true },
        { text: "Hacer todo a mano, pero más rápido.", correct: false },
        { text: "Dejar que la IA decida por vos.", correct: false },
      ],
      explanation: "Como el débito automático: lo autorizás una vez y se hace solo. Y lo seguís revisando.",
    },
    {
      // "Tres niveles de la IA"
      id: "q2",
      kind: "single",
      question: "Le pedís a la IA que guarde una planilla en tu Drive y lo hace. ¿Qué nivel es?",
      options: [
        { text: "Nivel 2: hace cosas por vos, conectada a tus apps.", correct: true },
        { text: "Nivel 1: solo te responde.", correct: false },
        { text: "Nivel 3: te avisa sola otro día.", correct: false },
      ],
      explanation: "Nivel 1 responde, nivel 2 hace cosas en tus apps cuando se lo pedís, nivel 3 te avisa sola.",
    },
    {
      // "Darle una llave, no la casa"
      id: "q3",
      kind: "vf",
      question: "Claude y Gemini se pueden conectar con tu calendario y tu Drive también en la versión gratis.",
      options: VF(true),
      explanation: "Las dos se conectan con las apps de Google también en la versión gratis. ChatGPT gratis no, pero tiene recordatorios.",
    },
    {
      // "Antes y después de conectar"
      id: "q4",
      kind: "single",
      question: "Ya no usás la conexión de la IA con tu Gmail. ¿Qué conviene hacer?",
      options: [
        { text: "Desconectarla desde la configuración de la IA.", correct: true },
        { text: "Dejarla: no pasa nada.", correct: false },
        { text: "Cambiar de celular.", correct: false },
      ],
      explanation: "Lo que no usás, se desconecta: le sacás el permiso desde la misma configuración.",
    },
    {
      // "Crear un evento" (plantilla)
      id: "q5",
      kind: "single",
      question: "¿Cuál de estos pedidos crea mejor un evento en tu calendario?",
      options: [
        { text: "\"Agendá el turno del dentista el jueves 16 a las 10, con aviso 1 hora antes.\"", correct: true },
        { text: "\"Tengo dentista.\"", correct: false },
        { text: "\"Acordate del dentista.\"", correct: false },
      ],
      explanation: "Qué, cuándo (día y hora) y el aviso: con eso la IA crea el evento completo.",
    },
    {
      // "Recordatorios" + plantilla (límites de ChatGPT gratis)
      id: "q6",
      kind: "single",
      question: "¿Qué tenés que tener en cuenta de los recordatorios de ChatGPT en la versión gratis?",
      options: [
        { text: "Hay un límite de recordatorios activos y el horario es aproximado.", correct: true },
        { text: "Son ilimitados y llegan al segundo exacto.", correct: false },
        { text: "Solo funcionan con una cuenta de Google.", correct: false },
      ],
      explanation: "Gratis: hasta 3 activos, como mucho uno por día y con horario aproximado. No necesita Google.",
    },
    {
      // "Qué conviene automatizar, y qué no"
      id: "q7",
      kind: "multi",
      question: "¿Qué cosas conviene automatizar? Marcá todas las correctas.",
      options: [
        { text: "Los avisos de los pagos del mes.", correct: true },
        { text: "Los cumpleaños de la familia.", correct: true },
        { text: "Las transferencias de plata, sin mirarlas.", correct: false },
      ],
      explanation: "Lo repetitivo y con fecha, sí. Lo que necesita tu decisión, como la plata, no.",
    },
    {
      // "Cómo reconocer una estafa"
      id: "q8",
      kind: "multi",
      question: "¿Cuáles son señales de estafa? Marcá todas las correctas.",
      options: [
        { text: "Te apuran con un plazo muy corto.", correct: true },
        { text: "Te piden el código que te llegó por SMS.", correct: true },
        { text: "Un premio que no pediste te pide pagar el envío.", correct: true },
        { text: "Un aviso dentro de la app oficial que abriste vos, que no te pide nada.", correct: false },
      ],
      explanation: "Urgencia, pedido de datos o plata y premios que piden pagar. Lo que ves en la app oficial que abriste vos, sin pedidos, es legítimo.",
    },
    {
      // "Tres hábitos que te protegen"
      id: "q9",
      kind: "single",
      question: "¿Para qué sirve acordar una palabra clave con tu familia?",
      options: [
        { text: "Para confirmar que es la persona real cuando pide plata por audio o por mensaje.", correct: true },
        { text: "Para entrar a la IA sin contraseña.", correct: false },
        { text: "Para que la IA reconozca tu voz.", correct: false },
      ],
      explanation: "Con IA se pueden imitar voces: la palabra clave confirma que del otro lado está tu familiar.",
    },
    {
      // "Cuidados al automatizar"
      id: "q10",
      kind: "vf",
      question: "Con tus apps conectadas a la IA, conviene que tu celular tenga bloqueo con PIN o huella.",
      options: VF(true),
      explanation: "Con tu agenda, tu Drive y tu correo conectados, tu celular es la llave: ponele bloqueo.",
    },
  ],
};
