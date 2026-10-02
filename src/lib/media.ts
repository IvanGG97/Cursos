import "server-only";
import { cache } from "react";
import type { Annotations, Course, Media, Slide } from "@/content/types";
import { SUPABASE_URL, isLocalMode } from "./supabase/config";
import { createClient } from "./supabase/server";

// Imágenes, GIFs y videos cargados desde el panel para los lugares de imagen de las diapositivas.
// Cada lugar puede tener varias (galería), en orden; la primera es la portada.
// Lo cargado tiene prioridad sobre el archivo por defecto del repo (Media.src).

export const MEDIA_BUCKET = "media";
export const MAX_GALLERY = 12;

/** `path` es una ruta dentro del bucket, o un enlace externo (https://...) cargado desde el panel. */
export const isExternal = (path: string) => /^https:\/\//i.test(path);
export const publicMediaUrl = (path: string) =>
  isExternal(path) ? path : `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;

export type Uploaded = {
  id: string;
  url: string;
  mime: string;
  path: string;
  position: number;
  external: boolean;
  annot?: Annotations;
};

/** Valida lo guardado en la base (si está mal formado, se ignora). */
function readAnnot(v: unknown): Annotations | undefined {
  const a = v as Annotations | null;
  if (!a || typeof a.w !== "number" || typeof a.h !== "number" || !Array.isArray(a.shapes) || a.shapes.length === 0) return undefined;
  return a;
}

/** Por lugar (media_id): sus imágenes en orden. */
export const getCourseMedia = cache(async (slug: string): Promise<Map<string, Uploaded[]>> => {
  if (isLocalMode()) return new Map();
  const supabase = await createClient();
  // "*": si la migración de galerías todavía no corrió (sin id/position), sigue funcionando.
  const { data } = await supabase.from("slide_media").select("*").eq("course_slug", slug);
  const map = new Map<string, Uploaded[]>();
  for (const r of data ?? []) {
    const list = map.get(r.media_id) ?? [];
    list.push({
      id: (r.id as string | undefined) ?? r.path,
      url: publicMediaUrl(r.path),
      mime: r.mime,
      path: r.path,
      position: (r.position as number | undefined) ?? 0,
      external: isExternal(r.path),
      annot: readAnnot(r.annotations),
    });
    map.set(r.media_id, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.position - b.position);
  return map;
});

/** Aplica lo cargado: portada en `src` y, si hay más de una, la galería completa. */
export function withMedia(slides: Slide[], uploaded: Map<string, Uploaded[]>): Slide[] {
  if (uploaded.size === 0) return slides;
  return slides.map((s) => {
    if (!("media" in s) || !s.media) return s;
    const items = uploaded.get(s.media.id);
    if (!items?.length) return s;
    const [first] = items;
    return {
      ...s,
      media: {
        ...s.media,
        src: first.url,
        mime: first.mime,
        annot: first.annot,
        gallery: items.length > 1 ? items.map((i) => ({ src: i.url, mime: i.mime, annot: i.annot })) : undefined,
      },
    };
  });
}

/** Todos los lugares de imagen de un curso, en orden (para la pestaña "Imágenes" del panel). */
export function mediaSlots(course: Course) {
  const out: { classNum: number; classTitle: string; slide: number; slideTitle: string; media: Media }[] = [];
  for (const c of course.classes) {
    c.slides.forEach((s, i) => {
      if ("media" in s && s.media) {
        out.push({ classNum: c.num, classTitle: c.title, slide: i + 1, slideTitle: "title" in s ? String(s.title) : "", media: s.media });
      }
    });
  }
  return out;
}
