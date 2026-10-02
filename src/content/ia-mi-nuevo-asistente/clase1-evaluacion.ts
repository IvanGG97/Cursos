import type { Evaluation } from "@/content/types";

// Evaluación de la Clase 1. Cada pregunta sale de algo explicado en la clase
// (entre paréntesis, la diapositiva). No repite las preguntas de los quizzes de las diapositivas.

export const clase1Evaluacion: Evaluation = {
  id: "clase-1-v1",
  title: "Evaluación de la Clase 1",
  intro:
    "10 preguntas sobre lo que vimos en la clase. Necesitás 6 bien para aprobar. Podés hacerla las veces que quieras: queda tu mejor nota.",
  passPercent: 60,
  questions: [
    {
      // "¿Qué es, en criollo, un asistente de IA?" (4)
      id: "q1",
      kind: "vf",
      question: "Un asistente de IA es un programa que entiende lo que le escribís como le hablarías a una persona, y te responde con texto.",
      options: [
        { text: "Verdadero", correct: true },
        { text: "Falso", correct: false },
      ],
      explanation: "Eso es, en criollo, un asistente de IA: entiende lenguaje natural y responde en lenguaje natural.",
    },
    {
      // "Lo que la IA NO es": no piensa, predice la palabra más probable (5)
      id: "q2",
      kind: "single",
      question: "¿Cómo arma la IA sus respuestas?",
      options: [
        { text: "Busca la respuesta en una lista de respuestas ya escritas.", correct: false },
        { text: "Predice la palabra más probable que sigue, en base a muchísimo texto que leyó.", correct: true },
        { text: "Piensa y razona igual que una persona.", correct: false },
      ],
      explanation: "La IA no “piensa”: predice la palabra más probable que sigue. Por eso puede sonar muy segura y aun así equivocarse.",
    },
    {
      // "¿Para qué me sirve saber esto?" — tokens (10)
      id: "q3",
      kind: "single",
      question: "Querés que la IA te explique una cláusula de un contrato de 20 páginas. Según lo que vimos de los tokens, ¿qué conviene?",
      options: [
        { text: "Pegar el contrato entero, por las dudas.", correct: false },
        { text: "Pegar solo la parte del contrato que te interesa.", correct: true },
        { text: "Pegarlo en tres chats distintos para comparar.", correct: false },
      ],
      explanation: "Pegar un texto larguísimo sin necesidad gasta tokens de más: conviene pegar solo la parte que importa.",
    },
    {
      // "Cuando la mesa ya no tiene lugar" — contexto (12)
      id: "q4",
      kind: "multi",
      question: "¿Qué puede pasar en una conversación muy larga, con muchos temas mezclados? Marcá todas las correctas.",
      options: [
        { text: "La IA empieza a “olvidar” lo primero que se habló.", correct: true },
        { text: "La IA puede confundir datos de distintos temas.", correct: true },
        { text: "Se borra tu cuenta.", correct: false },
      ],
      explanation:
        "El contexto es como una mesa de trabajo con tamaño límite: si se llena, la IA olvida lo primero y mezcla temas. La solución es abrir un chat nuevo al cambiar de tema.",
    },
    {
      // "Proyecto: una carpeta de carpetas" + "Cómo organizar tus propios chats" (14, 15)
      id: "q5",
      kind: "single",
      question: "Tenés un emprendimiento de tortas y todas las semanas le pedís cosas a la IA sobre tu negocio. ¿Qué te conviene?",
      options: [
        { text: "Armar un proyecto con los datos de tu negocio y abrir ahí un chat por cada tema.", correct: true },
        { text: "Usar siempre el mismo chat para todo, trabajo y vida personal.", correct: false },
        { text: "No darle nunca ningún dato de tu negocio.", correct: false },
      ],
      explanation:
        "Un proyecto agrupa chats de un mismo tema y guarda información fija (como los datos de tu negocio) para no repetirla cada vez.",
    },
    {
      // "¿Qué es una “alucinación”?" (19)
      id: "q6",
      kind: "vf",
      question: "Una “alucinación” es cuando la IA se niega a responder porque no sabe la respuesta.",
      options: [
        { text: "Verdadero", correct: false },
        { text: "Falso", correct: true },
      ],
      explanation:
        "Es al revés: una alucinación es cuando la IA responde algo incorrecto pero con total seguridad, como si fuera un dato cierto.",
    },
    {
      // "Error común y recomendación" — límites (21)
      id: "q7",
      kind: "multi",
      question: "¿Cuáles de estos datos que te da la IA conviene chequear en la fuente oficial antes de usarlos? Marcá todas las correctas.",
      options: [
        { text: "El precio de un trámite.", correct: true },
        { text: "La fecha de vencimiento de un impuesto.", correct: true },
        { text: "Tres ideas de nombre para tu emprendimiento.", correct: false },
      ],
      explanation:
        "Fechas, precios, trámites y leyes se verifican en la fuente oficial. Para ideas, redacción o ejemplos, el riesgo de alucinación es mucho menor.",
    },
    {
      // "Tres preguntas antes de escribir" (30)
      id: "q8",
      kind: "single",
      question: "¿Cuáles son las tres preguntas para hacerte antes de escribirle a la IA?",
      options: [
        { text: "¿Qué quiero?, ¿para qué es?, ¿en qué tono o formato lo necesito?", correct: true },
        { text: "¿Cuánto cuesta?, ¿cuánto tarda?, ¿quién lo hizo?", correct: false },
        { text: "¿Qué IA uso?, ¿desde qué celular?, ¿a qué hora?", correct: false },
      ],
      explanation: "Con esas tres respuestas (qué, para qué y en qué tono o formato) ya tenés un pedido mucho mejor.",
    },
    {
      // "Error común y recomendación" — cómo pedir (33)
      id: "q9",
      kind: "single",
      question: "Le pediste a la IA un mensaje para un cliente y la respuesta no te sirvió del todo. ¿Qué conviene hacer?",
      options: [
        { text: "Borrar todo y empezar de cero en otro chat.", correct: false },
        { text: "Decirle qué le falta y pedirle que lo ajuste.", correct: true },
        { text: "Copiarla igual: la IA sabe más.", correct: false },
      ],
      explanation: "Si la respuesta no te sirvió, no empieces de cero: decile qué le falta y pedile que ajuste.",
    },
    {
      // "Las reglas de oro de hoy" (36)
      id: "q10",
      kind: "vf",
      question: "Está bien darle a la IA el número de tu tarjeta y su código para que te ayude a ordenar tus gastos.",
      options: [
        { text: "Verdadero", correct: false },
        { text: "Falso", correct: true },
      ],
      explanation: "Regla de oro: nunca cargues contraseñas ni datos sensibles (tarjetas, claves, DNI completo) en ningún chat.",
    },
  ],
};
