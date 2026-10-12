import type { Slide } from "@/content/types";

// Clase 1 — Gmail + Google Calendar.
// Porteado 1 a 1 desde el pptx "Día 1" (sin reescribir contenido). Los avisos "IDEA PARA GENIALLY" se
// sacaron; cada "imagen/GIF sugerido" quedó como lugar para subir desde Admin → curso → Imágenes (ids hg1-NN).

export const hgClase1Slides: Slide[] = [
  // slide 1 del pptx original
  {
    type: "title",
    claseLine: "Clase 1 — Gmail + Google Calendar",
    subtitle: "21 de septiembre · 14 a 16 hs · Teatro Municipal",
    duracion: "Clase de 2 horas",
  },
  // slide 2 del pptx original
  { type: "divider", badge: "GMAIL", title: "Gmail: tu correo, ordenado" },
  // slide 2 del pptx original
  {
    type: "agenda",
    items: [
      "Por qué Gmail es la base de todo lo demás",
      "Redactar, responder y organizar con etiquetas",
      "Adjuntar y buscar archivos",
      "Práctica rápida",
    ],
  },
  // slide 3 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Por qué Gmail es la base de todo",
    body: "Tu cuenta de Gmail es la misma que usás para Calendar, Drive, Docs y todo lo demás.\n\nOrdenar el mail te ahorra tiempo en todo lo que viene después.",
    media: {
      id: "hg1-03",
      kind: "IMAGEN",
      caption: "Foto de una persona revisando su correo en el celular, en un ambiente tranquilo.",
    },
  },
  // slide 4 del pptx original
  {
    type: "content",
    kicker: "Lo básico",
    title: "3 acciones que vas a usar siempre",
    rows: [
      { h: "Redactar", d: "Empezar un mail nuevo, de cero." },
      { h: "Responder", d: "Contestar dentro de la misma conversación, sin perder el hilo." },
      { h: "Reenviar", d: "Mandarle a otra persona un mail que ya recibiste." },
    ],
  },
  // slide 5 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Redactar tu primer mail",
    steps: [
      "Tocá \"Redactar\".",
      "En \"Para\", escribí el mail del destinatario.",
      "Completá el \"Asunto\" — que sea claro y corto.",
      "Escribí tu mensaje y tocá \"Enviar\".",
    ],
  },
  // slide 6 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Gmail borra tus mails viejos automáticamente después de un tiempo?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 7 del pptx original
  {
    type: "concept",
    kicker: "Para no perderte",
    title: "Organizar con etiquetas",
    body: "Una etiqueta es como una carpeta de color para agrupar mails relacionados.\n\nEj.: \"Trabajo\", \"Trámites\", \"Curso\" — vos elegís el criterio.",
    media: {
      id: "hg1-07",
      kind: "IMAGEN",
      caption: "Captura de la barra lateral de Gmail mostrando 3 o 4 etiquetas de colores distintos.",
    },
  },
  // slide 8 del pptx original
  {
    type: "content",
    kicker: "Más herramientas",
    title: "Adjuntar y buscar",
    rows: [
      { h: "Adjuntar un archivo", d: "El ícono del clip — sirve para mandar fotos, PDFs o documentos." },
      { h: "Buscar dentro del mail", d: "La lupa de arriba — buscá por remitente, palabra o asunto." },
    ],
  },
  // slide 9 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Cómo encontrás más rápido un mail viejo?",
    options: [
      { text: "Buscar por el nombre de quien lo mandó", correct: true },
      { text: "Borrar toda la bandeja de entrada", correct: false },
      { text: "Cambiar la contraseña", correct: false },
      { text: "Cerrar sesión y volver a entrar", correct: false },
    ],
  },
  // slide 10 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Practicá con un mail de prueba",
    steps: [
      "Enviate un mail a vos mismo con un archivo adjunto.",
      "Creá una etiqueta y aplicásela a ese mail.",
      "Buscalo usando la lupa para confirmar que aparece.",
    ],
    media: {
      id: "hg1-10",
      kind: "IMAGEN",
      caption: "Captura de un mail recién enviado, con un archivo adjunto y una etiqueta de color aplicada.",
    },
  },
  // slide 11 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu bandeja de entrada lista para organizar cualquier cosa que llegue.",
    body: "Ahora sí, vamos con Google Calendar.",
  },
  // slide 12 del pptx original
  { type: "divider", badge: "GOOGLE CALENDAR · PARTE 1", title: "Primeros pasos en Google Calendar" },
  // slide 12 del pptx original
  {
    type: "agenda",
    items: [
      "Por qué una agenda digital te cambia la semana",
      "Recorrido de la interfaz: día, semana y mes",
      "Crear tu primer evento, paso a paso",
      "Práctica: cargamos 3 eventos reales de tu semana",
    ],
  },
  // slide 13 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Bienvenida: ¿qué esperás de este curso?",
    body: "Ronda rápida: contá en una frase si usás agenda de papel, o si no usás ninguna.\n\nAl final de las 4 clases vamos a repasar si esto se cumplió.",
    media: {
      id: "hg1-13",
      kind: "IMAGEN",
      caption: "Foto de un grupo de personas adultas conversando de forma distendida en un aula o taller.",
    },
  },
  // slide 14 del pptx original
  {
    type: "concept",
    kicker: "Por qué importa",
    title: "Agenda de papel vs. agenda digital",
    body: "El papel se pierde, se moja, y no te avisa nada.\n\nCalendar se ve desde el celular y la PC al mismo tiempo, y te manda recordatorios solo.\n\nEs gratis: ya lo tenés si tenés una cuenta de Gmail.",
    media: {
      id: "hg1-14",
      kind: "IMAGEN",
      caption: "Foto comparativa: una agenda de papel arrugada al lado de un celular con Google Calendar abierto.",
    },
  },
  // slide 15 del pptx original
  {
    type: "content",
    kicker: "Parte 1",
    title: "Recorrido de la interfaz",
    rows: [
      { h: "Vista Día", d: "Mostrás las horas de un solo día, ideal para ver el detalle de la jornada." },
      { h: "Vista Semana", d: "La de uso diario: ves lunes a domingo de un vistazo." },
      { h: "Vista Mes", d: "Panorama general — perfecta para ver compromisos grandes del mes." },
    ],
  },
  // slide 16 del pptx original
  {
    type: "concept",
    kicker: "Así se ve",
    title: "La vista semanal de Google Calendar",
    body: "Así se ve tu semana una vez que tenés algunos eventos cargados: cada bloque de color es un compromiso distinto.",
    media: {
      id: "hg1-16",
      kind: "IMAGEN",
      caption: "Captura de pantalla real de la vista Semana de Google Calendar con 4 o 5 eventos de ejemplo cargados.",
    },
  },
  // slide 17 del pptx original
  {
    type: "content",
    kicker: "Checkpoint",
    title: "Repaso rápido antes de seguir",
    rows: [
      { h: "¿Qué vista uso para ver todo el mes de un vistazo?", d: "Vista Mes" },
      { h: "¿Necesito instalar algo para usar Calendar?", d: "No — ya viene con tu cuenta de Gmail" },
      { h: "¿Se pierde la información si se rompe el celular?", d: "No, queda guardada en tu cuenta de Google" },
    ],
  },
  // slide 18 del pptx original
  {
    type: "concept",
    kicker: "Ahora sí",
    title: "Crear tu primer evento: qué vas a lograr",
    body: "En los próximos minutos vas a cargar tu primer evento real.\n\nNo hace falta completar todos los campos — con título, fecha y hora ya alcanza.",
    media: {
      id: "hg1-18",
      kind: "GIF",
      caption: "GIF corto (2-3 segundos) mostrando cómo se toca un día vacío del Calendar y se abre el formulario de evento nuevo.",
    },
  },
  // slide 19 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Crear tu primer evento",
    steps: [
      "Tocá \"+ Crear\" (o el día y la hora en el celular).",
      "Escribí el título del evento. Ej.: \"Turno médico\".",
      "Definí fecha y hora de inicio y de fin.",
      "Agregá la ubicación — Calendar la reconoce sola.",
      "Sumá una descripción o nota si hace falta.",
      "Guardá. ¡Listo!",
    ],
  },
  // slide 20 del pptx original
  {
    type: "concept",
    kicker: "Resultado",
    title: "Así queda un evento ya cargado",
    body: "Título, hora y ubicación bien visibles — así se ve cuando tocás un evento ya guardado en tu Calendar.",
    media: {
      id: "hg1-20",
      kind: "IMAGEN",
      caption: "Captura de pantalla de un evento guardado y abierto, con título \"Turno médico\", hora y ubicación visibles.",
    },
  },
  // slide 21 del pptx original
  {
    type: "content",
    kicker: "Tips",
    title: "Para que no se te complique",
    rows: [
      { h: "Usá lo que tengas a mano", d: "Celular o computadora — el resultado es el mismo, se sincroniza solo." },
      { h: "No hace falta llenarlo todo", d: "Con título, fecha y hora alcanza para empezar." },
      { h: "Siempre podés editarlo después", d: "Nada queda \"fijo\" — tocás el evento y cambiás lo que haga falta." },
    ],
  },
  // slide 22 del pptx original
  {
    type: "concept",
    kicker: "Sin miedo",
    title: "3 mitos sobre Google Calendar",
    body: "\"Es complicado\" → en realidad son 6 pasos simples, ya los vimos.\n\n\"Puedo perder mis datos\" → queda guardado en la nube, no en el celular.\n\n\"Hay que pagar\" → es 100% gratis con tu cuenta de Gmail.",
    media: {
      id: "hg1-22",
      kind: "IMAGEN",
      caption: "Ilustración simple y amigable transmitiendo tranquilidad (ícono de candado + nube, o una persona sonriendo con el celular).",
    },
  },
  // slide 23 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Cargá 3 eventos reales de tu semana",
    steps: ["Un turno médico.", "Un cumpleaños.", "Un pago de servicio."],
    media: {
      id: "hg1-23",
      kind: "IMAGEN",
      caption: "Captura de ejemplo de una semana con 3 eventos de distintos colores ya cargados.",
    },
  },
  // slide 24 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre de la parte 1",
    items: [
      "Mi cuenta de Google Calendar está abierta y la reconozco.",
      "Sé cambiar entre vista Día, Semana y Mes.",
      "Cargué al menos 3 eventos reales con título, fecha y hora.",
    ],
  },
  // slide 25 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Evento", d: "Cualquier cosa que cargás en el Calendar: un turno, un cumpleaños, una tarea con hora." },
      { h: "Vista", d: "La forma en la que mirás tu calendario: por Día, Semana o Mes." },
      { h: "Sincronizar", d: "Que lo que cargás en el celular aparezca también en la computadora, automáticamente." },
    ],
  },
  // slide 26 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu calendario personal con eventos reales ya cargados.",
    body: "La próxima clase: recordatorios y eventos que se repiten solos.",
  },
  // slide 27 del pptx original
  { type: "divider", badge: "GOOGLE CALENDAR · PARTE 2", title: "Recordatorios y eventos que se repiten" },
  // slide 27 del pptx original
  {
    type: "agenda",
    items: [
      "Notificaciones: avisos antes de cada evento",
      "Eventos recurrentes (pagos, medicación, clases)",
      "Colores por categoría",
      "Práctica: armamos tu \"mes tipo\"",
    ],
  },
  // slide 28 del pptx original
  {
    type: "concept",
    kicker: "Repaso + hoy",
    title: "Notificaciones: nunca más un olvido",
    body: "Repaso relámpago: ¿cómo te fue cargando eventos esta semana?\n\nHoy le sumamos avisos para no depender más de la memoria.",
    media: {
      id: "hg1-28",
      kind: "IMAGEN",
      caption: "Foto de una persona mirando una notificación de recordatorio en la pantalla de su celular.",
    },
  },
  // slide 29 del pptx original
  {
    type: "content",
    kicker: "Parte 2",
    title: "Tipos de aviso",
    rows: [
      { h: "10 minutos antes", d: "Para salir justo a tiempo — turnos, reuniones cortas." },
      { h: "1 hora antes", d: "Te da margen para prepararte o terminar algo antes." },
      { h: "1 día antes", d: "Ideal para pagos, trámites o eventos que necesitan preparación." },
    ],
  },
  // slide 30 del pptx original
  {
    type: "concept",
    kicker: "Tip",
    title: "Podés combinar avisos",
    body: "En un mismo evento podés poner un aviso 1 día antes y otro 30 minutos antes — Calendar te avisa las dos veces.",
    media: {
      id: "hg1-30",
      kind: "IMAGEN",
      caption: "Captura de pantalla del menú de notificaciones de un evento, mostrando dos avisos configurados.",
    },
  },
  // slide 31 del pptx original
  {
    type: "content",
    kicker: "Checkpoint",
    title: "Repaso rápido: notificaciones",
    rows: [
      { h: "¿Puedo poner más de un aviso al mismo evento?", d: "Sí, las veces que quieras" },
      { h: "¿Qué aviso conviene para un pago importante?", d: "Uno de 1 día antes, para tener margen" },
      { h: "¿Dónde se configura el aviso?", d: "Al crear o editar el evento" },
    ],
  },
  // slide 32 del pptx original
  {
    type: "concept",
    kicker: "Se repiten solos",
    title: "Cargalo una vez, repetilo solo",
    body: "El pago del alquiler, la medicación diaria, la clase semanal: se cargan una sola vez.\n\nCalendar los repite automáticamente en la frecuencia que elijas.",
    media: {
      id: "hg1-32",
      kind: "IMAGEN",
      caption: "Captura del menú \"No se repite\" desplegado, mostrando las opciones diario/semanal/mensual.",
    },
  },
  // slide 33 del pptx original
  {
    type: "quote",
    kicker: "Ojo con esto",
    title: "Editar un evento recurrente",
    quoteLabel: "Dos opciones distintas",
    quoteText: "\"Editar este evento\" cambia solo esa fecha. \"Editar todos los eventos\" cambia toda la serie. Lo vemos en vivo con un ejemplo de cada caso para que no haya dudas.",
    caption: "Es la confusión más común al trabajar con recurrencias — por eso lo mostramos las dos veces antes de practicar.",
  },
  // slide 34 del pptx original
  {
    type: "content",
    kicker: "Ejemplos",
    title: "Casos típicos de eventos recurrentes",
    rows: [
      { h: "Pago de alquiler", d: "Se repite el mismo día de cada mes." },
      { h: "Medicación diaria", d: "Se repite todos los días a la misma hora." },
      { h: "Clase semanal", d: "Se repite el mismo día de la semana." },
    ],
  },
  // slide 35 del pptx original
  {
    type: "concept",
    kicker: "De un vistazo",
    title: "Colores por categoría",
    body: "Asignale un color a cada tipo de evento: salud, trabajo, familia, pagos.\n\nArmá tu propio código — no hay una única forma correcta de hacerlo.",
    media: {
      id: "hg1-35",
      kind: "IMAGEN",
      caption: "Captura de un Calendar semanal con eventos de al menos 4 colores distintos, bien diferenciados.",
    },
  },
  // slide 36 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Asignarle un color a un evento",
    steps: [
      "Tocá el evento que ya creaste.",
      "Entrá a editarlo (ícono de lápiz).",
      "Elegí un color de la paleta disponible.",
      "Guardá — listo, ya quedó identificado.",
    ],
  },
  // slide 37 del pptx original
  {
    type: "concept",
    kicker: "Ejemplo",
    title: "Tu propio código de colores",
    body: "Rojo para salud, azul para trabajo, verde para familia, amarillo para pagos. Después lo ajustás a tu gusto.",
    media: {
      id: "hg1-37",
      kind: "IMAGEN",
      caption: "Captura de la leyenda de colores de Google Calendar, personalizada con nombres de categorías.",
    },
  },
  // slide 38 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Armá la agenda de tu \"mes tipo\"",
    steps: [
      "Cargá todos los pagos y compromisos fijos que se repiten cada mes.",
      "Ponele recordatorio a cada uno.",
      "Asignale un color según tu propio código.",
    ],
    media: {
      id: "hg1-38",
      kind: "IMAGEN",
      caption: "Captura de ejemplo de un mes completo con eventos recurrentes de distintos colores.",
    },
  },
  // slide 39 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre de la parte 2",
    items: [
      "Configuré al menos un recordatorio con dos avisos distintos.",
      "Cargué un evento recurrente (diario, semanal o mensual).",
      "Definí mi propio código de colores y lo apliqué.",
    ],
  },
  // slide 40 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Notificación", d: "El aviso que te manda Calendar antes de un evento." },
      { h: "Evento recurrente", d: "Un evento que se repite solo, sin tener que cargarlo cada vez." },
      { h: "Código de colores", d: "El criterio personal que usás para diferenciar categorías de eventos." },
    ],
  },
  // slide 41 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Recordatorios y colores funcionando — cero dependencia de la memoria.",
    body: "Las partes 3 y 4 de Calendar las retomamos en la Clase 4 — antes vienen Documentos, Hojas de cálculo, Presentaciones y Formularios.",
  },
];
