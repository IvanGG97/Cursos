"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit } from "@/lib/admin";
import { MEDIA_BUCKET, mediaSlots } from "@/lib/media";

// El navegador del admin sube el archivo directo a Storage (la RLS solo deja a admins);
// acá se registra en qué lugar va y se borra el archivo anterior.

export async function attachMedia(slug: string, mediaId: string, path: string, mime: string): Promise<{ error?: string }> {
  try {
    const ctx = await adminCtx();
    const course = getCourse(slug);
    if (!course || !mediaSlots(course).some((s) => s.media.id === mediaId)) return { error: "Lugar de imagen inexistente." };
    if (!path.startsWith(`${slug}/`)) return { error: "Ruta inválida." };

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

    if (prev?.path && prev.path !== path) await ctx.supabase.storage.from(MEDIA_BUCKET).remove([prev.path]);
    await audit(ctx, "media.set", `${slug}/${mediaId}`, { mime });
    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

export async function detachMedia(slug: string, mediaId: string): Promise<{ error?: string }> {
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
    if (prev?.path) await ctx.supabase.storage.from(MEDIA_BUCKET).remove([prev.path]);
    await audit(ctx, "media.remove", `${slug}/${mediaId}`);
    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo quitar." };
  }
}
