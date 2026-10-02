import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 3. Cada pregunta sale de algo explicado en la clase (en el comentario,
// la diapositiva de donde sale). No repite las preguntas de los quizzes de las diapositivas.

const VF = (verdadero: boolean) => [
  { text: "Verdadero", correct: verdadero },
  { text: "Falso", correct: !verdadero },
];

export const clase3Evaluacion: Evaluation = {
  id: "clase-3-v1",
  title: "Evaluación de la Clase 3",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "Tus datos entran, un plan sale"
      id: "q1",
      kind: "single",
      question: "¿Qué hace que un plan armado por la IA (un menú, una lista) te sirva de verdad?",
      options: [
        { text: "Que le cuentes tu realidad: cuántos son, cuánto tiempo tenés, qué les gusta y qué no.", correct: true },
        { text: "Que uses palabras difíciles.", correct: false },
        { text: "Que se lo pidas varias veces igual.", correct: false },
      ],
      explanation: "Sin tus datos, la IA arma un plan para nadie.",
    },
    {
      // "Del menú a la lista de compras"
      id: "q2",
      kind: "vf",
      question: "Para pasar del menú a la lista de compras, conviene pedirlo en el mismo chat, porque ya tiene el contexto.",
      options: VF(true),
      explanation: "En el mismo chat ya sabe el menú, para cuántos es y lo que no va.",
    },
    {
      // "Del menú a la lista de compras"
      id: "q3",
      kind: "single",
      question: "Ya tenés arroz, fideos y aceite en casa. ¿Qué le decís al pedir la lista de compras?",
      options: [
        { text: "Nada: compro de más por las dudas.", correct: false },
        { text: "\"Ya tengo arroz, fideos y aceite: sacalos de la lista\".", correct: true },
        { text: "Que me arme otro menú.", correct: false },
      ],
      explanation: "Contarle lo que ya tenés hace que la lista sea más corta y real.",
    },
    {
      // "Los precios los ponés vos"
      id: "q4",
      kind: "single",
      question: "Al armar un presupuesto con la IA, ¿en qué es muy buena y qué conviene que pongas vos?",
      options: [
        { text: "Es buena para listar los gastos a tener en cuenta; los precios reales los ponés vos.", correct: true },
        { text: "Es buena para saber los precios de hoy en tu ciudad; la lista la hacés vos.", correct: false },
        { text: "No sirve para presupuestos.", correct: false },
      ],
      explanation: "Pedile los rubros y que ordene y sume; los precios que averiguaste los ponés vos.",
    },
    {
      // "Error común y recomendación" — cuentas
      id: "q5",
      kind: "vf",
      question: "La IA nunca se equivoca al sumar.",
      options: VF(false),
      explanation: "A veces se equivoca, sobre todo con muchos números: pedí la cuenta paso a paso y revisá con la calculadora.",
    },
    {
      // "Error común y recomendación" — cuentas
      id: "q6",
      kind: "single",
      question: "Tus gastos son $40.000, $25.000 y $35.000, y tenés $120.000. ¿Cuánto te sobra?",
      options: [
        { text: "$20.000", correct: true },
        { text: "$30.000", correct: false },
        { text: "No te alcanza.", correct: false },
      ],
      explanation: "40.000 + 25.000 + 35.000 = 100.000. De 120.000, sobran 20.000.",
    },
    {
      // "Antes de comprar una heladera"
      id: "q7",
      kind: "multi",
      question: "Antes de comprar una heladera, ¿qué gastos que se suelen olvidar te puede recordar la IA? Marcá todas las correctas.",
      options: [
        { text: "El envío.", correct: true },
        { text: "La instalación.", correct: true },
        { text: "El color de la heladera.", correct: false },
      ],
      explanation: "Envío, instalación y flete son gastos que se olvidan. La tasa y el precio final se confirman en la tienda o el banco.",
    },
    {
      // "Error común y recomendación" — comparar
      id: "q8",
      kind: "single",
      question: "¿Cuál es el error más común al pedirle a la IA que compare opciones?",
      options: [
        { text: "Preguntar \"¿cuál me conviene?\" sin darle tus criterios.", correct: true },
        { text: "Pedirle una tabla.", correct: false },
        { text: "Pasarle los datos de cada opción.", correct: false },
      ],
      explanation: "Sin tus criterios te contesta lo que le convendría a cualquiera.",
    },
    {
      // "Error común y recomendación" — comparar
      id: "q9",
      kind: "vf",
      question: "Si la IA menciona características de un producto que vos no le pasaste, pueden ser inventadas.",
      options: VF(true),
      explanation: "Usá las características de la publicación o del folleto, y pasáselas vos.",
    },
    {
      // "Tu semana, organizada"
      id: "q10",
      kind: "single",
      question: "Para organizar tu semana con la IA, ¿por dónde conviene empezar?",
      options: [
        { text: "Contarle tus horarios fijos y lo que tenés pendiente.", correct: true },
        { text: "Pedirle que adivine qué tenés que hacer.", correct: false },
        { text: "Pedirle el plan sin ningún dato y no ajustarlo.", correct: false },
      ],
      explanation: "Horarios fijos y pendientes primero; después, el plan día por día y los ajustes.",
    },
  ],
};
