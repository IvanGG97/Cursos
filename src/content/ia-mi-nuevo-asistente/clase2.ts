import type { Slide } from "@/content/types";

// Clase 2 — Crear, entender y comunicarte. Bloques y tiempos según el resumen del curso (PDF).
// Mismas reglas que la Clase 1: contenido antes de cada quiz, ejemplos concretos, error común y
// recomendación en cada bloque.

const VERDADERO = [
  { text: "Verdadero", correct: true },
  { text: "Falso", correct: false },
];
const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase2Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 2 — Crear, entender y comunicarte",
    subtitle: "Ideas, textos y mensajes — también para tu trabajo",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso de la Clase 1",
      "Generar ideas con la IA",
      "Entender textos difíciles y comunicarte mejor",
      "Aplicarlo a tu trabajo o emprendimiento",
      "Práctica integradora: tu propio caso",
      "Cierre",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 15 MIN", title: "Repaso de la Clase 1", subtitle: "Lo que ya sabés, en cinco minutos" },
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
    title: "Crear, entender y comunicarte",
    body: "Hoy usamos la IA para tres cosas: crear (tirar ideas), entender (textos difíciles, en simple) y comunicarte (mails, reclamos, mensajes a clientes). Y después lo llevamos a tu trabajo o emprendimiento.",
    analogy: "La IA hoy es tu compañera de equipo: te tira ideas, te traduce lo complicado y te ayuda a escribir. Vos elegís, corregís y firmás.",
  },

  // ===================== BLOQUE 1: GENERAR IDEAS =====================
  { type: "divider", badge: "BLOQUE 1 · 25 MIN", title: "Generar ideas", subtitle: "La IA como compañera de lluvia de ideas" },
  {
    type: "concept",
    kicker: "Lluvia de ideas",
    title: "Una lluvia de ideas que no se cansa",
    body: "La IA es muy buena para tirar muchas ideas rápido: nombres, temas para publicar, platos para un menú. No todas van a servir — y no hace falta. Su trabajo es darte material; el tuyo, elegir.",
    analogy: "Es como una reunión con alguien que nunca se queda sin ideas: tira veinte, vos te quedás con las dos buenas y las mejorás.",
  },
  {
    type: "content",
    kicker: "Para qué sirve",
    title: "Tres usos que funcionan muy bien",
    rows: [
      { h: "Nombres", d: "para un producto, un emprendimiento, un combo o una promo." },
      { h: "Ideas para redes", d: "qué publicar esta semana en Instagram, Facebook o los estados de WhatsApp." },
      { h: "Un menú nuevo", d: "platos de temporada, opciones sin TACC, combos para el fin de semana." },
    ],
  },
  {
    type: "compare",
    kicker: "Pedir ideas",
    title: "Sin criterios vs. con criterios",
    leftLabel: "Sin criterios",
    rightLabel: "Con criterios",
    left: "\"Dame nombres para mi emprendimiento.\"",
    right:
      "\"Dame 10 nombres para mi emprendimiento de viandas saludables en Salta. Cortos, fáciles de decir, que no suenen a dieta y que sirvan como usuario de Instagram.\"",
  },
  {
    type: "content",
    kicker: "La receta",
    title: "\"Dame 10 ideas para...\" + tus criterios",
    rows: [
      { h: "Cuántas", d: "un número concreto: 10 ideas, 5 nombres, 3 opciones." },
      { h: "Para quién", d: "tu público: vecinos del barrio, oficinistas, familias con chicos." },
      { h: "Qué condiciones", d: "presupuesto, estilo, y también lo que NO querés." },
      { h: "Cómo te las da", d: "en una lista, con una línea que explique cada idea." },
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Ideas para redes, con criterios",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Tengo una panadería de barrio en Salta. Dame 10 ideas de publicaciones para Instagram para esta semana. Mi público son las familias del barrio. Nada de ofertas: quiero mostrar el trabajo del día a día. Una línea por idea.\"",
    caption: "Cantidad, negocio, público, una condición y el formato: todo en un solo mensaje.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir ideas sin contexto: te devuelve lo mismo que a todos (\"Delicias\", \"El Buen Sabor\")." },
      { h: "Recomendación", d: "dale tus criterios y pedile otra vuelta: \"estas son muy comunes, dame 10 más originales\"." },
      { h: "Tip extra", d: "pedile que combine: \"tomá la idea 3 y la 7, y armá una nueva\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estos pedidos de ideas va a dar mejores resultados?",
    options: [
      { text: "\"Dame ideas para mi negocio.\"", correct: false },
      { text: "\"Dame 10 ideas de combos para mi rotisería, pensados para oficinistas, que se puedan llevar y comer rápido.\"", correct: true },
      { text: "\"Hacé que mi negocio venda más.\"", correct: false },
    ],
    explanation: "Tiene cantidad (10), negocio (rotisería), público (oficinistas) y condiciones (para llevar, rápido).",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si de 10 ideas solo te sirven 2, la IA hizo mal su trabajo.",
    options: FALSO,
    explanation: "La lluvia de ideas es para tener material: no todas tienen que servir. Elegir y mejorar es tu parte.",
  },
  {
    type: "practice",
    title: "Tu lluvia de ideas",
    instructions:
      "Pedile a la IA 10 ideas para algo tuyo: un nombre, publicaciones para redes o un plato nuevo. Usá la receta: cuántas, para quién, qué condiciones y cómo te las da.\n\nDespués elegí las 2 que más te gusten y pedile que las mejore.",
  },

  // ===================== BLOQUE 2: ENTENDER Y COMUNICAR =====================
  { type: "divider", badge: "BLOQUE 2 · 25 MIN", title: "Entender y comunicar", subtitle: "Lo difícil, en simple. Y tus mensajes, mejor escritos." },
  {
    type: "concept",
    kicker: "Entender",
    title: "\"Explicámelo como si tuviera 10 años\"",
    body: "Cuando algo está escrito difícil — una nota del banco, las condiciones de un plan de celular, un reglamento — podés pegar el texto y pedir que te lo explique en palabras simples. Funciona muy bien.",
    analogy: "Es como tener a mano a ese amigo que sabe del tema y te dice: \"tranqui, esto lo que quiere decir es...\".",
  },
  {
    type: "content",
    kicker: "Resumir",
    title: "Resumir un PDF largo",
    rows: [
      { h: "Adjuntá el archivo", d: "con el clip o el \"+\" del chat: Claude, ChatGPT y Gemini aceptan PDF." },
      { h: "Decí qué querés y cómo", d: "\"los 5 puntos principales, en una lista corta\" o \"qué tengo que hacer y para cuándo\"." },
      { h: "Chequeá lo importante", d: "fechas y montos, en el documento original: puede equivocarse." },
    ],
    media: {
      id: "c2-adjuntar",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: el botón para adjuntar un archivo (clip o \"+\") en el chat.",
    },
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Un pedido para entender",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Te pego la nota que me mandó el banco. Explicámela en palabras simples, como si tuviera 10 años: qué cambia para mí, si tengo que hacer algo y para cuándo.\"",
    caption: "Ojo: antes de pegarla, borrá o tapá los datos sensibles (número de cuenta, DNI completo).",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA te resume un PDF, las fechas y montos que te da no hace falta chequearlos en el original.",
    options: FALSO,
    explanation: "Al resumir también se puede equivocar. Fechas y montos se chequean siempre en el documento original.",
  },
  {
    type: "concept",
    kicker: "Comunicar",
    title: "Los mensajes que más cuestan",
    body: "Un mail formal, una carta de reclamo, un WhatsApp delicado a un cliente: son los mensajes que más cuesta escribir. La IA te arma un borrador en segundos; vos lo revisás, lo ajustás y lo mandás.",
    analogy: "Es como arrancar con un borrador ya escrito: no te quedás mirando la hoja en blanco.",
  },
  {
    type: "content",
    kicker: "Tres casos",
    title: "Qué decirle en cada caso",
    rows: [
      { h: "Mail formal", d: "a quién va, qué pedís y el tono: \"formal pero cordial, máximo 120 palabras\"." },
      { h: "Carta de reclamo", d: "qué pasó, cuándo, qué hiciste hasta ahora y qué solución querés." },
      { h: "WhatsApp a un cliente", d: "corto, amable y con la información justa: precio, día y hora." },
    ],
  },
  {
    type: "compare",
    kicker: "Tu voz",
    title: "Reescribir todo vs. mejorar lo tuyo",
    leftLabel: "Pierde tu voz",
    rightLabel: "Mantiene tu voz",
    left: "\"Reescribí este mensaje.\" El resultado queda prolijo, pero no suena a vos: tus clientes lo notan.",
    right: "\"Mejorá este mensaje: corregí la ortografía y que sea más claro, pero mantené mi forma de escribir y mis palabras.\"",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir que \"reescriba todo\": queda perfecto pero frío, y se nota que no lo escribiste vos." },
      { h: "Recomendación", d: "pedí \"mejorá esto, pero mantené mi forma de escribir\"." },
      { h: "Tip extra", d: "si quedó muy formal: \"más corto y más cercano, como le hablo yo a mis clientes\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Escribiste un WhatsApp para un cliente y querés pulirlo sin que deje de sonar a vos. ¿Qué le pedís?",
    options: [
      { text: "\"Reescribilo entero.\"", correct: false },
      { text: "\"Mejoralo y corregí la ortografía, pero mantené mi forma de escribir.\"", correct: true },
      { text: "\"Hacelo más largo y más formal.\"", correct: false },
    ],
    explanation: "Pedir que mantenga tu forma de escribir mejora el mensaje sin perder tu voz.",
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué le contás a la IA para tu carta de reclamo?",
    options: [
      { text: "Qué pasó y cuándo.", correct: true },
      { text: "Qué solución querés.", correct: true },
      { text: "Qué hiciste hasta ahora (por ejemplo, que ya llamaste).", correct: true },
      { text: "La clave de tu home banking.", correct: false },
    ],
    explanation: "Qué pasó, cuándo, qué hiciste y qué solución querés. Las claves, nunca: es regla de oro.",
  },

  // ===================== BLOQUE 3: TU TRABAJO O EMPRENDIMIENTO =====================
  { type: "divider", badge: "BLOQUE 3 · 25 MIN", title: "Aplicarlo a tu trabajo o emprendimiento", subtitle: "Clientes, productos y reclamos" },
  {
    type: "concept",
    kicker: "Tu trabajo",
    title: "Una ayudante para tu negocio",
    body: "No importa si vendés tortas, hacés arreglos de electricidad o das clases particulares: todos los días hay mensajes que escribir, productos que describir y clientes que atender. Ahí la IA te ahorra tiempo.",
    analogy: "Es como sumar una ayudante que escribe rápido: vos ponés lo que sabés de tu negocio y ella te lo deja prolijo.",
  },
  {
    type: "quote",
    kicker: "Mensaje a un cliente",
    title: "Avisar una demora sin perder al cliente",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Soy electricista. Tenía que ir hoy a las 17 a la casa de un cliente y se me complicó con otro trabajo. Escribime un WhatsApp corto para avisarle, pedirle disculpas y ofrecerle mañana a las 10 o a las 16. Tono cercano.\"",
    caption: "Le diste la situación, lo que ofrecés y el tono: no tiene que adivinar nada.",
  },
  {
    type: "content",
    kicker: "Describir un producto",
    title: "Una descripción que vende",
    rows: [
      { h: "Qué es", d: "\"torta de chocolate de 20 cm, rinde 12 porciones\"." },
      { h: "Qué la hace especial", d: "\"con dulce de leche casero, se hace a pedido\"." },
      { h: "Dónde va", d: "Instagram, Marketplace o el catálogo de WhatsApp." },
      { h: "Cuánto texto", d: "\"3 líneas, sin exagerar\": si no, todo le sale \"¡increíble!\"." },
    ],
  },
  {
    type: "quote",
    kicker: "Responder un reclamo",
    title: "Un reclamo, bien respondido",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Una clienta se queja porque el pedido llegó una hora tarde y frío. Tiene razón. Ayudame a responderle: pedir disculpas sin excusas largas y ofrecerle un 15% de descuento en su próxima compra.\"",
    caption: "La solución (el descuento) la decidís vos; la IA te ayuda a decirlo bien.",
  },
  {
    type: "content",
    kicker: "Vender más",
    title: "Ideas para vender más",
    rows: [
      { h: "Promociones", d: "\"dame 5 ideas de promo para los días de poco movimiento\"." },
      { h: "Fechas especiales", d: "Día de la Madre, Día del Niño, fin de año: qué ofrecer y cómo contarlo." },
      { h: "Clientes de siempre", d: "un recordatorio amable para volver a comprar, sin sonar a spam." },
      { h: "Preguntas frecuentes", d: "respuestas listas para lo que te preguntan siempre: precios, envíos, horarios." },
    ],
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar un mensaje con algo que la IA inventó: un precio, un plazo o una garantía." },
      { h: "Recomendación", d: "los datos de tu negocio los ponés vos: precio, horario, condiciones." },
      { h: "Antes de mandar", d: "leé el mensaje entero como si fueras el cliente." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te armó la descripción de un producto y le agregó \"envío gratis a todo el país\", que vos no ofrecés. ¿Qué hacés?",
    options: [
      { text: "Lo dejo: queda lindo y vende más.", correct: false },
      { text: "Lo corrijo antes de publicar: los datos de mi negocio los pongo yo.", correct: true },
      { text: "Le creo: la IA sabe más de ventas que yo.", correct: false },
    ],
    explanation: "Lo que promete el mensaje lo tenés que cumplir vos. Precios, plazos y condiciones los ponés vos.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Para responder un reclamo, conviene que la solución (descuento, cambio, devolución) la decidas vos y que la IA te ayude a escribirla.",
    options: VERDADERO,
    explanation: "Vos conocés tu negocio y tu cliente: decidís la solución. La IA te ayuda a decirlo bien.",
  },

  // ===================== BLOQUE 4: PRÁCTICA INTEGRADORA =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Práctica integradora", subtitle: "Tu caso, resuelto en el momento" },
  {
    type: "steps",
    kicker: "Cómo la hacemos",
    title: "Tu caso real, en cuatro pasos",
    steps: [
      "Elegí un caso tuyo (o inventalo): un mensaje pendiente, un producto para describir, un texto que no entendés.",
      "Escribí el pedido con la fórmula: qué quiero, para qué es, en qué tono o formato.",
      "Leé la respuesta y pedile al menos un ajuste: \"más corto\", \"más cercano\", \"mantené mis palabras\".",
      "Revisá los datos (precios, fechas, nombres) y quedate con tu versión final.",
    ],
  },
  {
    type: "content",
    kicker: "Si no se te ocurre nada",
    title: "Casos para elegir",
    rows: [
      { h: "Trabajo", d: "avisar a tus clientes de siempre que aumentás el precio." },
      { h: "Emprendimiento", d: "10 nombres para un producto nuevo y la descripción del que elijas." },
      { h: "Vida diaria", d: "entender en simple una carta del banco o de la obra social (sin tus datos)." },
      { h: "Reclamo", d: "una carta porque un producto que compraste llegó roto." },
    ],
  },
  {
    type: "practice",
    title: "Manos a la obra",
    instructions:
      "Tenés 15 minutos para resolver tu caso con la IA. Pedí al menos un ajuste a la primera respuesta.\n\nAl final, quien quiera comparte el antes y el después: cómo fue el primer pedido y cómo quedó el resultado.",
  },

  // ===================== CIERRE =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Cierre", subtitle: "Lo que te llevás de hoy" },
  {
    type: "content",
    kicker: "Para recordar",
    title: "Las claves de hoy",
    rows: [
      { h: "Para ideas", d: "cantidad + criterios. Elegir y mejorar es tu parte." },
      { h: "Para entender", d: "\"explicámelo en simple\", y fechas y montos en el original." },
      { h: "Para comunicar", d: "\"mejorá esto, pero mantené mi forma de escribir\"." },
      { h: "Para tu negocio", d: "los datos los ponés vos; la IA te ayuda a decirlos bien." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Querés entender una carta larga de tu obra social. ¿Qué pedido es mejor?",
    options: [
      { text: "\"Resumila.\"", correct: false },
      { text: "\"Explicame en palabras simples qué cambia para mí y si tengo que hacer algo, en 5 puntos.\"", correct: true },
      { text: "\"¿Está bien esta carta?\"", correct: false },
    ],
    explanation: "Dice qué querés entender (qué cambia y qué hacer), cómo (en simple) y en qué formato (5 puntos).",
  },
  {
    type: "checkpoint",
    title: "Hoy te llevás...",
    items: [
      "Una forma de pedir ideas que da resultados.",
      "Cómo entender un texto difícil en minutos.",
      "Mensajes y reclamos mejor escritos, con tu propia voz.",
      "Al menos un caso de tu trabajo resuelto con la IA.",
    ],
  },
  {
    type: "divider",
    badge: "LA PRÓXIMA CLASE",
    title: "Clase 3: Organización de la vida diaria",
    subtitle: "Listas, planes, presupuestos y comparar opciones",
  },
];
