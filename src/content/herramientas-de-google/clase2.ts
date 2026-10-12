import type { Slide } from "@/content/types";

// Clase 2 — Google Documentos + Google Hojas de cálculo.
// Porteado 1 a 1 desde el pptx "Día 2" (sin reescribir contenido). Los avisos "IDEA PARA GENIALLY" se
// sacaron; cada "imagen/GIF sugerido" quedó como lugar para subir desde Admin → curso → Imágenes (ids hg2-NN).

export const hgClase2Slides: Slide[] = [
  // slide 1 del pptx original
  {
    type: "title",
    claseLine: "Clase 2 — Documentos + Hojas de cálculo",
    subtitle: "22 de septiembre · 14 a 16 hs · Teatro Municipal",
    duracion: "Clase de 2 horas",
  },
  // slide 2 del pptx original
  { type: "divider", badge: "DOCUMENTOS", title: "Documentos: escribí y compartí sin líos" },
  // slide 2 del pptx original
  {
    type: "agenda",
    items: [
      "Crear tu primer documento",
      "Formato básico: títulos, negrita, listas",
      "Compartir y trabajar en simultáneo",
      "Práctica con un documento real",
    ],
  },
  // slide 3 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Por qué Documentos y no Word en la compu",
    body: "Se guarda solo, mientras escribís — no existe el botón \"Guardar\".\n\nNo hace falta instalar nada, y lo abrís desde cualquier dispositivo con tu cuenta.",
    media: {
      id: "hg2-03",
      kind: "IMAGEN",
      caption: "Foto de una persona escribiendo en su celular o notebook, en un ambiente de trabajo tranquilo.",
    },
  },
  // slide 4 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Crear tu primer documento",
    steps: [
      "Entrá a docs.google.com, o desde Drive tocá \"Nuevo\" → \"Documentos\".",
      "Ponele un título arriba a la izquierda.",
      "Empezá a escribir.",
      "No hace falta guardar — ya está guardado.",
    ],
  },
  // slide 5 del pptx original
  {
    type: "content",
    kicker: "Formato",
    title: "Lo básico para que se vea prolijo",
    rows: [
      { h: "Negrita, cursiva, subrayado", d: "Seleccioná el texto y usá los botones de la barra de arriba." },
      { h: "Títulos y subtítulos", d: "El estilo \"Título 1\" o \"Título 2\" organiza tu documento en secciones." },
      { h: "Listas con viñetas o numeradas", d: "Para ordenar ideas o pasos, en vez de un párrafo largo." },
    ],
  },
  // slide 6 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Tenés que apretar \"Guardar\" para no perder lo que escribiste en Documentos?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 7 del pptx original
  {
    type: "concept",
    kicker: "Trabajar en equipo",
    title: "Compartir y trabajar en simultáneo",
    body: "Invitás a alguien igual que en Calendar: con su mail.\n\nVarias personas pueden editar al mismo tiempo, y ves el cursor de cada una con su color.",
    media: {
      id: "hg2-07",
      kind: "IMAGEN",
      caption: "Captura de un documento con dos cursores de colores distintos escribiendo en simultáneo.",
    },
  },
  // slide 8 del pptx original
  {
    type: "concept",
    kicker: "Niveles de permiso",
    title: "¿Qué puede hacer cada persona?",
    body: "Puede ver (solo lee), puede comentar (deja notas, no edita el texto), o puede editar (cambia el documento directamente). Vos elegís para cada persona.",
    media: { id: "hg2-08", kind: "IMAGEN", caption: "Captura del menú de \"Compartir\" mostrando el desplegable de permisos." },
  },
  // slide 9 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Compartir un documento",
    steps: [
      "Tocá \"Compartir\" arriba a la derecha.",
      "Escribí el mail de la persona.",
      "Elegí el permiso: ver, comentar o editar.",
      "Tocá \"Enviar\".",
    ],
  },
  // slide 10 del pptx original
  {
    type: "content",
    kicker: "Colaborar mejor",
    title: "Comentarios y sugerencias",
    rows: [
      { h: "Comentar", d: "Dejás una nota al margen, sin tocar el texto original." },
      {
        h: "Modo Sugerencias",
        d: "Proponés un cambio que la otra persona puede aceptar o rechazar — no lo borra directo.",
      },
      { h: "Resolver", d: "Marcás un comentario como \"listo\" cuando ya se solucionó." },
    ],
  },
  // slide 11 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué modo propone cambios sin borrar lo del otro?",
    options: [
      { text: "Modo edición", correct: false },
      { text: "Modo sugerencias", correct: true },
      { text: "Modo lectura", correct: false },
      { text: "Modo oculto", correct: false },
    ],
  },
  // slide 12 del pptx original
  {
    type: "concept",
    kicker: "Red de seguridad",
    title: "El historial de versiones",
    body: "Documentos guarda automáticamente cada cambio que hacés.\n\nSi algo se rompe o alguien borra de más, podés volver a una versión anterior.",
    media: {
      id: "hg2-12",
      kind: "GIF",
      caption: "GIF corto mostrando cómo se abre el historial de versiones desde el menú \"Archivo\".",
    },
  },
  // slide 13 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Armá tu primer documento",
    steps: [
      "Creá un documento nuevo con un título.",
      "Escribí un párrafo y aplicale negrita a una palabra.",
      "Agregá una lista con 3 ítems.",
    ],
    media: {
      id: "hg2-13",
      kind: "IMAGEN",
      caption: "Captura de un documento simple con título, un párrafo con negrita y una lista.",
    },
  },
  // slide 14 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre — Documentos",
    items: [
      "Creé un documento con título propio.",
      "Usé negrita y una lista.",
      "Compartí el documento con alguien, eligiendo un permiso.",
    ],
  },
  // slide 15 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Título 1 / Título 2", d: "Estilos de texto que organizan tu documento en secciones." },
      { h: "Comentario", d: "Una nota al margen que no modifica el texto original." },
      { h: "Historial de versiones", d: "El registro de todos los cambios — te permite volver atrás." },
    ],
  },
  // slide 16 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Un documento propio, formateado y listo para compartir.",
    body: "Ahora vamos con Hojas de cálculo.",
  },
  // slide 17 del pptx original
  { type: "divider", badge: "HOJAS DE CÁLCULO", title: "Hojas de cálculo: cuentas que se hacen solas" },
  // slide 17 del pptx original
  {
    type: "agenda",
    items: [
      "Crear tu primera hoja y entender filas y columnas",
      "Cargar datos ordenados",
      "Tu primera fórmula: SUMA",
      "Formato para que se entienda de un vistazo",
    ],
  },
  // slide 18 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Para qué sirve una hoja de cálculo",
    body: "Control de gastos, listas de stock, cualquier cosa con números que se repite.\n\nVos cargás los datos una vez, y las cuentas se recalculan solas.",
    media: {
      id: "hg2-18",
      kind: "IMAGEN",
      caption: "Foto de una persona mirando una planilla con números en su celular o computadora.",
    },
  },
  // slide 19 del pptx original
  {
    type: "steps",
    kicker: "Lo primero",
    title: "Crear tu hoja y ubicarte",
    steps: [
      "Entrá a sheets.google.com, o desde Drive tocá \"Nuevo\" → \"Hojas de cálculo\".",
      "Cada cuadradito se llama \"celda\".",
      "Las letras de arriba son columnas, los números del costado son filas.",
      "Cada celda tiene una dirección — por ejemplo, A1 o B2.",
    ],
  },
  // slide 20 del pptx original
  {
    type: "content",
    kicker: "Cargar datos",
    title: "Lo que podés escribir en una celda",
    rows: [
      { h: "Texto", d: "Nombres, categorías, descripciones." },
      { h: "Números", d: "Cargalos sin signos ni letras — Sheets los reconoce solo." },
      { h: "Fechas", d: "Escribila bien (ej. 21/09/2026) y Sheets la reconoce como fecha." },
    ],
  },
  // slide 21 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Tenés que escribir el símbolo $ para que Sheets entienda que un dato es un número?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 22 del pptx original
  {
    type: "concept",
    kicker: "La magia de Sheets",
    title: "Tu primera fórmula: SUMA",
    body: "Una fórmula siempre arranca con el signo =.\n\nSUMA suma automáticamente todos los números de un rango que vos elijas.",
    media: { id: "hg2-22", kind: "IMAGEN", caption: "Captura de una celda mostrando la fórmula =SUMA(A1:A5) y su resultado." },
  },
  // slide 23 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Escribir una fórmula SUMA",
    steps: [
      "Hacé clic en la celda donde va a aparecer el resultado.",
      "Escribí =SUMA(",
      "Seleccioná con el mouse las celdas que querés sumar.",
      "Cerrá el paréntesis y apretá Enter.",
    ],
  },
  // slide 24 del pptx original
  {
    type: "concept",
    kicker: "Ejemplo real",
    title: "Sumar una columna de gastos",
    body: "=SUMA(B2:B10) suma automáticamente todos los valores de la columna B, desde la fila 2 hasta la fila 10.",
    media: {
      id: "hg2-24",
      kind: "IMAGEN",
      caption: "Captura de una planilla de gastos con la columna B cargada y el total con SUMA abajo.",
    },
  },
  // slide 25 del pptx original
  {
    type: "content",
    kicker: "Que se entienda",
    title: "Formato de celdas",
    rows: [
      { h: "Color de fondo", d: "Para resaltar una fila importante, como el total." },
      { h: "Formato moneda", d: "Para que los números se vean como plata: $1.500." },
      { h: "Bordes", d: "Para armar una tabla prolija y fácil de leer." },
    ],
  },
  // slide 26 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué fórmula suma los valores de A1 a A10?",
    options: [
      { text: "=SUMA(A1:A10)", correct: true },
      { text: "=TOTAL(A1-A10)", correct: false },
      { text: "=A1+A10", correct: false },
      { text: "=SUMAR(A1,A10)", correct: false },
    ],
  },
  // slide 27 del pptx original
  {
    type: "concept",
    kicker: "Extra",
    title: "Ordenar y filtrar",
    body: "Podés ordenar una lista de mayor a menor (o al revés) con un clic.\n\nUn filtro te deja ver solo lo que te interesa, sin borrar nada del resto.",
    media: {
      id: "hg2-27",
      kind: "GIF",
      caption: "GIF corto mostrando cómo se activa un filtro y se ordena una columna de mayor a menor.",
    },
  },
  // slide 28 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Armá tu primera planilla de gastos",
    steps: [
      "Cargá una lista de 5 gastos con nombre y monto.",
      "Sumalos con la fórmula SUMA.",
      "Dale formato moneda a la columna de montos.",
    ],
    media: {
      id: "hg2-28",
      kind: "IMAGEN",
      caption: "Captura de una planilla de 5 gastos con formato moneda y el total sumado abajo.",
    },
  },
  // slide 29 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre — Hojas de cálculo",
    items: [
      "Cargué datos ordenados en columnas.",
      "Escribí una fórmula SUMA que funciona.",
      "Le di formato moneda a una columna de números.",
    ],
  },
  // slide 30 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Celda", d: "Cada cuadradito de la planilla, con su propia dirección (ej. A1)." },
      { h: "Fórmula", d: "Una instrucción que empieza con = y hace un cálculo automático." },
      { h: "Rango", d: "Un grupo de celdas seguidas, como A1:A10." },
    ],
  },
  // slide 31 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu primera planilla, con una fórmula funcionando de verdad.",
    body: "El Clase 3 seguimos con Presentaciones y Formularios.",
  },
];
