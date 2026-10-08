import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 3 (v2: acompaña la clase rearmada por funciones).
// Cada pregunta sale de algo explicado en la clase (en el comentario, la diapositiva de donde sale).
// No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase3Evaluacion: Evaluation = {
  id: "clase-3-v2",
  title: "Evaluación de la Clase 3",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "Copiar, otra respuesta y escuchar"
      id: "q1",
      kind: "single",
      question: "Te cuesta leer la respuesta en la pantalla del celular. ¿Qué botón te ayuda?",
      options: [
        { text: "El parlante: te lee la respuesta en voz alta.", correct: true },
        { text: "Copiar.", correct: false },
        { text: "Compartir.", correct: false },
      ],
      explanation: "El parlante (escuchar) lee la respuesta en voz alta.",
    },
    {
      // "Error común y recomendación" — botones (ojo al compartir)
      id: "q2",
      kind: "vf",
      question: "Al compartir un chat con el enlace, la otra persona ve toda la conversación.",
      options: VF(true),
      explanation: "Por eso, antes de compartir, revisá que no haya datos personales.",
    },
    {
      // "Para que busque de verdad"
      id: "q3",
      kind: "single",
      question: "Querés que la IA te dé el horario de hoy de un lugar, actualizado. ¿Cómo se lo pedís?",
      options: [
        { text: "\"Buscá en internet el horario de hoy de [lugar] y mostrame el enlace.\"", correct: true },
        { text: "\"¿A qué hora abren?\"", correct: false },
        { text: "\"Inventá un horario probable.\"", correct: false },
      ],
      explanation: "Pedile que busque en internet y que te muestre la fuente, así lo podés chequear.",
    },
    {
      // "Error común y recomendación" — buscar
      id: "q4",
      kind: "vf",
      question: "Si la IA busca en internet, ya no hace falta chequear nada: siempre tiene razón.",
      options: VF(false),
      explanation: "La búsqueda también se equivoca. Lo importante, y sobre todo trámites, salud y plata, en la fuente oficial.",
    },
    {
      // "Tres formas de quedarte con la tabla"
      id: "q5",
      kind: "multi",
      question: "La IA te armó una tabla con tus gastos del mes. ¿Cómo te la podés llevar? Marcá todas las correctas.",
      options: [
        { text: "Copiarla y pegarla en una planilla o en tus notas.", correct: true },
        { text: "Pedirle el archivo para descargar (Excel o PDF).", correct: true },
        { text: "No se puede: queda solo en el chat.", correct: false },
      ],
      explanation: "La copiás, pedís el archivo, o en Gemini la exportás a una planilla de Google.",
    },
    {
      // "Convertir un documento con la IA" + "Si la IA no puede hacer el PDF"
      id: "q6",
      kind: "single",
      question: "Le pediste a la IA que convierta tu documento de Word a PDF, pero no te da el archivo. ¿Qué hacés?",
      options: [
        { text: "Lo convierto yo: en Word, Guardar como PDF (o Imprimir → Guardar como PDF en el celular).", correct: true },
        { text: "Me olvido del PDF.", correct: false },
        { text: "Le saco una foto a la pantalla.", correct: false },
      ],
      explanation: "Siempre hay un plan B: Word, el celular o Google Docs guardan como PDF.",
    },
    {
      // "Decírselo una sola vez"
      id: "q7",
      kind: "single",
      question: "¿Para qué sirven las instrucciones o la memoria de la IA?",
      options: [
        { text: "Para que recuerde quién sos y cómo querés que te hable, sin repetírselo en cada chat.", correct: true },
        { text: "Para guardar tus claves.", correct: false },
        { text: "Para que la IA trabaje sin internet.", correct: false },
      ],
      explanation: "Le contás una vez quién sos y cómo hablarte, y lo tiene en cuenta en los chats nuevos.",
    },
    {
      // "Qué no contarle"
      id: "q8",
      kind: "single",
      question: "Querés hacer una consulta sin que la IA la recuerde después. ¿Qué usás?",
      options: [
        { text: "Un chat temporal o incógnito (o desactivo la memoria).", correct: true },
        { text: "Un chat común y le pido que se olvide.", correct: false },
        { text: "Otra cuenta de mail.", correct: false },
      ],
      explanation: "El chat temporal o incógnito no queda guardado en la memoria.",
    },
    {
      // "El mismo dibujo, cuatro estilos"
      id: "q9",
      kind: "single",
      question: "Pedís una imagen \"minimalista\". ¿Cómo va a ser?",
      options: [
        { text: "Pocas formas y pocos colores, con mucho espacio libre.", correct: true },
        { text: "Con luces de neón y brillos de ciencia ficción.", correct: false },
        { text: "Pintada a mano, con manchas suaves.", correct: false },
      ],
      explanation: "Minimalista es simple: pocas formas y pocos colores. Las otras son futurista y acuarela.",
    },
    {
      // "Cuidados y límites" — imágenes
      id: "q10",
      kind: "multi",
      question: "¿Qué conviene tener en cuenta al crear una imagen con tu foto? Marcá todas las correctas.",
      options: [
        { text: "Usar solo tu foto, o la de alguien que te dio permiso.", correct: true },
        { text: "Revisar que los textos estén bien escritos.", correct: true },
        { text: "Que la versión gratis tiene un límite de imágenes por día.", correct: true },
        { text: "Usar fotos de chicos sin pedir permiso a su familia.", correct: false },
      ],
      explanation: "Tu foto (o con permiso), revisar las letras y saber que hay un límite diario. Fotos de chicos, nunca sin permiso.",
    },
  ],
};
