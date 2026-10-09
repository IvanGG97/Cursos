"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit } from "@/lib/admin";
import { currentVersionId } from "@/lib/class-content";
import { formatDateTime } from "@/lib/site";

/** `current_slide` / `revealed`: dónde estaba la clase (para retomarla si el presentador se fue y volvió). */
export type LiveSession = { id: string; code: string; title: string | null; current_slide?: number; revealed?: boolean };
const SESSION_COLS = "id, code, title, current_slide, revealed";

/**
 * Abre la clase en vivo (o devuelve la que ya está abierta para esa clase). Solo admin.
 * `title`: nombre para identificar la partida después (ej. "Comisión martes 16 hs").
 */
export async function startLive(slug: string, num: number, title?: string): Promise<LiveSession | { error: string }> {
  try {
    const ctx = await adminCtx();
    const course = getCourse(slug);
    if (!course?.classes.some((c) => c.num === num)) return { error: "Clase inexistente." };

    const { data: open } = await ctx.supabase
      .from("live_sessions")
      .select(SESSION_COLS)
      .eq("course_slug", slug)
      .eq("class_num", num)
      .eq("status", "open")
      .maybeSingle();
    if (open) return open;

    const name = (title ?? "").trim().slice(0, 80) || `Clase ${num} · ${formatDateTime(new Date().toISOString())}`;
    // Con qué versión de la clase se da (si se editó desde el panel): los resultados se guardan por
    // número de diapositiva y tienen que seguir apuntando a estas preguntas.
    const version = await currentVersionId(slug, num);

    // Código de 4 números que no choque con otra sesión abierta.
    for (let i = 0; i < 8; i++) {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const { data, error } = await ctx.supabase
        .from("live_sessions")
        .insert({ code, title: name, course_slug: slug, class_num: num, created_by: ctx.viewer.id, ...(version !== null ? { content_version: version } : {}) })
        .select(SESSION_COLS)
        .single();
      if (!error && data) {
        await audit(ctx, "live.start", `${slug}/clase-${num}`, { code, title: name });
        revalidatePath(`/cursos/${slug}`);
        return data;
      }
      if (error?.code !== "23505") return { error: error?.message ?? "No se pudo iniciar." };
    }
    return { error: "No se pudo generar un código. Probá de nuevo." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo iniciar." };
  }
}

/** Termina la clase en vivo: los celulares ven "La clase terminó". Solo admin. */
export async function endLive(id: string): Promise<{ error?: string }> {
  try {
    const ctx = await adminCtx();
    const { data, error } = await ctx.supabase
      .from("live_sessions")
      .update({ status: "closed", closed_at: new Date().toISOString() })
      .eq("id", id)
      .select("course_slug, class_num")
      .single();
    if (error) return { error: error.message };
    await audit(ctx, "live.end", `${data.course_slug}/clase-${data.class_num}`, { session: id });
    revalidatePath(`/cursos/${data.course_slug}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo terminar." };
  }
}
