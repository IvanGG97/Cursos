import "server-only";
import type { ClassDef, Course } from "./types";
import { iaMiNuevoAsistente } from "./ia-mi-nuevo-asistente";

// Registro de todos los cursos de la plataforma.
// Para sumar un curso: crear src/content/<slug>/index.ts y agregarlo a esta lista.
// Solo se importa desde el servidor: al navegador viaja únicamente la clase que se abre.

const RAW: Course[] = [iaMiNuevoAsistente];

/** Convierte "comillas rectas" en “comillas tipográficas” (Space Grotesk dibuja mal las rectas). */
function typeset<T>(value: T): T {
  if (typeof value === "string") return value.replace(/"([^"\n]*)"/g, "“$1”") as T;
  if (Array.isArray(value)) return value.map(typeset) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typeset(v)])) as T;
  }
  return value;
}

export const courses: Course[] = RAW.map(typeset);

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

/** Las clases se identifican en la URL como "clase-1", "clase-2"... */
export const classSlug = (c: Pick<ClassDef, "num">) => `clase-${c.num}`;

export function getClass(course: Course, slug: string) {
  const m = slug.match(/^clase-(\d+)$/);
  return m ? course.classes.find((c) => c.num === Number(m[1])) : undefined;
}
