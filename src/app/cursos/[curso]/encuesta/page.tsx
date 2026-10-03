import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getCourse } from "@/content/registry";
import { canManage, getCourseState, getViewer, getVisibleCourseSlugs, isSurveyOpen } from "@/lib/access";
import { getMyCourseProgress } from "@/lib/progress";
import { formatDateTime } from "@/lib/site";
import { SurveyForm } from "./SurveyForm";
import "@/app/vivo/vivo.css";
import "./encuesta.css";

type Props = { params: Promise<{ curso: string }> };

export const metadata: Metadata = { title: "Encuesta" };

export default async function SurveyPage({ params }: Props) {
  const { curso } = await params;
  const course = getCourse(curso);
  if (!course?.survey) notFound();
  const base = `/cursos/${course.slug}`;

  const viewer = await getViewer();
  if (viewer.kind === "anon") redirect(`/login?next=${base}/encuesta`);
  const visible = await getVisibleCourseSlugs();
  if (visible !== "all" && !visible.has(course.slug)) notFound();
  const { surveyDone } = await getMyCourseProgress(course.slug);
  // Deshabilitada: los alumnos no la pueden responder (el admin la ve igual, para revisarla).
  const state = await getCourseState(course.slug);
  const closed = !isSurveyOpen(state) && !canManage(viewer);

  return (
    <SiteShell>
      <div className="survey-wrap" style={{ "--accent": course.accent } as CSSProperties}>
        <Link href={base} className="back">← {course.title}</Link>
        <h1 className="live-h1">{course.survey.title}</h1>
        <p className="muted">{course.survey.intro}</p>
        {viewer.kind === "local" ? (
          <div className="notice warn">La encuesta necesita Supabase configurado.</div>
        ) : surveyDone ? (
          <div className="notice ok">
            <strong>Ya respondiste esta encuesta.</strong> ¡Gracias!
          </div>
        ) : closed ? (
          <div className="notice">
            <strong>La encuesta todavía no está habilitada.</strong>{" "}
            {state.survey.visible && state.survey.visibleFrom
              ? `Se habilita el ${formatDateTime(state.survey.visibleFrom)}.`
              : "Se habilita al final del curso."}
          </div>
        ) : (
          <>
            {!isSurveyOpen(state) && (
              <div className="notice warn" style={{ marginBottom: 16 }}>
                <strong>Vista de admin:</strong> la encuesta está deshabilitada para los alumnos.{" "}
                <Link href={`/admin/cursos/${course.slug}/encuesta`}>Habilitarla →</Link>
              </div>
            )}
            <SurveyForm slug={course.slug} questions={course.survey.questions} courseHref={base} />
          </>
        )}
      </div>
    </SiteShell>
  );
}
