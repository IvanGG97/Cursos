import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { getCourseEvaluations } from "@/lib/evaluations";
import { CourseTabs } from "../../tabs";
import { EvaluationEditor } from "./EvaluationEditor";

export const metadata: Metadata = { title: "Editar evaluación" };

type Props = { params: Promise<{ slug: string; num: string }> };

export default async function EditEvaluation({ params }: Props) {
  const { slug, num: numStr } = await params;
  const course = getCourse(slug);
  const num = Number(numStr);
  const clase = course?.classes.find((c) => c.num === num);
  if (!course || !clase) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/evaluaciones/${num}`);
  if (!ctx) return null;

  const ce = (await getCourseEvaluations(slug)).get(num);
  if (!ce) notFound();
  const { count } = await ctx.supabase
    .from("evaluation_attempts")
    .select("id", { count: "exact", head: true })
    .eq("course_slug", slug)
    .eq("class_num", num)
    .eq("evaluation_id", ce.ev.id);

  return (
    <div style={{ "--accent": clase.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href={`/admin/cursos/${slug}/evaluaciones`} className="back">← Evaluaciones</Link>
        <h1>Clase {clase.num}: {clase.title}</h1>
      </div>
      <CourseTabs slug={slug} active="evaluaciones" hasSurvey={Boolean(course.survey)} />
      <EvaluationEditor
        slug={slug}
        num={num}
        initial={ce.ev}
        edited={ce.edited}
        attempts={count ?? 0}
        previewHref={`/cursos/${slug}/clase-${num}/evaluacion`}
      />
    </div>
  );
}
