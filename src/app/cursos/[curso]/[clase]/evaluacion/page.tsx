import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getClass, getCourse } from "@/content/registry";
import { getLiveCourse } from "@/lib/class-content";
import { canManage, classStatus, getCourseState, getViewer } from "@/lib/access";
import { getCourseEvaluations, publicQuestions } from "@/lib/evaluations";
import { formatDateTime } from "@/lib/site";
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
  const ce = c && k ? (await getCourseEvaluations(c.slug)).get(k.num) : undefined;
  return { title: ce?.ev.title ?? "Evaluación" };
}

export default async function EvaluationPage({ params }: Props) {
  const { curso, clase: classSlug } = await params;
  const course = await getLiveCourse(curso);
  const clase = course && getClass(course, classSlug);
  if (!course || !clase) notFound();
  // La vigente: la del repo o la editada en el panel.
  const ce = (await getCourseEvaluations(course.slug)).get(clase.num);
  if (!ce) notFound();
  const ev = ce.ev;

  const base = `/cursos/${course.slug}`;
  const viewer = await getViewer();
  if (viewer.kind === "anon") redirect(`/login?next=${base}/${classSlug}/evaluacion`);
  const status = classStatus(viewer, await getCourseState(course.slug), clase);
  if (status.kind !== "open") redirect(base);

  const mine = (await getMyCourseProgress(course.slug)).evals.get(clase.num);
  // Deshabilitada: los alumnos no la pueden rendir. El admin la ve igual, para probarla.
  const admin = canManage(viewer);
  const closed = !ce.isOpen && !admin;

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
        {closed ? (
          <div className="notice">
            <strong>La evaluación de esta clase todavía no está habilitada.</strong>{" "}
            {ce.visible && ce.visibleFrom ? `Se habilita el ${formatDateTime(ce.visibleFrom)}` : "Tu docente la habilita cuando corresponda."}
          </div>
        ) : viewer.kind === "local" || !isServiceConfigured ? (
          <div className="notice warn">
            Las evaluaciones todavía no están configuradas: falta la clave del servidor (<code>SUPABASE_SECRET_KEY</code>).
          </div>
        ) : (
          <>
          {admin && (
            <div className="notice warn" style={{ marginBottom: 16 }}>
              <strong>Vista de admin:</strong> {ce.isOpen ? "la evaluación está habilitada." : "la evaluación está deshabilitada para los alumnos."}{" "}
              Tus intentos no se guardan.{" "}
              <Link href={`/admin/cursos/${course.slug}/evaluaciones`}>Administrar evaluaciones →</Link>
            </div>
          )}
          <EvaluationForm
            slug={course.slug}
            num={clase.num}
            questions={publicQuestions(ev)}
            passPercent={ev.passPercent}
            courseHref={base}
          />
          </>
        )}
      </div>
    </SiteShell>
  );
}
