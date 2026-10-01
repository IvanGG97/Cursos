"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { getViewer } from "@/lib/access";
import { fromLocalInput } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

// Cada acción verifica admin acá Y en la base (RLS): doble cerrojo.

async function adminClient() {
  const viewer = await getViewer();
  if (viewer.kind !== "user" || !viewer.isAdmin) throw new Error("Solo administradores.");
  return createClient();
}

function courseFrom(formData: FormData) {
  const course = getCourse(String(formData.get("slug") ?? ""));
  if (!course) throw new Error("Curso inexistente.");
  return course;
}

/** Los cursos nacen en el repo: la fila en la base se crea la primera vez que se toca algo. */
async function ensureCourseRow(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  const { error } = await supabase.from("courses").upsert({ slug }, { onConflict: "slug", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

function done() {
  revalidatePath("/", "layout");
}

export async function setPublished(formData: FormData) {
  const supabase = await adminClient();
  const course = courseFrom(formData);
  await ensureCourseRow(supabase, course.slug);
  const { error } = await supabase
    .from("courses")
    .update({ published: formData.get("published") === "true" })
    .eq("slug", course.slug);
  if (error) throw new Error(error.message);
  done();
}

export async function setEnrollCode(formData: FormData) {
  const supabase = await adminClient();
  const course = courseFrom(formData);
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  await ensureCourseRow(supabase, course.slug);

  const { error } = code
    ? await supabase.from("course_codes").upsert({ course_slug: course.slug, code })
    : await supabase.from("course_codes").delete().eq("course_slug", course.slug);
  if (error) throw new Error(error.code === "23505" ? "Ese código ya lo usa otro curso." : error.message);
  done();
}

export async function setRelease(formData: FormData) {
  const supabase = await adminClient();
  const course = courseFrom(formData);
  const num = Number(formData.get("num"));
  if (!course.classes.some((c) => c.num === num)) throw new Error("Clase inexistente.");
  await ensureCourseRow(supabase, course.slug);

  const { error } = await supabase.from("class_releases").upsert({
    course_slug: course.slug,
    class_num: num,
    visible: formData.get("visible") === "true",
    visible_from: fromLocalInput(String(formData.get("visible_from") ?? "")),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  done();
}
