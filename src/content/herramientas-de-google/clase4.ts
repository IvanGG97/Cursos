import type { Slide } from "@/content/types";

// Clase 4 — Google Drive + Google Calendar + Asistentes de IA (Claude).
// Porteado 1 a 1 desde el pptx "Día 4" (sin reescribir contenido). Los avisos "IDEA PARA GENIALLY" se
// sacaron; cada "imagen/GIF sugerido" quedó como lugar para subir desde Admin → curso → Imágenes (ids hg4-NN).

export const hgClase4Slides: Slide[] = [
  // slide 1 del pptx original
  {
    type: "title",
    claseLine: "Clase 4 — Drive + Google Calendar",
    subtitle: "24 de septiembre · 14 a 16 hs · Teatro Municipal",
    duracion: "Clase de 2 horas",
  },
  // slide 2 del pptx original
  { type: "divider", badge: "DRIVE", title: "Drive: todo en la nube, todo a mano" },
  // slide 2 del pptx original
  {
    type: "agenda",
    items: [
      "Por qué guardar todo en la nube",
      "Crear carpetas y subir archivos",
      "Compartir con otras personas",
      "Práctica rápida",
    ],
  },
  // slide 3 del pptx original
  {
    type: "concept",
    kicker: "Para empezar",
    title: "Drive es tu mochila digital",
    body: "Todo lo que armaste estos días — Documentos, Hojas de cálculo, Presentaciones, Formularios — ya vive acá.\n\nNo se pierde aunque cambies de celular: solo iniciás sesión y todo vuelve a aparecer.",
    media: { id: "hg4-03", kind: "IMAGEN", caption: "Foto de una persona revisando sus archivos guardados en el celular." },
  },
  // slide 4 del pptx original
  {
    type: "content",
    kicker: "Lo básico",
    title: "3 acciones que vas a usar siempre",
    rows: [
      { h: "Crear carpeta", d: "Para ordenar tus archivos por tema, como en un escritorio." },
      { h: "Subir archivo", d: "Fotos, PDFs, lo que tengas en el celular o la compu." },
      { h: "Buscar", d: "La lupa de arriba — encontrás cualquier archivo por su nombre." },
    ],
  },
  // slide 5 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Crear una carpeta y subir un archivo",
    steps: [
      "Tocá \"Nuevo\".",
      "Elegí \"Carpeta\" y ponele un nombre.",
      "Entrá a la carpeta y tocá \"Subir archivo\".",
      "Elegí el archivo desde tu dispositivo.",
    ],
  },
  // slide 6 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Necesitás instalar una app aparte para abrir tus archivos de Drive?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 7 del pptx original
  {
    type: "concept",
    kicker: "Trabajar en equipo",
    title: "Compartir con otras personas",
    body: "Mismo criterio que ya viste en Documentos, Hojas de cálculo y Presentaciones.\n\nCon el mail de la persona, y eligiendo qué puede hacer: ver, comentar o editar.",
    media: { id: "hg4-07", kind: "IMAGEN", caption: "Captura del menú de \"Compartir\" de una carpeta de Drive." },
  },
  // slide 8 del pptx original
  {
    type: "content",
    kicker: "Para estar tranquilo",
    title: "3 cosas que conviene saber",
    rows: [
      { h: "Carpeta compartida", d: "Todo lo que hay adentro se comparte junto, sin repetirlo archivo por archivo." },
      { h: "Acceso directo", d: "Organizás un archivo en otra carpeta sin duplicarlo — sigue siendo el mismo archivo." },
      { h: "Papelera", d: "Nada se borra para siempre al toque: tenés 30 días para recuperarlo." },
    ],
  },
  // slide 9 del pptx original
  {
    type: "concept",
    kicker: "El menú de la izquierda",
    title: "Las pestañas de Drive, una por una",
    body: "Del lado izquierdo de Drive hay varias secciones — no todas son lugares distintos donde \"vive\" un archivo.\n\nAlgunas son accesos directos a los mismos archivos que ya tenés en otro lado, no copias nuevas.",
    media: {
      id: "hg4-09",
      kind: "IMAGEN",
      caption: "Captura del menú lateral de Google Drive, con todas las pestañas visibles (Mi unidad, Compartido conmigo, Reciente, etc.).",
    },
  },
  // slide 10 del pptx original
  {
    type: "content",
    kicker: "Ocupan tu almacenamiento",
    title: "Estas 3 sí cuentan contra tu espacio",
    rows: [
      { h: "Mi unidad", d: "Tus archivos propios — lo que vos creaste o subiste." },
      {
        h: "Ordenadores",
        d: "Las carpetas de tu compu que respaldaste con Drive para escritorio — siguen siendo tuyas.",
      },
      {
        h: "Papelera",
        d: "Ojo con esta: lo que borraste sigue ocupando espacio hasta que la vacíes, o hasta que pasen 30 días.",
      },
    ],
  },
  // slide 11 del pptx original
  {
    type: "content",
    kicker: "No ocupan tu almacenamiento",
    title: "Estas son solo accesos, no copias",
    rows: [
      {
        h: "Compartido conmigo",
        d: "Son archivos de OTRA persona. Cuentan contra el espacio de quien los creó, no el tuyo — salvo que vos elijas \"Agregar a Mi unidad\".",
      },
      {
        h: "Reciente y Destacados",
        d: "Son vistas rápidas de archivos que ya están en Mi unidad o Compartido conmigo — no duplican nada.",
      },
      { h: "Proyectos", d: "Agrupa accesos directos a archivos relacionados con un tema — tampoco crea copias nuevas." },
    ],
  },
  // slide 12 del pptx original
  {
    type: "quiz",
    kind: "vf",
    question: "¿Un archivo que otra persona compartió con vos ocupa tu almacenamiento de Drive?",
    options: [
      { text: "Verdadero", correct: false },
      { text: "Falso", correct: true },
    ],
  },
  // slide 13 del pptx original
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué pasa si borrás un archivo de Drive por error?",
    options: [
      { text: "Se borra para siempre al instante", correct: false },
      { text: "Va a la papelera y podés recuperarlo por 30 días", correct: true },
      { text: "Se manda automáticamente a tu mail", correct: false },
      { text: "No se puede borrar nunca", correct: false },
    ],
  },
  // slide 14 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Ordená todo lo que armaste estos días",
    steps: [
      "Creá una carpeta con el nombre del curso.",
      "Movés ahí los archivos de Documentos, Hojas de cálculo, Presentaciones y Formularios que ya hiciste.",
      "Compartí la carpeta completa con alguien.",
    ],
    media: {
      id: "hg4-14",
      kind: "IMAGEN",
      caption: "Captura de una carpeta llamada \"Herramientas de Google\" con 4 archivos distintos adentro.",
    },
  },
  // slide 15 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Todo lo que armaste estos días, guardado y organizado en un mismo lugar.",
    body: "Ahora sí, cerramos con las dos últimas clases de Google Calendar.",
  },
  // slide 16 del pptx original
  { type: "divider", badge: "GOOGLE CALENDAR · PARTE 3", title: "Compartir y coordinar con otros" },
  // slide 16 del pptx original
  {
    type: "agenda",
    items: [
      "Compartir tu calendario completo",
      "Invitar a alguien a un evento puntual",
      "Calendarios múltiples (personal / trabajo)",
      "Extra: Gmail que agrega eventos solo",
    ],
  },
  // slide 17 del pptx original
  {
    type: "concept",
    kicker: "Para coordinar",
    title: "Por qué compartir tu calendario",
    body: "Con la familia, para saber quién lleva a los chicos al colegio.\n\nCon un socio de trabajo, para no pisarse los horarios.",
    media: {
      id: "hg4-17",
      kind: "IMAGEN",
      caption: "Foto de dos personas mirando juntas la pantalla de un celular con Google Calendar abierto.",
    },
  },
  // slide 18 del pptx original
  {
    type: "content",
    kicker: "Parte 3",
    title: "Niveles de permiso al compartir",
    rows: [
      {
        h: "Solo libre / ocupado",
        d: "La otra persona ve si estás disponible, sin ver el detalle. Es la opción por defecto.",
      },
      { h: "Todos los detalles", d: "Ve el título y la info completa de cada evento — lo elegís vos." },
      { h: "Puede editar", d: "La otra persona puede modificar tu calendario — para casos de mucha confianza." },
    ],
  },
  // slide 19 del pptx original
  {
    type: "concept",
    kicker: "Tranquilidad",
    title: "¿Qué ve la otra persona?",
    body: "Compartir tu calendario no muestra el detalle de tus eventos, salvo que vos elijas explícitamente mostrar más. Vos decidís cuánto ve cada persona.",
    media: {
      id: "hg4-19",
      kind: "IMAGEN",
      caption: "Captura de pantalla del calendario compartido visto desde otra cuenta, mostrando solo bloques \"ocupado\" sin detalle.",
    },
  },
  // slide 20 del pptx original
  {
    type: "content",
    kicker: "Checkpoint",
    title: "Repaso rápido: compartir calendario",
    rows: [
      { h: "¿Qué ve otra persona por defecto?", d: "Solo si estás libre u ocupado" },
      { h: "¿Puedo elegir mostrar más detalle?", d: "Sí, vos decidís el nivel de permiso" },
      { h: "¿Puedo compartir con más de una persona?", d: "Sí, las que quieras" },
    ],
  },
  // slide 21 del pptx original
  {
    type: "concept",
    kicker: "Evento a evento",
    title: "Invitar a un evento puntual",
    body: "No hace falta compartir todo el calendario para coordinar una reunión puntual.\n\nAlcanza con agregar a esa persona como invitada de ese evento.",
    media: {
      id: "hg4-21",
      kind: "GIF",
      caption: "GIF corto mostrando cómo se escribe un mail en el campo \"Invitados\" al crear un evento.",
    },
  },
  // slide 22 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Invitar a alguien a un evento",
    steps: [
      "Creá el evento como siempre.",
      "En \"Invitados\", escribí el mail de la persona.",
      "Fijate si Calendar avisa que tiene otro compromiso a esa hora.",
      "Guardá y enviá la invitación.",
    ],
  },
  // slide 23 del pptx original
  {
    type: "concept",
    kicker: "Del otro lado",
    title: "Qué recibe la otra persona",
    body: "Un mail con tres botones: Sí, No o Tal vez. Apenas responde, tu evento se actualiza solo.",
    media: {
      id: "hg4-23",
      kind: "IMAGEN",
      caption: "Captura de pantalla de un mail de invitación a un evento de Calendar, con los botones Sí / No / Tal vez visibles.",
    },
  },
  // slide 24 del pptx original
  {
    type: "concept",
    kicker: "Orden",
    title: "Calendarios múltiples",
    body: "Uno personal, y otro para el trabajo — separados o superpuestos.\n\nÚtil para no mezclar todo en un mismo lugar.",
    media: {
      id: "hg4-24",
      kind: "IMAGEN",
      caption: "Captura mostrando dos calendarios superpuestos con distinto color en la barra lateral de Google Calendar.",
    },
  },
  // slide 25 del pptx original
  {
    type: "content",
    kicker: "Casos de uso",
    title: "¿Cuándo conviene un segundo calendario?",
    rows: [
      { h: "Tenés uno o varios trabajos", d: "Separás tus compromisos personales de los laborales." },
      { h: "Coordinás con un equipo", d: "Podés activar o desactivar la vista según lo que necesites mirar." },
      {
        h: "Compartís uno y no el otro",
        d: "Elegís compartir solo el calendario de trabajo, y el personal queda privado.",
      },
    ],
  },
  // slide 26 del pptx original
  {
    type: "concept",
    kicker: "Extra",
    title: "Gmail que agrega eventos solo",
    body: "Un mail de confirmación de vuelo, turno o reserva puede aparecer solo en tu Calendar.\n\nNo hace falta cargarlo a mano — Calendar lo detecta.",
    media: {
      id: "hg4-26",
      kind: "IMAGEN",
      caption: "Captura de la sección \"Eventos de Gmail\" dentro de Google Calendar, mostrando un turno detectado automáticamente.",
    },
  },
  // slide 27 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Creá un evento compartido",
    steps: [
      "Invitá a un compañero del curso a un evento de prueba.",
      "Respondé la invitación que recibas del tuyo (Sí / No / Tal vez).",
      "Fijate cómo queda reflejado en tu Calendar.",
    ],
    media: {
      id: "hg4-27",
      kind: "IMAGEN",
      caption: "Captura de un evento con el ícono de \"invitados\" mostrando dos o más personas confirmadas.",
    },
  },
  // slide 28 del pptx original
  {
    type: "checkpoint",
    title: "Checklist de cierre de la parte 3",
    items: [
      "Compartí mi calendario con al menos una persona real.",
      "Invité a alguien a un evento y vi si tenía disponibilidad.",
      "Entiendo la diferencia entre compartir todo y invitar a un evento puntual.",
    ],
  },
  // slide 29 del pptx original
  {
    type: "content",
    kicker: "Glosario",
    title: "Palabras que vas a escuchar hoy",
    rows: [
      { h: "Calendario compartido", d: "Un calendario que otra persona puede ver desde su propia cuenta." },
      { h: "Invitado", d: "La persona que agregás a un evento puntual para coordinar con ella." },
      { h: "Disponibilidad", d: "Si una persona está libre u ocupada a una hora determinada." },
    ],
  },
  // slide 30 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Un calendario compartido activo con alguien real.",
    body: "La próxima clase, la última: le sumamos IA a todo esto.",
  },
  // slide 31 del pptx original
  { type: "divider", badge: "GOOGLE CALENDAR · PARTE 4", title: "Puente: organizar la agenda hablando, con IA" },
  // slide 31 del pptx original
  {
    type: "agenda",
    items: [
      "Cómo conectar Claude a tu Google Calendar",
      "Un solo mensaje para crear tus eventos",
      "Lo mismo con Documentos, Hojas y Presentaciones",
      "Tip final: agendale a alguien que no es tan digital",
    ],
  },
  // slide 32 del pptx original
  {
    type: "concept",
    kicker: "Repaso general",
    title: "Lo que aprendiste en 3 clases",
    body: "Parte 1: crear eventos. Parte 2: recordatorios y colores. Parte 3: compartir y coordinar.\n\nHoy le sumamos IA a todo eso, y cerramos el curso.",
    media: {
      id: "hg4-32",
      kind: "IMAGEN",
      caption: "Ilustración simple tipo línea de tiempo con los íconos de las 3 clases anteriores.",
    },
  },
  // slide 33 del pptx original
  {
    type: "steps",
    kicker: "Conectá Claude",
    title: "Antes de arrancar: dale permiso a Claude",
    steps: [
      "En el chat de Claude, tocá el signo \"+\" al lado del mensaje.",
      "Pasá el mouse sobre \"Conectores\".",
      "Activá Google Calendar (y Drive, si después vas a crear documentos).",
      "La primera vez, Claude te pide iniciar sesión con tu cuenta de Google — aceptá los permisos.",
    ],
  },
  // slide 34 del pptx original
  {
    type: "concept",
    kicker: "El puente",
    title: "Claude como atajo",
    body: "Claude no es parte de Google, pero se conecta a tu cuenta con tu permiso, en un par de clics.\n\nLe escribís en lenguaje natural, y arma el evento directo en tu Calendar.",
    media: {
      id: "hg4-34",
      kind: "IMAGEN",
      caption: "Captura del menú \"Conectores\" de Claude, mostrando Google Calendar activado.",
    },
  },
  // slide 35 del pptx original
  {
    type: "content",
    kicker: "Para aprovecharlo bien",
    title: "Cada corrección cuenta",
    rows: [
      { h: "Pedilo todo junto", d: "Mejor un solo mensaje con todos los datos, que ir corrigiendo de a uno." },
      {
        h: "Cada ajuste es un mensaje nuevo",
        d: "Cambiar el color o el horario después también consume tu cuota de mensajes.",
      },
      {
        h: "El plan gratuito también sirve",
        d: "Los conectores de Google están disponibles en todos los planes, incluido el gratuito.",
      },
    ],
  },
  // slide 36 del pptx original
  {
    type: "concept",
    kicker: "Prompt destacado",
    title: "Un evento, un solo mensaje",
    body: "Creá este evento en mi Google Calendar: Partido de Pádel, viernes 25 de septiembre de 2026, de 20 a 22, en Sporting Club Tres Cerritos, avisos 60 y 30 minutos antes, no se repite.\n\nCuantos más datos completos en un solo mensaje, menos idas y vueltas después.",
    media: {
      id: "hg4-36",
      kind: "IMAGEN",
      caption: "Captura de Calendar mostrando el evento ya creado por la IA, con fecha, hora y lugar correctos.",
    },
  },
  // slide 37 del pptx original
  {
    type: "content",
    kicker: "Campos útiles",
    title: "Qué conviene incluir en el mensaje",
    rows: [
      { h: "Título y fecha completa", d: "Con día, mes y año — \"el viernes\" solo es ambiguo." },
      { h: "Hora de inicio (y de fin)", d: "Si no ponés hora de fin, se asume una hora de duración." },
      { h: "Avisos y repetición", d: "Opcional: minutos u horas antes, y si se repite y hasta cuándo." },
    ],
  },
  // slide 38 del pptx original
  {
    type: "content",
    kicker: "Checkpoint",
    title: "Repaso rápido: Claude y tu agenda",
    rows: [
      { h: "¿Claude puede crear eventos directo en mi Calendar?", d: "Sí, si le diste permiso" },
      { h: "¿Tengo que revisar lo que arma la IA?", d: "Siempre, antes de darlo por bueno" },
      { h: "¿Necesito otra cuenta para usar Claude?", d: "No, se conecta con tu misma cuenta de Google" },
    ],
  },
  // slide 39 del pptx original
  {
    type: "concept",
    kicker: "Caso práctico",
    title: "Armá tu semana con una lista propia",
    body: "Escribí o dictá una lista de 5 pendientes reales de tu semana.\n\nPedile a Claude que te los organice en el Calendar.",
    media: {
      id: "hg4-39",
      kind: "GIF",
      caption: "GIF corto mostrando a alguien dictando una lista de pendientes en voz alta al celular.",
    },
  },
  // slide 40 del pptx original
  {
    type: "concept",
    kicker: "Prompt destacado",
    title: "Una lista completa, organizada sola",
    body: "Organizame esta lista en mi Calendar de la semana que viene, en horarios razonables, y avisame con recordatorio 1 hora antes de cada uno.",
    media: {
      id: "hg4-40",
      kind: "IMAGEN",
      caption: "Captura de una semana de Calendar completa, armada a partir de una lista de pendientes.",
    },
  },
  // slide 41 del pptx original
  {
    type: "content",
    kicker: "Importante",
    title: "Corrección y ajuste",
    rows: [
      { h: "¿Los horarios tienen sentido?", d: "Revisá que no haya nada a las 3 de la mañana por error." },
      { h: "¿Hay superposiciones?", d: "Dos eventos a la misma hora — corregilo a mano." },
      { h: "La decisión final es tuya", d: "La IA arma un borrador útil, pero quien confirma sos vos." },
    ],
  },
  // slide 42 del pptx original
  {
    type: "concept",
    kicker: "También funciona con...",
    title: "Documentos, Hojas y Presentaciones",
    body: "Con Drive conectado (Clase de hoy, paso 1), Claude también crea y guarda archivos directo en tu cuenta.\n\nMismo criterio que con Calendar: un solo mensaje, con el contenido ya definido.",
    media: {
      id: "hg4-42",
      kind: "IMAGEN",
      caption: "Captura del menú de Conectores con Google Calendar y Google Drive activados.",
    },
  },
  // slide 43 del pptx original
  {
    type: "quote",
    kicker: "Para un documento",
    title: "Crear un Documento de Google",
    quoteLabel: "Prompt modelo",
    quoteText: "Creá un documento de Google en mi Drive que se llame \"Ideas para mi emprendimiento\", con este contenido: una lista de 5 ideas de productos que podría vender, cada una con un título y una descripción de dos líneas.",
    caption: "Funciona muy bien para texto: notas de una reunión, un instructivo, una carta.",
  },
  // slide 44 del pptx original
  {
    type: "quote",
    kicker: "Para una hoja de cálculo",
    title: "Crear una Hoja de cálculo",
    quoteLabel: "Prompt modelo",
    quoteText: "Creá una hoja de cálculo de Google en mi Drive que se llame \"Control de gastos de septiembre\", con columnas Fecha, Concepto y Monto, y cargá estos gastos: 3/9 Alquiler del local $150.000, 5/9 Internet $12.000, 10/9 Compra de insumos $45.000.",
    caption: "Cuanto más ordenados le des los datos (fecha, concepto y monto, uno por uno), mejor arma la tabla.",
  },
  // slide 45 del pptx original
  {
    type: "quote",
    kicker: "Para una presentación",
    title: "Crear una Presentación",
    quoteLabel: "Prompt modelo",
    quoteText: "Armame una presentación de 5 diapositivas para mostrar mi emprendimiento de tortas caseras: portada, quién soy, qué vendo, precios, y cómo contactarme. Dejámela lista para descargar.",
    caption: "A diferencia de Documentos y Hojas, acá Claude arma el archivo y te lo da para descargar — lo subís a tu Drive y elegís \"Abrir con → Presentaciones de Google\" para convertirlo.",
  },
  // slide 46 del pptx original
  {
    type: "content",
    kicker: "Antes de enseñarlo",
    title: "3 cosas para tener en cuenta",
    rows: [
      { h: "Fecha completa, siempre", d: "Día, mes y año — vale para Calendar y para cualquier fecha que menciones." },
      { h: "Cada acción pide tu aprobación", d: "Crear, enviar o borrar algo: Claude te lo confirma antes de hacerlo." },
      {
        h: "Formularios, todavía no",
        d: "Los formularios de Google no se pueden crear así — necesitan otro camino que no vimos en este curso.",
      },
    ],
  },
  // slide 47 del pptx original
  {
    type: "concept",
    kicker: "El cierre del curso",
    title: "Y ahora, el tip más importante",
    body: "No todos en tu vida van a tomar este curso.\n\nPero podés armarles la agenda vos, sin que tengan que aprender nada.",
    media: {
      id: "hg4-47",
      kind: "IMAGEN",
      caption: "Foto cálida de una persona mayor sonriendo mientras mira su celular, acompañada por un familiar.",
    },
  },
  // slide 48 del pptx original
  {
    type: "concept",
    kicker: "El tip final del curso",
    title: "Agendale a alguien que no es tan digital",
    body: "Creás un evento recurrente \"Tomar la pastilla\" todos los días a una hora fija, e invitás por mail a tu mamá. Ella solo necesita tener Google Calendar instalado con su cuenta — nada más. El evento le queda integrado directo en SU propio Calendar.\n\nNo es compartir todo el calendario (eso fue la Parte 3): es crear vos el evento y que le llegue integrado a la otra persona, sin que tenga que aprender nada.",
  },
  // slide 49 del pptx original
  {
    type: "steps",
    kicker: "Cómo se hace",
    title: "Armarle un evento a otra persona",
    steps: [
      "Creá el evento (ej. \"Tomar la pastilla\").",
      "Marcalo como recurrente si corresponde.",
      "En \"Invitados\", escribí su mail.",
      "Guardá y enviá — listo.",
    ],
  },
  // slide 50 del pptx original
  {
    type: "steps",
    kicker: "Manos a la obra",
    title: "Pensá en alguien de tu entorno",
    steps: [
      "Elegí a una persona real: un familiar, tu pareja, un socio de trabajo.",
      "Armale un evento de prueba pensado para ella.",
      "Si no tenés su mail a mano, usá uno propio secundario.",
    ],
    media: {
      id: "hg4-50",
      kind: "IMAGEN",
      caption: "Captura de un evento recurrente con un invitado agregado, listo para enviar.",
    },
  },
  // slide 51 del pptx original
  {
    type: "checkpoint",
    title: "Antes de irte, revisá todo lo que lograste",
    items: [
      "Sé crear, compartir y colorear eventos en Google Calendar.",
      "Sé invitar a otra persona a un evento puntual.",
      "Sé conectar Claude y pedirle que me arme la semana.",
      "Sé armarle la agenda a alguien que no es tan digital.",
    ],
  },
  // slide 52 del pptx original
  {
    type: "content",
    kicker: "Resumen",
    title: "Todo lo que te llevás del curso",
    rows: [
      {
        h: "Un sistema propio y funcionando",
        d: "Eventos, recordatorios, colores y calendarios compartidos — armados por vos, con casos reales.",
      },
      {
        h: "Dos formas de cargar tu agenda",
        d: "A mano, prolija y a tu ritmo — o pidiéndole a Claude que te arme un borrador.",
      },
      {
        h: "Una forma de cuidar a otros",
        d: "Ya sabés armarle la agenda a alguien que no es tan digital, sin que tenga que aprender nada.",
      },
    ],
  },
  // slide 53 del pptx original
  {
    type: "concept",
    kicker: "Te lo llevás hecho",
    title: "Tu agenda semanal armada con IA — y el truco para armarle la agenda a quien más lo necesita.",
    body: "Ya sabés conectar Claude a tu Calendar, Drive, Documentos, Hojas de cálculo y Presentaciones. Probalo esta semana con algo real.",
  },
];
