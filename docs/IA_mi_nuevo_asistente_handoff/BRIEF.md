# Curso "IA, mi nuevo asistente" — Brief de traspaso a proyecto web

Contexto para retomar este trabajo en otro entorno (Claude en VS Code / Claude Code local).

## 1. Quién soy y para qué es esto

Ivan, desarrollador fullstack (Python/Django, Next.js/React/TS, PostgreSQL/MySQL, Docker, AWS), freelance, Salta, Argentina.

Estoy preparando material pago para la Municipalidad de Salta, programa "Escuela de Emprendedores". Ya dicté un curso anterior ("Herramientas de Google", 4 días, ya finalizado). Ahora estoy armando un curso NUEVO:

**Nombre del curso: "IA, mi nuevo asistente"**
4 clases de 2 horas reloj cada una (16 a 18 hs). Es alfabetización general en IA / uso cotidiano — no es sobre Google, es sobre cómo usar un asistente de IA (Claude, ChatGPT, Gemini) en el día a día.

## 2. Decisión de formato (lo último que charlamos)

Veníamos armando el contenido como decks de PowerPoint (.pptx) generados por código (pptxgenjs). La Clase 1 ya está completa en pptx (38 diapositivas) — ver `clase1_content.js` adjunto, que tiene TODO el contenido ya escrito y aprobado para esa clase.

Al ver la Clase 1 armada, el feedback fue: "el contenido está genial, pero la paleta de colores es muy genérica". En vez de seguir iterando con pptx (caro de regenerar), armamos una **maqueta HTML/CSS** de diapositivas de ejemplo en estilo "tecnológico" con buen contraste, para definir la identidad visual más barato. Esa maqueta es `Main.dc.html` (adjunto) — usa:

- Fondo oscuro casi negro (`#0B0F14`), panel `#121826`, texto `#EDF1F7`, texto secundario `#8A93A6`.
- Tipografías: **Space Grotesk** (títulos), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (etiquetas/kickers) — explícitamente NO Inter/Roboto/Arial (se sentían genéricas).
- 4 colores de acento, uno por clase (pensados para que se puedan ajustar, todavía no cerrados en definitivo):
  - Clase 1: cian `#22D3EE`
  - Clase 2: naranja `#FF6A3D`
  - Clase 3: violeta `#7C5CFF`
  - Clase 4: verde-azulado `#2EE6A8`
- Estilo general: sin gradientes tipo "wash", sin tarjetas con borde-izquierdo-de-color cliché, sin emojis — líneas finitas, acentos sólidos, tipografía mono para metadatos, mucho contraste.

**Decisión tomada ahora:** en vez de seguir en pptx, pasar la Clase 1 (y luego las demás) a una **página web real, para desplegar en Netlify**. La idea es construir un "motor" liviano que lea el contenido de las diapositivas como datos (JSON/objetos), reusando el diseño validado en la maqueta, para poder seguir iterando el contenido rápido sin tocar el motor. Más adelante, si hace falta, se puede volver a exportar/adaptar a pptx para Genially o para imprimir, pero la prioridad ahora es probar esta modalidad web.

## 3. Reglas de producción (aplican a TODO el contenido, cualquiera sea el formato final)

- Antes de cada pregunta/quiz tiene que haber contenido real que la sustente (nunca preguntar algo que no se explicó antes).
- Meter bastantes preguntas/quizzes para que sea interactivo y dinámico (no solo teoría seguida).
- Colores que se vean bien proyectados (alto contraste, nada de tonos pálidos/pastel que se laven con proyector).
- Letra grande y ancha, nada de fuentes finitas/chicas — tiene que leerse desde el fondo del salón.
- En cada clase: ejemplos precisos y concretos, errores comunes cuando corresponda, y recomendaciones.
- La Clase 4 NO debe tener gancho hacia "Herramientas de Google" (ese curso ya se dictó, no corresponde).

## 4. Estructura completa de las 4 clases

(Ver también `IA_mi_nuevo_asistente_Resumen_Curso.pdf` adjunto — tiene el desglose completo con tiempos por bloque.)

- **Clase 1 — Qué es esto y cómo le hablo**: conceptos (tokens, contexto, chat, proyecto, con analogías — ej. "los tokens son como nuestra moneda de intercambio"), límites (alucinaciones), primer contacto (crear cuenta — incluye mini-guías de instalación de Claude, ChatGPT y Gemini, las 3), cómo pedir bien las cosas, cierre con reglas de oro. CONTENIDO COMPLETO YA ESCRITO en `clase1_content.js` (38 slides).
- **Clase 2 — Crear, entender y comunicarte**: combina tres ejes aprobados — creativa/brainstorming, entender y comunicar, changa/emprendimiento — en una clase con apertura + 3 bloques de contenido + práctica integradora + cierre. Contenido detallado: pendiente de escribir (ver resumen PDF para la distribución de tiempos ya definida).
- **Clase 3 — Organización de la vida diaria**: listas y planes, presupuestos básicos, comparar opciones con criterios. Contenido detallado: pendiente.
- **Clase 4 — Decisiones y cuidado digital**: combina tres ejes aprobados — decisiones importantes, casa y bolsillo, cuidado y sentido crítico — SIN gancho hacia Herramientas de Google. Contenido detallado: pendiente.

## 5. Archivos adjuntos en este paquete

- `clase1_content.js` — contenido completo y aprobado de la Clase 1 (38 slides), en formato de descriptores JS (`{type, params}`) pensado originalmente para pptxgenjs. Sirve como FUENTE DE CONTENIDO (textos, ejemplos, preguntas de quiz con respuesta correcta) para portear a la web — no hace falta reescribir el contenido, solo re-renderizarlo.
- `Main.dc.html` — maqueta visual HTML/CSS con 6 tipos de diapositiva de ejemplo (portada, divisor, concepto+analogía, quiz V/F, pasos, comparación) en el estilo tecnológico acordado. Es la referencia de diseño para construir los componentes de la web (colores, tipografías, espaciados, estados de quiz correcto/incorrecto).
- `IA_mi_nuevo_asistente_Resumen_Curso.pdf` — resumen imprimible de las 4 clases completas: temario, subtemas y distribución de tiempos por bloque de cada clase (fechas puestas como "A confirmar" porque todavía no están fijadas).

## 6. Qué falta

- Construir el proyecto web (sugerido: motor simple tipo reveal.js a medida, o un framework liviano como Astro/Vite + React, con el contenido de cada clase como datos separados del render) y desplegarlo en Netlify.
- Definir los colores finales de la paleta (la maqueta deja 4 acentos + fondo editables, pero no están cerrados).
- Escribir el contenido detallado de Clases 2, 3 y 4 (por ahora solo está el temario/tiempos, no el texto slide por slide como en la Clase 1).
