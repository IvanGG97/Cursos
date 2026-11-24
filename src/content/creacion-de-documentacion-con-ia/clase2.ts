import type { Slide } from "@/content/types";

// Clase 2 de 2 — Creación de documentación con IA: "Del chat al archivo". Resumir un archivo que ya
// tenés, crear y modificar Word y PDF (Gemini con cuenta de Google; Claude con cualquier mail; copiar a
// Word como último recurso), conectar Google Drive paso a paso, y una práctica integradora con el
// material que trae cada uno. Arranca entrando de nuevo y con un repaso de la clase 1.
// Los nombres de los menús cambian con las actualizaciones: se dice dónde buscar. Menús de Drive
// verificados el 2026-10-30 en las dos apps.

const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];
const VERDADERO = [
  { text: "Verdadero", correct: true },
  { text: "Falso", correct: false },
];

export const cdClase2Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Del chat al archivo",
    subtitle: "Resumir archivos, crear y modificar Word y PDF, y conectar tu Google Drive",
    duracion: "Clase 2 de 2 · 2 horas",
  },
  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Volver a entrar y repaso de ayer",
      "Resumir un archivo que ya tenés",
      "Del chat al archivo: crear y modificar Word y PDF",
      "Conectar con Google Drive, paso a paso",
      "Tu documento, de principio a fin",
      "Cuidados y cierre",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 15 MIN", title: "Volver a entrar", subtitle: "Y repasar lo de ayer" },
  {
    type: "steps",
    kicker: "Como ayer",
    title: "Entrar de nuevo",
    steps: [
      "Abrí una ventana de incógnito (Ctrl + Shift + N).",
      "Con cuenta de Google: gemini.google.com → \"Acceder\".",
      "Sin cuenta de Google: claude.ai → tu mail → el enlace que te llega.",
      "Tené a mano lo que trajiste: tus apuntes y un Word tuyo.",
    ],
  },
  {
    type: "content",
    kicker: "Sin cuenta de Google · Antes de empezar",
    title: "Que Claude pueda crear archivos",
    rows: [
      { h: "Dónde", d: "tu nombre (abajo a la izquierda) → Configuración → Capacidades." },
      { h: "Qué activar", d: "\"Ejecutar código en la nube\", dentro de \"Ejecución de código y creación de archivos\" (suele venir activado)." },
      { h: "Si no lo encontrás", d: "escribí \"archivos\" en el buscador de Configuración: el nombre cambia con las actualizaciones." },
    ],
    media: {
      id: "cd-claude-capacidades",
      kind: "IMAGEN",
      caption: "Captura de la computadora: Configuración → Capacidades de Claude, con el interruptor \"Ejecutar código en la nube\" activado y señalado.",
    },
  },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo de ayer, en cuatro ideas",
    rows: [
      { h: "La receta", d: "qué documento, de quién y para quién, para qué y con qué datos, y cómo." },
      { h: "Conversar", d: "las correcciones, en el mismo chat y de a una." },
      { h: "No inventes", d: "si falta un dato, que ponga [completar]." },
      { h: "Datos de vecinos", d: "nunca: van entre [corchetes] y se completan en Word." },
    ],
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué le falta a \"Nota a Compras pidiendo sillas\"?",
    options: [
      { text: "De quién es: tu área.", correct: true },
      { text: "Para quién es.", correct: false },
      { text: "Cuántas sillas y para qué.", correct: true },
      { text: "El tono y el largo.", correct: true },
    ],
    explanation: "Ya dice qué (una nota) y para quién (Compras). Faltan de quién es, los datos (cuántas y para qué) y cómo (tono y largo).",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si en el chat de ayer le pedís \"cambiá el destinatario\", mantiene el resto de la nota.",
    options: VERDADERO,
    explanation: "En el mismo chat ya tiene tus datos: cambia lo que le pedís (igual, revisá que no haya tocado otra cosa).",
  },

  // ===================== BLOQUE 1: UN ARCHIVO QUE YA TENÉS =====================
  { type: "divider", badge: "BLOQUE 1 · 20 MIN", title: "Un archivo que ya tenés", subtitle: "Subirlo para resumirlo o usarlo de base" },
  {
    type: "steps",
    kicker: "Gemini o Claude · Documentos largos",
    title: "Subir un archivo para resumirlo",
    steps: [
      "Tocá el \"+\" del cuadro para escribir (en Claude, el \"+\" o el clip).",
      "Elegí \"Subir archivos\" y buscá el PDF o el Word.",
      "Escribí qué querés: \"Resumilo en 10 puntos para un informe\".",
      "Enviá y revisá el resumen con el original a mano.",
    ],
    media: {
      id: "cd-subir-archivo",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el menú del \"+\" abierto (Gemini o Claude), con la opción para subir un archivo señalada.",
    },
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Resumen para un informe",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Resumí este archivo en [N] puntos para [destinatario]. Usá solo lo que dice el archivo; si algo no está, poné [completar]. Al final, armá una tabla con [qué datos].\"",
    caption: "Antes de subirlo, fijate que no tenga datos de vecinos.",
  },
  {
    type: "practice",
    title: "Tarea 1 · Resumí un archivo tuyo",
    instructions:
      "Subí el Word que trajiste (o un PDF de una norma o un instructivo, sin datos de vecinos) y pedile un resumen con la plantilla.\n\nAbrí el original al lado y comprobá: ¿está todo? ¿Agregó algo que el archivo no dice?\n\nDesafío: preguntale algo que el archivo no dice y fijate si te avisa que no está o lo inventa.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "subir un expediente o una planilla con datos personales de vecinos." },
      { h: "Recomendación", d: "sacá esos datos antes de subirlo, o reemplazalos por [corchetes]." },
      { h: "Archivos largos", d: "pedí por partes: \"resumí de la página 1 a la 10\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "El resumen trae un dato que no encontrás en el original. ¿Qué hacés?",
    options: [
      { text: "Lo dejo si suena lógico para el informe.", correct: false },
      { text: "Lo dejo: la IA leyó el archivo completo.", correct: false },
      { text: "Lo saco, salvo que lo encuentre en el original.", correct: true },
    ],
    explanation: "La IA puede agregar cosas que el archivo no dice: lo que no está en el original, no va.",
  },

  // ===================== BLOQUE 2: DEL CHAT AL ARCHIVO =====================
  { type: "divider", badge: "BLOQUE 2 · 30 MIN", title: "Del chat al archivo", subtitle: "Crear y modificar archivos de Word y PDF" },
  {
    type: "concept",
    kicker: "Lo nuevo",
    title: "La IA te arma el archivo",
    body: "Gemini (con tu cuenta de Google) y Claude (con tu mail) crean el archivo terminado: un Word (.docx) o un PDF. Se lo pedís nombrando el archivo (\"Creá un archivo de Word con esta nota\") y te lo deja para descargar. También te devuelven modificado un Word tuyo.",
    analogy: "Ya no copiás y pegás: te entrega el documento en la mano.",
    media: {
      id: "cd-archivo-creado",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Gemini, el archivo de Word creado dentro del chat, con el botón \"Abrir\".",
    },
  },
  {
    type: "steps",
    kicker: "Gemini · Con cuenta de Google",
    title: "Pedirle el archivo en Word o PDF",
    steps: [
      "Pedile: \"Creá un archivo de Word con esta nota, para descargarlo\" (o un PDF).",
      "Gemini muestra el archivo: tocá \"Abrir\".",
      "Tocá la flecha de descargar (arriba a la derecha).",
      "Si dice que no puede, repetí el pedido así.",
    ],
    media: {
      id: "cd-descargar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el archivo que creó Gemini abierto, con la flecha de descargar (arriba a la derecha) señalada.",
    },
  },
  {
    type: "steps",
    kicker: "Gemini · Con cuenta de Google",
    title: "Exportar a Documentos de Google",
    steps: [
      "Debajo de la respuesta, tocá los tres puntos.",
      "Elegí \"Exportar a Documentos\".",
      "Tocá \"Abrir Documentos\": es un documento nuevo en tu Drive.",
      "Desde ahí: Archivo → Descargar → Word o PDF.",
    ],
    media: {
      id: "cd-exportar-docs",
      kind: "IMAGEN",
      caption: "Captura de la computadora: debajo de una respuesta de Gemini, el menú de los tres puntos abierto con \"Exportar a Documentos\" señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Claude · Sin cuenta de Google",
    title: "Crear el archivo en Word o PDF",
    steps: [
      "Pedile: \"Armá esta nota en un archivo de Word\" (o \"en PDF\").",
      "Claude crea el archivo y lo muestra en el chat.",
      "Tocá la flecha de descargar (arriba a la derecha del archivo): queda en Descargas.",
      "Abrilo en Word y revisalo antes de usarlo.",
    ],
    media: {
      id: "cd-claude-archivo",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Claude, el archivo de Word creado dentro del chat, con la flecha de descargar señalada.",
    },
  },
  {
    type: "steps",
    kicker: "Gemini o Claude",
    title: "Modificar un Word que ya tenés",
    steps: [
      "Tocá el \"+\" y subí tu archivo de Word.",
      "Pedí el cambio y el formato: \"Corregí la ortografía, dejalo en una página y devolvémelo en Word\".",
      "Descargá la versión nueva.",
      "Comparala con la original antes de reemplazarla.",
    ],
    media: {
      id: "cd-modificar-word",
      kind: "IMAGEN",
      caption: "Captura de la computadora: un Word subido al chat con el pedido de cambios, y debajo el archivo nuevo listo para descargar.",
    },
  },
  {
    type: "content",
    kicker: "Último recurso · Sin ninguna cuenta",
    title: "Copiar y pegar en Word",
    rows: [
      { h: "Gemini sin sesión", d: "solo escribe texto: no sube ni crea archivos." },
      { h: "A Word", d: "seleccioná la respuesta, Ctrl + C, y en Word Ctrl + V." },
      { h: "Guardar", d: "Archivo → Guardar como → Tipo: Word (.docx) o PDF." },
    ],
    media: {
      id: "cd-pegar-word",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el texto de Gemini seleccionado con el mouse, y al lado Word con el texto pegado y \"Guardar como\" → PDF.",
    },
  },
  {
    type: "practice",
    title: "Tarea 2 · Tu archivo terminado",
    instructions:
      "Elegí uno de los documentos que hiciste ayer o hoy (nota, acta o informe) y pedile el archivo: \"Creá un archivo de Word con esta nota, para descargarlo\". Descargalo y abrilo.\n\nDespués subilo de nuevo al chat y pedí un cambio: \"pasalo a PDF\", \"acortalo\" o \"agregá una tabla\". Descargá la versión nueva y compará las dos.\n\nDesafío: pedí el nombre de tu área en el encabezado y fijate si lo respetó.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "mandar el archivo sin abrirlo: a veces cambian las viñetas o los títulos." },
      { h: "Recomendación", d: "abrilo siempre antes de enviarlo, y nombralo bien: \"Nota_Pedido_Sillas_Octubre2026\"." },
      { h: "Si llegás al límite", d: "el plan gratis tiene un tope de mensajes: esperá un rato o seguí copiando a Word." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Sin cuenta de Google, ¿qué camino NO sirve para tener la nota en PDF?",
    options: [
      { text: "Claude con tu mail: pedirle el archivo en PDF.", correct: false },
      { text: "Gemini sin sesión: tocar \"Exportar a Documentos\".", correct: true },
      { text: "Gemini sin sesión: copiar a Word y Guardar como PDF.", correct: false },
    ],
    explanation: "Sin sesión, Gemini solo escribe texto: no exporta ni crea archivos. Los otros dos caminos sí funcionan.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Cuando le subís un Word a Claude, lo modifica directamente en tu compu.",
    options: FALSO,
    explanation: "Te devuelve una versión nueva para descargar: tu original queda igual, y conviene compararlos.",
  },

  // ===================== BLOQUE 3: CONECTAR CON GOOGLE DRIVE =====================
  { type: "divider", badge: "BLOQUE 3 · 25 MIN", title: "Conectar con Google Drive", subtitle: "Que la IA lea tus documentos y guarde los nuevos en tu Drive" },
  {
    type: "concept",
    kicker: "Para qué sirve",
    title: "Tu Drive, adentro del chat",
    body: "Hasta acá subías y descargabas cada archivo a mano. Si conectás tu Google Drive, la IA busca y lee tus documentos sin que los subas, y podés usarlos de modelo para uno nuevo. Con Claude, además, el archivo que crea queda guardado en tu Drive.",
    analogy: "Es como darle la llave de tu archivero: busca lo que le pedís, y se la podés sacar cuando quieras.",
  },
  {
    type: "content",
    kicker: "Antes de conectar",
    title: "Qué hace falta y qué hace cada una",
    rows: [
      { h: "Hace falta", d: "una cuenta de Google: la misma donde tenés tus documentos." },
      { h: "Gemini", d: "busca y lee tu Drive. Para guardar, \"Exportar a Documentos\"." },
      { h: "Claude", d: "busca y lee tu Drive, y guarda ahí los archivos que crea (con \"Ejecutar código en la nube\" activado)." },
      { h: "Sin cuenta de Google", d: "no hay Drive para conectar: seguí subiendo y descargando archivos." },
    ],
  },
  {
    type: "steps",
    kicker: "Gemini · Conectar",
    title: "Conectar tu Drive con Gemini",
    steps: [
      "En la barra de la izquierda, tocá \"Más\" → \"Personalizar\".",
      "Arriba, tocá la pestaña \"Conectores\".",
      "Buscá \"Google Workspace\" (trae Drive, Documentos y Gmail), tocá el \"+\" y seguí lo que te pide.",
      "Si ya figura en \"Instalado\", está conectado.",
    ],
    media: {
      id: "cd-drive-gemini-conectar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Gemini, el menú Más → Personalizar, y la pestaña Conectores con Google Workspace señalado.",
    },
  },
  {
    type: "content",
    kicker: "Gemini · Si no aparece",
    title: "Lo primero que hay que revisar",
    rows: [
      { h: "Conservar la actividad", d: "tiene que estar en \"Sí\": ruedita (abajo a la izquierda) → Actividad. Sin eso, Gemini no usa apps conectadas." },
      { h: "Cuenta del trabajo", d: "puede estar bloqueado por quien la administra: probá con tu cuenta personal." },
      { h: "Atajo", d: "escribí @ en el cuadro y elegí \"Google Drive\": si falta conectarlo, Gemini te lo pide." },
    ],
    media: {
      id: "cd-drive-gemini-actividad",
      kind: "IMAGEN",
      caption: "Captura de la computadora: la página \"Actividad en las Apps con Gemini\", con \"Conservar la actividad\" en \"Sí\" señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Gemini · Usar",
    title: "Traer un documento de tu Drive",
    steps: [
      "Tocá el \"+\" y elegí \"Agregar desde Drive\".",
      "Buscá el documento, tocalo y tocá \"Insertar\".",
      "Pedí lo que necesitás: \"Usá este documento como modelo y redactá una nota igual, pidiendo [qué]\".",
      "Enviá y revisá lo que armó.",
    ],
    media: {
      id: "cd-drive-gemini-traer",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el menú del \"+\" de Gemini con \"Agregar desde Drive\" señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Gemini · Usar",
    title: "Buscar sin saber dónde está",
    steps: [
      "En el cuadro, escribí @ y elegí \"Google Drive\".",
      "Pedí qué buscar y qué hacer: \"Buscá la nota del pedido de sillas y resumila en 3 puntos\".",
      "Enviá: al lado de cada dato te muestra de qué documento salió.",
      "Abrí ese documento y comprobá lo que dice.",
    ],
    media: {
      id: "cd-drive-gemini-buscar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en el cuadro de Gemini, la @ escrita y la lista de conectores con Google Drive señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Claude · Conectar",
    title: "Conectar tu Drive con Claude",
    steps: [
      "En la barra de la izquierda, tocá \"Personalización\" → \"Conectores\".",
      "Buscá \"Google Drive\", tocá el \"+\" y después \"Conectar\".",
      "Elegí tu cuenta de Google, revisá los permisos y tocá \"Continuar\".",
      "Listo: el conector dice \"Conectado\".",
    ],
    media: {
      id: "cd-drive-claude-conectar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Claude, Personalización → Conectores, con Google Drive señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Claude · Usar",
    title: "Traer un documento de tu Drive",
    steps: [
      "Tocá el \"+\" → \"Conectores\" → \"Agregar desde Google Drive\".",
      "Buscá el documento, tildalo y tocá \"Agregar al chat\".",
      "Pedí qué hacer: \"Usalo de modelo y redactá una nota igual, pidiendo [qué]\".",
      "¿Un Word o un PDF? No salen en esa lista: pedí \"Buscá en mi Drive [nombre]\".",
    ],
    media: {
      id: "cd-drive-claude-traer",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el menú del \"+\" de Claude, con Conectores abierto y \"Agregar desde Google Drive\" señalado.",
    },
  },
  {
    type: "steps",
    kicker: "Claude · Usar",
    title: "Guardar el archivo en tu Drive",
    steps: [
      "Pedí el archivo y dónde va: \"Hacé un archivo de Word con esta nota y guardalo en mi Drive con el nombre [nombre]\".",
      "Claude te muestra qué va a guardar: leelo y tocá \"Permitir una vez\".",
      "Esperá: puede tardar unos minutos.",
      "Abrí el archivo con el enlace que te deja y revisá lo que agregó por su cuenta.",
    ],
    media: {
      id: "cd-drive-claude-guardar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: en Claude, el pedido de guardar el archivo en Drive y la respuesta con el archivo ya guardado.",
    },
  },
  {
    type: "quote",
    kicker: "Plantilla",
    title: "Un documento nuevo a partir de otro",
    quoteLabel: "COPIÁ Y COMPLETÁ",
    quoteText:
      "\"Buscá en mi Drive [nombre o tema del documento]. Usalo como modelo y armá [una nota / un informe] sobre [tema], con estos datos: [datos]. No inventes nada; si falta un dato, poné [completar].\"",
    caption: "Si la cuenta de Google tiene varios documentos parecidos, decile cuál: el nombre o la fecha.",
  },
  {
    type: "practice",
    title: "Tarea 3 · Tu Drive en el chat",
    instructions:
      "Conectá tu Drive con Gemini o con Claude (si ya está conectado, seguí).\n\nTraé un documento tuyo que no tenga datos de vecinos y pedile un resumen en 3 puntos, o una nota nueva usándolo de modelo. Después compará lo que armó con el original.\n\nDesafío: pedile que compare dos documentos tuyos de Drive y te diga en qué se diferencian.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "creer que, por estar conectado, ya se le puede pedir cualquier documento." },
      { h: "Recomendación", d: "pedile documentos puntuales, y ninguno con datos de vecinos o expedientes." },
      { h: "En la compu de la sala", d: "la conexión queda en tu cuenta, no en la compu: al cerrar incógnito, nadie más la usa." },
    ],
  },
  {
    type: "steps",
    kicker: "Cuando no lo uses más",
    title: "Cómo desconectarlo",
    steps: [
      "Gemini: Más → Personalizar → Conectores.",
      "Tocá los tres puntos de \"Google Workspace\" → \"Desconectar\".",
      "Claude: Personalización → Conectores → Google Drive.",
      "Tocá los tres puntos, al lado de \"Conectado\" → \"Desconectar\".",
    ],
    media: {
      id: "cd-drive-desconectar",
      kind: "IMAGEN",
      caption: "Captura de la computadora: el menú de los tres puntos con \"Desconectar\", en Gemini y en Claude.",
    },
  },
  {
    type: "quiz",
    kind: "single",
    question: "Gemini no usa tu Drive: ¿qué revisás?",
    options: [
      { text: "Que tengas el plan pago de Gemini.", correct: false },
      { text: "Que Drive esté instalado en la compu.", correct: false },
      { text: "Que no estés en una ventana de incógnito.", correct: false },
      { text: "Que \"Conservar la actividad\" esté en \"Sí\".", correct: true },
    ],
    explanation: "Sin \"Conservar la actividad\", Gemini no usa las apps conectadas.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "En Claude, un Word de tu Drive aparece en la lista de \"Agregar desde Google Drive\".",
    options: FALSO,
    explanation: "Esa lista muestra solo Documentos, Hojas y Presentaciones de Google: un Word o un PDF se pide por chat (\"Buscá en mi Drive...\").",
  },

  // ===================== BLOQUE 4: TU DOCUMENTO, DE PRINCIPIO A FIN =====================
  { type: "divider", badge: "BLOQUE 4 · 20 MIN", title: "Tu documento, de principio a fin", subtitle: "Con lo que trajiste: del apunte al archivo" },
  {
    type: "steps",
    kicker: "Práctica integradora",
    title: "El recorrido completo",
    steps: [
      "Pegá tus apuntes (sin datos de vecinos) y pedí el acta o la nota con la plantilla.",
      "Corregí en el mismo chat hasta que la firmarías.",
      "Pedí el archivo en Word o en PDF (o exportalo a Documentos).",
      "Abrilo, revisalo y guardalo con un nombre claro (o en tu Drive).",
    ],
  },
  {
    type: "practice",
    title: "Tarea 4 · De tus apuntes al archivo",
    instructions:
      "Hacé el recorrido completo con lo que trajiste: los apuntes de una reunión, o el documento de la semana de ayer.\n\nAl final tenés que tener el archivo abierto en Word (o en Documentos de Google), revisado y con un nombre claro, por ejemplo \"Acta_Reunion_Turnos_25-11\".\n\nDesafío: hacelo una segunda vez con otro tipo de documento (si hiciste un acta, ahora un memorando), sin mirar las plantillas.",
  },
  {
    type: "content",
    kicker: "Antes de enviarlo",
    title: "La última revisada",
    rows: [
      { h: "Datos", d: "nombres, cargos, fechas y números: que sean los tuyos." },
      { h: "Inventos", d: "lo que no dijiste, afuera; los [completar], completados." },
      { h: "Formato", d: "abrí el archivo: títulos, viñetas y firma en su lugar." },
      { h: "Nombre", d: "que diga qué es y la fecha: \"Nota_Pedido_Sillas_Noviembre2026\"." },
    ],
  },

  // ===================== BLOQUE 5: CUIDADOS Y CIERRE =====================
  { type: "divider", badge: "BLOQUE 5 · 10 MIN", title: "Cuidados y cierre", subtitle: "Lo que te llevás de las dos clases" },
  {
    type: "content",
    kicker: "Tu kit",
    title: "Las plantillas de hoy",
    rows: [
      { h: "Resumen", d: "\"Resumí este archivo en [N] puntos; si algo no está, [completar]\"." },
      { h: "Archivo", d: "\"Creá un archivo de Word con esta nota, para descargarlo\" (o PDF)." },
      { h: "Modificar", d: "subí tu Word: \"corregí [qué] y devolvémelo en Word\"." },
      { h: "Drive", d: "\"Buscá en mi Drive [documento] y usalo de modelo para [qué]\"." },
    ],
  },
  {
    type: "checkpoint",
    title: "Reglas de oro",
    items: [
      "Dale contexto: qué documento, para quién, con qué datos y cómo.",
      "Corregí en el mismo chat; pedile que no invente y que marque [completar].",
      "Nunca pegues datos personales de vecinos.",
      "Revisá datos, cuentas y normas, y abrí el archivo antes de enviarlo.",
    ],
  },
  {
    type: "practice",
    title: "Antes de irte",
    instructions:
      "Guardá las plantillas de las dos clases en tus notas o en un documento de tu Drive.\n\nSi conectaste tu Drive y no lo vas a usar más, desconectalo. Cerrá la ventana de incógnito para salir de tu cuenta en esta compu.",
  },
];
