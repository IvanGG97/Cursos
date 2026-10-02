"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit, type AdminCtx } from "@/lib/admin";
import { isExternal, MAX_GALLERY, MEDIA_BUCKET, mediaSlots } from "@/lib/media";

// Cada lugar de imagen tiene una galería ordenada (la primera es la portada). Cada imagen es un
// archivo subido (el navegador del admin lo sube directo a Storage; la RLS solo deja a admins) o
// un enlace externo (https://...). Al quitar una imagen subida, también se borra del Storage.

type Result = { error?: string };

function checkSlot(slug: string, mediaId: string) {
  const course = getCourse(slug);
  return Boolean(course && mediaSlots(course).some((s) => s.media.id === mediaId));
}

async function items(ctx: AdminCtx, slug: string, mediaId: string) {
  const { data, error } = await ctx.supabase
    .from("slide_media")
    .select("id, path, position")
    .eq("course_slug", slug)
    .eq("media_id", mediaId)
    .order("position");
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Deja las posiciones como 0, 1, 2… en el orden dado. */
async function renumber(ctx: AdminCtx, ids: string[]) {
  await Promise.all(ids.map((id, i) => ctx.supabase.from("slide_media").update({ position: i }).eq("id", id)));
}

async function add(ctx: AdminCtx, slug: string, mediaId: string, path: string, mime: string, kind: "upload" | "link"): Promise<Result> {
  if (!checkSlot(slug, mediaId)) return { error: "Lugar de imagen inexistente." };
  const current = await items(ctx, slug, mediaId);
  if (current.length >= MAX_GALLERY) return { error: `Máximo ${MAX_GALLERY} imágenes por lugar.` };

  await ctx.supabase.from("courses").upsert({ slug }, { onConflict: "slug", ignoreDuplicates: true });
  const { error } = await ctx.supabase.from("slide_media").insert({
    course_slug: slug,
    media_id: mediaId,
    path,
    mime,
    position: current.length ? Math.max(...current.map((c) => c.position)) + 1 : 0,
    updated_at: new Date().toISOString(),
    updated_by: ctx.viewer.id,
  });
  if (error) {
    return {
      error: /position|column/i.test(error.message)
        ? "Falta correr la migración 20261002040000_media_gallery.sql en Supabase."
        : error.message,
    };
  }
  await audit(ctx, kind === "link" ? "media.link" : "media.set", `${slug}/${mediaId}`, kind === "link" ? { url: path } : { mime });
  revalidatePath("/", "layout");
  return {};
}

/** Agrega a la galería un archivo ya subido a Storage. */
export async function attachMedia(slug: string, mediaId: string, path: string, mime: string): Promise<Result> {
  try {
    const ctx = await adminCtx();
    if (!path.startsWith(`${slug}/`)) return { error: "Ruta inválida." };
    const res = await add(ctx, slug, mediaId, path, mime, "upload");
    // Si no se pudo registrar, no dejar el archivo huérfano en Storage.
    if (res.error) await ctx.supabase.storage.from(MEDIA_BUCKET).remove([path]);
    return res;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

/** Agrega a la galería un enlace externo (imagen, GIF o video directo). */
export async function attachMediaUrl(slug: string, mediaId: string, url: string, mime: string): Promise<Result> {
  try {
    const ctx = await adminCtx();
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return { error: "Ese enlace no es válido." };
    }
    if (parsed.protocol !== "https:") return { error: "El enlace tiene que empezar con https://" };
    if (parsed.href.length > 2000) return { error: "El enlace es demasiado largo." };
    const safeMime = /^(image|video)\/[a-z0-9.+-]+$/i.test(mime) ? mime : "image/url";
    return await add(ctx, slug, mediaId, parsed.href, safeMime, "link");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

/** Quita una imagen de la galería (y su archivo, si era subido). */
export async function detachMedia(slug: string, mediaId: string, itemId: string): Promise<Result> {
  try {
    const ctx = await adminCtx();
    const list = await items(ctx, slug, mediaId);
    const it = list.find((i) => i.id === itemId);
    if (!it) return { error: "Esa imagen ya no está." };
    const { error } = await ctx.supabase.from("slide_media").delete().eq("id", itemId);
    if (error) return { error: error.message };
    if (!isExternal(it.path)) await ctx.supabase.storage.from(MEDIA_BUCKET).remove([it.path]);
    await renumber(ctx, list.filter((i) => i.id !== itemId).map((i) => i.id));
    await audit(ctx, "media.remove", `${slug}/${mediaId}`);
    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo quitar." };
  }
}

/** Mueve una imagen: "up" (antes), "down" (después) o "first" (portada). */
export async function moveMedia(slug: string, mediaId: string, itemId: string, to: "up" | "down" | "first"): Promise<Result> {
  try {
    const ctx = await adminCtx();
    const ids = (await items(ctx, slug, mediaId)).map((i) => i.id);
    const i = ids.indexOf(itemId);
    if (i < 0) return { error: "Esa imagen ya no está." };
    const j = to === "first" ? 0 : to === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= ids.length || j === i) return {};
    ids.splice(i, 1);
    ids.splice(j, 0, itemId);
    await renumber(ctx, ids);
    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo mover." };
  }
}
