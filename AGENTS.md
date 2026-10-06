<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Plataforma de cursos — reglas del proyecto

- **Antes de cualquier tarea, leer `DECISIONES.md`** y no contradecir lo que ya está decidido. Cada decisión nueva importante se agrega ahí como una línea con fecha.
- El contenido de los cursos vive en `src/content/<slug-del-curso>/` como datos TypeScript (`Slide[]`); el motor (`src/components/deck`) no se toca para agregar contenido. Ver `README.md`.
- Reglas de contenido: antes de cada quiz tiene que haber contenido que lo explique; varios quizzes por clase; ejemplos concretos, errores comunes y recomendaciones en cada bloque; el curso "IA, desde 0" no hace referencia al curso "Herramientas de Google".
- Diseño: identidad de `docs/IA_mi_nuevo_asistente_handoff/Main.dc.html` — oscuro, alto contraste, Space Grotesk / IBM Plex Sans / IBM Plex Mono; nada de Inter/Roboto/Arial, gradientes, emojis ni tarjetas con borde izquierdo de color.
