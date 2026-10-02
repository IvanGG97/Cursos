import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getClass, getCourse } from "@/content/registry";
import { classStatus, getCourseState, getViewer } from "@/lib/access";
import { publicQuestions } from "@/lib/evaluations";
import { getMyCourseProgress } from "@/lib/progress";
import { isServiceConfigured } from "@/lib/supabase/admin";
import { EvaluationForm } from "./EvaluationForm";
import "@/app/vivo/vivo.css";
import "./evaluacion.css";

type Props = { params: Promise<{ curso: string; clase: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { curso, clase } = await params;
  const c = getCourse(curso);
  const k = c && getClass(c, clase);
  return { title: k?.evaluation?.title ?? "Evaluación" };
}

export default async function EvaluationPage({ params }: Props) {
  const { curso, clase: classSlug } = await params;
  const course = getCourse(curso);
  const clase = course && getClass(course, classSlug);
  const ev = clase?.evaluation;
  if (!course || !clase || !ev) notFound();

  const base = `/cursos/${course.slug}`;
  const viewer = await getViewer();
  if (viewer.kind === "anon") redirect(`/login?next=${base}/${classSlug}/evaluacion`);
  const status = classStatus(viewer, await getCourseState(course.slug), clase);
  if (status.kind !== "open") redirect(base);

  const mine = (await getMyCourseProgress(course.slug)).evals.get(clase.num);

  return (
    <SiteShell>
      <div className="eval-wrap" style={{ "--accent": clase.accent } as CSSProperties}>
        <Link href={base} className="back">← {course.title}</Link>
        <div className="kicker-sm" style={{ marginTop: 16 }}>Clase {clase.num} · {clase.title}</div>
        <h1 className="live-h1">{ev.title}</h1>
        <p className="muted">{ev.intro}</p>
        {mine && (
          <p className="eval-best">
            Tu mejor nota: <strong>{mine.best} / {mine.total}</strong> {mine.passed ? "· aprobada" : ""} · {mine.attempts} intento(s)
          </p>
        )}
        {viewer.kind === "local" || !isServiceConfigured ? (
          <div className="notice warn">
            Las evaluaciones todavía no están configuradas: falta la clave del servidor (<code>SUPABASE_SECRET_KEY</code>).
          </div>
        ) : (
          <EvaluationForm
            slug={course.slug}
            num={clase.num}
            questions={publicQuestions(ev)}
            passPercent={ev.passPercent}
            courseHref={base}
          />
        )}
      </div>
    </SiteShell>
  );
}
