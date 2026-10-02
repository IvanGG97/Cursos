import "server-only";
import { cache } from "react";
import type { Course, Media, Slide } from "@/content/types";
import { SUPABASE_URL, isLocalMode } from "./supabase/config";
import { createClient } from "./supabase/server";

// Archivos subidos desde el panel para los lugares de imagen de las diapositivas.
// Lo subido tiene prioridad sobre el archivo por defecto del repo (Media.src).

export const MEDIA_BUCKET = "media";

/** `path` es una ruta dentro del bucket, o un enlace externo (https://...) cargado desde el panel. */
export const isExternal = (path: string) => /^https:\/\//i.test(path);
export const publicMediaUrl = (path: string) =>
  isExternal(path) ? path : `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;

export type Uploaded = { url: string; mime: string; path: string; updatedAt: string; external: boolean };

export const getCourseMedia = cache(async (slug: string): Promise<Map<string, Uploaded>> => {
  if (isLocalMode()) return new Map();
  const supabase = await createClient();
  const { data } = await supabase.from("slide_media").select("media_id, path, mime, updated_at").eq("course_slug", slug);
  return new Map(
    (data ?? []).map((r) => [
      r.media_id as string,
      { url: publicMediaUrl(r.path), mime: r.mime, path: r.path, updatedAt: r.updated_at, external: isExternal(r.path) },
    ]),
  );
});

/** Reemplaza el `src` de cada lugar por el archivo subido (si hay). */
export function withMedia(slides: Slide[], uploaded: Map<string, Uploaded>): Slide[] {
  if (uploaded.size === 0) return slides;
  return slides.map((s) => {
    if (!("media" in s) || !s.media) return s;
    const u = uploaded.get(s.media.id);
    return u ? { ...s, media: { ...s.media, src: u.url, mime: u.mime } } : s;
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
