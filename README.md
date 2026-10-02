# Plataforma de cursos

Plataforma propia para dictar y publicar cursos: diapositivas proyectables con quizzes interactivos, login sin contraseña, inscripción con código, liberación de clases de a una y resumen de cada clase en PDF.

**Stack:** Next.js 16 (App Router) · TypeScript · Supabase (Postgres + Auth) · `@react-pdf/renderer` · deploy en Vercel.

Las decisiones del proyecto están en [DECISIONES.md](DECISIONES.md).

## Cómo está organizado

```
src/
  content/                      ← EL CONTENIDO (en el repo, versionado)
    types.ts                    tipos de diapositiva, clase y curso
    registry.ts                 lista de cursos de la plataforma
    ia-mi-nuevo-asistente/
      index.ts                  datos del curso y sus clases
      clase1.ts                 diapositivas de la clase 1
  components/deck/              motor de diapositivas (lienzo 1920×1080)
  app/
    page.tsx                    catálogo
    cursos/[curso]/             página del curso (+ inscripción con código)
    cursos/[curso]/[clase]/     visor de la clase (#12 = diapositiva 12)
    cursos/[curso]/[clase]/resumen/   PDF del resumen
    login/, auth/               login con link por mail (y Google opcional)
    admin/                      publicar cursos, código, liberar clases
  lib/
    access.ts                   ÚNICO lugar con las reglas de quién ve qué
    supabase/                   clientes de Supabase y refresco de sesión
    pdf/                        armado y diseño del PDF
  proxy.ts                      refresca la sesión en cada request
supabase/migrations/            esquema de la base + RLS
```

**El contenido vive en el repo; la base solo guarda lo que cambia en vivo:** qué cursos están publicados, qué clases están liberadas (y desde cuándo), quién está inscripto y el código de inscripción de cada curso.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:3000
```

Sin `.env.local` la app arranca en **modo local**: sin login y con acceso de admin, ideal para escribir y revisar contenido. Hay un aviso amarillo arriba mientras está así. En producción, sin las variables de Supabase la app devuelve error (nunca queda abierta por accidente).

Atajos en el visor: `←` `→` (o espacio / PageUp / PageDown) navegar · `F` pantalla completa · `R` ver respuesta del quiz · `1`–`4` elegir opción · `I` volver al curso.

**Celular:** el visor cambia solo a "modo celular" cuando la pantalla es chica (diapositivas al ancho, scroll vertical, barra táctil abajo y swipe para pasar). En notebook, tablet y proyector usa el lienzo 1920×1080. Los estilos del modo celular están al final de `src/components/deck/deck.css`.

> Ojo al editar archivos desde PowerShell 5.1: `Set-Content -Encoding utf8` agrega un BOM que rompe la primera regla de los `.css`. Usar el editor o `[IO.File]::WriteAllText`.

## Conectar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Correr las migraciones de `supabase/migrations/` **en orden**, cada una una sola vez: pegarla en **SQL Editor** y ejecutar (o `supabase db push` con la CLI).
   - `20261001000000_init.sql` — esquema base.
   - `20261001020000_admin_panel.sql` — panel de admin (invitaciones, accesos individuales, suspensiones, registro de actividad).
   - `20261002000000_course_access.sql` — estado "Libre" de un curso (visible sin registrarse).
   - `20261002010000_engagement.sql` — progreso, evaluaciones, clase en vivo (asistencia + quiz) y encuesta.
   - `20261002020000_live_game.sql` — clase en vivo estilo Kahoot (nombre de partida, apodos, ranking).
   - `20261002030000_media.sql` — imágenes, GIFs y videos subidos desde el panel (Storage + `slide_media`).
   - `20261002040000_media_gallery.sql` — galerías (varias imágenes por lugar, en orden).
   - `20261002050000_media_annotations.sql` — flechas y recuadros dibujados sobre cada imagen ("Señalar").
3. Copiar `.env.example` a `.env.local` y completar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API Keys).
4. **Authentication → URL Configuration:**
   - Site URL: `http://localhost:3000` (en producción, el dominio real).
   - Redirect URLs: `http://localhost:3000/auth/callback` y `https://TU-DOMINIO/auth/callback`.
5. Entrar una vez en `/login` con tu mail (se crea tu usuario) y hacerte admin desde el SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'TU-MAIL');
   ```
6. **Google (login principal):** ver la sección siguiente. Con `NEXT_PUBLIC_AUTH_GOOGLE=on` el botón de Google aparece primero y el mail queda como alternativa.

## Configurar el login con Google

1. En [Google Cloud Console](https://console.cloud.google.com/) crear un proyecto (ej. "Plataforma cursos").
2. **APIs y servicios → Pantalla de consentimiento de OAuth** (Google Auth Platform → Branding/Audience): tipo **Externo**, nombre de la app, mail de soporte y mail de contacto. En "Público", **publicar la app** (pasar de "Prueba" a "En producción"); en modo prueba solo pueden entrar los usuarios de prueba que cargues. Con los permisos básicos (mail y perfil) no hace falta verificación de Google.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** → tipo **Aplicación web**:
   - Orígenes autorizados de JavaScript: `http://localhost:3000` (y después `https://TU-PROYECTO.vercel.app`).
   - URI de redireccionamiento autorizados: `https://zngigunepuwsroracpkv.supabase.co/auth/v1/callback` (la que muestra Supabase en Authentication → Providers → Google).
4. Copiar **ID de cliente** y **Secreto de cliente** en Supabase → **Authentication → Providers → Google**, activar y guardar.
5. Verificar que en Supabase → Authentication → URL Configuration estén `http://localhost:3000/auth/callback` (y la de Vercel cuando exista) en Redirect URLs.

## Panel de administración (`/admin`)

| Sección | Qué se hace |
|---|---|
| **Resumen** | Números generales, últimos registros y actividad reciente. |
| **Cursos** → curso | Estado: **Sin publicar / Publicado (con inscripción) / Libre (sin registrarse)** · **Liberar todas las clases** · código de inscripción (escribirlo, generarlo al azar o desactivarlo) · por clase: **Liberar ahora**, **Ocultar** o **Programar** fecha y hora · inscriptos (buscar, suspender, reactivar, quitar) · **agregar personas pegando mails** (las que ya tienen cuenta quedan inscriptas; las otras quedan invitadas) · invitaciones pendientes · accesos individuales. |
| **Personas** → ficha | Buscar y filtrar por rol/estado · en la ficha: **hacer/quitar admin**, **suspender/reactivar cuenta**, inscribir/suspender/quitar en cada curso y **dar acceso individual a una clase**, más el historial de acciones sobre esa persona. |
| **Actividad** | Registro de todas las acciones de los admins. |

Las acciones delicadas piden confirmación con un segundo toque. Nadie puede quitarse su propio rol de admin ni suspender su propia cuenta.

## Participación de los alumnos

- **Progreso**: se guarda solo mientras miran la clase. En la página del curso ven su avance y "Seguir →".
- **Evaluación por clase**: `/cursos/<curso>/clase-N/evaluacion`. Se define en el contenido (`evaluation` de la clase, ver `src/content/ia-mi-nuevo-asistente/clase1-evaluacion.ts`). Necesita `SUPABASE_SECRET_KEY` en el servidor.
- **Clase en vivo (estilo Kahoot)**: en la clase, **Iniciar en vivo** → nombrás la partida → tecla **C** muestra el código y el QR → los alumnos entran a `/vivo` y ponen su apodo. En cada quiz se ven las respuestas en tiempo real; **R** revela la correcta en los celulares; **T** muestra el ranking. **Terminar** cierra la partida. Resultados (ranking, asistencia, respuestas por pregunta, CSV) en **Admin → curso → Seguimiento**.
- **Encuesta**: `/cursos/<curso>/encuesta`, definida en `Course.survey`. Resultados en **Admin → curso → Encuesta**.

## Flujo de un curso

1. En **/admin → Cursos**: publicar el curso y definir el **código de inscripción** (ej. `SALTA2026`, o generar uno al azar).
2. Los alumnos entran a la página del curso, ingresan con Google y escriben el código. Si tenés la lista de mails, podés invitarlos de antemano.
3. Antes de cada clase, **Liberar ahora** (o programarla con fecha y hora de Argentina: se libera sola).
4. Como admin podés abrir y proyectar cualquier clase aunque esté oculta para los alumnos ("modo presentador").
5. Si alguien faltó y querés que vea una clase puntual: en su ficha, **Dar acceso** a esa clase.
6. Cada clase liberada tiene su **Resumen PDF**, armado automáticamente desde las diapositivas, con una autoevaluación al final.

## Agregar contenido

- **Nueva clase de un curso existente:** crear `src/content/<curso>/claseN.ts` exportando un `Slide[]` y asignarlo en `slides` de esa clase en `index.ts`. Mientras `slides` esté vacío, la clase figura "En preparación".
- **Nuevo curso:** crear `src/content/<slug>/index.ts` con un objeto `Course` y sumarlo a `RAW` en `src/content/registry.ts`. Aparece en /admin; queda oculto hasta publicarlo.
- **Imágenes:** cada lugar de imagen tiene un `media.id` fijo. Lo más simple es subir el archivo desde **Admin → curso → Imágenes** (tiene prioridad). También se puede poner un archivo por defecto en `public/img/<curso>/` con `media.src`. Sin archivo se muestra un recuadro con la descripción de qué buscar.
- Los tipos de diapositiva están documentados en `src/content/types.ts`.

## Deploy en Vercel

1. Subir el repo a GitHub e importarlo en Vercel (detecta Next solo).
2. Cargar las variables de `.env.example` en Settings → Environment Variables (con `NEXT_PUBLIC_SITE_URL` = dominio real).
3. Agregar `https://TU-DOMINIO/auth/callback` a las Redirect URLs de Supabase.
4. Uso comercial: Vercel requiere plan **Pro** (Hobby no permite uso comercial). En Supabase conviene **Pro**: el plan gratis pausa proyectos inactivos.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción (incluye chequeo de tipos) |
| `npm run typecheck` | solo chequeo de tipos |
| `node scripts/woff-to-ttf.mjs <archivos>` | convierte fuentes WOFF a TTF (las del PDF ya están convertidas en `src/lib/pdf/fonts`) |
