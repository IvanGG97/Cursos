import type { Slide } from "@/content/types";

// Clase 3 — Organización de la vida diaria. Bloques y tiempos según el resumen del curso (PDF).
// Mismas reglas que la Clase 1: contenido antes de cada quiz, ejemplos concretos, error común y
// recomendación en cada bloque. Los montos son de ejemplo (los precios reales los pone cada uno).

const FALSO = [
  { text: "Verdadero", correct: false },
  { text: "Falso", correct: true },
];

export const clase3Slides: Slide[] = [
  // ---------- PORTADA ----------
  {
    type: "title",
    claseLine: "Clase 3 — Organización de la vida diaria",
    subtitle: "Listas, planes, presupuestos y comparar opciones",
    duracion: "Clase de 2 horas",
  },

  // ---------- AGENDA ----------
  {
    type: "agenda",
    items: [
      "Repaso de la Clase 2",
      "Armar listas y planes",
      "Presupuestos básicos",
      "Comparar opciones con criterios",
      "Cierre: organizá tu semana",
    ],
  },

  // ===================== APERTURA =====================
  { type: "divider", badge: "APERTURA · 10 MIN", title: "Repaso de la Clase 2", subtitle: "Crear, entender y comunicarte" },
  {
    type: "content",
    kicker: "Repaso",
    title: "Lo que vimos la clase pasada",
    rows: [
      { h: "Ideas", d: "cantidad + criterios. Elegir y mejorar es tu parte." },
      { h: "Entender", d: "\"explicámelo en simple\", y fechas y montos en el original." },
      { h: "Comunicar", d: "\"mejorá esto, pero mantené mi forma de escribir\"." },
      { h: "Tu negocio", d: "precios, plazos y condiciones los ponés vos." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Querés que la IA mejore un mensaje tuyo sin que pierda tu estilo. ¿Qué le pedís?",
    options: [
      { text: "\"Reescribí todo.\"", correct: false },
      { text: "\"Mejorá esto, pero mantené mi forma de escribir.\"", correct: true },
      { text: "\"Hacelo más formal y más largo.\"", correct: false },
    ],
    explanation: "Así mejora el mensaje sin que deje de sonar a vos.",
  },
  {
    type: "concept",
    kicker: "Hoy",
    title: "La IA como organizadora",
    body: "Hoy la usamos para ordenar la vida diaria: armar listas y planes, hacer las cuentas de un gasto grande y comparar opciones antes de decidir. Cosas que ya hacés, pero en menos tiempo.",
    analogy: "Es como tener a alguien que te ayuda a ordenar el placard: vos decidís qué queda, pero te lo separa en pilas.",
  },

  // ===================== BLOQUE 1: LISTAS Y PLANES =====================
  { type: "divider", badge: "BLOQUE 1 · 30 MIN", title: "Armar listas y planes", subtitle: "Menú, compras y salidas, sin hoja en blanco" },
  {
    type: "concept",
    kicker: "La idea",
    title: "Tus datos entran, un plan sale",
    body: "La IA arma listas y planes muy rápido, pero solo te sirven si le contás tu realidad: cuántos son en casa, cuánto tiempo tenés, qué les gusta y qué no. Sin eso, te arma un plan para nadie.",
    analogy: "Es como mandar a alguien a hacer las compras: si no le decís para cuántos ni qué les gusta, vuelve con cualquier cosa.",
  },
  {
    type: "quote",
    kicker: "Ejemplo 1",
    title: "Menú semanal",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Armame un menú de cenas de lunes a viernes para una familia de 4, con dos chicos. Comidas simples, de menos de 40 minutos, económicas y sin pescado. Que el lunes y el miércoles sobre para el almuerzo del día siguiente.\"",
    caption: "Cuántos son, cuánto tiempo, presupuesto, lo que no va y un detalle práctico.",
  },
  {
    type: "content",
    kicker: "Ejemplo 2",
    title: "Del menú a la lista de compras",
    rows: [
      { h: "En el mismo chat", d: "\"ahora pasame la lista de compras para ese menú\": ya tiene el contexto." },
      { h: "Por sector y con cantidades", d: "verdulería, almacén, carnicería, con cantidades para 4: revisalas vos." },
      { h: "Sin lo que ya tenés", d: "\"ya tengo arroz, fideos y aceite: sacalos de la lista\"." },
    ],
    media: {
      id: "c3-lista",
      kind: "IMAGEN",
      caption: "Captura del celular, en castellano: una lista de compras armada por la IA, ordenada por sector.",
    },
  },
  {
    type: "quote",
    kicker: "Ejemplo 3",
    title: "Un plan de viaje simple",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Vamos a Cafayate un fin de semana, en auto desde Salta: dos adultos y un nene de 6 años. Armame un plan para el sábado y el domingo con paradas para descansar, cosas para hacer con chicos y una opción por si llueve.\"",
    caption: "Horarios, precios y si un lugar está abierto: confirmalo antes de salir (puede alucinar).",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "pedir \"armame un menú\" sin decir para cuántos, ni el presupuesto, ni qué no comen." },
      { h: "Recomendación", d: "tus datos primero: personas, tiempo, presupuesto y lo que no va." },
      { h: "Tip extra", d: "pedí el formato: \"en una tabla por día\" o \"en una lista para mandar por WhatsApp\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué pedido de menú semanal va a funcionar mejor?",
    options: [
      { text: "\"Armame un menú.\"", correct: false },
      { text: "\"Menú de cenas para 2 adultos, de lunes a viernes, sin carne roja, rápido de hacer y económico.\"", correct: true },
      { text: "\"¿Qué como esta semana?\"", correct: false },
    ],
    explanation: "Dice para cuántos, qué días, qué no va, cuánto tiempo y el presupuesto.",
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué datos le das para una buena lista de compras?",
    options: [
      { text: "Para cuántas personas es.", correct: true },
      { text: "Lo que ya tenés en casa.", correct: true },
      { text: "El número de tu tarjeta.", correct: false },
    ],
    explanation: "Para cuántos es y lo que ya tenés (además del menú). La tarjeta, nunca: es regla de oro.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si en el plan de viaje la IA dice que un lugar abre a las 9, no hace falta chequearlo.",
    options: FALSO,
    explanation: "Horarios, precios y si algo está abierto son datos que puede inventar: se confirman antes de salir.",
  },
  {
    type: "practice",
    title: "Tu menú y tu lista",
    instructions:
      "Pedile a la IA un menú de 3 días para tu casa, con tus datos: cuántos son, cuánto tiempo tenés y qué no comen.\n\nDespués, en el mismo chat, pedile la lista de compras ordenada por sector, sacando lo que ya tenés.",
  },

  // ===================== BLOQUE 2: PRESUPUESTOS =====================
  { type: "divider", badge: "BLOQUE 2 · 30 MIN", title: "Presupuestos básicos", subtitle: "Cuentas claras para un gasto grande" },
  {
    type: "concept",
    kicker: "La idea",
    title: "Un desglose de gastos, en minutos",
    body: "Para un cumpleaños, un arreglo de la casa o una compra grande, la IA te ayuda a armar el desglose: qué cosas hay que pagar, cuánto sale cada una y cuánto da el total.",
    analogy: "Es como hacer la cuenta en una servilleta, pero prolija, separada por rubro y sin olvidarte de nada.",
  },
  {
    type: "content",
    kicker: "Clave",
    title: "Los precios los ponés vos",
    rows: [
      { h: "No sabe los precios de hoy", d: "no tiene los precios actuales de tu ciudad: si se los pedís, los puede inventar." },
      { h: "Pedile los rubros", d: "\"¿qué gastos tengo que tener en cuenta para...?\": ahí es muy buena." },
      { h: "Completá los precios", d: "los que averiguaste en el súper, en el corralón o preguntando." },
      { h: "Ella ordena y suma", d: "y te avisa si te pasás del presupuesto." },
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo con números",
    title: "El cumple, con cuentas claras",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Organizo el cumple de mi hijo: 30 personas, en casa. Tengo $250.000. Averigüé: torta $45.000, bebidas $60.000, comida $90.000, cotillón $20.000 y piñata $15.000. Armame una tabla con el total, decime cuánto me sobra o me falta y qué podría recortar.\"",
    caption: "Los montos son de ejemplo: usá los que averigües vos.",
  },
  {
    type: "content",
    kicker: "Ojo con las cuentas",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "copiar el total sin revisar: a veces se equivoca al sumar, sobre todo con muchos números." },
      { h: "Recomendación", d: "pedile que muestre la cuenta paso a paso, y chequeá el total con la calculadora." },
      { h: "Tip extra", d: "pedí un margen: \"sumá un 10% para imprevistos\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Con los números del ejemplo (torta, bebidas, comida, cotillón y piñata) y $250.000 de presupuesto, ¿cuánto sobra?",
    options: [
      { text: "$20.000", correct: true },
      { text: "$30.000", correct: false },
      { text: "No alcanza: faltan $10.000", correct: false },
    ],
    explanation: "45.000 + 60.000 + 90.000 + 20.000 + 15.000 = 230.000. De 250.000, sobran 20.000. Así se chequea la cuenta.",
  },
  {
    type: "content",
    kicker: "Compra grande",
    title: "Antes de comprar una heladera",
    rows: [
      { h: "Contado o cuotas", d: "pasale las dos opciones: \"¿cuánto pago en total en cada una?\"." },
      { h: "Gastos que se olvidan", d: "envío, instalación, flete: pedile que te los recuerde." },
      { h: "Lo que podés por mes", d: "\"puedo pagar hasta $X por mes: ¿qué opción me entra?\"." },
      { h: "Lo real", d: "la tasa, el precio final y las condiciones se confirman en la tienda o el banco." },
    ],
  },
  {
    type: "quiz",
    kind: "vf",
    question: "La IA conoce los precios actualizados de los supermercados de tu ciudad.",
    options: FALSO,
    explanation: "No tiene los precios de hoy: si se los pedís, los puede inventar. Los precios reales los ponés vos.",
  },
  {
    type: "quiz",
    kind: "single",
    question: "Le pasaste a la IA 8 gastos para un evento y te dio el total. ¿Qué conviene hacer?",
    options: [
      { text: "Usar el total tal cual: la IA no se equivoca con números.", correct: false },
      { text: "Pedirle la cuenta paso a paso y chequear el total con la calculadora.", correct: true },
      { text: "Preguntarle en otro chat si el total está bien.", correct: false },
    ],
    explanation: "A veces se equivoca al sumar. La cuenta paso a paso y la calculadora te sacan la duda.",
  },
  {
    type: "practice",
    title: "Tu presupuesto",
    instructions:
      "Elegí un gasto que tengas cerca: un cumple, una salida, arreglar algo de la casa.\n\nPrimero pedile a la IA la lista de gastos a tener en cuenta. Después completá los precios que conozcas y pedile la tabla con el total. Revisá la suma con la calculadora del celular.",
  },

  // ===================== BLOQUE 3: COMPARAR OPCIONES =====================
  { type: "divider", badge: "BLOQUE 3 · 35 MIN", title: "Comparar opciones con criterios", subtitle: "\"Ayudame a decidir entre A y B\"" },
  {
    type: "concept",
    kicker: "La idea",
    title: "Comparar, no adivinar",
    body: "\"¿Qué me conviene?\" es una de las preguntas que más se le hacen a la IA. Te puede ayudar muchísimo a comparar, pero solo si le decís qué es importante para vos: lo que le conviene a otro no tiene por qué convenirte a vos.",
    analogy: "Es como pedirle consejo a un amigo que sabe: antes de opinar, te pregunta cuánto querés gastar y para qué lo necesitás.",
  },
  {
    type: "content",
    kicker: "Criterios",
    title: "Cuáles son tus criterios",
    rows: [
      { h: "Presupuesto", d: "cuánto podés gastar, de contado o por mes." },
      { h: "Prioridades", d: "qué te importa más: que dure, que gaste poco, que sea rápido." },
      { h: "Restricciones", d: "lo que no se puede: espacio, horarios, distancia." },
      { h: "Uso real", d: "para qué y cuánto lo vas a usar." },
    ],
  },
  {
    type: "compare",
    kicker: "En vivo",
    title: "La misma pregunta, dos formas",
    left: "\"¿Qué lavarropas me conviene, el A o el B?\"",
    right:
      "\"Comparame estos dos lavarropas (te pego los datos de cada uno). Somos 4, lavo casi todos los días, puedo gastar hasta $800.000 y me importa que gaste poca luz y agua. Hacé una tabla y decime cuál elegirías según eso.\"",
  },
  {
    type: "steps",
    kicker: "Paso a paso",
    title: "Cómo pedir una comparación",
    steps: [
      "Contale qué tenés que decidir y entre qué opciones.",
      "Pasale los datos de cada una: copiá las características de la publicación o del folleto.",
      "Decile tus criterios: presupuesto, prioridades y restricciones.",
      "Pedile una tabla y una recomendación explicada según tus criterios.",
    ],
  },
  {
    type: "quote",
    kicker: "Ejemplo",
    title: "Elegir entre dos changas",
    quoteLabel: "LE PEDIMOS",
    quoteText:
      "\"Me ofrecieron dos changas para los sábados. A: pintar un local, $80.000 por día, a 40 minutos en colectivo. B: atender una verdulería, $60.000 por día, a 10 cuadras de casa. Tengo dos hijos y me importa volver temprano. Comparalas con esos criterios.\"",
    caption: "No es solo la plata: la comparación tiene en cuenta lo que le dijiste que te importa.",
  },
  {
    type: "content",
    kicker: "Para tener en cuenta",
    title: "Error común y recomendación",
    rows: [
      { h: "Error común", d: "preguntar \"¿cuál me conviene?\" sin tus criterios: te contesta lo que le convendría a cualquiera." },
      { h: "Recomendación", d: "siempre tus criterios y restricciones reales antes de pedir la comparación." },
      { h: "Ojo", d: "si menciona características que no le pasaste, pueden ser inventadas: usá las de la publicación." },
      { h: "La decisión", d: "es tuya: la tabla te ordena las opciones, no decide por vos." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "Querés cambiar de plan de celular. ¿Qué pedido es mejor?",
    options: [
      { text: "\"¿Qué plan me conviene?\"", correct: false },
      { text: "\"Comparame estos dos planes (te pego los datos): uso mucho WhatsApp, casi no llamo y puedo pagar hasta $20.000 por mes.\"", correct: true },
      { text: "\"¿Cuál es la mejor compañía de celular?\"", correct: false },
    ],
    explanation: "Le pasa los datos de cada plan y sus criterios: uso real y presupuesto.",
  },
  {
    type: "quiz",
    kind: "multi",
    question: "¿Qué criterios conviene darle antes de comparar?",
    options: [
      { text: "Tu presupuesto.", correct: true },
      { text: "Para qué lo vas a usar.", correct: true },
      { text: "Qué te importa más.", correct: true },
      { text: "La contraseña de tu banco.", correct: false },
    ],
    explanation: "Presupuesto, uso real y prioridades. Las contraseñas, nunca.",
  },
  {
    type: "quiz",
    kind: "vf",
    question: "Si la IA arma la tabla y recomienda una opción, la decisión ya está tomada.",
    options: FALSO,
    explanation: "La tabla te ordena las opciones; la decisión sigue siendo tuya.",
  },
  {
    type: "practice",
    title: "Tu comparación",
    instructions:
      "Pensá en algo que tengas que decidir: un electrodoméstico, un plan de celular o de internet, dos changas, dos escuelas.\n\nPedile a la IA una tabla comparando las opciones con TUS criterios. Después cambiá una prioridad y fijate si cambia la recomendación.",
  },

  // ===================== CIERRE =====================
  { type: "divider", badge: "CIERRE · 15 MIN", title: "Cierre", subtitle: "Organizá tu semana" },
  {
    type: "steps",
    kicker: "Práctica final",
    title: "Tu semana, organizada",
    steps: [
      "Contale a la IA tus horarios fijos: trabajo, chicos, trámites, turnos.",
      "Agregá lo que tenés pendiente esta semana, y qué es lo más urgente.",
      "Pedile un plan día por día, con un rato libre de verdad.",
      "Ajustalo (\"el miércoles a la tarde no puedo\") hasta que te sirva.",
    ],
  },
  {
    type: "content",
    kicker: "Para recordar",
    title: "Las claves de hoy",
    rows: [
      { h: "Listas y planes", d: "tus datos primero: cuántos son, tiempo, presupuesto y lo que no va." },
      { h: "Presupuestos", d: "la IA ordena y suma; los precios reales los ponés vos." },
      { h: "Cuentas", d: "pedí el paso a paso y revisá con la calculadora." },
      { h: "Comparar", d: "tus criterios antes de preguntar \"¿cuál me conviene?\"." },
    ],
  },
  {
    type: "quiz",
    kind: "single",
    question: "¿Qué tienen en común un buen menú, un buen presupuesto y una buena comparación hechos con IA?",
    options: [
      { text: "Que la IA decide por vos.", correct: false },
      { text: "Que vos le das tus datos reales: personas, precios y criterios.", correct: true },
      { text: "Que hace falta la versión paga.", correct: false },
    ],
    explanation: "En los tres casos, la respuesta es tan buena como los datos reales que le das.",
  },
  {
    type: "checkpoint",
    title: "Hoy te llevás...",
    items: [
      "Un menú y una lista de compras hechos a tu medida.",
      "Un presupuesto con el total revisado.",
      "Una forma de comparar opciones según lo que te importa.",
      "Tu semana organizada (o casi).",
    ],
  },
  {
    type: "divider",
    badge: "LA PRÓXIMA CLASE",
    title: "Clase 4: Decisiones y cuidado digital",
    subtitle: "Trámites, casa y bolsillo, y sentido crítico",
  },
];
