import type { Slide } from "@/content/types";

// Clase 2 — Crear, entender y comunicarte (v2, revisada con Ivan después de dar la Clase 1).
// Criterio: ejemplos generales (le sirven a cualquiera) + una plantilla para completar con lo propio
// + una tarea corta después de cada tema, cada uno con su celular. Público: muchos adultos mayores
// que recién empiezan, por eso el bloque de voz, fotos, archivos y enlaces va paso a paso.
// Reglas de siempre: contenido antes de cada quiz, error común y recomendación en cada bloque.

const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase2Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 2 — Crear, entender y comunicarte",
    subtitle: "Ideas, voz, fotos, archivos y mensajes — también para tu trabajo",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso de la Clase 1",
      "Generar ideas con la IA",
      "Hablarle y mostrarle cosas: voz, fotos, archivos y enlaces",
      "Entender textos difíciles y escribir mejores mensajes",
      "Aplicarlo a tu trabajo o emprendimiento",
      "Práctica integradora y cierre",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 10 MIN", title: "Repaso de la Clase 1", subtitle: "Lo que ya sabés, en cinco minutos" },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo que vimos la clase pasada",
    rows: [
      { h: "Un asistente de IA", d: "entiende lo que escribís y responde. No piensa, no espía y no decide por vos." },
      { h: "Contexto y chats", d: "la conversación es una mesa de trabajo con límite: un chat por tema." },
      { h: "Alucinaciones", d: "puede inventar con total seguridad: fechas, precios y trámites se chequean." },
      { h: "La fórmula", d: "¿qué quiero?, ¿para qué es?, ¿en qué tono o formato lo necesito?" },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Venías hablando de tu trabajo con la IA y ahora querés ideas para un cumpleaños. ¿Qué conviene?",
    options: [
      { text: "Seguir en el mismo chat: total, ya me conoce.", correct: false },
      { text: "Abrir un chat nuevo, porque cambiaste de tema.", correct: true },
      { text: "Borrar la cuenta y crear otra.", correct: false },
    ],
    explanation: "Un chat por tema: así la IA no mezcla el contexto de tu trabajo con el del cumpleaños.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA dice un dato con mucha seguridad, es porque el dato es correcto.",
    options: FALSO,
    explanation: "Eso es justamente una alucinación: un dato incorrecto dicho con total seguridad. Lo importante se chequea.",
  },
  {
    type: "concept",
    kicker: "Hoy",
    title: "Crear, hablar, mostrar y comunicar",
    body: "Hoy usamos la IA para tirar ideas, para hablarle con la voz, para mostrarle fotos, archivos y enlaces, para entender textos difíciles y para escribir mejores mensajes. Y en cada tema hacés una tarea corta con tu celular.",
    analogy: "La IA hoy es tu compañera de equipo: te escucha, mira lo que le mostrás y te ayuda a escribir. Vos elegís, corregís y decidís.",
  },
  {
    type: "content",
    kicker: "Cómo trabajamos hoy",
    title: "Ejemplo, plantilla y tarea",
    rows: [
      { h: "Un ejemplo resuelto", d: "para ver cómo se pide cada cosa." },
      { h: "Una plantilla", d: "el mismo pedido con [espacios entre corchetes]: los cambiás por tus datos y borrás los corchetes." },
      { h: "Una tarea corta", d: "3 a 5 minutos, cada uno con su celular y la IA que usó en la Clase 1." },
    ],
  },

  // ===================== BLOQUE 1: GENERAR IDEAS =====================
  { type: "divider", badge: "BLOQUE 1 · 20 MIN", title: "Generar ideas", subtitle: "La IA como compañera de lluvia de ideas" },
  {
    type: "concept",
    kicker: "Lluvia de ideas",
    title: "Una lluvia de ideas que no se cansa",
    body: "La IA es muy buena para tirar muchas ideas rápido: nombres, cosas para publicar, propuestas nuevas. No todas van a servir — y no hace falta. Su trabajo es darte material; el tuyo, elegir.",
    analogy: "Es como una reunión con alguien que nunca se queda sin ideas: tira veinte, vos te quedás con las dos buenas y las mejorás.",
  },
  {
    type: "content",
    kicker: "La receta",
    title: "\"Dame 10 ideas para...\" + tus criterios",
    rows: [
      { h: "Cuántas", d: "un número concreto: 10 ideas, 5 nombres, 3 opciones." },
      { h: "Para quién", d: "tus clientes, tu familia, tus vecinos: a quién va dirigido." },
      { h: "Qué condiciones", d: "estilo, presupuesto, y también lo que NO querés." },
      { h: "Cómo te las da", d: "en una lista, con una línea que explique cada idea." },
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo resuelto",
    title: "Ideas para publicar, con criterios",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Dame 10 ideas de publicaciones para las redes de mi emprendimiento. Mis clientes son personas de mi barrio. Nada de ofertas: quiero mostrar cómo trabajo. Una línea por idea.\"",
    caption: "Tiene cantidad, para quién, una condición y el formato.",
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Ahora, con lo tuyo",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Tengo [tu trabajo o emprendimiento]. Dame [cantidad] ideas de [nombres / publicaciones / promociones] para [a quién le vendés]. Que sean [cómo las querés] y que no [lo que no querés]. Una línea por idea.\"",
    caption: "Si no tenés un emprendimiento, usala para otra cosa: un regalo, una salida, un cumpleaños.",
  },
  {
    type: "practice",
    title: "Tarea 1 · Tu lluvia de ideas",
    instructions:
      "Abrí la IA que usaste en la Clase 1 y escribile la plantilla, completada con lo tuyo.\n\nLeé las ideas con calma y elegí las 2 que más te gusten.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir ideas sin contexto: te devuelve las mismas ideas que le da a cualquiera." },
      { h: "Recomendación", d: "pedile otra vuelta: \"estas son muy comunes, dame 10 más originales\"." },
      { h: "Tip extra", d: "pedile que combine: \"tomá la idea 3 y la 7, y armá una nueva\"." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 2 · Otra vuelta",
    instructions:
      "En el mismo chat, pedile: \"Estas ideas son muy comunes. Dame 10 más originales.\"\n\nDespués elegí las 2 mejores de todas y pedile que las combine en una sola.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estos pedidos de ideas va a dar mejores resultados?",
    options: [
      { text: "\"Dame ideas para mi negocio.\"", correct: false },
      { text: "\"Dame 10 ideas de promociones para mi emprendimiento, para clientes del barrio, que no sean descuentos.\"", correct: true },
      { text: "\"Hacé que venda más.\"", correct: false },
    ],
    explanation: "Tiene cantidad (10), qué (promociones), para quién (clientes del barrio) y una condición (sin descuentos).",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Dame 10 nombres para mi emprendimiento.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "Contar de qué se trata y para quién es.", correct: true },
      { text: "Pedirlo con más educación.", correct: false },
      { text: "Nada: así está perfecto.", correct: false },
    ],
    explanation: "Sin saber de qué se trata ni para quién es, te da nombres que le servirían a cualquiera.",
  },

  // ===================== BLOQUE 2: HABLARLE Y MOSTRARLE COSAS =====================
  { type: "divider", badge: "BLOQUE 2 · 25 MIN", title: "Hablarle y mostrarle cosas", subtitle: "Voz, fotos, archivos y enlaces: no hace falta escribir todo" },
  {
    type: "concept",
    kicker: "Más que escribir",
    title: "No hace falta escribir todo",
    body: "A la IA también le podés hablar con tu voz, y le podés mostrar cosas: una foto que sacás en el momento, una imagen de tu galería, un PDF, un documento o el enlace de una página. Te responde sobre lo que le dijiste o le mostraste.",
    analogy: "Es como pedirle ayuda a alguien en persona: le contás en voz alta y le ponés el papel adelante, en vez de escribirle todo.",
  },

  // --- Voz ---
  {
    type: "compare",
    kicker: "Con tu voz",
    title: "Dictar vs. charlar",
    leftLabel: "Dictar (se transcribe)",
    rightLabel: "Charlar (modo voz)",
    left: "Tocás el micrófono, hablás y lo que decís aparece escrito en el cuadro. Lo revisás, lo corregís si hace falta y lo mandás. La respuesta llega escrita.",
    right: "Tocás el botón de conversación y hablan como por teléfono. La IA te responde en voz alta, y la podés interrumpir o preguntarle de nuevo.",
  },
  {
    type: "steps",
    kicker: "Dónde están los botones",
    title: "Usar la voz, paso a paso",
    steps: [
      "Para dictar: tocá el micrófono que está en el cuadro donde escribís, hablá y tocalo de nuevo.",
      "Revisá el texto que apareció (a veces entiende mal una palabra) y tocá enviar.",
      "Para charlar: tocá el botón de conversación, al lado (suele ser un ícono de ondas de sonido).",
      "Para terminar la charla, tocá la X o el botón de cortar.",
    ],
    media: {
      id: "c2-voz",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: el micrófono para dictar y el botón del modo voz, señalados con flechas.",
    },
  },
  {
    type: "content",
    kicker: "Cuándo conviene cada una",
    title: "Dictar o charlar",
    rows: [
      { h: "Dictar", d: "cuando querés revisar lo que pediste o tener la respuesta escrita: un mensaje, una lista, una receta." },
      { h: "Charlar", d: "para una consulta rápida, para practicar, o si te cuesta leer y escribir en el celular." },
      { h: "Ojo en voz alta", d: "se escucha todo: no digas datos personales en un lugar con gente." },
      { h: "Si no aparece el botón", d: "actualizá la app; en algunas, el modo voz tiene otro nombre (en Gemini, \"Live\")." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 3 · Probá las dos",
    instructions:
      "Tocá el micrófono y dictale un pedido, por ejemplo: \"Dame 5 ideas para un almuerzo de domingo en familia\". Revisá el texto antes de mandarlo.\n\nDespués tocá el botón de conversación y hacele una pregunta en voz alta. Escuchá la respuesta y probá interrumpirla.",
  },

  // --- Fotos, archivos y enlaces ---
  {
    type: "content",
    kicker: "Qué le podés mostrar",
    title: "Cuatro cosas que entiende",
    rows: [
      { h: "Una foto con la cámara", d: "un cartel, una etiqueta, un papel impreso, un aparato que muestra un error." },
      { h: "Una imagen o captura", d: "algo que ya tenés guardado en la galería del celular." },
      { h: "Un PDF o documento", d: "una nota, un reglamento, un instructivo, un presupuesto." },
      { h: "Un enlace", d: "la dirección de una página web, para que te la explique o la resuma." },
    ],
  },
  {
    type: "steps",
    kicker: "En el celular",
    title: "Mandarle una foto o un archivo",
    steps: [
      "Abrí la app de la IA y entrá a un chat.",
      "Tocá el \"+\" (o el clip) que está al lado del cuadro donde escribís.",
      "Elegí \"Cámara\" para sacar una foto, \"Fotos\" para la galería o \"Archivos\" para un PDF.",
      "Escribí (o dictá) qué querés que haga con eso y tocá enviar.",
    ],
    media: {
      id: "c2-adjuntar",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: el botón \"+\" del chat abierto, mostrando Cámara, Fotos y Archivos.",
    },
  },
  {
    type: "content",
    kicker: "En la computadora",
    title: "Tres formas de adjuntar",
    rows: [
      { h: "El clip o el \"+\"", d: "al lado del cuadro de texto: elegís el archivo de tu computadora." },
      { h: "Arrastrar y soltar", d: "agarrás el archivo con el mouse y lo soltás sobre el chat." },
      { h: "Pegar una imagen", d: "copiás una imagen o una captura y la pegás en el chat (Ctrl + V)." },
    ],
    media: {
      id: "c2-adjuntar-pc",
      kind: "IMAGEN",
      caption: "Captura de la computadora, en castellano: el clip o \"+\" del chat y un archivo listo para enviar.",
    },
  },
  {
    type: "content",
    kicker: "Enlaces",
    title: "Pasarle una página web",
    rows: [
      { h: "Copiá el enlace", d: "mantené apretada la dirección de la página y elegí \"Copiar\"." },
      { h: "Pegalo en el chat", d: "y decile qué querés: \"resumime esta página en 5 puntos\"." },
      { h: "Si no la puede abrir", d: "algunas páginas no la dejan entrar: copiá el texto y pegalo directamente." },
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo y plantilla",
    title: "Siempre decile qué querés",
    quoteLabel: "CON LA FOTO O EL ARCHIVO, ESCRIBÍ",
    quoteText:
      "\"Te mando [una foto / un PDF / un enlace] de [qué es]. [Explicámelo en palabras simples / decime qué tengo que hacer / resumilo en 5 puntos].\"",
    caption: "Ejemplo: \"Te mando una foto de la pantalla de mi lavarropas. ¿Qué significa este error y qué puedo revisar?\"",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar la foto o el archivo sin decir nada: la IA no sabe qué querés." },
      { h: "Cuidá tus datos", d: "antes de mandar, tapá DNI, números de tarjeta, direcciones y datos de otras personas." },
      { h: "Que se lea bien", d: "foto con luz, derecha y sin cortar el texto: si vos no lo leés, la IA tampoco." },
      { h: "Si te pone un límite", d: "la versión gratis tiene un tope de archivos por día: probá más tarde." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 4 · Sacale una foto",
    instructions:
      "Sacale una foto a algo que tengas cerca y que tenga texto: una etiqueta, un cartel, un papel, el envase de un producto.\n\nMandásela a la IA con un pedido, por ejemplo: \"Explicame qué dice esto\" o \"¿Para qué sirve esto?\"",
  },
  {
    type: "practice",
    title: "Tarea 5 · Un enlace o un archivo",
    instructions:
      "Elegí una de las dos.\n\nCopiá el enlace de una página que te interese (una noticia, una receta, un instructivo) y pedile un resumen en 5 puntos.\n\nO adjuntá un PDF o documento que tengas en el celular (sin datos personales) y pedile que te lo explique.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál es la diferencia entre dictarle a la IA y charlar con ella en modo voz?",
    options: [
      { text: "Al dictar, lo que decís se pasa a texto y la respuesta llega escrita; al charlar, te responde en voz alta.", correct: true },
      { text: "Son lo mismo, con distinto nombre.", correct: false },
      { text: "Al dictar te escucha y al charlar no.", correct: false },
    ],
    explanation: "Dictar = se transcribe (lo revisás y lo mandás, la respuesta es escrita). Charlar = conversación hablada, te contesta con voz.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Antes de mandarle la foto de un papel a la IA, ¿qué revisás?",
    options: [
      { text: "Que se lea bien y que los datos personales estén tapados.", correct: true },
      { text: "Que tenga un lindo filtro.", correct: false },
      { text: "Nada: la IA lo arregla sola.", correct: false },
    ],
    explanation: "Si no se lee, la IA tampoco lo lee. Y el DNI, la tarjeta y las direcciones se tapan antes de mandar.",
  },

  // ===================== BLOQUE 3: ENTENDER Y COMUNICAR =====================
  { type: "divider", badge: "BLOQUE 3 · 20 MIN", title: "Entender y comunicar", subtitle: "Lo difícil, en simple. Y tus mensajes, mejor escritos." },
  {
    type: "concept",
    kicker: "Entender",
    title: "\"Explicámelo como si tuviera 10 años\"",
    body: "Cuando algo está escrito difícil — una nota del banco, las condiciones de un servicio, un reglamento — le sacás una foto o pegás el texto, y le pedís que te lo explique en palabras simples. Funciona muy bien.",
    analogy: "Es como tener a mano a ese amigo que sabe del tema y te dice: \"tranqui, esto lo que quiere decir es...\".",
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Para entender un texto",
    quoteLabel: "PEGÁ EL TEXTO O ADJUNTÁ LA FOTO, Y ESCRIBÍ",
    quoteText:
      "\"Explicame este texto en palabras simples, como si tuviera 10 años: qué dice, si tengo que hacer algo y para cuándo.\"",
    caption: "Fechas y montos: chequealos siempre en el papel original. La IA también se equivoca al resumir.",
  },
  {
    type: "concept",
    kicker: "Comunicar",
    title: "Los mensajes que más cuestan",
    body: "Un mail formal, una carta de reclamo, un mensaje delicado: son los que más cuesta escribir. La IA te arma un borrador en segundos; vos lo revisás, lo ajustás y lo mandás.",
    analogy: "Es como arrancar con un borrador ya escrito: no te quedás mirando la hoja en blanco.",
  },
  {
    type: "content",
    kicker: "Qué decirle",
    title: "Lo que necesita saber",
    rows: [
      { h: "A quién va", d: "un cliente, el banco, la escuela, un vecino, tu jefe." },
      { h: "Qué pasó o qué necesitás", d: "con los datos justos: qué, cuándo y qué querés lograr." },
      { h: "El tono", d: "formal, cordial o cercano: como le hablarías vos." },
      { h: "El largo", d: "\"máximo 50 palabras\": si no, te escribe una carta entera." },
    ],
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Para escribir un mensaje",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Escribime un [mail / WhatsApp / carta] para [a quién] sobre [qué pasó o qué necesito]. Tono [formal / cordial / cercano], máximo [cantidad] palabras.\"",
    caption: "Ejemplo: \"Escribime un WhatsApp para confirmar un turno de mañana a las 10. Tono cercano, máximo 40 palabras.\"",
  },
  {
    type: "practice",
    title: "Tarea 6 · Tu mensaje pendiente",
    instructions:
      "Pensá en un mensaje que tengas que mandar esta semana: a un cliente, al banco, a la escuela, a un vecino. Pedíselo con la plantilla (escrita o dictada).\n\nSi no te gusta cómo quedó, pedile un cambio: \"más corto\" o \"más cercano\".",
  },
  {
    type: "compare",
    kicker: "Tu voz",
    title: "Reescribir todo vs. mejorar lo tuyo",
    leftLabel: "Pierde tu voz",
    rightLabel: "Mantiene tu voz",
    left: "\"Reescribí este mensaje.\" El resultado queda prolijo, pero no suena a vos: quien lo recibe lo nota.",
    right: "\"Mejorá este mensaje: corregí la ortografía y que sea más claro, pero mantené mi forma de escribir y mis palabras.\"",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir que \"reescriba todo\": queda perfecto pero frío, y se nota que no lo escribiste vos." },
      { h: "Recomendación", d: "\"mejorá esto, pero mantené mi forma de escribir\"." },
      { h: "Si quedó muy formal", d: "seguí la conversación: \"más corto y más cercano, como hablo yo\"." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 7 · Con tu propia voz",
    instructions:
      "Escribí vos un mensaje corto, como lo escribirías normalmente.\n\nPegalo en el chat y pedile: \"Mejoralo y corregí la ortografía, pero mantené mi forma de escribir\". Después compará las dos versiones.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te escribió un mensaje correcto, pero muy largo y formal. ¿Cómo seguís la conversación?",
    options: [
      { text: "Le pido: \"más corto y más cercano, como hablo yo\".", correct: true },
      { text: "Borro el chat y empiezo de cero.", correct: false },
      { text: "Lo mando igual: lo escribió la IA.", correct: false },
    ],
    explanation: "No hace falta empezar de cero: decile qué cambiar y lo ajusta en el mismo chat.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Escribime una carta de reclamo.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "Qué pasó, cuándo y qué solución querés.", correct: true },
      { text: "Que sea más larga.", correct: false },
      { text: "Nada: la IA lo adivina.", correct: false },
    ],
    explanation: "Sin esos datos, la IA inventa un reclamo genérico. Con ellos, escribe el tuyo.",
  },

  // ===================== BLOQUE 4: TU TRABAJO O EMPRENDIMIENTO =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Aplicarlo a tu trabajo o emprendimiento", subtitle: "Clientes, productos y reclamos" },
  {
    type: "concept",
    kicker: "Tu trabajo",
    title: "Una ayudante para tu trabajo",
    body: "Vendas lo que vendas o hagas el trabajo que hagas, todos los días hay mensajes para clientes, cosas que describir y reclamos que responder. Ahí la IA te ahorra tiempo: vos ponés lo que sabés y ella lo deja prolijo.",
    analogy: "Es como sumar una ayudante que escribe rápido: vos le contás, ella lo pasa en limpio.",
  },
  {
    type: "content",
    kicker: "Para qué sirve",
    title: "Cuatro usos para tu trabajo",
    rows: [
      { h: "Mensajes a clientes", d: "avisar, confirmar, recordar o pedir disculpas." },
      { h: "Describir lo que ofrecés", d: "un producto o un servicio, para redes o para WhatsApp." },
      { h: "Responder reclamos", d: "con respeto y con la solución que decidís vos." },
      { h: "Ideas para vender", d: "promociones, fechas especiales y respuestas a las preguntas de siempre." },
    ],
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Un mensaje a un cliente",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Trabajo de [tu trabajo]. Escribime un WhatsApp para un cliente para [avisar / confirmar / recordar / pedir disculpas por] [qué pasó]. Ofrecé [tu propuesta]. Tono cercano y corto.\"",
    caption: "Ejemplo: avisar que vas a llegar más tarde y ofrecer dos horarios nuevos para el mismo día.",
  },
  {
    type: "practice",
    title: "Tarea 8 · Un mensaje a un cliente",
    instructions:
      "Usá la plantilla con una situación real de tu trabajo: un aviso, una confirmación, un recordatorio. Si no tenés clientes, hacelo para alguien a quien le tengas que escribir por un trámite.\n\nAntes de darlo por bueno, leelo como si lo recibieras vos.",
  },
  {
    type: "content",
    kicker: "Describir lo que ofrecés",
    title: "Una descripción que vende",
    rows: [
      { h: "Qué es", d: "el producto o servicio, en pocas palabras." },
      { h: "Qué lo hace distinto", d: "lo que vos sabés que lo hace bueno." },
      { h: "Dónde va", d: "redes, Marketplace o el catálogo de WhatsApp." },
      { h: "Cuánto texto", d: "\"3 líneas, sin exagerar\": si no, todo le sale \"¡increíble!\"." },
    ],
  },
  {
    type: "content",
    kicker: "Reclamos",
    title: "Responder un reclamo",
    rows: [
      { h: "Primero decidís vos", d: "qué solución ofrecés: un cambio, una devolución, un descuento." },
      { h: "Después la IA te ayuda", d: "\"ayudame a responder este reclamo: disculpas sin excusas largas y ofrecé [tu solución]\"." },
      { h: "Antes de mandar", d: "leelo entero como si fueras el cliente." },
    ],
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar algo que la IA inventó: un precio, un plazo, un envío o una garantía." },
      { h: "Recomendación", d: "los datos de tu trabajo los ponés vos: precios, horarios y condiciones." },
      { h: "Antes de publicar", d: "revisá que no haya agregado nada que no sea cierto." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 9 · Describí lo que ofrecés",
    instructions:
      "Pedile la descripción de un producto o servicio tuyo, en 3 líneas. Si no vendés nada, pedile la descripción de algo que te gustaría ofrecer.\n\nRevisala: ¿agregó algo que no es cierto (un precio, un envío, una garantía)? Si es así, pedile que lo saque.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA armó la descripción de tu producto y le agregó \"envío gratis\", que no ofrecés. ¿Qué hacés antes de publicar?",
    options: [
      { text: "Lo dejo: queda lindo y vende más.", correct: false },
      { text: "Lo saco: los datos de mi trabajo los pongo yo.", correct: true },
      { text: "Le creo: la IA sabe más de ventas que yo.", correct: false },
    ],
    explanation: "Lo que promete el mensaje lo tenés que cumplir vos. Precios, envíos y condiciones los ponés vos.",
  },

  // ===================== BLOQUE 5: PRÁCTICA INTEGRADORA =====================
  { type: "divider", badge: "BLOQUE 5 · 15 MIN", title: "Práctica integradora", subtitle: "Tu caso, resuelto en el momento" },
  {
    type: "steps",
    kicker: "Cómo la hacemos",
    title: "Tu caso real, en cuatro pasos",
    steps: [
      "Elegí un caso tuyo: un mensaje pendiente, algo para describir, un papel que no entendés.",
      "Pedilo con una plantilla de hoy, escrita o dictada. Si sirve, sumale una foto o un archivo.",
      "Leé la respuesta y pedile al menos un ajuste: \"más corto\", \"más simple\", \"mantené mis palabras\".",
      "Revisá los datos (precios, fechas, nombres) y quedate con tu versión final.",
    ],
  },
  {
    type: "content",
    kicker: "Si no se te ocurre nada",
    title: "Casos para elegir",
    rows: [
      { h: "Tu trabajo", d: "ideas para promocionar algo que ofrecés y la descripción del que elijas." },
      { h: "Un papel difícil", d: "una foto a una carta o un instructivo (con los datos tapados) para que te lo explique." },
      { h: "Un mensaje", d: "el que venís postergando: un reclamo, un aviso, un pedido." },
      { h: "Algo nuevo", d: "ideas para algo que quieras empezar: un emprendimiento, un curso, un viaje." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 10 · Manos a la obra",
    instructions:
      "Tenés 10 minutos para resolver tu caso con la IA, usando lo que vimos hoy: plantillas, la voz, fotos o archivos, y pedir ajustes.\n\nCuando termines, guardá el resultado: copialo en tus notas o dejá el chat guardado para usarlo después.",
  },

  // ===================== CIERRE =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Cierre", subtitle: "Lo que te llevás de hoy" },
  {
    type: "content",
    kicker: "Para recordar",
    title: "Las claves de hoy",
    rows: [
      { h: "Para ideas", d: "cantidad + para quién + condiciones. Elegir es tu parte." },
      { h: "Con tu voz", d: "el micrófono dicta (respuesta escrita); el modo voz conversa (respuesta hablada)." },
      { h: "Para mostrarle cosas", d: "el \"+\" o el clip: foto, archivo o enlace, siempre con un pedido." },
      { h: "Para escribir y tu trabajo", d: "\"mantené mi forma de escribir\"; los datos los ponés vos." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Le pediste que te resuma un PDF y te dio un texto muy largo. ¿Cómo seguís la conversación?",
    options: [
      { text: "Le pido: \"resumilo en 5 puntos cortos\".", correct: true },
      { text: "Subo el PDF de nuevo en otro chat.", correct: false },
      { text: "Lo dejo así: no se puede achicar.", correct: false },
    ],
    explanation: "Seguí en el mismo chat y decile el formato que querés: ya tiene el PDF y el contexto.",
  },
  {
    type: "checkpoint",
    title: "Hoy te llevás...",
    items: [
      "Ideas para tu trabajo, pedidas con criterios.",
      "Cómo hablarle a la IA: dictar o charlar con la voz.",
      "Cómo mandarle fotos, archivos y enlaces.",
      "Mensajes mejor escritos, con tu propia voz, y plantillas para reusar.",
    ],
  },
  {
    type: "divider",
    badge: "LA PRÓXIMA CLASE",
    title: "Clase 3: Organización de la vida diaria",
    subtitle: "Listas, planes, presupuestos y comparar opciones",
  },
];
