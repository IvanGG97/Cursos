"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit, type AdminCtx } from "@/lib/admin";
import { isExternal, MEDIA_BUCKET, mediaSlots } from "@/lib/media";

// Cada lugar de imagen puede tener un archivo subido (el navegador del admin lo sube directo a
// Storage; la RLS solo deja a admins) o un enlace externo (https://...). Acá se registra cuál va
// en cada lugar y se borra del Storage el archivo anterior, si lo había.

type Result = { error?: string };

async function save(ctx: AdminCtx, slug: string, mediaId: string, path: string, mime: string, kind: "upload" | "link"): Promise<Result> {
  const course = getCourse(slug);
  if (!course || !mediaSlots(course).some((s) => s.media.id === mediaId)) return { error: "Lugar de imagen inexistente." };

  const { data: prev } = await ctx.supabase
    .from("slide_media")
    .select("path")
    .eq("course_slug", slug)
    .eq("media_id", mediaId)
    .maybeSingle();

  await ctx.supabase.from("courses").upsert({ slug }, { onConflict: "slug", ignoreDuplicates: true });
  const { error } = await ctx.supabase.from("slide_media").upsert({
    course_slug: slug,
    media_id: mediaId,
    path,
    mime,
    updated_at: new Date().toISOString(),
    updated_by: ctx.viewer.id,
  });
  if (error) return { error: error.message };

  if (prev?.path && prev.path !== path && !isExternal(prev.path)) {
    await ctx.supabase.storage.from(MEDIA_BUCKET).remove([prev.path]);
  }
  await audit(ctx, kind === "link" ? "media.link" : "media.set", `${slug}/${mediaId}`, kind === "link" ? { url: path } : { mime });
  revalidatePath("/", "layout");
  return {};
}

/** Registra un archivo ya subido a Storage. */
export async function attachMedia(slug: string, mediaId: string, path: string, mime: string): Promise<Result> {
  try {
    const ctx = await adminCtx();
    if (!path.startsWith(`${slug}/`)) return { error: "Ruta inválida." };
    return await save(ctx, slug, mediaId, path, mime, "upload");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

/** Usa un enlace externo (imagen, GIF o video directo). */
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
    return await save(ctx, slug, mediaId, parsed.href, safeMime, "link");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

export async function detachMedia(slug: string, mediaId: string): Promise<Result> {
  try {
    const ctx = await adminCtx();
    const { data: prev } = await ctx.supabase
      .from("slide_media")
      .select("path")
      .eq("course_slug", slug)
      .eq("media_id", mediaId)
      .maybeSingle();
    const { error } = await ctx.supabase.from("slide_media").delete().eq("course_slug", slug).eq("media_id", mediaId);
    if (error) return { error: error.message };
    if (prev?.path && !isExternal(prev.path)) await ctx.supabase.storage.from(MEDIA_BUCKET).remove([prev.path]);
    await audit(ctx, "media.remove", `${slug}/${mediaId}`);
    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo quitar." };
  }
}
