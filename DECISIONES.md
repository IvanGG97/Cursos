# Decisiones del proyecto — "IA, mi nuevo asistente"

Registro de decisiones que importan a futuro. Una línea por decisión, con fecha. Releer antes de cada tarea nueva.

## Curso y contenido

- 2026-10-01 — Curso de 4 clases de 2 h (16 a 18 hs) para la Escuela de Emprendedores (Municipalidad de Salta). Estructura y tiempos por bloque según `docs/IA_mi_nuevo_asistente_handoff/IA_mi_nuevo_asistente_Resumen_Curso.pdf`.
- 2026-10-01 — El contenido de la Clase 1 (`clase1_content.js`, 38 slides) es fuente de verdad: se portea tal cual, no se reescribe.
- 2026-10-01 — Regla de contenido: antes de cada quiz tiene que haber contenido que lo explique; nunca preguntar algo no explicado antes.
- 2026-10-01 — Regla de contenido: varias preguntas/quizzes por clase para que sea dinámico.
- 2026-10-01 — Regla de contenido: ejemplos concretos y específicos, errores comunes cuando corresponda y recomendaciones en cada bloque.
- 2026-10-01 — La Clase 4 no lleva ningún gancho hacia el curso "Herramientas de Google" (ya se dictó).
- 2026-10-01 — Las decisiones importantes se registran en este archivo (DECISIONES.md), sin que haga falta pedirlo.

## Formato y tecnología

- 2026-10-01 — El curso pasa de pptx a web. Exportar a pptx/Genially queda como opción futura, no prioritaria.
- ~~2026-10-01 — Stack: Vite + React + TypeScript con deploy en Netlify y rutas por hash.~~ Reemplazada el mismo día por la plataforma Next (ver abajo).
- 2026-10-01 — El proyecto deja de ser "un curso" y pasa a ser una **plataforma de cursos** propia: Ivan va a subir varios cursos, con login, inscripciones y clases que se liberan de a una.
- 2026-10-01 — Stack de la plataforma: Next.js (App Router) + TypeScript, deploy en **Vercel**, **Supabase** para la base (Postgres), el login y el almacenamiento. Para uso comercial hace falta Vercel Pro (Hobby no permite uso comercial) y conviene Supabase Pro (el plan gratis pausa proyectos inactivos).
- 2026-10-01 — **Un solo repositorio** con una sola app Next para todos los cursos. Monorepo (Turborepo) solo si aparece otra app (por ej. mobile).
- 2026-10-01 — El **contenido** de las clases vive en el repo como TypeScript (versionado y tipado); la **base de datos** guarda solo lo que cambia en vivo: cursos publicados, clases visibles/fecha de liberación, inscripciones y (más adelante) progreso.
- 2026-10-01 — Login sin contraseña: link mágico por mail y Google (el público son adultos sin experiencia; las contraseñas olvidadas son una barrera).
- 2026-10-01 — PDF de resumen por clase con `@react-pdf/renderer`, armado desde los mismos datos de la clase. No es una copia de las diapositivas: formato de lectura, fondo blanco, imprimible.
- 2026-10-01 — Orden de trabajo: 1) migrar a Next sin login, 2) Supabase (login, cursos, visibilidad, inscripciones), 3) PDF de resumen, 4) progreso/resultados de quizzes. La Clase 2 se escribe después de tener la base.
- 2026-10-01 — Habrá "modo presentador": el admin ve y proyecta todas las clases aunque estén ocultas para los alumnos.
- 2026-10-01 — Implementado sobre Next.js 16.3 (usa `src/proxy.ts`, que reemplaza a `middleware.ts`) con TypeScript 7. Código en `src/`; cada curso en `src/content/<slug>/` y registrado en `src/content/registry.ts`.
- 2026-10-01 — Las URLs de clase son `/cursos/<slug>/clase-N`, y la diapositiva va en el hash (`#12`). El slug de un curso no se cambia una vez publicado (es la clave en la base).
- 2026-10-01 — Inscripción de alumnos **con código por curso** (el admin lo define en /admin y lo reparte en clase). Es la única vía de alta para alumnos; el código no es visible para ellos.
- 2026-10-01 — Liberación de clases: oculta/liberada + fecha y hora opcional (hora de Argentina, `America/Argentina/Salta`) a partir de la cual se libera sola.
- 2026-10-01 — El rol admin se asigna solo por SQL (`profiles.role`); desde la app nadie puede cambiar su rol.
- 2026-10-01 — "Modo local": sin variables de Supabase y fuera de producción, la app corre sin login y con acceso de admin, para trabajar contenido. En producción, sin esas variables, la app da error (nunca queda abierta).
- 2026-10-01 — Login con Google detrás de `NEXT_PUBLIC_AUTH_GOOGLE=on` (hay que configurar el proveedor en Supabase); el link por mail siempre está.
- 2026-10-01 — **Google es el login principal** (activado). El link por mail queda como alternativa secundaria ("¿No tenés cuenta de Google?"). El SMTP propio se posterga: mientras tanto el mail sale por el servicio de Supabase, con límites bajos (sirve solo para casos aislados).
- 2026-10-01 — Login con Google mediante el **botón oficial de Google (Google Identity Services) en nuestro sitio** + `signInWithIdToken` de Supabase, para que Google muestre nuestro dominio y no `xxxx.supabase.co`. Requiere `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; sin esa variable (o si el script de Google no carga) se usa el flujo por redirección vía Supabase. Cuando haya dominio propio: verificar la marca en Google para que aparezca el nombre "Cursos · Iván Gutiérrez" y el logo.
- 2026-10-01 — Si alguien abre el login desde el navegador interno de Instagram/Facebook/TikTok, se le avisa que lo abra en Chrome o Safari (Google bloquea el login ahí).
- 2026-10-01 — Sin dominio propio por ahora: en producción se usa el subdominio gratuito `*.vercel.app`. Al comprar dominio se agrega en Vercel y en las Redirect URLs de Supabase; con dominio se puede pasar a Resend para los mails.
- 2026-10-01 — Producción en Vercel: proyecto `cursos-ivan`, URL **https://cursos-ivan.vercel.app** (deploy automático con cada push a `main`). Esa URL va en Supabase (Site URL + Redirect URL `/auth/callback`), en Google Cloud (origen autorizado) y en `NEXT_PUBLIC_SITE_URL`.
- 2026-10-01 — **La plataforma tiene que ser completamente usable en celular** (los alumnos llevan más el celular que la notebook).
- 2026-10-01 — Visor en dos modos automáticos: **lienzo** 1920×1080 escalado (proyector, notebook, tablet) y **modo celular** cuando el lienzo quedaría por debajo de 0.45 de escala (celular vertical u horizontal): diapositivas al ancho de pantalla, scroll vertical, barra táctil abajo (Curso · ← · n/total · → · PDF), swipe para pasar. Las medidas de las diapositivas usan la unidad `--u` (1px en lienzo, 0.5px en celular).
- 2026-10-01 — En pantallas táctiles todo lo que se toca mide al menos 44px; los campos de texto usan 16px (evita el zoom automático de iOS).
- ~~2026-10-01 — Repositorio: `github.com/IvanGG97/Cursos`. Debe ser **privado** (el contenido de los cursos es material pago).~~ Corregida el mismo día por Ivan: el material es suyo y no hay problema en que sea público.
- 2026-10-01 — Repositorio **público** en `github.com/IvanGG97/Cursos` (rama `main`). Nunca se suben secretos: `.env.local` está ignorado y la app solo usa la publishable key. La copia `.zip` de `docs/` no se versiona.
- 2026-10-01 — El PDF de resumen se genera al pedirlo (no se guarda en Storage), con las mismas reglas de acceso que la clase. Se arma automáticamente desde las diapositivas: agrupado por bloque, sin quizzes en el cuerpo y con una "Autoevaluación" final con preguntas y respuestas. Sin número de página (bug de react-pdf con este layout).
- 2026-10-01 — Las fuentes del PDF van como TTF en `src/lib/pdf/fonts` (react-pdf no lee bien los WOFF de @fontsource; se convierten con `scripts/woff-to-ttf.mjs`).
- 2026-10-01 — Nombre provisorio de la plataforma: "Cursos · Iván Gutiérrez" (en `src/lib/site.ts`), pendiente de definir.
- 2026-10-01 — Lienzo fijo de 1920×1080 que se escala a la ventana, para que la letra sea proyectable (títulos de ~76px o más, cuerpo de ~36–42px).
- 2026-10-01 — Tipos de diapositiva: title, agenda, divider, concept, content, quiz (vf/single/multi), quote, steps, practice, compare, checkpoint.
- 2026-10-01 — Los quizzes son interactivos en la web: se elige opción (clic o teclas 1–4) y `R` revela la respuesta. Reemplaza las notas para Genially.
- 2026-10-01 — Las imágenes pendientes se muestran como placeholder con la descripción de qué buscar, hasta que haya archivo (`media.src`).

## Diseño

- 2026-10-01 — Identidad visual según `Main.dc.html`: fondo `#0B0F14`, panel `#121826`, línea `#232B3A`, texto `#EDF1F7`, texto secundario `#C3CAD6`, metadatos `#8A93A6`.
- 2026-10-01 — Tipografías: Space Grotesk (títulos), IBM Plex Sans (cuerpo), IBM Plex Mono (etiquetas). Nunca Inter/Roboto/Arial.
- 2026-10-01 — Sin gradientes, sin emojis, sin tarjetas con borde izquierdo de color (por eso se le sacó la barrita izquierda al recuadro de analogía de la maqueta).
- 2026-10-01 — Un acento por clase (provisorio, no cerrado): C1 cian `#22D3EE`, C2 naranja `#FF6A3D`, C3 violeta `#7C5CFF`, C4 verde-azulado `#2EE6A8`. ~~Se editan en `:root` de `src/styles.css`.~~ Desde la plataforma: cada clase (y cada curso) define su `accent` en su archivo de contenido; la paleta base sigue en `src/app/globals.css`.
- 2026-10-01 — El PDF usa la misma tipografía pero en fondo blanco; el acento de la clase solo en barras y marcas, nunca en texto (no tiene contraste sobre blanco).
- 2026-10-01 — Colores de quiz fijos, independientes de la clase: correcta `#A3E635`, incorrecta `#FF4D6D`, siempre acompañados del texto "Correcta"/"Incorrecta".
- 2026-10-01 — Las comillas rectas del contenido se convierten automáticamente en comillas tipográficas (“ ”) al cargar los datos.
