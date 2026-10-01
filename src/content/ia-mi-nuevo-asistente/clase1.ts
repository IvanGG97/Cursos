import type { Slide } from "@/content/types";

// Contenido aprobado de la Clase 1, porteado desde clase1_content.js (pptx).
// El breadcrumb, el número de página y el color se calculan en el motor.

const VF = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase1Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 1 — Qué es esto y cómo le hablo",
    subtitle: "Conceptos base, límites de la IA y tu primer mensaje",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Qué es un asistente de IA y qué opciones existen",
      "Conceptos clave: tokens, contexto, chats y proyectos",
      "Límites de la IA: qué es una alucinación",
      "Primer contacto: crear tu cuenta",
      "Cómo pedir bien las cosas",
      "Cierre: reglas de oro",
    ],
  },

  // ===================== BLOQUE 1: QUÉ ES LA IA =====================
  { type: "divider", badge: "BLOQUE 1 · 15 MIN", title: "Qué es un asistente de IA", subtitle: "Sin tecnicismos, y sin miedo" },
  {
    type: "concept",
    kicker: "Para empezar",
    title: "¿Qué es, en criollo, un asistente de IA?",
    body: "Es un programa que entiende lenguaje natural — lo que escribís como le hablarías a una persona — y te responde con texto, también en lenguaje natural. Nada más (y nada menos) que eso.",
    analogy: "Es como un empleado nuevo, muy leído, que no conoce tu negocio todavía: le tenés que explicar lo que necesitás, pero entiende instrucciones complejas al toque.",
    media: { kind: "IMAGEN", caption: "Buscar: ilustración simple de una persona chateando con un asistente virtual en el celular (estilo flat / amigable, sin logos de marcas)." },
  },
  {
    type: "content",
    kicker: "Desmitificando",
    title: "Lo que la IA NO es",
    rows: [
      { h: "No \"piensa\"", d: "Predice la palabra más probable que sigue, en base a muchísimo texto que leyó." },
      { h: "No te espía", d: "No ve tu pantalla ni tu cámara. Solo sabe lo que le escribís en el chat." },
      { h: "No reemplaza tu juicio", d: "Te ayuda a pensar más rápido, pero la decisión final siempre es tuya." },
    ],
  },
  {
    type: "content",
    kicker: "Panorama",
    title: "Las tres opciones más conocidas",
    rows: [
      { h: "ChatGPT (OpenAI)", d: "La más conocida y usada en el mundo. Buena para empezar y para uso general." },
      { h: "Gemini (Google)", d: "Viene integrada a tu cuenta de Google — Gmail, Calendar, Drive." },
      { h: "Claude (Anthropic)", d: "Muy cuidadosa con las instrucciones largas y la redacción prolija." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "¿Un asistente de IA puede ver lo que hacés en otras apps de tu celular mientras chateás con él?",
    options: VF,
  },

  // ===================== BLOQUE 2: CONCEPTOS CLAVE =====================
  { type: "divider", badge: "BLOQUE 2 · 25 MIN", title: "Conceptos clave", subtitle: "Tokens, contexto, chats y proyectos" },
  {
    type: "concept",
    kicker: "Concepto 1",
    title: "Tokens: la moneda de cambio",
    body: "Cada vez que escribís algo o la IA te responde, ese texto se divide en \"tokens\" (pedacitos de palabras). Son la unidad con la que se paga la conversación.",
    analogy: "Los tokens son como la moneda que usás para pagar en el quiosco de la esquina: cuanto más larga y repetitiva la conversación, más \"monedas\" gastás.",
  },
  {
    type: "content",
    kicker: "En la práctica",
    title: "¿Para qué me sirve saber esto?",
    rows: [
      { h: "Mensajes más cortos y precisos", d: "rinden más que escribir y corregir muchas veces." },
      { h: "Pegar un texto larguísimo sin necesidad", d: "gasta tokens de más — pegá solo la parte que importa." },
      { h: "No es un problema grave si te excedés", d: "simplemente conviene ser ordenado, no es \"romper\" nada." },
    ],
  },
  {
    type: "concept",
    kicker: "Concepto 2",
    title: "Contexto: la memoria de la charla",
    body: "El contexto es todo lo que se dijo en la conversación hasta ahora. La IA lo \"tiene arriba de la mesa\" para responder, pero esa mesa tiene un tamaño límite.",
    analogy: "Es como una mesa de trabajo: todo lo que pusiste encima lo podés usar, pero si la llenás de papeles viejos, no entra nada nuevo y se empieza a mezclar todo.",
    media: { kind: "IMAGEN", caption: "Buscar: ilustración de un escritorio con documentos apilados, como metáfora de la 'mesa de trabajo' con límite de espacio." },
  },
  {
    type: "content",
    kicker: "Qué pasa cuando se llena",
    title: "Cuando la mesa ya no tiene lugar",
    rows: [
      { h: "La IA empieza a \"olvidar\" lo primero", d: "de una conversación muy larga, para hacerle lugar a lo nuevo." },
      { h: "Puede confundir datos de distintos temas", d: "si metiste todo en un mismo chat interminable." },
      { h: "La solución es simple", d: "arrancar un chat nuevo cuando cambiás de tema." },
    ],
  },
  {
    type: "concept",
    kicker: "Concepto 3",
    title: "Chat: una carpeta por tema",
    body: "Un chat es una conversación independiente. Lo que hablás en uno no se mezcla con otro (salvo que vos se lo cuentes).",
    analogy: "Pensalo como una carpeta: una carpeta para \"presupuesto del casamiento\" y otra distinta para \"trabajo\" — no las vas a mezclar en una misma.",
  },
  {
    type: "concept",
    kicker: "Concepto 4",
    title: "Proyecto: una carpeta de carpetas",
    body: "Un proyecto agrupa varios chats relacionados y puede guardar información fija que aplica a todos ellos (por ejemplo, datos de tu negocio).",
    analogy: "Es como un cajón que agrupa varias carpetas de un mismo tema general, con una ficha con tus datos pegada adentro para no repetirla cada vez.",
  },
  {
    type: "content",
    kicker: "Organización",
    title: "Cómo organizar tus propios chats",
    rows: [
      { h: "Un chat por tema", d: "si cambiaste de asunto, abrí uno nuevo." },
      { h: "Error común", d: "meter todo en un solo chat eterno — la IA empieza a mezclar contextos viejos con lo nuevo." },
      { h: "Recomendación", d: "si vas a volver sobre el mismo tema seguido (tu changa, tu casa), armate un proyecto." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estas definiciones de \"contexto\" es la correcta?",
    options: [
      { text: "Es la cantidad de dinero que cuesta usar la IA.", correct: false },
      { text: "Es todo lo dicho en la conversación, que la IA usa para responder, con un límite de tamaño.", correct: true },
      { text: "Es la cantidad de chats que tenés abiertos.", correct: false },
    ],
  },
  {
    type: "quiz",
    kind: "multi",
    question: "Marcá las que son prácticas recomendadas para organizar tus chats:",
    options: [
      { text: "Abrir un chat nuevo cuando cambiás de tema.", correct: true },
      { text: "Usar un proyecto para temas a los que volvés seguido.", correct: true },
      { text: "Meter trabajo y vida personal en el mismo chat de siempre.", correct: false },
    ],
  },

  // ===================== BLOQUE 3: LÍMITES =====================
  { type: "divider", badge: "BLOQUE 3 · 15 MIN", title: "Los límites de la IA", subtitle: "Qué es una alucinación y por qué importa" },
  {
    type: "concept",
    kicker: "Un límite real",
    title: "¿Qué es una \"alucinación\"?",
    body: "Es cuando la IA responde algo incorrecto, pero lo dice con total seguridad — como si fuera un dato cierto. No miente a propósito: simplemente predice una respuesta creíble, no siempre correcta.",
  },
  {
    type: "quote",
    kicker: "Ejemplo real",
    title: "Así se ve una alucinación",
    quoteLabel: "LE PREGUNTAMOS",
    quoteText:
      "\"¿Hasta qué fecha puedo renovar la licencia de conducir en Salta este año?\"\n\nLa IA puede responder una fecha concreta y segura — que puede ser incorrecta, porque no tiene acceso en tiempo real al calendario oficial del municipio.",
    caption: "El problema no es que \"no sepa\": es que lo dice con la misma seguridad que si supiera.",
  },
  {
    type: "content",
    kicker: "Qué hacer",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "copiar la respuesta y actuar sin chequear fechas, precios, trámites o leyes." },
      { h: "Recomendación", d: "todo dato \"factual\" sensible se verifica en la fuente oficial antes de usarlo (la web del organismo, el banco, etc.)." },
      { h: "Buena noticia", d: "para redactar, resumir, organizar ideas o dar ejemplos, el riesgo de alucinación es mucho menor." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA te da una fecha de vencimiento de un trámite, ¿podés confiar y actuar sin chequear?",
    options: VF,
  },

  // ===================== BLOQUE 4: PRIMER CONTACTO =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Primer contacto", subtitle: "Creamos tu cuenta, paso a paso" },
  {
    type: "steps",
    kicker: "Instalación",
    title: "Crear una cuenta en Claude",
    steps: [
      "Entrá a claude.ai desde el navegador, o descargá la app \"Claude\" en tu celular.",
      "Tocá \"Continuar con Google\" (lo más simple) o registrate con tu mail.",
      "Confirmá tu cuenta si te lo pide por mail.",
      "Ya podés escribir tu primer mensaje en el chat.",
    ],
    media: { kind: "IMAGEN", caption: "Captura de pantalla real de la pantalla de inicio de sesión de claude.ai." },
  },
  {
    type: "steps",
    kicker: "Instalación",
    title: "Crear una cuenta en ChatGPT",
    steps: [
      "Entrá a chatgpt.com desde el navegador, o descargá la app \"ChatGPT\" en tu celular.",
      "Tocá \"Registrarse\" y elegí continuar con Google, Apple o mail.",
      "Confirmá tu cuenta si te lo pide.",
      "Ya podés escribir tu primer mensaje en el chat.",
    ],
    media: { kind: "IMAGEN", caption: "Captura de pantalla real de la pantalla de inicio de sesión de chatgpt.com." },
  },
  {
    type: "steps",
    kicker: "Instalación",
    title: "Crear una cuenta en Gemini",
    steps: [
      "Entrá a gemini.google.com, o abrí la app \"Gemini\" en tu celular.",
      "Iniciá sesión con tu cuenta de Google (si ya tenés Gmail, ya tenés Gemini).",
      "Aceptá los términos de uso la primera vez.",
      "Ya podés escribir tu primer mensaje en el chat.",
    ],
    media: { kind: "IMAGEN", caption: "Captura de pantalla real de la pantalla de inicio de gemini.google.com." },
  },
  {
    type: "content",
    kicker: "En cualquiera de las tres",
    title: "La interfaz es siempre parecida",
    rows: [
      { h: "Un cuadro de texto abajo", d: "para escribir tu mensaje." },
      { h: "Un botón para \"Chat nuevo\"", d: "para arrancar un tema distinto." },
      { h: "Un historial a la izquierda", d: "con todos tus chats anteriores, para volver a ellos cuando quieras." },
    ],
    media: { kind: "GIF", caption: "Buscar/grabar un GIF corto mostrando: escribir un mensaje, recibir respuesta, y abrir un chat nuevo." },
  },
  {
    type: "practice",
    title: "Mandá tu primer mensaje",
    instructions:
      "Elegí una de las tres (Claude, ChatGPT o Gemini), creá tu cuenta, y escribile: \"Hola, estoy aprendiendo a usarte. Contame en 3 líneas qué cosas me podés ayudar a hacer en mi día a día.\"\n\nLeé la respuesta en voz alta si querés compartirla con el grupo.",
  },

  // ===================== BLOQUE 5: CÓMO PEDIR BIEN LAS COSAS =====================
  { type: "divider", badge: "BLOQUE 5 · 35 MIN", title: "Cómo pedir bien las cosas", subtitle: "La diferencia entre un prompt vago y uno claro" },
  {
    type: "concept",
    kicker: "La fórmula",
    title: "Tres preguntas antes de escribir",
    body: "Antes de mandar el mensaje, respondete: ¿qué quiero?, ¿para qué es esto?, ¿en qué tono o formato lo necesito? Con esas tres respuestas ya tenés un prompt mucho mejor.",
    analogy: "Es como pedirle algo a un empleado nuevo: cuanto más claro seas sobre qué necesitás y para qué, mejor te va a salir sin tener que corregir después.",
  },
  {
    type: "compare",
    kicker: "En vivo",
    title: "El mismo pedido, dos formas distintas",
    left: "\"Ayudame con un mail para mi casero.\"",
    right:
      "\"Escribime un mail formal para pedirle a mi casero que arregle una pérdida de agua en el baño. Tono respetuoso pero firme, máximo 100 palabras, y que mencione que ya avisé hace una semana.\"",
  },
  {
    type: "content",
    kicker: "Qué cambió",
    title: "Por qué el segundo funciona mejor",
    rows: [
      { h: "Dice el objetivo exacto", d: "pedir que arreglen la pérdida de agua, no \"algo sobre el casero\"." },
      { h: "Da el tono", d: "respetuoso pero firme — así la IA no tiene que adivinar." },
      { h: "Pone un límite claro", d: "máximo 100 palabras, para que no quede un texto interminable." },
      { h: "Suma un dato de contexto", d: "que ya avisó antes — hace el mail más efectivo." },
    ],
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "prompts de una sola línea, esperando que la IA \"adivine\" todo el contexto." },
      { h: "Recomendación", d: "si la respuesta no te sirvió, no empieces de cero — decile qué le falta y pedile que ajuste." },
      { h: "Tip extra", d: "podés pedirle cosas de a partes: primero una idea general, después que la desarrolle." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estos prompts está mejor armado?",
    options: [
      { text: "\"Escribime algo para mi negocio.\"", correct: false },
      { text: "\"Escribime 3 publicaciones cortas para Instagram promocionando mi local de tortas, tono cercano y con emojis.\"", correct: true },
      { text: "\"Necesito ayuda.\"", correct: false },
    ],
  },

  // ===================== CIERRE =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Reglas de oro", subtitle: "Lo único que no podés olvidar" },
  {
    type: "content",
    kicker: "Antes de irte",
    title: "Las reglas de oro de hoy",
    rows: [
      { h: "Nunca cargues contraseñas ni datos sensibles", d: "tarjetas, claves, DNI completo — en ningún chat." },
      { h: "Un chat por tema", d: "y un proyecto si volvés seguido a lo mismo." },
      { h: "Chequeá los datos importantes", d: "fechas, precios, trámites — en la fuente oficial." },
      { h: "Cuanto más claro el pedido", d: "mejor la respuesta — sin necesidad de corregir muchas veces." },
    ],
  },
  {
    type: "checkpoint",
    title: "Hoy te llevás...",
    items: [
      "Una cuenta creada en Claude, ChatGPT o Gemini.",
      "Tu primer mensaje enviado y respondido.",
      "La fórmula de 3 preguntas para pedir las cosas bien.",
      "Claridad sobre cuándo chequear lo que te responde la IA.",
    ],
  },
  {
    type: "divider",
    badge: "LA PRÓXIMA CLASE",
    title: "Clase 2: Crear, entender y comunicarte",
    subtitle: "Ideas, textos y mensajes — también para tu changa",
  },
];
