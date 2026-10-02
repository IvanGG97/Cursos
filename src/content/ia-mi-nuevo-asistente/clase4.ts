import type { Slide } from "@/content/types";

// Clase 4 — Decisiones y cuidado digital. Bloques y tiempos según el resumen del curso (PDF).
// Mismas reglas que la Clase 1: contenido antes de cada quiz, ejemplos concretos, error común y
// recomendación en cada bloque. Cierra el curso: sin ganchos hacia otros cursos.

const VERDADERO = [
  { text: "Verdadero", correct: true },
  { text: "Falso", correct: false },
];
const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase4Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 4 — Decisiones y cuidado digital",
    subtitle: "Trámites, casa y bolsillo, y sentido crítico",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso de la Clase 3",
      "Decisiones importantes: trámites, médico y abogado",
      "Casa y bolsillo: facturas, contratos y recetas",
      "Cuidado y sentido crítico: contenido hecho con IA y estafas",
      "Repaso de todo el curso",
      "Cierre del curso",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 15 MIN", title: "Repaso de la Clase 3", subtitle: "Organización de la vida diaria" },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo que vimos la clase pasada",
    rows: [
      { h: "Listas y planes", d: "tus datos primero: cuántos son, tiempo, presupuesto y lo que no va." },
      { h: "Presupuestos", d: "la IA ordena y suma; los precios reales los ponés vos." },
      { h: "Cuentas", d: "paso a paso, y revisadas con la calculadora." },
      { h: "Comparar", d: "tus criterios antes de preguntar \"¿cuál me conviene?\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué tenés que darle a la IA antes de pedirle que compare dos opciones?",
    options: [
      { text: "Nada: ella ya sabe qué te conviene.", correct: false },
      { text: "Los datos de cada opción y tus criterios: presupuesto, prioridades y restricciones.", correct: true },
      { text: "Tu DNI, para que te conozca mejor.", correct: false },
    ],
    explanation: "Sin tus criterios, compara para \"cualquiera\". Con ellos, compara para vos.",
  },
  {
    type: "concept",
    kicker: "Hoy",
    title: "Decidir mejor, y cuidarte",
    body: "Hoy vemos lo más delicado: trámites, salud, temas legales, facturas y contratos. Y también la otra cara: cómo reconocer contenido hecho con IA y cómo no caer en estafas.",
    analogy: "La IA es una muy buena ayudante para prepararte. No es el médico, ni el abogado, ni el banco.",
  },

  // ===================== BLOQUE 1: DECISIONES IMPORTANTES =====================
  { type: "divider", badge: "BLOQUE 1 · 25 MIN", title: "Decisiones importantes", subtitle: "Prepararte bien, sin reemplazar al profesional" },
  {
    type: "concept",
    kicker: "Trámites",
    title: "Un trámite, paso a paso",
    body: "Los trámites asustan porque no sabemos por dónde empezar. La IA te ayuda a ordenarlos: qué pasos suelen tener, qué papeles conviene preparar y qué preguntar. Los requisitos exactos, turnos y costos se confirman en la web oficial del organismo.",
    analogy: "Es como pedirle a alguien que ya hizo el trámite que te cuente cómo fue: te orienta, pero las reglas de hoy las dice la oficina.",
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Pedir ayuda con un trámite",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Tengo que renovar el DNI de mi hija de 14 años. Explicame en pasos simples cómo suele ser el trámite, qué conviene llevar y qué tengo que confirmar en la web oficial antes de ir.\"",
    caption: "Fijate el final del pedido: también le pedís qué confirmar. Así no actuás sobre un dato inventado.",
  },
  {
    type: "concept",
    kicker: "Médico y abogado",
    title: "Llegar preparado a la consulta",
    body: "Antes de ir al médico o al abogado, la IA te ayuda a ordenar lo que te pasa, entender palabras que no conocés y armar la lista de preguntas. Así aprovechás mejor la consulta. Lo que nunca hace: diagnosticarte ni darte un dictamen legal válido.",
  },
  {
    type: "content",
    kicker: "Antes de la consulta",
    title: "Qué le podés pedir",
    rows: [
      { h: "Ordenar lo que te pasa", d: "\"ayudame a anotar desde cuándo me duele, cómo es y qué lo empeora\"." },
      { h: "Entender palabras", d: "qué significa un término de un estudio o de una carta documento." },
      { h: "Preparar preguntas", d: "\"¿qué le pregunto al abogado sobre mi contrato de alquiler?\"." },
      { h: "Llevarlo escrito", d: "en el celular o en papel, para no olvidarte nada en la consulta." },
    ],
  },
  {
    type: "compare",
    kicker: "La diferencia",
    title: "Reemplazar al médico vs. prepararte",
    leftLabel: "Reemplaza al médico",
    rightLabel: "Te prepara",
    left: "\"Me duele la cabeza hace 3 días. ¿Qué tengo y qué tomo?\" Y tomar lo que te diga.",
    right: "\"Me duele la cabeza hace 3 días. Ayudame a anotar los síntomas y armar preguntas para el médico.\"",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "tratar la respuesta como un diagnóstico o un dictamen legal válido." },
      { h: "Recomendación", d: "usarla para entender y preparar preguntas, nunca para reemplazar al profesional." },
      { h: "Urgencias", d: "ante un síntoma fuerte o una urgencia, no chatees: llamá al 911 o andá a la guardia." },
      { h: "Tus datos", d: "para preguntar no hace falta tu nombre, tu DNI ni tu número de afiliado." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA te dice qué enfermedad tenés, ya podés empezar el tratamiento que te recomienda.",
    options: FALSO,
    explanation: "La IA no diagnostica. Sirve para prepararte y armar preguntas; el diagnóstico y el tratamiento los da el médico.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Te llegó una carta documento y no entendés nada. ¿Cuál es el mejor uso de la IA?",
    options: [
      { text: "Que me diga qué contestar y mandarlo sin consultar a nadie.", correct: false },
      { text: "Que me explique en simple qué dice (sin mis datos) y me ayude a armar preguntas para un abogado.", correct: true },
      { text: "Ignorar la carta.", correct: false },
    ],
    explanation: "Entender y prepararte, sí. La respuesta a una carta documento, con un profesional.",
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué conviene confirmar en la web oficial?",
    options: [
      { text: "Los requisitos.", correct: true },
      { text: "El costo.", correct: true },
      { text: "Los turnos y horarios.", correct: true },
      { text: "Cómo ordenar tus papeles en una carpeta.", correct: false },
    ],
    explanation: "Requisitos, costos y turnos cambian y la IA los puede inventar. Ordenar tus papeles no depende de eso.",
  },

  // ===================== BLOQUE 2: CASA Y BOLSILLO =====================
  { type: "divider", badge: "BLOQUE 2 · 25 MIN", title: "Casa y bolsillo", subtitle: "Facturas, contratos y la heladera" },
  {
    type: "concept",
    kicker: "Facturas",
    title: "Entender una factura de servicios",
    body: "Las facturas de luz, gas o agua están llenas de siglas, cargos e impuestos. Podés sacarle una foto y pedirle a la IA que te explique cada parte: qué estás pagando, por qué subió y cuándo vence.",
    media: {
      id: "c4-factura",
      kind: "IMAGEN",
      caption: "Foto de una factura de servicios con los datos personales tapados (nombre, dirección, número de cliente).",
    },
  },
  {
    type: "content",
    kicker: "Antes de mandar la foto",
    title: "Tapá tus datos",
    rows: [
      { h: "Qué tapar", d: "nombre, dirección, número de cliente o de medidor, y el código de pago." },
      { h: "Cómo", d: "con el editor de fotos del celular: recortá o pintá encima." },
      { h: "Qué preguntar", d: "\"explicame cada cargo\" o \"¿por qué este mes pagué más que el anterior?\"." },
      { h: "Qué chequear", d: "el vencimiento y el monto, siempre en la factura misma." },
    ],
  },
  {
    type: "quote",
    kicker: "Contratos",
    title: "Un contrato de alquiler, en simple",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Te pego unas cláusulas de mi contrato de alquiler. Explicámelas en simple: cada cuánto aumenta, qué pasa si me voy antes y quién paga los arreglos. Marcame lo que convenga consultar con un abogado.\"",
    caption: "Pegá solo las cláusulas que importan, sin nombres ni DNI. La firma y las dudas serias, con un profesional.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar la factura o el contrato entero, con todos tus datos personales a la vista." },
      { h: "Recomendación", d: "pegá o fotografiá solo la parte que necesitás, con los datos tapados." },
      { h: "Recordá", d: "lo que te diga sobre leyes o aumentos puede tener errores: lo importante, con un profesional." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Antes de mandarle a la IA la foto de una factura, conviene tapar tu nombre, tu dirección y tu número de cliente.",
    options: VERDADERO,
    explanation: "Para explicarte la factura no necesita saber quién sos: tapá los datos personales.",
  },
  {
    type: "concept",
    kicker: "La heladera",
    title: "Recetas con lo que hay",
    body: "Abrís la heladera: medio zapallo, dos huevos, queso y arroz… y cero ideas. Escribile a la IA qué tenés y te propone recetas con eso, sin salir a comprar.",
    analogy: "Es como un libro de recetas que se lee al revés: no empieza por el plato, sino por lo que tenés.",
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Lo que hay en la heladera",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Tengo medio zapallo, 2 huevos, queso cremoso, arroz y una cebolla. Dame 3 recetas para la cena de 3 personas, de menos de 30 minutos y sin horno. Paso a paso y con cantidades.\"",
    caption: "El mismo truco de siempre: tus datos (qué hay, para cuántos, cuánto tiempo) y el formato.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué pedido de receta va a funcionar mejor?",
    options: [
      { text: "\"Pasame una receta.\"", correct: false },
      { text: "\"Tengo pollo, papas y morrón. Una receta para 2, al horno, en menos de una hora, paso a paso.\"", correct: true },
      { text: "\"¿Qué es lo más rico para cenar?\"", correct: false },
    ],
    explanation: "Dice qué hay, para cuántos, cómo cocinarlo, cuánto tiempo y el formato.",
  },
  {
    type: "practice",
    title: "Casa y bolsillo",
    instructions:
      "Elegí una de las dos:\n\nSacale una foto a una factura (con tus datos tapados) y pedile que te explique cada cargo.\n\nO escribile lo que tenés en tu heladera y pedile 2 recetas para hoy.",
  },

  // ===================== BLOQUE 3: CUIDADO Y SENTIDO CRÍTICO =====================
  { type: "divider", badge: "BLOQUE 3 · 25 MIN", title: "Cuidado y sentido crítico", subtitle: "Contenido hecho con IA y estafas" },
  {
    type: "concept",
    kicker: "Lo nuevo",
    title: "No todo lo que ves es real",
    body: "Hoy la IA puede crear fotos, videos, voces y textos que parecen reales. Se usa para cosas lindas, pero también para engañar: famosos falsos que venden productos, audios con la voz de un familiar, noticias inventadas.",
    media: {
      id: "c4-imagen-ia",
      kind: "IMAGEN",
      caption: "Imagen hecha con IA que tenga un error visible (manos, dedos o letras), para señalarlo con flechas y recuadros.",
    },
  },
  {
    type: "content",
    kicker: "Pistas",
    title: "Cómo detectar contenido hecho con IA",
    rows: [
      { h: "Imágenes", d: "manos y dedos raros, letras deformadas, piel demasiado perfecta, fondos sin sentido." },
      { h: "Videos", d: "la boca no coincide con lo que dice, parpadeos raros, voz sin respiración." },
      { h: "Textos", d: "muy genéricos, todo \"perfecto\" y sin datos concretos que se puedan chequear." },
      { h: "La mejor pista", d: "¿quién lo publica? Si no viene de una fuente confiable, dudá." },
    ],
  },
  {
    type: "content",
    kicker: "Ojo",
    title: "Las pistas cada vez fallan más",
    rows: [
      { h: "La IA mejora rápido", d: "lo que hoy delata una imagen falsa, mañana puede no estar." },
      { h: "Ningún detector es infalible", d: "ni siquiera las apps que dicen \"detectar IA\"." },
      { h: "Lo que sí funciona", d: "buscar la misma noticia en medios conocidos o en la fuente oficial." },
      { h: "Ante la duda", d: "no lo compartas: así no ayudás a que se difunda." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si una app dice que una imagen no fue hecha con IA, es seguro que es real.",
    options: FALSO,
    explanation: "Ningún detector es infalible. Lo que mejor funciona es fijarse quién lo publica y buscar la fuente.",
  },
  {
    type: "concept",
    kicker: "Estafas",
    title: "Los mensajes falsos del banco",
    body: "Es una de las estafas más comunes: un mensaje que parece de tu banco o de tu billetera virtual, avisando un problema urgente con tu cuenta, con un link o un número para \"solucionarlo\". Con IA, ahora vienen sin faltas de ortografía y hasta con la voz de alguien conocido.",
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Así se ve un mensaje falso",
    quoteLabel: "TE LLEGA POR WHATSAPP",
    quoteText:
      "\"Banco: detectamos un movimiento sospechoso en su cuenta. Para evitar el bloqueo, ingrese sus datos en el siguiente enlace en los próximos 30 minutos: bit.ly/...\"",
    caption: "Urgencia + link + pedido de datos: las tres señales juntas son una alarma.",
  },
  {
    type: "content",
    kicker: "Señales de alerta",
    title: "Cómo reconocer una estafa",
    rows: [
      { h: "Urgencia", d: "\"en 30 minutos\", \"hoy se bloquea\": te apuran para que no pienses." },
      { h: "Te piden datos", d: "claves, códigos que te llegan por SMS, número de tarjeta: tu banco no te los pide así." },
      { h: "Links raros", d: "acortados, o con el nombre del banco mal escrito o con letras de más." },
      { h: "Qué hacer", d: "no toques el link: llamá al número que figura en tu tarjeta o entrá a la app oficial." },
    ],
  },
  {
    type: "content",
    kicker: "Una ayuda",
    title: "La IA como segunda opinión",
    rows: [
      { h: "Pegale el mensaje sospechoso", d: "sin tus datos, y preguntale: \"¿qué señales de estafa ves acá?\"." },
      { h: "Te explica las señales", d: "urgencia, links raros, pedidos de datos." },
      { h: "No es la última palabra", d: "si te dice \"parece seguro\", igual confirmá por el canal oficial." },
      { h: "Con tu familia", d: "acuerden: si llega un audio pidiendo plata, se corta y se llama al número de siempre." },
    ],
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué delata una estafa?",
    options: [
      { text: "Te apura con un plazo muy corto.", correct: true },
      { text: "Te pide tu clave o un código que te llegó por SMS.", correct: true },
      { text: "Trae un link acortado o con el nombre del banco mal escrito.", correct: true },
      { text: "No trae ningún link y te dice que entres a la app oficial como siempre.", correct: false },
    ],
    explanation: "Urgencia, pedido de datos y links raros son las señales clásicas. Entrar a la app oficial es justamente lo seguro.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Te llega un audio con la voz de tu hijo pidiendo que le transfieras plata urgente a otra cuenta. ¿Qué hacés?",
    options: [
      { text: "Transfiero rápido: es una urgencia.", correct: false },
      { text: "Corto y lo llamo yo a su número de siempre para confirmar.", correct: true },
      { text: "Le pido a la IA que me diga si la voz es real, y si dice que sí, transfiero.", correct: false },
    ],
    explanation: "Con IA se puede imitar una voz. Se corta y se confirma llamando al número de siempre.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si le pegás a la IA un mensaje sospechoso y te dice que parece seguro, ya no hace falta confirmar nada.",
    options: FALSO,
    explanation: "La IA es una segunda opinión, no la última palabra: se confirma por el canal oficial.",
  },

  // ===================== BLOQUE 4: REPASO GENERAL =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Repaso general del curso", subtitle: "Tu caso de uso favorito" },
  {
    type: "content",
    kicker: "Las 4 clases",
    title: "Todo lo que vimos",
    rows: [
      { h: "Clase 1", d: "qué es la IA, chats y contexto, alucinaciones y cómo pedir bien." },
      { h: "Clase 2", d: "ideas, entender textos y comunicarte con tu propia voz." },
      { h: "Clase 3", d: "listas, planes, presupuestos y comparar con tus criterios." },
      { h: "Clase 4", d: "trámites y consultas, casa y bolsillo, y cuidado digital." },
    ],
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Cuáles de estas son reglas que vimos en el curso?",
    options: [
      { text: "Nunca cargar contraseñas ni datos sensibles.", correct: true },
      { text: "Chequear fechas, precios y trámites en la fuente oficial.", correct: true },
      { text: "Darle tus datos y criterios reales para que la respuesta te sirva.", correct: true },
      { text: "Hacer lo que diga la IA sin revisar.", correct: false },
    ],
    explanation: "Cuidar tus datos, chequear lo importante y pedir con tus datos reales. Revisar, siempre.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Lo mejor es tener un solo chat y usarlo para todo, así la IA se acuerda de todo.",
    options: FALSO,
    explanation: "Un chat por tema: si mezclás todo, la mesa de trabajo se llena y la IA confunde los temas.",
  },
  {
    type: "steps",
    kicker: "Actividad",
    title: "Tu caso de uso favorito",
    steps: [
      "Pensá en todo lo que probaste en el curso: ¿qué fue lo que más te sirvió?",
      "Escribí ese pedido de nuevo, mejorado con todo lo que aprendiste.",
      "Probalo en la IA y ajustalo hasta que la respuesta te sirva de verdad.",
      "Guardalo (en tus notas o en un proyecto) para usarlo cuando lo necesites.",
    ],
  },
  {
    type: "practice",
    title: "Compartí tu caso",
    instructions:
      "Contale al grupo tu caso de uso favorito: qué le pediste, cómo lo pediste y para qué te sirvió.\n\nAnotá los casos de tus compañeros que te puedan servir: son ideas probadas por gente como vos.",
  },

  // ===================== CIERRE DEL CURSO =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Cierre del curso", subtitle: "Y ahora, ¿cómo seguís?" },
  {
    type: "content",
    kicker: "Para siempre",
    title: "Las reglas de oro del curso",
    rows: [
      { h: "Cuidá tus datos", d: "nunca contraseñas, claves, tarjetas ni DNI completo." },
      { h: "Pedí claro", d: "qué quiero, para qué es, en qué tono o formato, y tus criterios." },
      { h: "Chequeá lo importante", d: "fechas, precios, trámites, salud y leyes: fuente oficial o profesional." },
      { h: "Vos decidís", d: "la IA es tu asistente, nunca tu reemplazo." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Después de este curso, ¿qué es la IA para vos?",
    options: [
      { text: "Algo que decide por mí.", correct: false },
      { text: "Una asistente que me ayuda: yo pido bien, reviso y decido.", correct: true },
      { text: "Una fuente de datos que nunca se equivoca.", correct: false },
    ],
    explanation: "Ese es el objetivo del curso: la IA como asistente, nunca como reemplazo.",
  },
  {
    type: "concept",
    kicker: "Reflexión final",
    title: "¿Cómo vas a seguir usándola?",
    body: "Pensá en una cosa concreta que vas a hacer con la IA esta semana — un mensaje, un menú, un trámite — y en otra que vas a hacer distinto a partir de hoy. La mejor forma de no olvidarte lo que aprendiste es usarlo.",
  },
  {
    type: "checkpoint",
    title: "Del curso te llevás...",
    items: [
      "Una cuenta y la confianza para usar la IA todos los días.",
      "La forma de pedir bien las cosas, con tus datos y criterios.",
      "Saber cuándo chequear y cuándo consultar a un profesional.",
      "Herramientas para cuidarte de estafas y contenido falso.",
    ],
  },
  {
    type: "divider",
    badge: "FIN DEL CURSO",
    title: "¡Gracias por participar!",
    subtitle: "Contanos qué te pareció: la encuesta está en la página del curso",
  },
];
