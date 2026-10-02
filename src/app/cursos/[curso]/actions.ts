"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type JoinState = { error?: string };

export async function joinCourse(_prev: JoinState, formData: FormData): Promise<JoinState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "Escribí el código que te dio tu docente." };

  const supabase = await createClient();
  const { data: slug, error } = await supabase.rpc("join_course", { p_code: code });

  if (error) {
    if (error.code === "P0002") return { error: "Ese código no es válido. Revisalo con tu docente." };
    if (error.code === "42501") return { error: "Tu cuenta está suspendida. Hablá con tu docente." };
    return { error: "No pudimos inscribirte. Probá de nuevo en un rato." };
  }

  revalidatePath(`/cursos/${slug}`);
  redirect(`/cursos/${slug}`);
}
