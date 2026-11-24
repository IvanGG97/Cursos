import type { Slide } from "@/content/types";

// Clase 1 de 2 — Creación de documentación con IA: "Escribir con IA" (capacitación interna,
// Municipalidad de Salta). Todo pasa adentro del chat: pedir bien, corregir conversando, no inventar,
// datos de vecinos entre [corchetes]. La clase 2 convierte esto en archivos (Word, PDF, Drive).
// Público: personal municipal de nivel intermedio (usa la compu todos los días), en la Sala de
// Capacitación, cada uno con su computadora.
// Con cuenta de Google: Gemini gratis. Sin cuenta de Google: Claude gratis con cualquier mail.
// Último recurso, sin ninguna cuenta: Gemini sin iniciar sesión (solo escribe texto).
// Criterio de los otros cursos: ejemplo resuelto + plantilla con [espacios] + tarea corta por tema,
// preguntas solo después del contenido, error común y recomendación en cada bloque.
// Hasta el 28/10/2026 era una sola clase: esa versión quedó guardada en el panel (versión 15) para los
// resultados de la clase en vivo de ese día.

const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const cdClase1Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Escribir con IA",
    subtitle: "Notas, memorandos, actas e informes con Gemini o Claude, pedidos bien y corregidos conversando",
    duracion: "Clase 1 de 2 · 2 horas",
  },
  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Entrar: Gemini con Google, o Claude con tu mail",
      "La receta de un buen pedido, y lo que no se pega",
      "La nota formal",
      "Memorando y acta",
      "Informe o proyecto",
      "Tu documento de la semana, y cierre",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 15 MIN", title: "Entrar a la IA", subtitle: "Gemini con tu cuenta de Google, o Claude con tu mail" },
  {
    type: "concept",
    kicker: "Hoy",
    title: "De la hoja en blanco al documento",
    body: "En dos clases vamos a usar la inteligencia artificial para escribir los documentos de todos los días: notas, memorandos, actas, informes y proyectos. Hoy: pedirle bien y corregir conversando. Mañana: convertirlo en un archivo de Word o PDF y guardarlo en tu Drive.",
    analogy: "Es como tener un asistente que escribe rápido: vos le dictás qué querés y después corregís lo que hizo antes de firmar.",
    media: {
      id: "cd-gemini-inicio",
      kind: "IMAGEN",
      caption: "Captura de la computadora: la pantalla de inicio de gemini.google.com, en castellano, con el cuadro para escribir.",
    },
  },
  {
    type: "steps",
    kicker: "Con cuenta de Google",
    title: "Entrar a Gemini",
    steps: [
      "Abrí el navegador en una ventana de incógnito (Ctrl + Shift + N).",
      "Entrá a gemini.google.com.",
      "Tocá \"Acceder\" arriba a la derecha y entrá con tu cuenta.",
      "Listo: el cuadro de abajo es donde escribís.",
    ],
    media: {
      id: "cd-acceder",
      kind: "IMAGEN",
      caption: "Captura de la computadora: gemini.google.com sin sesión, con el botón \"Acceder\" arriba a la derecha señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Sin cuenta de Google",
    title: "Entrar a Claude con tu mail",
    steps: [
      "En la ventana de incógnito, entrá a claude.ai.",
      "Escribí tu mail (Hotmail, Outlook, el del trabajo) y tocá \"Continuar con correo electrónico\".",
      "Abrí tu mail y tocá el enlace que te llega.",
      "Si te muestra un código, pegalo en Claude. La primera vez, completá tu nombre.",
    ],
    media: {
      id: "cd-claude-registro",
      kind: "IMAGEN",
      caption: "Captura de la computadora: la pantalla de ingreso de claude.ai, con el campo para el mail y \"Continuar con correo electrónico\" señalados.",
    },
  },
  {
    type: "content",
    kicker: "Compu compartida",
    title: "Cuidá tu cuenta en la sala",
    rows: [
      { h: "Incógnito", d: "al cerrar la ventana, se borra tu sesión de esta compu." },
      { h: "No guardes la contraseña", d: "si el navegador pregunta, elegí \"Nunca\"." },
      { h: "Al terminar", d: "cerrá la ventana de incógnito. Si no usaste incógnito: foto de perfil → \"Salir\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Vas a entrar a tu cuenta en una compu de la sala. ¿Qué conviene?",
    options: [
      { text: "Abrir una ventana de incógnito y cerrarla al terminar.", correct: true },
      { text: "Guardar la contraseña para la próxima.", correct: false },
      { text: "Dejar la sesión abierta para el que sigue.", correct: false },
    ],
    explanation: "La ventana de incógnito no guarda tu sesión: al cerrarla, tu cuenta queda fuera de esa compu.",
  },

  // ===================== BLOQUE 1: LA RECETA Y LO QUE NO SE PEGA =====================
  { type: "divider", badge: "BLOQUE 1 · 20 MIN", title: "La receta de un buen pedido", subtitle: "Lo que la IA necesita saber, y lo que nunca le pasás" },
  {
    type: "concept",
    kicker: "La clave",
    title: "La IA no sabe lo que vos sabés",
    body: "No conoce tu área, a quién le escribís ni los datos del caso. Si le pedís \"haceme una nota\", inventa todo. Si le das el contexto, te devuelve un documento casi listo.",
    analogy: "Es como pedirle algo a un compañero nuevo: si le explicás bien, lo hace bien a la primera.",
  },
  {
    type: "content",
    kicker: "La receta",
    title: "Cinco datos en cada pedido",
    rows: [
      { h: "Qué documento", d: "nota, memorando, acta, informe o proyecto." },
      { h: "De quién y para quién", d: "tu área y el cargo de quien lo recibe." },
      { h: "Para qué y con qué datos", d: "el motivo, las fechas, los números, lo que tiene que decir." },
      { h: "Cómo", d: "tono formal, largo (\"una página\", \"diez líneas\") y estructura." },
    ],
  },
  {
    type: "compare",
    kicker: "Mirá la diferencia",
    title: "Pedido flojo vs. pedido completo",
    leftLabel: "FLOJO",
    left: "\"Haceme una nota pidiendo sillas.\"",
    rightLabel: "COMPLETO",
    right: "\"Redactá una nota formal de la Dirección de [tu área] al Director de Compras, pidiendo 10 sillas para la sala de atención al público, porque las actuales están rotas. Tono formal, máximo 10 líneas, con lugar y fecha, y espacio para la firma.\"",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir en una línea y después corregir diez veces." },
      { h: "Recomendación", d: "dale los cinco datos de entrada: ganás tiempo." },
      { h: "Datos que falten", d: "pedile \"si falta algo, dejá [completar]\": así no inventa." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Haceme un informe.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "Para quién es, sobre qué, con qué datos y qué largo.", correct: true },
      { text: "Nada, la IA ya sabe lo que necesito.", correct: false },
      { text: "Que lo escriba en mayúsculas.", correct: false },
    ],
    explanation: "Sin contexto, la IA inventa. Los datos los ponés vos: tema, destinatario, números y formato.",
  },
  {
    type: "practice",
    title: "Tarea 1 · Arreglá un pedido flojo",
    instructions:
      "Este pedido está flojo: \"Haceme un memo por el horario.\"\n\nReescribilo con los cinco datos (qué documento, de quién y para quién, para qué y con qué datos, y cómo) con un caso de tu área. Mandá los dos y compará las respuestas.",
  },
  {
    type: "content",
    kicker: "Datos sensibles",
    title: "Lo que no se pega en la IA",
    rows: [
      { h: "Datos de vecinos", d: "nombres completos, DNI, domicilios, teléfonos." },
      { h: "Expedientes", d: "información reservada, sumarios, datos de salud." },
      { h: "Cómo hacerlo", d: "reemplazalos por [nombre], [DNI], [domicilio] y completalos en Word." },
    ],
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué información reemplazás por [corchetes]?",
    options: [
      { text: "El DNI de un vecino.", correct: true },
      { text: "El domicilio de un vecino.", correct: true },
      { text: "El nombre de tu área.", correct: false },
      { text: "El tema de la reunión.", correct: false },
    ],
    explanation: "Los datos de terceros van entre corchetes y se completan en Word.",
  },

  // ===================== BLOQUE 2: LA NOTA FORMAL =====================
  { type: "divider", badge: "BLOQUE 2 · 25 MIN", title: "La nota formal", subtitle: "Pedirla, revisarla y mejorarla conversando" },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Tu nota en un pedido",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Redactá una nota formal de [tu área] dirigida a [cargo y nombre], para [motivo]. Incluí lugar y fecha, referencia, saludo formal, [datos clave], cierre y espacio para la firma de [tu cargo]. Tono formal y claro, máximo [N] líneas.\"",
    caption: "Cambiá lo que está entre [corchetes] por tus datos y borrá los corchetes.",
  },
  {
    type: "steps",
    kicker: "Paso a paso",
    title: "Pedir la nota",
    steps: [
      "Hacé clic en el cuadro para escribir (en Gemini o en Claude).",
      "Pegá la plantilla y completá los [corchetes].",
      "Apretá Enter (o la flecha de enviar).",
      "Leé la nota de arriba a abajo antes de usarla.",
    ],
    media: {
      id: "cd-nota-pedido",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el pedido de una nota escrito en el cuadro de Gemini, con la flecha de enviar señalada.",
    },
  },
  {
    type: "content",
    kicker: "El resultado",
    title: "Qué revisar en la nota",
    rows: [
      { h: "Datos", d: "nombres, cargos, fechas y números: ¿son los tuyos?" },
      { h: "Inventos", d: "¿agregó algo que vos no dijiste? Sacalo." },
      { h: "Tono", d: "¿suena a una nota de la Municipalidad? ¿Es demasiado larga?" },
    ],
    media: {
      id: "cd-nota-resultado",
      kind: "IMAGEN",
      caption: "Captura de la computadora: la nota formal que respondió Gemini (lugar y fecha, referencia, cuerpo y firma).",
    },
  },
  {
    type: "content",
    kicker: "Conversar para mejorar",
    title: "No la reescribas: pedíselo",
    rows: [
      { h: "\"Más corta\"", d: "\"Dejala en 6 líneas, sin perder los datos.\"" },
      { h: "\"Agregá...\"", d: "\"Agregá que el pedido es urgente por la atención al público.\"" },
      { h: "\"Cambiá...\"", d: "\"El destinatario es la Subsecretaría de Compras, no el Director.\"" },
    ],
    media: {
      id: "cd-nota-mejorar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en el mismo chat, el pedido \"Dejala en 6 líneas\" y la nota corregida debajo.",
    },
  },
  {
    type: "practice",
    title: "Tarea 2 · Tu nota",
    instructions:
      "Con la plantilla, pedile a Gemini una nota real de tu trabajo (por ejemplo: pedir materiales, informar un cambio de horario o solicitar una reunión).\n\nDespués pedile al menos un cambio en el mismo chat: más corta, más formal o con un dato que falte.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "abrir un chat nuevo para cada corrección: pierde todo lo que ya sabía." },
      { h: "Recomendación", d: "corregí en el mismo chat, de a un cambio por vez." },
      { h: "Si no te gusta nada", d: "pedile \"escribila de nuevo, más simple\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "La nota salió muy larga. ¿Cómo seguís?",
    options: [
      { text: "En el mismo chat: \"dejala en 6 líneas, sin perder los datos\".", correct: true },
      { text: "Abro un chat nuevo y empiezo de cero.", correct: false },
      { text: "La mando igual.", correct: false },
    ],
    explanation: "En el mismo chat, Gemini ya tiene tus datos: solo le decís qué cambiar.",
  },

  // ===================== BLOQUE 3: MEMORANDO Y ACTA =====================
  { type: "divider", badge: "BLOQUE 3 · 25 MIN", title: "Memorando y acta", subtitle: "De una instrucción o de apuntes desordenados" },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Memorando interno",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Redactá un memorando interno de [tu área] para [destinatarios] sobre [tema]. Indicá qué se pide, desde cuándo y [plazo]. Formato: Para / De / Fecha / Asunto / Texto. Breve y claro.\"",
    caption: "Sirve para avisos internos: cambios de horario, pedidos a otra área, recordatorios.",
  },
  {
    type: "practice",
    title: "Tarea 3 · Tu memorando",
    instructions:
      "Con la plantilla, pedile un memorando real de tu área: un cambio de horario, un pedido a otra área o un recordatorio.\n\nDespués pedile un cambio en el mismo chat: más corto, o con otro plazo.",
  },
  {
    type: "concept",
    kicker: "Donde más tiempo ahorra",
    title: "Del apunte al acta",
    body: "Después de una reunión, los apuntes quedan desordenados: frases sueltas, nombres, tareas. Gemini los ordena en un acta formal con presentes, temas, acuerdos, responsables y plazos. Vos solo revisás.",
    analogy: "Es como darle tu cuaderno a alguien prolijo para que lo pase en limpio.",
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Acta a partir de tus apuntes",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Con estos apuntes de una reunión, armá un acta formal con: fecha, lugar, presentes, temas tratados, acuerdos, responsables y plazos. No inventes nada; si falta un dato, poné [completar]. Apuntes: [pegá tus apuntes]\"",
    caption: "\"No inventes nada\" es la parte más importante del pedido.",
  },
  {
    type: "content",
    kicker: "Así queda",
    title: "Apuntes sueltos → acta ordenada",
    rows: [
      { h: "Entrada", d: "\"reunión martes 10 hs, estaban Ana, Luis y Marta. Cambiar turnos de atención. Luis arma la planilla para el viernes.\"" },
      { h: "Salida", d: "acta con presentes, tema, acuerdo y responsable (Luis, viernes)." },
      { h: "Faltante", d: "si no dijiste el lugar, Gemini pone [completar]." },
    ],
    media: {
      id: "cd-acta",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Gemini, los apuntes pegados en el pedido y el acta ordenada que respondió (con [completar] donde falta un dato).",
    },
  },
  {
    type: "practice",
    title: "Tarea 4 · Tu acta",
    instructions:
      "Escribí 4 o 5 apuntes sueltos de una reunión (real o inventada): quiénes estaban, qué se habló y qué se acordó.\n\nPedile el acta con la plantilla. Revisá: ¿inventó algo? ¿Dejó [completar] donde faltaba un dato?",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "dar el acta por buena sin leerla: a veces agrega acuerdos que nadie tomó." },
      { h: "Recomendación", d: "compará el acta con tus apuntes, punto por punto." },
      { h: "Nombres", d: "revisá que estén bien escritos y con el cargo correcto." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué frase evita que Gemini invente datos en el acta?",
    options: [
      { text: "\"No inventes nada; si falta un dato, poné [completar]\".", correct: true },
      { text: "\"Hacelo rápido\".", correct: false },
      { text: "\"Usá muchas palabras\".", correct: false },
    ],
    explanation: "Si le avisás qué hacer cuando falta un dato, deja el espacio marcado en vez de inventar.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si los apuntes no dicen el lugar de la reunión, está bien que la IA lo invente.",
    options: FALSO,
    explanation: "Un acta es un documento formal: lo que falta se completa con el dato real, no con uno inventado.",
  },

  // ===================== BLOQUE 4: INFORME O PROYECTO =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Informe o proyecto", subtitle: "Datos sueltos, tablas y proyectos" },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Informe con tabla",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Armá un informe sobre [tema] para [destinatario] con estos datos: [datos]. Estructura: introducción, desarrollo con una tabla de [columnas], conclusiones y próximos pasos. Tono formal, máximo una página.\"",
    caption: "Los números los ponés vos: la IA ordena, no averigua.",
  },
  {
    type: "content",
    kicker: "El resultado",
    title: "Un informe con su tabla",
    rows: [
      { h: "La tabla", d: "ordena tus datos en filas y columnas." },
      { h: "Las cuentas", d: "si suma o saca porcentajes, revisalos con la calculadora." },
      { h: "A Hojas de cálculo", d: "con cuenta: tocá los tres puntos de abajo de la tabla → \"Exportar a Hojas de cálculo\"." },
    ],
    media: {
      id: "cd-informe-tabla",
      kind: "IMAGEN",
      caption: "Captura de la computadora: un informe de Gemini con una tabla, y el menú de los tres puntos de abajo de la tabla abierto, con \"Exportar a Hojas de cálculo\" señalado.",
    },
  },
  {
    type: "content",
    kicker: "Para un proyecto",
    title: "Pedile la estructura primero",
    rows: [
      { h: "Paso 1", d: "\"Armá el índice de un proyecto para [objetivo] en [tu área]\"." },
      { h: "Paso 2", d: "completá cada parte con tus datos: fundamentación, objetivos, actividades." },
      { h: "Paso 3", d: "\"Sumá un cronograma en tabla y los recursos necesarios\"." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 5 · Tu informe",
    instructions:
      "Pedile un informe con la plantilla y estos datos de ejemplo (o los tuyos): atenciones al público por mes — julio 420, agosto 515, septiembre 610.\n\nPedí una tabla y una conclusión. Revisá las cuentas: ¿cuánto creció de julio a septiembre?",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedirle datos que no tiene: \"¿cuántos vecinos atendimos?\". No lo sabe." },
      { h: "Recomendación", d: "pegale los datos vos y pedile que los ordene y explique." },
      { h: "Normas y números", d: "si cita una ordenanza o un decreto, chequealo: puede inventar el número." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "El informe dice que la atención creció 45%. ¿Qué hacés?",
    options: [
      { text: "Lo reviso con la calculadora antes de usarlo.", correct: true },
      { text: "Lo dejo: la IA no se equivoca en cuentas.", correct: false },
      { text: "Le saco la tabla al informe.", correct: false },
    ],
    explanation: "Con 420 y 610 el crecimiento es de 45%. Esta vez acertó, pero las cuentas se revisan siempre.",
  },

  // ===================== BLOQUE 5: TU DOCUMENTO DE LA SEMANA Y CIERRE =====================
  { type: "divider", badge: "BLOQUE 5 · 15 MIN", title: "Tu documento de la semana", subtitle: "Uno real, de principio a fin, y el cierre" },
  {
    type: "practice",
    title: "Tarea 6 · Tu documento de la semana",
    instructions:
      "Pensá un documento que tengas que escribir esta semana: una nota, un memorando, un acta o un informe.\n\n1. Armá el pedido con los cinco datos (los datos de vecinos, entre [corchetes]).\n2. Pedile dos mejoras en el mismo chat.\n3. Revisalo como si lo fueras a firmar.\n\nMañana lo convertimos en un archivo.",
  },
  {
    type: "content",
    kicker: "Antes de firmar",
    title: "Lo que siempre revisás",
    rows: [
      { h: "Datos y cuentas", d: "fechas, montos, porcentajes y nombres." },
      { h: "Normas citadas", d: "números de ordenanzas, decretos o resoluciones: puede inventarlos." },
      { h: "La firma es tuya", d: "la IA ayuda a escribir, pero quien firma responde por el documento." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA escribió la nota, la responsabilidad de lo que dice es de la IA.",
    options: FALSO,
    explanation: "La IA arma el borrador; quien lo revisa y lo firma es responsable del contenido.",
  },
  {
    type: "content",
    kicker: "Tu kit",
    title: "Las plantillas de hoy",
    rows: [
      { h: "Nota", d: "área, destinatario, motivo, datos, tono y largo." },
      { h: "Memorando", d: "Para / De / Fecha / Asunto / Texto." },
      { h: "Acta", d: "apuntes + \"no inventes nada; si falta, poné [completar]\"." },
      { h: "Informe", d: "tus datos + tabla + conclusiones; las cuentas, revisadas." },
    ],
  },
  {
    type: "checkpoint",
    title: "Te llevás",
    items: [
      "Dale los cinco datos: qué, de quién, para quién, para qué y cómo.",
      "Corregí en el mismo chat, de a un cambio por vez.",
      "Pedile que no invente: si falta un dato, que ponga [completar].",
      "Los datos de vecinos, siempre entre [corchetes].",
    ],
  },
  {
    type: "content",
    kicker: "Para mañana",
    title: "Qué traer a la clase 2",
    rows: [
      { h: "Apuntes", d: "de una reunión real, sin nombres de vecinos ni DNI: los vamos a pasar a un acta." },
      { h: "Un Word tuyo", d: "una nota o un informe viejo, para modificarlo con la IA." },
      { h: "Tu cuenta", d: "la contraseña de tu cuenta de Google, o el mail que usaste en Claude." },
    ],
  },
  {
    type: "practice",
    title: "Antes de irte",
    instructions:
      "Guardá en tus notas las plantillas de hoy, y el texto de tu documento de la semana (o mandátelo por mail): mañana lo usamos.\n\nCerrá la ventana de incógnito para salir de tu cuenta en esta compu.",
  },
];
