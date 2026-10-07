import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 2 (v2: acompaña la clase revisada, con voz, fotos, archivos y enlaces).
// Cada pregunta sale de algo explicado en la clase (en el comentario, la diapositiva de donde sale).
// No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase2Evaluacion: Evaluation = {
  id: "clase-2-v2",
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
      question: "Le pediste ideas a la IA y te dio ideas muy comunes. ¿Qué conviene hacer?",
      options: [
        { text: "Quedarte con la primera: total, son todas parecidas.", correct: false },
        { text: "Pedirle otra vuelta: \"estas son muy comunes, dame 10 más originales\".", correct: true },
        { text: "Dejar de usar la IA para ideas.", correct: false },
      ],
      explanation: "Pedile otra vuelta, en el mismo chat, y si querés que combine las que más te gustaron.",
    },
    {
      // "Dictar vs. charlar" + "Dictar o charlar"
      id: "q3",
      kind: "single",
      question: "Querés que la IA te arme una lista de compras y tenerla escrita para revisarla. ¿Qué te conviene usar?",
      options: [
        { text: "Dictar con el micrófono: lo que decís se pasa a texto y la respuesta llega escrita.", correct: true },
        { text: "El modo voz: te responde en voz alta.", correct: false },
        { text: "Ninguno: a la IA solo se le puede escribir.", correct: false },
      ],
      explanation: "Dictar sirve cuando querés revisar lo que pediste o tener la respuesta escrita. El modo voz es para charlar.",
    },
    {
      // "Mandarle una foto o un archivo" (celular)
      id: "q4",
      kind: "single",
      question: "Para mandarle a la IA un PDF que tenés en el celular, ¿qué tocás?",
      options: [
        { text: "El \"+\" (o el clip) al lado del cuadro donde escribís, y después \"Archivos\".", correct: true },
        { text: "El micrófono.", correct: false },
        { text: "El botón para compartir de WhatsApp.", correct: false },
      ],
      explanation: "El \"+\" o el clip abre las opciones: Cámara, Fotos y Archivos.",
    },
    {
      // "Error común y recomendación" — fotos y archivos
      id: "q5",
      kind: "vf",
      question: "Antes de mandarle la foto de un papel a la IA, conviene tapar el DNI, los números de tarjeta y las direcciones.",
      options: VF(true),
      explanation: "Para explicarte un papel no necesita tus datos personales: tapalos antes de mandar.",
    },
    {
      // "Pasarle una página web"
      id: "q6",
      kind: "single",
      question: "Le pegaste el enlace de una página y la IA te dice que no la puede abrir. ¿Qué hacés?",
      options: [
        { text: "Copio el texto de la página y se lo pego directamente.", correct: true },
        { text: "Le mando el mismo enlace diez veces.", correct: false },
        { text: "Nada: esa página no se puede usar.", correct: false },
      ],
      explanation: "Algunas páginas no la dejan entrar: pegarle el texto resuelve el problema.",
    },
    {
      // "\"Explicámelo como si tuviera 10 años\""
      id: "q7",
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
      // "Reescribir todo vs. mejorar lo tuyo"
      id: "q8",
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
      // "Error común y recomendación" — tu trabajo
      id: "q9",
      kind: "vf",
      question: "Si la IA agrega en tu mensaje una garantía que no ofrecés, igual lo podés mandar: total, lo escribió la IA.",
      options: VF(false),
      explanation: "Lo que dice el mensaje lo tenés que cumplir vos: precios, plazos y garantías los ponés vos.",
    },
    {
      // "Cuatro usos para tu trabajo"
      id: "q10",
      kind: "multi",
      question: "¿Qué cosas le podés pedir a la IA para tu trabajo? Marcá todas las correctas.",
      options: [
        { text: "Mensajes para avisar, confirmar o recordar algo a un cliente.", correct: true },
        { text: "La descripción de un producto o servicio que ofrecés.", correct: true },
        { text: "Ideas de promociones o para fechas especiales.", correct: true },
        { text: "Que decida tus precios sin que le digas tus costos.", correct: false },
      ],
      explanation: "Mensajes, descripciones, reclamos e ideas para vender. Los datos de tu trabajo (precios) los ponés vos.",
    },
  ],
};
