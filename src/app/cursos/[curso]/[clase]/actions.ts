"use server";

import { getLiveCourse } from "@/lib/class-content";
import { classStatus, getCourseState, getViewer } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

/**
 * Guarda hasta dónde vio la clase la persona (lo llama el visor, con un pequeño retraso).
 * Silencioso: si no hay sesión o algo falla, no interrumpe la clase.
 */
export async function saveProgress(slug: string, num: number, slide: number) {
  const viewer = await getViewer();
  if (viewer.kind !== "user") return;

  const course = await getLiveCourse(slug);
  const clase = course?.classes.find((c) => c.num === num);
  if (!course || !clase) return;
  const total = clase.slides.length;
  if (!Number.isInteger(slide) || slide < 1 || slide > total) return;
  if (classStatus(viewer, await getCourseState(slug), clase).kind !== "open") return;

  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("class_progress")
    .select("max_slide, completed_at")
    .eq("user_id", viewer.id)
    .eq("course_slug", slug)
    .eq("class_num", num)
    .maybeSingle();

  const max = Math.max(prev?.max_slide ?? 0, slide);
  await supabase.from("class_progress").upsert({
    user_id: viewer.id,
    course_slug: slug,
    class_num: num,
    last_slide: slide,
    max_slide: max,
    total_slides: total,
    // "Vista" = llegó a la última diapositiva alguna vez.
    completed_at: prev?.completed_at ?? (max >= total ? new Date().toISOString() : null),
    updated_at: new Date().toISOString(),
  });
}
