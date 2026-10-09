import "server-only";
import type { ClassDef, Course } from "./types";
import { iaMiNuevoAsistente } from "./ia-mi-nuevo-asistente";
import { typeset } from "./typeset";

// Registro de todos los cursos de la plataforma.
// Para sumar un curso: crear src/content/<slug>/index.ts y agregarlo a esta lista.
// Solo se importa desde el servidor: al navegador viaja únicamente la clase que se abre.

const RAW: Course[] = [iaMiNuevoAsistente];

// Vive aparte para poder usarla también en el navegador (vista previa del editor de clases).
export { typeset };

export const courses: Course[] = RAW.map(typeset);

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

/** Las clases se identifican en la URL como "clase-1", "clase-2"... */
export const classSlug = (c: Pick<ClassDef, "num">) => `clase-${c.num}`;

export function getClass(course: Course, slug: string) {
  const m = slug.match(/^clase-(\d+)$/);
  return m ? course.classes.find((c) => c.num === Number(m[1])) : undefined;
}
