import type { Slide } from "@/content/types";

// Clase 4 — Automatizar y cuidarte (v2, rearmada con Ivan). Cierra el curso.
// De que la IA responda a que la IA haga: conectada a las apps de Google (Claude y Gemini, también
// en la versión gratis), agenda eventos, guarda archivos en Drive y deja recordatorios; ChatGPT
// gratis no se conecta con Google, pero tiene tareas programadas que avisan solas.
// Después: estafas (ronda "¿Estafa o no?") y cuidados al conectar. Quienes no tienen cuenta de
// Google hacen la parte de ChatGPT. Criterio de las clases 2 y 3: ejemplo general + plantilla +
// tarea corta. Los nombres de los menús cambian con las actualizaciones: se dice dónde buscar.
// Sin ganchos a otros cursos (usar Gmail, Drive o Calendar no es hacer referencia a ninguno).

const ESTAFA = [
  { text: "Es estafa", correct: true },
  { text: "Parece legítimo", correct: false },
];
const LEGITIMO = [
  { text: "Es estafa", correct: false },
  { text: "Parece legítimo", correct: true },
];

export const clase4Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 4 — Automatizar y cuidarte",
    subtitle: "La IA trabajando con tu agenda, tu Drive y tus recordatorios, sin caer en estafas",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso y qué es automatizar",
      "Conectar la IA con tus apps",
      "Tu agenda y tus archivos, desde el chat",
      "Recordatorios que te avisan",
      "Menú de automatizaciones: armá las tuyas",
      "Estafas, permisos y cierre del curso",
    ],
  },

  // ===================== APERTURA Y QUÉ ES AUTOMATIZAR =====================
  { type: "divider", badge: "APERTURA · 15 MIN", title: "Repaso y qué es automatizar", subtitle: "De que la IA te responda a que la IA haga cosas por vos" },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo que vimos la clase pasada",
    rows: [
      { h: "Los botones", d: "copiar, otra respuesta, editar tu pedido, escuchar en voz alta." },
      { h: "Buscar en internet", d: "con los enlaces, para chequear de dónde salió cada dato." },
      { h: "Tablas y archivos", d: "pedir la tabla o el PDF, y abrirlo antes de usarlo." },
      { h: "Memoria e imágenes", d: "contarle una vez quién sos; imágenes con qué, colores y estilo." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te dio un horario, pero no te mostró de dónde lo sacó. ¿Cómo seguís?",
    options: [
      { text: "Le pido que lo busque en internet con el enlace, y lo chequeo.", correct: true },
      { text: "Lo doy por bueno: lo dijo la IA.", correct: false },
      { text: "Le pido otra respuesta hasta que me guste.", correct: false },
    ],
    explanation: "Sin fuente no se puede chequear. Con el enlace, lo comprobás en un minuto.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Haceme una invitación.\" ¿Qué le falta a este pedido para una imagen?",
    options: [
      { text: "Para qué es, qué tiene que decir, los colores y el estilo.", correct: true },
      { text: "Pedirlo con más educación.", correct: false },
      { text: "Nada: la IA sabe lo que quiero.", correct: false },
    ],
    explanation: "La receta de una imagen: qué es, qué aparece, los colores y el estilo.",
  },
  {
    type: "concept",
    kicker: "Qué es automatizar",
    title: "Explicarlo una vez, y que se haga solo",
    body: "Automatizar es explicar una vez lo que querés, para que después se haga solo, o casi solo, sin que tengas que hacerlo a mano cada vez.",
    analogy: "Es como el débito automático: autorizás una sola vez y la luz se paga sola todos los meses. No tenés que acordarte, pero sí revisás el resumen.",
  },
  {
    type: "content",
    kicker: "Sin darte cuenta",
    title: "Ya automatizás cosas",
    rows: [
      { h: "La alarma del celular", d: "la ponés una vez y suena todos los días." },
      { h: "El débito automático", d: "se paga solo cada mes." },
      { h: "El lavarropas programado", d: "elegís el lavado y termina solo." },
      { h: "Los avisos de cumpleaños", d: "el celular te recuerda la fecha cada año." },
    ],
  },
  {
    type: "content",
    kicker: "La idea de hoy",
    title: "Tres niveles de la IA",
    rows: [
      { h: "Nivel 1 · Te responde", d: "le preguntás y te contesta: lo que hicimos en las clases 1, 2 y 3." },
      { h: "Nivel 2 · Hace cosas por vos", d: "conectada a tus apps, cuando se lo pedís guarda el archivo en tu Drive o agenda el evento." },
      { h: "Nivel 3 · Te avisa sola", d: "un recordatorio llega el día que elegiste, sin que vuelvas a pedírselo." },
    ],
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Qué conviene automatizar, y qué no",
    rows: [
      { h: "Sí", d: "lo repetitivo (los pagos del mes), lo que se te olvida (cumpleaños) y lo que tiene fecha (turnos, trámites)." },
      { h: "No", d: "lo que necesita tu decisión: pagar, transferir plata, mandar un correo importante sin leerlo." },
      { h: "Con hora exacta, no", d: "la medicación va con la alarma del celular." },
      { h: "Regla de oro", d: "automatizar no es desentenderse: revisás lo que hizo, como el resumen del débito." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estas es una automatización?",
    options: [
      { text: "El débito automático de la luz.", correct: true },
      { text: "Pagar la luz en la ventanilla cada mes.", correct: false },
      { text: "Anotar los vencimientos en un papel.", correct: false },
    ],
    explanation: "Lo autorizás una vez y se hace solo todos los meses. Lo otro lo hacés a mano cada vez.",
  },

  // ===================== BLOQUE 1: CONECTAR LA IA CON TUS APPS =====================
  { type: "divider", badge: "BLOQUE 1 · 15 MIN", title: "Conectar la IA con tus apps", subtitle: "Darle permiso para usar tu agenda, tu Drive y tu correo" },
  {
    type: "concept",
    kicker: "Conectar",
    title: "Darle una llave, no la casa",
    body: "Claude y Gemini se pueden conectar con tus apps de Google: el Calendario, el Drive y el Gmail. Al conectarlas, le das permiso para usarlas cuando vos se lo pidas en el chat. También en la versión gratis. ChatGPT gratis no se conecta con Google, pero te avisa con recordatorios.",
    analogy: "Es como dejarle la llave del depósito a un ayudante de confianza: puede guardar y buscar cosas cuando le pedís, y la llave se la podés sacar cuando quieras.",
  },
  {
    type: "steps",
    kicker: "En Claude",
    title: "Conectar tus apps de Google",
    steps: [
      "Entrá a Configuración y buscá \"Conectores\" (también aparece en el \"+\" del chat).",
      "Elegí Google Calendar, Google Drive o Gmail y tocá \"Conectar\".",
      "Elegí tu cuenta de Google y tocá \"Permitir\".",
      "Volvé al chat y probá: \"¿Qué tengo en mi calendario esta semana?\".",
    ],
    media: {
      id: "c4-conectar",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: la pantalla de Conectores de Claude, con Google Calendar, Drive y Gmail.",
    },
  },
  {
    type: "content",
    kicker: "En Gemini",
    title: "Las apps conectadas",
    rows: [
      { h: "Dónde", d: "Configuración → Apps (o \"Apps conectadas\")." },
      { h: "Qué activar", d: "Google Calendar, Drive, Gmail y Keep (para notas y listas)." },
      { h: "Cómo probar", d: "\"¿Qué tengo en mi calendario el viernes?\". Si no responde, revisá que esté activada." },
      { h: "Si no aparece", d: "depende del país, del idioma y del celular: actualizá la app." },
    ],
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Antes y después de conectar",
    rows: [
      { h: "Leé qué permiso das", d: "la pantalla de Google te dice qué va a poder ver y hacer." },
      { h: "Siempre con tu aprobación", d: "para mandar un correo o borrar algo, la IA te pide confirmación: leelo antes de aceptar." },
      { h: "Se puede desconectar", d: "desde la misma configuración, cuando quieras." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 1 · Conectá tu agenda",
    instructions:
      "En Claude o en Gemini, conectá tu Google Calendar (y si querés, tu Drive). Después preguntale: \"¿Qué tengo en mi calendario esta semana?\".\n\nSi no tenés cuenta de Google, mirá cómo se hace: tu parte es con ChatGPT, en el bloque de recordatorios.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Conectaste la IA con tu Gmail y te propone mandar un correo. ¿Qué revisás antes de aceptar?",
    options: [
      { text: "Leo el correo entero: a quién va y qué dice.", correct: true },
      { text: "Nada: si lo escribió la IA, está bien.", correct: false },
      { text: "Solo que tenga buena ortografía.", correct: false },
    ],
    explanation: "La IA te pide confirmación justamente para eso: lo que se manda en tu nombre lo decidís vos.",
  },

  // ===================== BLOQUE 2: TU AGENDA DESDE EL CHAT =====================
  { type: "divider", badge: "BLOQUE 2 · 15 MIN", title: "Tu agenda desde el chat", subtitle: "Crear, consultar y mover eventos escribiendo o hablando" },
  {
    type: "concept",
    kicker: "Agenda",
    title: "Le pedís, y queda en tu calendario",
    body: "Con el calendario conectado, le pedís un turno, un cumpleaños o un vencimiento, y la IA crea el evento con el aviso que quieras. También le podés preguntar qué tenés en la semana, o pedirle que mueva o cancele algo. En Gemini, hasta se lo podés decir hablando, con el modo voz.",
    analogy: "Es como tener una secretaria: le decís \"anotame esto\" y lo encontrás en tu agenda.",
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Crear un evento",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Agendá [qué] el [día] a las [hora] en mi calendario, con un aviso [1 hora / 1 día] antes. En la descripción poné [lo que tenga que llevar o recordar].\"",
    caption: "También: \"¿Qué tengo esta semana?\", \"pasá el turno del jueves al viernes\" o \"cancelá...\".",
  },
  {
    type: "content",
    kicker: "Ideas para tu agenda",
    title: "Lo que más sirve",
    rows: [
      { h: "De la foto al calendario", d: "foto de una boleta o un turno: \"agendá el vencimiento con aviso 2 días antes\"." },
      { h: "El turno, preparado", d: "\"en la descripción poné estas preguntas para el médico: [tus preguntas]\"." },
      { h: "Los cumpleaños", d: "\"agendá el cumpleaños de [nombre] todos los años, con aviso el día antes\"." },
      { h: "La semana de un vistazo", d: "\"mirá mi calendario de esta semana y armame una tabla\"." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 2 · Tu primer evento desde el chat",
    instructions:
      "Pedile a la IA que agende algo real de tu semana con la plantilla: un turno, un pago, un cumpleaños. Probá dictarlo con el micrófono.\n\nAbrí tu Google Calendar y fijate que el evento esté, con el aviso.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "\"Anotame el dentista.\" ¿Qué le falta a este pedido?",
    options: [
      { text: "El día, la hora y cuánto antes querés el aviso.", correct: true },
      { text: "El nombre del dentista en mayúsculas.", correct: false },
      { text: "Nada: la IA sabe cuándo es.", correct: false },
    ],
    explanation: "Sin día ni hora no puede crear el evento. Y el aviso es lo que hace que no te olvides.",
  },

  // ===================== BLOQUE 3: ARCHIVOS QUE VAN SOLOS A TU DRIVE =====================
  { type: "divider", badge: "BLOQUE 3 · 15 MIN", title: "Archivos que van solos a tu Drive", subtitle: "Pedís el documento o la planilla, y queda guardado" },
  {
    type: "concept",
    kicker: "Tu Drive",
    title: "Del chat a tu Drive, sin descargar nada",
    body: "Con el Drive conectado, le pedís un documento o una planilla y lo guarda directamente en tu Drive: un presupuesto, los gastos del mes, un itinerario, tu lista de compras. Lo encontrás desde cualquier celular o computadora con tu cuenta.",
    analogy: "Es como pedirle a alguien que pase en limpio un papel y lo guarde en tu carpeta, en el cajón de siempre.",
  },
  {
    type: "content",
    kicker: "Cómo se hace",
    title: "En Claude y en Gemini",
    rows: [
      { h: "Claude", d: "con el Drive conectado y la creación de archivos activada, \"guardalo en mi Drive\" y queda ahí." },
      { h: "Gemini", d: "debajo de la respuesta, \"Exportar a Documentos\" (o a Hojas de cálculo): queda en tu Drive." },
      { h: "Para encontrarlo", d: "decile con qué nombre guardarlo: \"Gastos de octubre\", \"Presupuesto García\"." },
    ],
    media: {
      id: "c4-drive",
      kind: "IMAGEN",
      caption: "Captura: el archivo que creó la IA, ya guardado en Google Drive, con el nombre pedido.",
    },
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Un archivo a tu Drive",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Armá [un documento / una planilla] con [qué: mis gastos fijos, un presupuesto, mi lista de compras]. Columnas: [cuáles]. Guardalo en mi Drive con el nombre [nombre].\"",
    caption: "Ejemplo: \"Armá una planilla con mis gastos fijos (gasto, monto, vencimiento, pagado) y guardala en mi Drive como Gastos de octubre\".",
  },
  {
    type: "practice",
    title: "Tarea 3 · Un archivo a tu Drive",
    instructions:
      "Con la plantilla, pedile una planilla o un documento útil para vos (sin datos sensibles) y que lo guarde en tu Drive con un nombre.\n\nAbrí tu Drive y buscalo por ese nombre. Revisá que esté todo bien.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "La IA te guardó en el Drive la planilla de gastos del mes. ¿Qué revisás?",
    options: [
      { text: "Que estén todos los gastos y que las cuentas den bien.", correct: true },
      { text: "Nada: si la guardó la IA, está perfecta.", correct: false },
      { text: "Solo que tenga lindo diseño.", correct: false },
    ],
    explanation: "Automatizar no es desentenderse: los montos y las sumas se chequean.",
  },

  // ===================== BLOQUE 4: RECORDATORIOS QUE TE AVISAN =====================
  { type: "divider", badge: "BLOQUE 4 · 10 MIN", title: "Recordatorios que te avisan", subtitle: "El nivel 3: llega solo, el día que elegiste" },
  {
    type: "content",
    kicker: "Recordatorios",
    title: "Cómo te avisa cada una",
    rows: [
      { h: "ChatGPT", d: "\"recordame el martes a la mañana...\": te manda una notificación. No necesita Google." },
      { h: "Gemini", d: "\"recordame...\": lo guarda en tus tareas de Google y te avisa." },
      { h: "Claude", d: "crea un evento en tu calendario con aviso, y el aviso te llega del calendario." },
    ],
    media: {
      id: "c4-recordatorio",
      kind: "IMAGEN",
      caption: "Captura del celular: la notificación de un recordatorio de ChatGPT en la pantalla.",
    },
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Un recordatorio que se repite",
    quoteLabel: "COMPLETÁ LOS [ESPACIOS]",
    quoteText:
      "\"Recordame [qué] [el día y la hora / todos los lunes / todos los meses el día 10]. Cuando me avises, [agregá lo que quieras: dame 3 ideas, decime qué llevar].\"",
    caption: "ChatGPT gratis: hasta 3 recordatorios activos, como mucho uno por día y con horario aproximado.",
  },
  {
    type: "practice",
    title: "Tarea 4 · Tu primer recordatorio",
    instructions:
      "Pedile a ChatGPT (o a Gemini) un recordatorio real con la plantilla: un pago del mes, una idea para publicar cada lunes, regar las plantas.\n\nRevisá que tengas activadas las notificaciones de la app, para que el aviso te llegue.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Para qué NO conviene usar un recordatorio de ChatGPT gratis?",
    options: [
      { text: "Para tomar un remedio a una hora exacta.", correct: true },
      { text: "Para acordarte de pagar la luz este mes.", correct: false },
      { text: "Para que cada lunes te dé ideas para publicar.", correct: false },
    ],
    explanation: "En la versión gratis el horario es aproximado. Lo que necesita hora exacta, con la alarma del celular.",
  },

  // ===================== BLOQUE 5: MENÚ DE AUTOMATIZACIONES =====================
  { type: "divider", badge: "BLOQUE 5 · 20 MIN", title: "Menú de automatizaciones", subtitle: "Elegí 3 y armalas para tu vida" },
  {
    type: "content",
    kicker: "Menú · Agenda y trámites",
    title: "Con tu calendario",
    rows: [
      { h: "Vencimientos desde una foto", d: "boleta o notificación → evento con aviso 2 días antes." },
      { h: "Turno médico preparado", d: "el evento con tus preguntas para el médico en la descripción." },
      { h: "Trámites con requisitos", d: "\"buscá los requisitos oficiales de [trámite], con enlaces, y agendá un recordatorio\"." },
      { h: "Cumpleaños del año", d: "todos cargados, con aviso el día antes." },
    ],
  },
  {
    type: "content",
    kicker: "Menú · Tu Drive",
    title: "Archivos que quedan guardados",
    rows: [
      { h: "Gastos del mes", d: "una planilla en tu Drive que actualizás cada mes en el mismo chat." },
      { h: "De Word a PDF", d: "\"pasalo en limpio, convertilo a PDF y guardalo en mi Drive\"." },
      { h: "Presupuesto para un cliente", d: "con tus ítems y tus precios, en PDF, en tu Drive." },
      { h: "Itinerario de una salida", d: "buscado en internet, guardado en tu Drive y agendado." },
    ],
  },
  {
    type: "content",
    kicker: "Menú · Recordatorios (ChatGPT)",
    title: "Que te avisen solos",
    rows: [
      { h: "Pagos del mes", d: "\"todos los meses el día 10, recordame pagar [luz, agua, internet]\"." },
      { h: "Ideas para publicar", d: "\"todos los lunes, dame 3 ideas de publicaciones para mi [emprendimiento]\"." },
      { h: "Alerta de estafas", d: "\"todos los viernes, contame una estafa que esté circulando y cómo reconocerla\"." },
      { h: "Seguir practicando", d: "\"todas las mañanas, proponeme un pedido corto para practicar con la IA\"." },
    ],
  },
  {
    type: "content",
    kicker: "Menú · Correo (siempre lo mandás vos)",
    title: "Con tu Gmail",
    rows: [
      { h: "Borradores para clientes", d: "\"escribí en mi Gmail un borrador para [cliente] confirmando [qué]\"." },
      { h: "Resumen de lo importante", d: "\"resumime los correos de esta semana del [banco, escuela]: qué dicen y si tengo que hacer algo\"." },
      { h: "Segunda opinión", d: "\"revisá el último correo de [remitente] y decime si ves señales de estafa\"." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 5 · Armá tus 3 automatizaciones",
    instructions:
      "Elegí 3 del menú que te sirvan de verdad y armalas ahora, con tus datos. Si no tenés cuenta de Google, elegí 3 de recordatorios con ChatGPT.\n\nAl terminar, revisá cada una: el evento en tu calendario, el archivo en tu Drive o el recordatorio en ChatGPT.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Cuál de estas cosas conviene automatizar?",
    options: [
      { text: "El aviso de vencimiento de la luz, todos los meses.", correct: true },
      { text: "Transferir plata sin mirar el monto.", correct: false },
      { text: "Mandar correos importantes sin leerlos.", correct: false },
    ],
    explanation: "Lo repetitivo y con fecha, sí. Lo que necesita tu decisión (plata, correos importantes), no.",
  },

  // ===================== BLOQUE 6: ESTAFAS Y PERMISOS =====================
  { type: "divider", badge: "BLOQUE 6 · 20 MIN", title: "Cuidarte: estafas y permisos", subtitle: "Con IA, las estafas vienen mejor escritas" },
  {
    type: "concept",
    kicker: "Lo nuevo",
    title: "Estafas sin faltas de ortografía",
    body: "Con la IA, los estafadores escriben mensajes perfectos, imitan logos y hasta la voz de un familiar en un audio. Ya no alcanza con buscar errores: hay que mirar qué te piden y cómo te apuran.",
    analogy: "Es como un disfraz mejor hecho: ya no te fijás en el disfraz, te fijás en lo que te pide.",
  },
  {
    type: "content",
    kicker: "Señales de alerta",
    title: "Cómo reconocer una estafa",
    rows: [
      { h: "Te apuran", d: "\"en 30 minutos\", \"hoy se bloquea\", \"última oportunidad\": para que no pienses." },
      { h: "Te piden datos o plata", d: "claves, el código que te llegó por SMS, tu tarjeta, una transferencia o \"pagar el envío\"." },
      { h: "Links raros", d: "acortados, o con el nombre del banco mal escrito o con letras de más." },
      { h: "Números nuevos", d: "\"cambié de número, transferime\": un familiar que de repente necesita plata." },
    ],
  },
  {
    type: "content",
    kicker: "Qué hacer",
    title: "Tres hábitos que te protegen",
    rows: [
      { h: "Cortá y confirmá", d: "por el canal oficial: el número de tu tarjeta, la app del banco, el número de siempre del familiar." },
      { h: "Palabra clave familiar", d: "acordá una palabra con tu familia para confirmar que es la persona real cuando pide plata por audio." },
      { h: "La IA como segunda opinión", d: "sacale foto al mensaje (sin tus datos) y preguntale: \"¿qué señales de estafa ves acá?\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Estafa o no? SMS: \"Banco: detectamos un movimiento sospechoso. Ingresá en bit.ly/… en los próximos 30 minutos para evitar el bloqueo.\"",
    options: ESTAFA,
    explanation: "Urgencia + link acortado + bloqueo: estafa. Tu banco no te pide entrar por un link de un SMS.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Estafa o no? WhatsApp de un número desconocido: \"Hola mamá, cambié de número. Necesito que me transfieras hoy, después te explico.\"",
    options: ESTAFA,
    explanation: "Número nuevo + pedido de plata urgente: cortá y llamá al número de siempre (o usá la palabra clave familiar).",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Estafa o no? En la app oficial de tu banco, que abriste vos, aparece: \"Recordá: nunca te vamos a pedir tu clave por teléfono ni por mensaje.\"",
    options: LEGITIMO,
    explanation: "No te pide nada, no te apura y lo ves en la app que abriste vos: es un aviso legítimo (y un buen consejo).",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Estafa o no? \"¡Ganaste un celular nuevo! Para recibirlo, pagá solo el envío en este enlace.\"",
    options: ESTAFA,
    explanation: "Un premio que no pediste y que te pide pagar: estafa clásica.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Estafa o no? Te llama \"soporte técnico\" y te pide el código que te acaba de llegar por SMS \"para verificar tu cuenta\".",
    options: ESTAFA,
    explanation: "Ese código es la llave de tu cuenta: nunca se le dice a nadie, aunque diga ser del soporte.",
  },
  {
    type: "content",
    kicker: "Y tus apps conectadas",
    title: "Cuidados al automatizar",
    rows: [
      { h: "Revisá qué conectaste", d: "en la configuración de la IA ves todas las apps conectadas." },
      { h: "Desconectá lo que no uses", d: "si ya no lo necesitás, sacale el permiso." },
      { h: "Celular con bloqueo", d: "con tus apps conectadas, tu celular es la llave: ponele PIN o huella." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 6 · Segunda opinión y revisión",
    instructions:
      "Buscá en tu celular un mensaje que te haya parecido raro (o inventá uno). Sacale una captura, tapá tus datos y preguntale a la IA: \"¿Qué señales de estafa ves acá?\".\n\nDespués entrá a la configuración y mirá qué apps tenés conectadas. ¿Las usás todas?",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Te llega un audio con la voz de tu hijo pidiendo plata urgente a otra cuenta. ¿Qué hacés?",
    options: [
      { text: "Corto y lo llamo a su número de siempre, o le pido la palabra clave familiar.", correct: true },
      { text: "Transfiero rápido: es una urgencia.", correct: false },
      { text: "Le pregunto a la IA si la voz es real y, si dice que sí, transfiero.", correct: false },
    ],
    explanation: "Con IA se puede imitar una voz. Se confirma por otro canal, siempre.",
  },

  // ===================== CIERRE DEL CURSO =====================
  { type: "divider", badge: "CIERRE · 10 MIN", title: "Cierre del curso", subtitle: "Tu kit de IA y cómo seguir" },
  {
    type: "content",
    kicker: "Las 4 clases",
    title: "Todo lo que aprendiste",
    rows: [
      { h: "Clase 1", d: "qué es la IA, chats y contexto, alucinaciones y cómo pedir bien." },
      { h: "Clase 2", d: "ideas, tu voz, fotos y archivos, y mensajes con tu propia forma de escribir." },
      { h: "Clase 3", d: "botones, búsqueda con fuentes, tablas y archivos, memoria e imágenes." },
      { h: "Clase 4", d: "automatizar tu agenda, tu Drive y tus recordatorios, y cuidarte de estafas." },
    ],
  },
  {
    type: "practice",
    title: "Tarea 7 · Tu kit de IA",
    instructions:
      "Pedile a la IA: \"Armá un documento con mis plantillas favoritas del curso: [pegá o dictá las 5 que más usaste]. Guardalo en mi Drive con el nombre Mi kit de IA\".\n\nSin Google: pedíselo a ChatGPT y copialo en tus notas.",
  },
  {
    type: "content",
    kicker: "Para siempre",
    title: "Las reglas de oro del curso",
    rows: [
      { h: "Cuidá tus datos", d: "nunca claves, códigos, tarjetas ni DNI completo." },
      { h: "Pedí claro", d: "qué quiero, para qué es, cómo lo quiero, y tus datos reales." },
      { h: "Chequeá lo importante", d: "fechas, precios, trámites, salud y leyes: la fuente oficial o un profesional." },
      { h: "Vos decidís", d: "la IA te ayuda y automatiza; lo que importa lo revisás y lo decidís vos." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Después de este curso, ¿qué es la IA para vos?",
    options: [
      { text: "Una asistente que me ayuda y hace cosas por mí: yo pido bien, reviso y decido.", correct: true },
      { text: "Algo que decide todo por mí.", correct: false },
      { text: "Una fuente de datos que nunca se equivoca.", correct: false },
    ],
    explanation: "Ese es el objetivo del curso: la IA como asistente, nunca como reemplazo.",
  },
  {
    type: "checkpoint",
    title: "Del curso te llevás...",
    items: [
      "Saber pedirle bien a la IA, con tu voz, fotos y archivos.",
      "Buscar con fuentes, armar tablas, archivos e imágenes.",
      "Tu agenda, tu Drive y tus recordatorios, automatizados.",
      "Herramientas para cuidarte de estafas y cuidar tus datos.",
    ],
  },
  {
    type: "divider",
    badge: "FIN DEL CURSO",
    title: "¡Gracias por participar!",
    subtitle: "Contanos qué te pareció: la encuesta está en la página del curso",
  },
];
