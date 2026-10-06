import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { classSlug, getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { getCourseEvaluations } from "@/lib/evaluations";
import { formatDateTime, toLocalInput } from "@/lib/site";
import { setEvaluationOpen } from "../../../actions";
import { ActionForm, Submit } from "../../../_ui";
import { CourseTabs } from "../tabs";

export const metadata: Metadata = { title: "Evaluaciones" };

type Props = { params: Promise<{ slug: string }> };

// Evaluaciones por clase: habilitar / deshabilitar / programar, y acceso al editor de preguntas.
export default async function CourseEvaluations({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/evaluaciones`);
  if (!ctx) return null;

  const evals = await getCourseEvaluations(slug);
  const { data: atts } = await ctx.supabase.from("evaluation_attempts").select("class_num, evaluation_id").eq("course_slug", slug);

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="evaluaciones" hasSurvey={Boolean(course.survey)} />

      <section className="panel" style={{ marginBottom: 14 }}>
        <h2>Evaluaciones de las clases</h2>
        <p className="muted">
          Cada evaluación está <strong>deshabilitada</strong> hasta que la habilites (o la programes para una fecha y hora).
          Deshabilitada, los alumnos no la ven ni la pueden rendir; vos la podés probar igual (tus intentos no se
          guardan). Las preguntas se pueden editar: lo editado reemplaza a la versión original, que siempre se puede
          restaurar.
        </p>
      </section>

      <div className="stack">
        {course.classes.map((clase) => {
          const ce = evals.get(clase.num);
          if (!ce) return null;
          const scheduled = ce.visible && !ce.isOpen && ce.visibleFrom;
          const tries = (atts ?? []).filter((a) => a.class_num === clase.num);
          const triesNow = tries.filter((a) => a.evaluation_id === ce.ev.id).length;
          const f = { slug, num: clase.num };
          return (
            <article key={clase.num} className="panel class-admin" style={{ "--accent": clase.accent } as CSSProperties}>
              <div className="panel-head">
                <div>
                  <div className="kicker-sm">Clase {String(clase.num).padStart(2, "0")}</div>
                  <h3>{ce.ev.title}</h3>
                </div>
                <div className="card-row">
                  {ce.isOpen ? (
                    <span className="tag ok">Habilitada</span>
                  ) : scheduled ? (
                    <span className="tag warn">Se habilita el {formatDateTime(ce.visibleFrom!)}</span>
                  ) : (
                    <span className="tag">Deshabilitada</span>
                  )}
                  <span className="tag">{ce.ev.questions.length} preguntas · aprueba con {ce.ev.passPercent}%</span>
                  {ce.edited && <span className="tag warn">Editada en el panel</span>}
                </div>
              </div>
              <p className="hint">
                {tries.length === 0
                  ? "Todavía nadie la rindió."
                  : `${tries.length} intento(s)${ce.edited && triesNow !== tries.length ? `, ${triesNow} con las preguntas actuales` : ""}.`}
                {ce.edited && ce.updatedAt && ` Editada el ${formatDateTime(ce.updatedAt)}.`}
              </p>

              <div className="btn-row">
                {!ce.isOpen && (
                  <ActionForm action={setEvaluationOpen} fields={{ ...f, open: "true", open_from: "" }} inline>
                    <Submit small variant="primary">Habilitar ahora</Submit>
                  </ActionForm>
                )}
                {(ce.isOpen || scheduled) && (
                  <ActionForm action={setEvaluationOpen} fields={{ ...f, open: "false", open_from: "" }} inline>
                    <Submit small>Deshabilitar</Submit>
                  </ActionForm>
                )}
                <Link href={`/admin/cursos/${slug}/evaluaciones/${clase.num}`} className="btn btn-sm">
                  Editar preguntas
                </Link>
                <Link href={`/cursos/${slug}/${classSlug(clase)}/evaluacion`} className="btn btn-sm">
                  Probar
                </Link>
              </div>

              <details className="more">
                <summary>Programar para una fecha y hora</summary>
                <ActionForm action={setEvaluationOpen} fields={{ ...f, open: "true" }}>
                  <div className="form-row">
                    <input
                      type="datetime-local"
                      name="open_from"
                      className="input"
                      defaultValue={toLocalInput(scheduled ? ce.visibleFrom : null)}
                      aria-label="Habilitar desde (hora de Argentina)"
                      required
                    />
                    <Submit>Programar</Submit>
                  </div>
                  <p className="hint">Hora de Argentina. La evaluación se habilita sola a esa hora.</p>
                </ActionForm>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}
