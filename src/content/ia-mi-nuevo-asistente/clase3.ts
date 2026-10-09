import type { Slide } from "@/content/types";

// Clase 3 — Organización de la vida diaria (v2, rearmada por funciones con Ivan).
// Enseña herramientas de las tres IA que todavía no se habían visto: los botones de cada respuesta,
// buscar en internet con fuentes, tablas y archivos (incluido Word → PDF), memoria e instrucciones,
// y crear imágenes (con la tarea grande: tu caricatura o tu logo, con foto y dictado).
// Criterio de la Clase 2: ejemplo general + plantilla con [espacios] + tarea corta por tema, cada
// uno con su celular. Público con muchos adultos mayores: lo práctico va paso a paso.
// Los nombres de los menús de cada app pueden cambiar con las actualizaciones: se dice dónde buscar.

const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase3Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 3 — Organización de la vida diaria",
    subtitle: "Buscar, armar tablas y archivos, recordar y crear imágenes",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso de la Clase 2",
      "Los botones de cada respuesta",
      "Buscar en internet, con fuentes",
      "Tablas y archivos: de Word a PDF",
      "Memoria e instrucciones: que te conozca",
      "Crear imágenes: tu caricatura o tu logo, y cierre",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 10 MIN", title: "Repaso de la Clase 2", subtitle: "Crear, hablar, mostrar y comunicar" },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo que vimos la clase pasada",
    rows: [
      { h: "Ideas", d: "cantidad + para quién + condiciones. Elegir es tu parte." },
      { h: "Con tu voz", d: "el micrófono dicta (respuesta escrita); el modo voz conversa (respuesta hablada)." },
      { h: "Fotos y archivos", d: "el \"+\": cámara, fotos o archivos, siempre con un pedido." },
      { h: "Tus mensajes", d: "\"mantené mi forma de escribir\"; los datos los ponés vos." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Querés mandarle a la IA una foto que sacás en el momento. ¿Qué tocás?",
    options: [
      { text: "El \"+\" al lado del cuadro donde escribís, y después \"Cámara\".", correct: true },
      { text: "El botón de compartir de WhatsApp.", correct: false },
      { text: "Nada: la IA no puede ver fotos.", correct: false },
    ],
    explanation: "El \"+\" (o el clip) abre la cámara, la galería y los archivos.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te mejoró un mensaje, pero ya no suena a vos. ¿Cómo seguís la conversación?",
    options: [
      { text: "Le pido: \"mejoralo, pero mantené mi forma de escribir\".", correct: true },
      { text: "Lo mando igual.", correct: false },
      { text: "Borro la app.", correct: false },
    ],
    explanation: "Seguí en el mismo chat y decile qué querés conservar: tus palabras y tu forma de escribir.",
  },
  {
    type: "concept",
    kicker: "Hoy",
    title: "Las herramientas que casi nadie usa",
    body: "Hoy subimos un escalón: los botones de cada respuesta, buscar en internet con fuentes, armar tablas y archivos, que la IA te conozca y crear imágenes. Todo para organizar mejor tu vida diaria y tu trabajo.",
    analogy: "Es como un auto que venías manejando siempre en primera: hoy aprendés a usar los cambios.",
  },
  {
    type: "content",
    kicker: "Cómo trabajamos hoy",
    title: "Ejemplo, plantilla y tarea",
    rows: [
      { h: "Un ejemplo resuelto", d: "para ver cómo se pide cada cosa." },
      { h: "Una plantilla", d: "el pedido con [espacios entre corchetes]: los cambiás por tus datos y borrás los corchetes." },
      { h: "Una tarea corta", d: "3 a 5 minutos, cada uno con su celular. Y al final, una tarea grande." },
    ],
  },

  // ===================== BLOQUE 1: LOS BOTONES DE CADA RESPUESTA =====================
  { type: "divider", badge: "BLOQUE 1 · 15 MIN", title: "Los botones de cada respuesta", subtitle: "Copiar, pedir otra, escuchar, editar y compartir" },
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Botones chiquitos, muy útiles",
    body: "Debajo de cada respuesta (o manteniéndola apretada, en el celular) hay botones que casi nadie toca. Sirven para copiarla, pedir otra versión, escucharla en voz alta o compartirla. Los íconos cambian un poco de una app a otra, pero están en las tres.",
    analogy: "Es como el control remoto: siempre usamos el de prender y apagar, y hay otros que hacen la vida más fácil.",
  },
  {
    type: "content",
    kicker: "Debajo de la respuesta",
    title: "Copiar, otra respuesta y escuchar",
    rows: [
      { h: "Copiar", d: "para pegar la respuesta en WhatsApp, en un mail o en tus notas." },
      { h: "Otra respuesta", d: "la flecha en círculo: lo vuelve a intentar con otras palabras." },
      { h: "Escuchar", d: "el parlante: te lee la respuesta en voz alta." },
    ],
    media: {
      id: "c3-botones",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: los botones debajo de una respuesta (copiar, otra respuesta, escuchar), señalados.",
    },
  },
  {
    type: "content",
    kicker: "Más botones",
    title: "Editar, compartir y buscar",
    rows: [
      { h: "Editar tu pedido", d: "tocá (o mantené apretado) tu mensaje y elegí editar: lo corregís y la IA responde de nuevo." },
      { h: "Compartir un chat", d: "te da un enlace para mandarle la conversación a otra persona." },
      { h: "Buscar en el historial", d: "la lupa del menú de chats: encontrás una conversación vieja por una palabra." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 1 · Escuchá y pedí otra",
    instructions:
      "Hacele una pregunta cualquiera, por ejemplo: \"¿Cómo cuido una planta de interior?\". Tocá el parlante para escuchar la respuesta en voz alta.\n\nDespués tocá \"otra respuesta\" y compará las dos versiones.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "empezar un chat nuevo cada vez que algo salió mal: perdés todo lo que ya le contaste." },
      { h: "Recomendación", d: "editá tu pedido o pedí otra respuesta, en el mismo chat." },
      { h: "Ojo al compartir", d: "el enlace muestra toda la conversación: revisá que no haya datos personales." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 2 · Editá tu pedido",
    instructions:
      "Con la lupa del historial, buscá un chat de la clase pasada.\n\nEditá uno de tus pedidos para mejorarlo (más claro o con más datos) y fijate cómo cambia la respuesta.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "El pedido estaba bien, pero la respuesta no te convenció. ¿Cómo seguís?",
    options: [
      { text: "Toco \"otra respuesta\" para que lo intente de nuevo.", correct: true },
      { text: "Cierro la app y no la uso más.", correct: false },
      { text: "Me creo una cuenta nueva.", correct: false },
    ],
    explanation: "\"Otra respuesta\" le pide que lo intente de nuevo, con otras palabras, sin perder el chat.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Te equivocaste al escribir el pedido y la respuesta salió mal. ¿Qué hacés?",
    options: [
      { text: "Edito mi pedido, lo corrijo y la IA responde de nuevo.", correct: true },
      { text: "Abro un chat nuevo y le explico todo otra vez.", correct: false },
      { text: "Me quedo con la respuesta equivocada.", correct: false },
    ],
    explanation: "Editar el pedido corrige el error sin perder lo que ya le habías contado.",
  },

  // ===================== BLOQUE 2: BUSCAR EN INTERNET =====================
  { type: "divider", badge: "BLOQUE 2 · 20 MIN", title: "Buscar en internet", subtitle: "Información de hoy, con fuentes para chequear" },
  {
    type: "concept",
    kicker: "Información de hoy",
    title: "Busca, y te dice de dónde lo sacó",
    body: "Las tres IA pueden buscar en internet: horarios, precios actuales, noticias, lugares. Cuando buscan, te muestran de qué páginas sacaron la información, con enlaces. Eso cambia todo: ya podés chequear de dónde salió cada dato.",
    analogy: "Es como un ayudante que, además de contestarte, te dice \"lo leí acá\" y te pasa la página.",
  },
  {
    type: "content",
    kicker: "Cómo pedírselo",
    title: "Para que busque de verdad",
    rows: [
      { h: "Pedíselo claro", d: "\"buscá en internet...\" o \"con información actualizada\"." },
      { h: "Pedí las fuentes", d: "\"mostrame los enlaces de donde lo sacaste\"." },
      { h: "Si no busca", d: "en algunas apps hay un botón de búsqueda (una lupa o un globo): activalo." },
      { h: "Igual se chequea", d: "la búsqueda también se equivoca: lo importante, abrí el enlace y fijate." },
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo resuelto",
    title: "Una salida, con información de hoy",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Buscá en internet qué actividades gratuitas hay este fin de semana en mi ciudad para ir con chicos. Dame 5 opciones con día, horario y el enlace de cada una.\"",
    caption: "Qué, dónde, cuándo, para quién, el formato... y los enlaces para chequear.",
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Ahora, con lo tuyo",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Buscá en internet [qué necesitás saber] en [tu ciudad o lugar] para [cuándo]. Dame [cantidad] opciones con [precio / horario / dirección] y el enlace de cada una.\"",
    caption: "Sirve para horarios, lugares, precios de hoy, actividades o novedades.",
  },
  {
    type: "practice",
    title: "Tarea 3 · Buscá algo de esta semana",
    instructions:
      "Usá la plantilla para algo que necesites esta semana: un horario, un lugar, un precio, una actividad. Si querés, dictalo.\n\nAbrí al menos uno de los enlaces que te da.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "creer que todo lo que dice está actualizado: a veces no busca y responde de memoria." },
      { h: "Recomendación", d: "pedí siempre los enlaces; si no te muestra fuentes, decile \"buscalo en internet\"." },
      { h: "Trámites, salud y plata", d: "la fuente oficial manda, aunque la IA diga otra cosa." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 4 · Chequeá la fuente",
    instructions:
      "Preguntale algo que puedas comprobar, por ejemplo el horario de atención de un lugar que conocés.\n\nAbrí el enlace que te da y compará. Si no coincide, decíselo y fijate cómo lo corrige.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Decime qué hay para hacer el fin de semana.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "Dónde, para quién, y que lo busque en internet con los enlaces.", correct: true },
      { text: "Más signos de pregunta.", correct: false },
      { text: "Nada: así está perfecto.", correct: false },
    ],
    explanation: "Sin lugar ni para quién, te da algo genérico. Y sin buscar en internet, puede no estar actualizado.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te dio un horario de atención, pero no te mostró de dónde lo sacó. ¿Qué revisás?",
    options: [
      { text: "Le pido que lo busque en internet con el enlace, y lo chequeo en la página.", correct: true },
      { text: "Nada: si lo dice la IA, está bien.", correct: false },
      { text: "Le pregunto lo mismo diez veces.", correct: false },
    ],
    explanation: "Sin fuente no hay forma de chequear. Con el enlace, lo comprobás en un minuto.",
  },

  // ===================== BLOQUE 3: TABLAS Y ARCHIVOS =====================
  { type: "divider", badge: "BLOQUE 3 · 20 MIN", title: "Tablas y archivos", subtitle: "De la respuesta en el chat a algo que guardás" },
  {
    type: "concept",
    kicker: "Ordenar",
    title: "De la respuesta a algo que guardás",
    body: "Le podés pedir la información en una tabla: una lista de compras, los gastos del mes, las tareas de la semana. Y llevártela: copiarla a una planilla, descargarla, o pedirle un archivo listo, como un PDF.",
    analogy: "Es pasar de anotar en una servilleta a tener la hoja ordenada en la carpeta.",
  },
  {
    type: "quote",
    kicker: "Ejemplo resuelto",
    title: "Una tabla para la semana",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Armame una tabla con las tareas de la casa de lunes a domingo, con columnas día, tarea y quién la hace. Somos tres en casa y nadie quiere cocinar dos días seguidos.\"",
    caption: "Dice qué tabla, qué columnas y los datos reales (cuántos son, una condición).",
  },
  {
    type: "content",
    kicker: "Llevártela",
    title: "Tres formas de quedarte con la tabla",
    rows: [
      { h: "Copiarla", d: "tocá copiar y pegala en una planilla (Excel o Google Sheets) o en tus notas." },
      { h: "Pedir el archivo", d: "\"pasámelo a un archivo de Excel\" o \"a un PDF\": ChatGPT y Claude te lo dan para descargar." },
      { h: "En Gemini", d: "debajo de la tabla está el botón para exportarla a una planilla de Google." },
    ],
  },
  {
    type: "steps",
    kicker: "De Word a PDF",
    title: "Convertir un documento con la IA",
    steps: [
      "Tocá el \"+\" y adjuntá tu documento de Word (.docx).",
      "Si hace falta, pedile: \"corregí la ortografía y dale un formato prolijo\".",
      "Pedile: \"convertilo a PDF\" y descargá el archivo que te da.",
      "Abrilo y revisalo antes de usarlo: el diseño puede cambiar un poco.",
    ],
    media: {
      id: "c3-pdf",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: un documento .docx adjuntado y el PDF listo para descargar en la respuesta.",
    },
  },
  {
    type: "content",
    kicker: "Plan B",
    title: "Si la IA no puede hacer el PDF",
    rows: [
      { h: "En Word", d: "Archivo → Guardar como → elegí PDF." },
      { h: "En el celular", d: "abrí el documento → Compartir o Imprimir → Guardar como PDF." },
      { h: "En Google Docs", d: "Archivo → Descargar → Documento PDF." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 5 · Tu tabla",
    instructions:
      "Pedile una tabla para algo tuyo: los gastos del mes, las tareas de la semana o una lista de compras por sector.\n\nDespués llevátela: copiala a tus notas o pedile el archivo para descargar.",
  },
  {
    type: "practice",
    title: "Tarea 6 · De Word a PDF",
    instructions:
      "Si tenés un documento de Word en el celular o la computadora (sin datos personales), adjuntalo y pedile que lo pase en limpio y lo convierta a PDF.\n\nSi no tenés ninguno, pedile que te escriba una nota corta y te la dé como PDF. Abrí el archivo y revisalo.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar el archivo sin abrirlo: puede haber cambiado el formato o un número." },
      { h: "Recomendación", d: "abrilo y revisalo antes de mandarlo o imprimirlo." },
      { h: "Si la tabla suma", d: "pedile que muestre la cuenta y chequeala con la calculadora." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál pedido es mejor para organizar las tareas de la casa?",
    options: [
      { text: "\"Organizame la semana.\"", correct: false },
      { text: "\"Armame una tabla de lunes a domingo con día, tarea y quién la hace. Somos tres en casa.\"", correct: true },
      { text: "\"Hacé una tabla.\"", correct: false },
    ],
    explanation: "Dice qué tabla, qué columnas y los datos reales. Las otras dejan todo para que la IA adivine.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te dio tu presupuesto como PDF para descargar. ¿Qué revisás antes de mandarlo?",
    options: [
      { text: "Lo abro y reviso montos, cuentas y formato.", correct: true },
      { text: "Nada: si lo hizo la IA, está perfecto.", correct: false },
      { text: "Solo el nombre del archivo.", correct: false },
    ],
    explanation: "Al convertir puede cambiar el formato o un número, y las cuentas se chequean con la calculadora.",
  },

  // ===================== BLOQUE 4: MEMORIA E INSTRUCCIONES =====================
  { type: "divider", badge: "BLOQUE 4 · 15 MIN", title: "Memoria e instrucciones", subtitle: "Que te conozca, sin repetirle todo" },
  {
    type: "concept",
    kicker: "Que te conozca",
    title: "Decírselo una sola vez",
    body: "Las tres IA pueden recordar cosas tuyas entre un chat y otro, o seguir instrucciones fijas: quién sos, a qué te dedicás, cómo querés que te hable. Así no tenés que repetirlo cada vez que le pedís algo.",
    analogy: "Es como un empleado que ya te conoce: no hace falta explicarle todo cada mañana.",
  },
  {
    type: "content",
    kicker: "Dónde se configura",
    title: "En cada una de las tres",
    rows: [
      { h: "ChatGPT", d: "Configuración → Personalización: instrucciones y memoria." },
      { h: "Claude", d: "Configuración → Perfil (tus preferencias), y los Proyectos, con instrucciones fijas." },
      { h: "Gemini", d: "Configuración → Información guardada, y los Gems (asistentes con instrucciones)." },
      { h: "Si no lo encontrás", d: "los menús cambian con las actualizaciones: buscá \"personalización\" o \"memoria\"." },
    ],
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Tus instrucciones",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Me llamo [tu nombre]. Me dedico a [tu trabajo]. Vivo en [tu ciudad]. Hablame [simple y sin palabras técnicas / con frases cortas]. Cuando te pida textos, usá un tono [cercano / formal].\"",
    caption: "Se pega una sola vez en la configuración, y vale para todos los chats nuevos.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Qué no contarle",
    rows: [
      { h: "Nada sensible", d: "ni DNI, ni claves, ni datos de salud o de cuentas bancarias." },
      { h: "Revisalo cada tanto", d: "podés ver, editar y borrar lo que recuerda, desde la misma configuración." },
      { h: "Si no querés que recuerde", d: "usá un chat temporal o incógnito, o desactivá la memoria." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 7 · Contale quién sos",
    instructions:
      "Entrá a la configuración de tu IA y cargá tus instrucciones con la plantilla.\n\nDespués abrí un chat nuevo y pedile algo, por ejemplo: \"Escribime un saludo para mis clientes\". Fijate si ya te tiene en cuenta.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Conviene guardar en la memoria de la IA tu DNI y tus claves, así no tenés que buscarlos.",
    options: FALSO,
    explanation: "En la memoria va quién sos y cómo querés que te hable. Nada sensible: ni DNI, ni claves, ni datos de salud.",
  },

  // ===================== BLOQUE 5: CREAR IMÁGENES =====================
  { type: "divider", badge: "BLOQUE 5 · 30 MIN", title: "Crear imágenes", subtitle: "Tu caricatura o tu logo, con una foto y con tu voz" },
  {
    type: "concept",
    kicker: "Imágenes a pedido",
    title: "Un ilustrador en el bolsillo",
    body: "ChatGPT y Gemini crean imágenes a partir de lo que les pedís: una tarjeta, un cartel, un logo, una caricatura. Hasta pueden partir de una foto tuya. Claude no crea imágenes: es muy bueno con textos, pero para esto usá las otras dos.",
    analogy: "Es como encargarle un dibujo a un ilustrador muy rápido: cuanto mejor le describís lo que querés, mejor sale.",
  },
  {
    type: "content",
    kicker: "La receta",
    title: "Qué decirle para una imagen",
    rows: [
      { h: "Qué es", d: "un logo, una invitación, una caricatura, un cartel." },
      { h: "Qué tiene que aparecer", d: "personas, objetos, el nombre de tu emprendimiento, un texto corto." },
      { h: "Los colores", d: "\"verde y blanco\", \"colores cálidos\", los de tu marca." },
      { h: "El estilo (el \"tipo\")", d: "cómo se ve: minimalista, futurista, caricatura, acuarela..." },
    ],
  },
  {
    type: "concept",
    kicker: "Qué es el \"tipo\" de imagen",
    title: "El mismo dibujo, cuatro estilos",
    body: "Pedimos \"una taza de café\". Minimalista: dos líneas y un círculo, un solo color. Futurista: una taza de metal con luces de neón. Caricatura: una taza con cara sonriente y ojos grandes. Acuarela: una taza pintada a mano, con manchas suaves.",
    media: {
      id: "c3-estilos",
      kind: "IMAGEN",
      caption: "Galería: la misma imagen (una taza de café) en 4 estilos — minimalista, futurista, caricatura y acuarela. Cargar las 4 en este lugar.",
    },
  },
  {
    type: "content",
    kicker: "Más estilos para probar",
    title: "Otros \"tipos\" que funcionan bien",
    rows: [
      { h: "Retro", d: "como un afiche de los años 70 u 80." },
      { h: "Realista", d: "parece una foto de verdad." },
      { h: "Dibujo animado", d: "como una película para chicos, colores vivos." },
      { h: "Ilustración plana", d: "colores lisos, sin sombras, como los íconos del celular." },
    ],
  },
  {
    type: "steps",
    kicker: "La tarea grande, paso a paso",
    title: "Con tu foto y con tu voz",
    steps: [
      "Abrí ChatGPT o Gemini, tocá el \"+\" y elegí una foto tuya (de la galería o con la cámara).",
      "Tocá el micrófono y dictá el pedido: qué imagen, los colores y el estilo.",
      "Revisá el texto dictado, corregí lo que haga falta y tocá enviar.",
      "Si no te gusta, pedí un cambio: \"más colores\", \"menos exagerado\", \"fondo blanco\".",
    ],
    media: {
      id: "c3-caricatura",
      kind: "IMAGEN",
      caption: "Captura del celular: una foto adjuntada y el pedido dictado en el cuadro, antes de enviar.",
    },
  },
  {
    type: "quote",
    kicker: "Plantilla para dictar",
    title: "Tu caricatura",
    quoteLabel: "CON TU FOTO ADJUNTA, DICTÁ",
    quoteText:
      "\"Con esta foto mía, creá una caricatura [divertida / tierna / elegante] en estilo [dibujo animado / acuarela / futurista]. Colores [cuáles]. Fondo [liso / de mi trabajo / de mi ciudad]. Que se parezca a mí.\"",
    caption: "Si sale muy exagerada, pedí: \"que se parezca más a la foto\".",
  },
  {
    type: "quote",
    kicker: "Plantilla para dictar",
    title: "Tu logo",
    quoteLabel: "DICTÁ",
    quoteText:
      "\"Creá un logo para mi emprendimiento [nombre], que se dedica a [qué hace]. Estilo [minimalista / retro / moderno], colores [cuáles], fondo [blanco / liso]. Que se lea bien el nombre y que sirva para [redes / un cartel / tarjetas].\"",
    caption: "Revisá siempre que el nombre esté bien escrito: a veces cambia letras.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Cuidados y límites",
    rows: [
      { h: "Fotos de otros", d: "solo la tuya, o con permiso. Nunca de chicos sin permiso de su familia." },
      { h: "Tu cara viaja", d: "al mandar tu foto, queda en el servicio: si no te gusta la idea, hacé el logo." },
      { h: "Las letras", d: "a veces salen con errores: revisá que el texto esté bien escrito." },
      { h: "Límites", d: "la versión gratis deja crear pocas imágenes por día: si te avisa, probá más tarde." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 8 · La tarea grande: tu caricatura o tu logo",
    instructions:
      "Elegí: tu caricatura (con una foto tuya, de la cámara o de la galería) o el logo de tu emprendimiento.\n\nAbrí ChatGPT o Gemini y dictá el pedido con la plantilla: qué imagen, los colores y el estilo. Pedí al menos un ajuste hasta que te guste, y guardá la imagen.",
  },
  {
    type: "content",
    kicker: "Comparar las IA",
    title: "¿Cuál salió mejor?",
    rows: [
      { h: "El parecido", d: "¿se parece a vos, o a lo que pediste?" },
      { h: "Estilo y colores", d: "¿respetó lo que dictaste?" },
      { h: "Las letras", d: "¿el nombre está bien escrito?" },
      { h: "Para qué cada una", d: "imágenes: ChatGPT y Gemini. Textos: cualquiera de las tres." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 9 · La misma imagen en la otra IA",
    instructions:
      "Hacé el mismo pedido en la otra IA (si usaste ChatGPT, ahora Gemini, o al revés), con la misma foto o los mismos datos, y dictado.\n\nPoné las dos imágenes una al lado de la otra y elegí cuál te gusta más, y por qué.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Haceme un logo.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "El nombre, a qué se dedica, los colores y el estilo.", correct: true },
      { text: "Pedirlo por favor.", correct: false },
      { text: "Nada: la IA sabe lo que quiero.", correct: false },
    ],
    explanation: "Sin esos datos te da un logo genérico. Con nombre, rubro, colores y estilo, te da el tuyo.",
  },

  // ===================== CIERRE =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Cierre", subtitle: "Lo que te llevás de hoy" },
  {
    type: "content",
    kicker: "Para recordar",
    title: "Las claves de hoy",
    rows: [
      { h: "Los botones", d: "copiar, otra respuesta, editar, escuchar y compartir." },
      { h: "Buscar", d: "pedí los enlaces y chequeá la fuente." },
      { h: "Tablas y archivos", d: "pedí la tabla o el PDF, y abrilo antes de usarlo." },
      { h: "Memoria e imágenes", d: "contale quién sos una vez; para imágenes: qué, colores y estilo." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué tienen en común un buen pedido de búsqueda, de tabla y de imagen?",
    options: [
      { text: "Le das datos concretos y después revisás el resultado.", correct: true },
      { text: "Hay que pagar la versión completa.", correct: false },
      { text: "La IA decide todo por vos.", correct: false },
    ],
    explanation: "Datos concretos para pedir (qué, para quién, cómo) y revisar lo que te da: así funciona todo.",
  },
  {
    type: "practice",
    title: "Para hacer en casa · Tu semana",
    instructions:
      "Pedile a la IA que te organice la semana en una tabla (día, horario y actividad), teniendo en cuenta lo que le contaste en tus instrucciones.\n\nGuardala como PDF o copiala en tus notas.",
  },
  {
    type: "checkpoint",
    title: "Hoy te llevás...",
    items: [
      "Los botones que te ahorran tiempo: editar, otra respuesta, escuchar.",
      "Búsquedas con información de hoy y fuentes para chequear.",
      "Tablas y archivos para llevarte, incluido de Word a PDF.",
      "Tu caricatura o tu logo, hecho con tu foto y tu voz.",
    ],
  },
  {
    type: "divider",
    badge: "LA PRÓXIMA CLASE",
    title: "Clase 4: Automatizar y cuidarte",
    subtitle: "Tu agenda, tu Drive y tus recordatorios con IA, sin caer en estafas",
  },
];
