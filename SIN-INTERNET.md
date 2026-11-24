# Dar la clase sin internet

Si en la sala falla internet, la plataforma puede andar desde tu compu: diapositivas, imágenes, galerías, zoom, preguntas (con la tecla R para mostrar la respuesta), modo claro/oscuro, estilos y el PDF de resumen.

Se hace en dos momentos: **preparar** (con internet, el día anterior) y **arrancar** (en la sala, sin internet).

## 1. Preparar — el día anterior, CON internet

1. Abrí la carpeta del proyecto en Visual Studio Code y abrí una terminal: menú **Terminal → Nueva terminal**.
2. Escribí estos tres comandos, de a uno, apretando Enter después de cada uno:

   ```
   git pull
   npm install
   npm run sin-internet:preparar
   ```

   El último baja a tu compu las imágenes, GIFs y videos cargados desde el panel, y lo que cambiaste desde el editor de clases. Tarda uno o dos minutos y termina con **"Listo: … archivos"**.

3. **Probalo ahí mismo**: hacé el paso 2 de abajo y abrí las clases que vas a dar. La primera vez cada clase tarda alrededor de un minuto en abrir; después queda guardada y al otro día abre mucho más rápido.

> Si después cambiás algo desde el panel (imágenes, textos, estilo), volvé a correr `npm run sin-internet:preparar` con internet.

## 2. Arrancar — en la sala, SIN internet

1. En la terminal del proyecto, escribí:

   ```
   npm run sin-internet
   ```

2. Esperá a que diga **Ready** y abrí en el navegador: **http://localhost:3000**
3. Entrá al curso y a la clase. Abrí la clase **antes de que lleguen los alumnos** (la primera vez tarda unos segundos).
4. Pantalla completa con la tecla **F**. Avanzás con las flechas, la barra espaciadora o el clicker.
5. Al terminar: en la terminal, **Ctrl + C** (si pregunta, respondé **S**).

## Qué funciona y qué no

| Funciona sin internet | Necesita internet |
|---|---|
| Diapositivas, imágenes, galerías y zoom | Gemini y Claude (las tareas de los alumnos) |
| Preguntas con la respuesta (tecla R) | Clase en vivo: código, QR, ranking y asistencia |
| PDF de resumen de cada clase | QR de la clase, login, panel de administración |
| Modo claro/oscuro y estilos | El progreso y las evaluaciones de los alumnos |

Sin internet no hay login: la plataforma te muestra todo, como si fueras admin, y nada de lo que hagas se guarda.

## Si algo falla

- **"Todavía no está preparado"**: falta el paso 1. Hay que correr `npm run sin-internet:preparar` con internet.
- **"Port 3000 is in use"** (el puerto está ocupado): ya hay otra ventana con la plataforma abierta. Usá esa, o arrancá en otro puerto con `npm run sin-internet -- 3001` y abrí http://localhost:3001.
- **Una imagen no aparece**: se cargó desde el panel después de preparar. Con internet, volvé a correr `npm run sin-internet:preparar`.
- **"npm no se reconoce como comando"**: falta instalar Node.js (versión 22 o más nueva) desde nodejs.org.

## En otra computadora

Hace falta Node.js 22 o más nuevo, Git y una copia del proyecto (`git clone https://github.com/IvanGG97/Cursos.git`). El archivo `.env.local` con las claves no se sube a GitHub: copialo a mano desde esta compu (es secreto, no lo compartas). Después, los pasos de arriba.
