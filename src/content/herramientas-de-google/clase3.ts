import type { Slide } from "@/content/types";

// Clase 3 — Google Presentaciones + Google Formularios.
// Porteado 1 a 1 desde el pptx "Día 3" (sin reescribir contenido). Los avisos "IDEA PARA GENIALLY" se
// sacaron; cada "imagen/GIF sugerido" quedó como lugar para subir desde Admin → curso → Imágenes (ids hg3-NN).

export const hgClase3Slides: Slide[] = [
  // slide 1 del pptx original
  {
    type: "title",
    claseLine: "Clase 3 — Presentaciones + Formularios",
    subtitle: "23 de septiembre · 14 a 16 hs · Teatro Municipal",
    duracion: "Clase de 2 horas",
  },
  // slide 2 del pptx original
  { type: "divider", badge: "PRESENTACIONES", title: "Presentaciones: contá tu idea en pantalla" },
  // slide 2 del pptx original
  {
    type: "agenda",
    items: [
      "Crear tu primera presentación",
      "Agregar texto e imágenes a una diapositiva",
      "Elegir un tema para que se vea prolija",
      "Presentar en pantalla completa",
    ],
  },
  // slide 3 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Para qué sirve una presentación",
    body: "Para mostrar un producto, un proyecto o una idea — mejor que explicarlo solo hablando.\n\nSe guarda sola y la abrís desde cualquier dispositivo, igual que el resto de Google.",
    media: {
      id: "hg3-03",
      kind: "IMAGEN",
      caption: "Foto de una persona mostrando una presentación en una pantalla o proyector.",
    },
  },
  // slide 4 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Crear tu primera presentación",
    steps: [
      "Entrá a slides.google.com, o desde Drive tocá \"Nuevo\" → \"Presentaciones\".",
      "Elegí un tema (un diseño ya armado).",
      "Ponele un título a la portada.",
      "Agregá una diapositiva nueva con el botón \"+\".",
    ],
  },
  // slide 5 del pptx original
  {
    type: "content",
    kicker: "Elementos básicos",
    title: "Qué podés poner en una diapositiva",
    rows: [
      { h: "Texto", d: "Cuadros de título y subtítulo, ya ubicados por el tema que elegiste." },
      { h: "Imagen", d: "La subís desde tu dispositivo o la buscás directo desde Slides." },
      { h: "Forma", d: "Flechas, cuadros o círculos para resaltar algo puntual." },
    ],
  },
  // slide 6 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Tenés que diseñar el fondo de cada diapositiva a mano?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 7 del pptx original
  {
    type: "concept",
    kicker: "Que se vea prolijo",
    title: "Elegir un tema",
    body: "Un tema es un diseño ya armado: colores, tipografía y ubicación de los elementos.\n\nLo aplicás una vez, y cambia automáticamente toda la presentación.",
    media: {
      id: "hg3-07",
      kind: "IMAGEN",
      caption: "Captura del panel de temas de Google Presentaciones, mostrando 4 o 5 diseños distintos.",
    },
  },
  // slide 8 del pptx original
  {
    type: "concept",
    kicker: "Tip de diseño",
    title: "Menos texto, más grande",
    body: "Una diapositiva no es un documento para leer — si tiene más de 4 o 5 líneas, seguramente sobra texto. Achicá la idea, no la letra.",
    media: {
      id: "hg3-08",
      kind: "IMAGEN",
      caption: "Comparación visual de una diapositiva sobrecargada de texto vs. una limpia con una sola idea.",
    },
  },
  // slide 9 del pptx original
  {
    type: "steps",
    kicker: "El momento clave",
    title: "Presentar en pantalla completa",
    steps: [
      "Tocá \"Presentar\" arriba a la derecha.",
      "Se abre en pantalla completa.",
      "Usá las flechas del teclado o el mouse para avanzar.",
      "Apretá \"Esc\" para salir cuando termines.",
    ],
  },
  // slide 10 del pptx original
  {
    type: "content",
    kicker: "Extras útiles",
    title: "Herramientas que te van a servir",
    rows: [
      { h: "Notas del orador", d: "Texto que solo ves vos, no el público — para recordar qué decir." },
      { h: "Transiciones", d: "Un efecto simple al pasar de una diapositiva a otra." },
      { h: "Animaciones", d: "Hacer que un elemento aparezca de a poco, en vez de todo junto." },
    ],
  },
  // slide 11 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Dónde anotás lo que vas a decir, sin que se vea?",
    options: [
      { text: "En el título", correct: false },
      { text: "En las notas del orador", correct: true },
      { text: "En el chat", correct: false },
      { text: "No se puede hacer eso", correct: false },
    ],
  },
  // slide 12 del pptx original
  {
    type: "concept",
    kicker: "Para el día del evento",
    title: "Compartir y presentar en vivo",
    body: "Se comparte igual que Documentos y Hojas de cálculo, con el mail de la persona.\n\nTambién podés compartir el link para que otros la sigan en vivo mientras presentás.",
    media: {
      id: "hg3-12",
      kind: "GIF",
      caption: "GIF corto mostrando el botón \"Presentar\" y la transición a pantalla completa.",
    },
  },
  // slide 13 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Armá una mini presentación",
    steps: [
      "Creá una presentación de 3 diapositivas sobre vos o tu negocio.",
      "Elegí un tema.",
      "Agregá al menos una imagen.",
    ],
    media: {
      id: "hg3-13",
      kind: "IMAGEN",
      caption: "Captura de una presentación de 3 diapositivas simples, con tema aplicado e imagen.",
    },
  },
  // slide 14 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre — Presentaciones",
    items: [
      "Creé una presentación con tema aplicado.",
      "Agregué texto e imagen en al menos una diapositiva.",
      "Probé el modo \"Presentar\" en pantalla completa.",
    ],
  },
  // slide 15 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Tema", d: "El diseño (colores y tipografía) que se aplica a toda la presentación." },
      { h: "Notas del orador", d: "Texto de ayuda que solo ve quien presenta, no el público." },
      { h: "Transición", d: "El efecto visual al cambiar de una diapositiva a la siguiente." },
    ],
  },
  // slide 16 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu primera presentación, lista para mostrar en cualquier pantalla.",
    body: "Ahora vamos con Formularios.",
  },
  // slide 17 del pptx original
  { type: "divider", badge: "FORMULARIOS", title: "Formularios: preguntá y recibí respuestas ordenadas" },
  // slide 17 del pptx original
  {
    type: "agenda",
    items: [
      "Crear tu primer formulario",
      "Tipos de pregunta",
      "Ver las respuestas organizadas",
      "Compartir tu formulario",
    ],
  },
  // slide 18 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Para qué sirve un formulario",
    body: "Encuestas, inscripciones, pedidos de un negocio — todo se ordena solo.\n\nNadie necesita tener cuenta de Google para responder.",
    media: { id: "hg3-18", kind: "IMAGEN", caption: "Foto de una persona completando un formulario en el celular." },
  },
  // slide 19 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Crear tu primer formulario",
    steps: [
      "Entrá a forms.google.com, o desde Drive tocá \"Nuevo\" → \"Formularios\".",
      "Ponele un título y una descripción.",
      "Agregá tu primera pregunta con el botón \"+\".",
      "Elegí el tipo de pregunta.",
    ],
  },
  // slide 20 del pptx original
  {
    type: "content",
    kicker: "Tipos de pregunta",
    title: "Las 3 que más vas a usar",
    rows: [
      { h: "Respuesta corta", d: "Texto libre — para el nombre, un comentario, lo que sea." },
      { h: "Opción múltiple", d: "La persona elige una sola opción entre varias." },
      { h: "Casillas de verificación", d: "La persona puede elegir varias opciones a la vez." },
    ],
  },
  // slide 21 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Podés hacer que una pregunta sea obligatoria antes de que se pueda enviar el formulario?",
    options: [
      { text: "Verdadero", correct: true },
      { text: "Falso", correct: false },
    ],
  },
  // slide 22 del pptx original
  {
    type: "concept",
    kicker: "Que se vea propio",
    title: "Personalizar tu formulario",
    body: "Podés cambiar el color y agregar una imagen de portada.\n\nTambién podés ordenar las preguntas en secciones, si el formulario es largo.",
    media: {
      id: "hg3-22",
      kind: "IMAGEN",
      caption: "Captura del panel de personalización de color y portada de un formulario.",
    },
  },
  // slide 23 del pptx original
  {
    type: "concept",
    kicker: "Tip práctico",
    title: "Menos obligatorio, más respuestas",
    body: "Marcá como obligatorias solo las preguntas realmente necesarias. Un formulario muy largo o muy exigente hace que la gente lo abandone a mitad de camino.",
    media: {
      id: "hg3-23",
      kind: "IMAGEN",
      caption: "Comparación de un formulario corto y simple vs. uno largo con demasiadas preguntas obligatorias.",
    },
  },
  // slide 24 del pptx original
  {
    type: "steps",
    kicker: "Después de publicarlo",
    title: "Ver las respuestas",
    steps: [
      "Tocá la pestaña \"Respuestas\".",
      "Mirá el resumen con gráficos automáticos.",
      "Tocá el ícono de Sheets para exportar todo a una planilla.",
      "Analizá los datos ahí, con lo que ya aprendiste en la Clase 2.",
    ],
  },
  // slide 25 del pptx original
  {
    type: "content",
    kicker: "Extras útiles",
    title: "Lo que hace Formularios por vos",
    rows: [
      { h: "Resumen automático", d: "Gráficos de las respuestas, sin que vos hagas nada." },
      { h: "Respuestas individuales", d: "Ver formulario por formulario, uno a la vez." },
      { h: "Exportar a Sheets", d: "Todas las respuestas en una planilla, lista para analizar." },
    ],
  },
  // slide 26 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Dónde ves las respuestas como una tabla?",
    options: [
      { text: "Documentos", correct: false },
      { text: "Hojas de cálculo", correct: true },
      { text: "Presentaciones", correct: false },
      { text: "Gmail", correct: false },
    ],
  },
  // slide 27 del pptx original
  {
    type: "concept",
    kicker: "Para que lo respondan",
    title: "Compartir tu formulario",
    body: "Se comparte con un link — ni siquiera hace falta tener cuenta de Google para responder.\n\nPodés mandarlo por WhatsApp, mail o pegarlo en tus redes.",
    media: {
      id: "hg3-27",
      kind: "GIF",
      caption: "GIF corto mostrando cómo se copia el link de un formulario para compartirlo.",
    },
  },
  // slide 28 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Armá tu primer formulario",
    steps: [
      "Creá un formulario con 3 preguntas de distinto tipo.",
      "Marcá una como obligatoria.",
      "Compartí el link con un compañero del curso.",
    ],
    media: {
      id: "hg3-28",
      kind: "IMAGEN",
      caption: "Captura de un formulario con 3 preguntas de tipos distintos, una marcada como obligatoria.",
    },
  },
  // slide 29 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre — Formularios",
    items: [
      "Creé un formulario con al menos 3 preguntas.",
      "Usé más de un tipo de pregunta.",
      "Compartí el link y alguien pudo responder.",
    ],
  },
  // slide 30 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Pregunta obligatoria", d: "No se puede enviar el formulario si esa pregunta queda sin responder." },
      { h: "Respuesta corta", d: "Un tipo de pregunta de texto libre, sin opciones prearmadas." },
      { h: "Opción múltiple", d: "Un tipo de pregunta donde se elige una sola opción entre varias." },
    ],
  },
  // slide 31 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu primer formulario, listo para juntar respuestas ordenadas.",
    body: "En la Clase 4 cerramos con Drive y las últimas dos clases de Calendar.",
  },
];
