# Importar "Herramientas de Google" a la plataforma

1. Copiá la carpeta `src/content/herramientas-de-google/` dentro de tu repo (misma ruta).
2. En `src/content/registry.ts` agregá (o aplicá `registry.patch` con `git apply registry.patch`):
   - `import { herramientasDeGoogle } from "./herramientas-de-google";`
   - `const RAW: Course[] = [iaMiNuevoAsistente, herramientasDeGoogle];`
3. `npx tsc --noEmit` (ya probado: sin errores) y `npm run dev` → /cursos/herramientas-de-google
4. Publicar el curso desde Admin (como el de IA) y subir las imágenes desde Admin → curso → Imágenes (ids `hgN-NN`).
5. Línea sugerida para DECISIONES.md:
   `- 2026-10-09 — Se suma el curso "Herramientas de Google" (slug herramientas-de-google): 4 clases de 2 h, porteado 1 a 1 desde los pptx de cada día, sin evaluaciones ni encuesta. Los avisos "IDEA PARA GENIALLY" se eliminaron; las imágenes sugeridas quedaron como placeholders (ids hg1-NN … hg4-NN). Las "Clase 1–4" internas de Calendar pasaron a "Parte 1–4" para no chocar con la numeración de la plataforma.`

## Qué cambió respecto de los pptx
- Genially: sacados. Imágenes/GIF sugeridos: placeholders subibles desde el panel.
- Cada sección ("Gmail", "Google Calendar · Parte 1…") = divisor + agenda.
- Checkpoints de pregunta/respuesta → diapositiva `content` (pregunta | respuesta).
- Quizzes: se conserva la respuesta correcta, sin explicación (los pptx no la tenían).
- Referencias "Día N" / "Clase N" de Calendar → "Clase N" (curso) / "Parte N" (Calendar).
