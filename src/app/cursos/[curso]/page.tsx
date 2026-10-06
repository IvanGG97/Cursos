import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { classSlug, getCourse } from "@/content/registry";
import { canManage, classStatus, getCourseState, getViewer, getVisibleCourseSlugs, isSurveyOpen, type ClassStatus } from "@/lib/access";
import { formatDateTime } from "@/lib/site";
import { getMyCourseProgress } from "@/lib/progress";
import { getCourseEvaluations } from "@/lib/evaluations";
import { createClient } from "@/lib/supabase/server";
import { JoinForm } from "./JoinForm";

type Params = { params: Promise<{ curso: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = getCourse((await params).curso);
  return { title: course?.title };
}

export default async function CoursePage({ params }: Params) {
  const { curso } = await params;
  const course = getCourse(curso);
  if (!course) notFound();

  const visible = await getVisibleCourseSlugs();
  if (visible !== "all" && !visible.has(course.slug)) notFound();

  const viewer = await getViewer();
  const state = await getCourseState(course.slug);
  const admin = canManage(viewer);
  const totalMin = course.classes.reduce((acc, c) => acc + c.blocks.reduce((a, b) => a + b.min, 0), 0);
  const mine = await getMyCourseProgress(course.slug);

  // ¿Hay una clase en vivo ahora? Los alumnos ven el botón para sumarse; el admin, para volver a
  // presentarla (retoma en la diapositiva donde estaba).
  let liveNow: { code: string; class_num: number; current_slide: number }[] = [];
  if (viewer.kind !== "local") {
    const supabase = await createClient();
    const { data } = await supabase
      .from("live_sessions")
      .select("code, class_num, current_slide")
      .eq("course_slug", course.slug)
      .eq("status", "open");
    liveNow = data ?? [];
  }
  const surveyOpen = isSurveyOpen(state);
  const evals = await getCourseEvaluations(course.slug);
  const canSeeSomething = course.classes.some((c) => classStatus(viewer, state, c).kind === "open");

  return (
    <SiteShell>
      <div className="page-head" style={{ "--accent": course.accent } as CSSProperties}>
        <div className="kicker-sm">
          Curso · {course.classes.length} clases · {Math.round(totalMin / 60)} horas
        </div>
        <h1>{course.title}</h1>
        <p>{course.tagline}</p>
        <p className="org">{course.org}</p>
      </div>

      {liveNow.map((l) => {
        const clase = course.classes.find((c) => c.num === l.class_num);
        return admin && clase ? (
          <div key={l.code} className="notice live-banner" style={{ marginBottom: 24 }}>
            <div>
              <strong>Clase {l.class_num} en vivo ahora</strong> (código {l.code}, diapositiva {l.current_slide}). Sos el
              presentador: volvé a la clase y sigue donde la dejaste.
            </div>
            <Link href={`/cursos/${course.slug}/${classSlug(clase)}#${l.current_slide}`} className="btn btn-primary">
              Volver a presentar
            </Link>
          </div>
        ) : (
          <div key={l.code} className="notice live-banner" style={{ marginBottom: 24 }}>
            <div>
              <strong>Clase {l.class_num} en vivo ahora.</strong> Sumate desde el celular para responder las preguntas
              {viewer.kind === "user" ? " y registrar tu asistencia" : ""}.
            </div>
            <Link href={`/vivo?c=${l.code}`} className="btn btn-primary">Unirme a la clase</Link>
          </div>
        );
      })}

      {admin && viewer.kind !== "local" && !state.published && (
        <div className="notice warn" style={{ marginBottom: 24 }}>
          <strong>Curso sin publicar.</strong> Solo lo ven los administradores y quienes tengan acceso individual.
          Publicalo desde <Link href={`/admin/cursos/${course.slug}`}>Admin</Link>.
        </div>
      )}

      {state.isPublic && !admin && (
        <div className="notice ok" style={{ marginBottom: 32 }}>
          <strong>Curso libre.</strong> Podés ver las clases disponibles sin registrarte.
        </div>
      )}

      {viewer.kind === "anon" && !state.isPublic && (
        <div className="notice" style={{ marginBottom: 32 }}>
          <p style={{ marginTop: 0 }}>
            <strong>Para ver las clases, ingresá con tu cuenta.</strong> Es un toque con Google, sin contraseñas nuevas.
          </p>
          <div className="btn-row">
            <Link href={`/login?next=/cursos/${course.slug}`} className="btn btn-primary">Ingresar</Link>
            <Link href={`/solicitar-acceso?curso=${course.slug}`} className="btn">No tengo Google: pedir acceso</Link>
          </div>
        </div>
      )}

      {viewer.kind === "user" && viewer.blocked && !state.isPublic && (
        <div className="notice err" style={{ marginBottom: 32 }}>
          <strong>Tu cuenta está suspendida.</strong> Si creés que es un error, hablá con tu docente.
        </div>
      )}
      {viewer.kind === "user" && !viewer.blocked && !admin && state.enrollment === "suspended" && (
        <div className="notice warn" style={{ marginBottom: 32 }}>
          <strong>Tu inscripción a este curso está suspendida.</strong> Hablá con tu docente para reactivarla.
        </div>
      )}
      {viewer.kind === "user" && !viewer.blocked && !admin && state.enrollment === "none" && state.published && !state.isPublic && (
        <JoinForm />
      )}

      <div className="classes">
        {course.classes.map((clase) => {
          const status = classStatus(viewer, state, clase);
          const href = `/cursos/${course.slug}/${classSlug(clase)}`;
          const open = status.kind === "open";
          const minutes = clase.blocks.reduce((a, b) => a + b.min, 0);
          const prog = mine.progress.get(clase.num);
          const ev = mine.evals.get(clase.num);
          const inProgress = prog && !prog.completed && prog.last > 1;
          return (
            <article
              key={clase.num}
              className={`class-row${open ? "" : " locked"}`}
              style={{ "--accent": clase.accent } as CSSProperties}
            >
              <div>
                <div className="kicker-sm">
                  Clase {String(clase.num).padStart(2, "0")} · {minutes} min
                </div>
                <h3>{clase.title}</h3>
                <p>{clase.summary}</p>
                {open && prog && (
                  <div className="class-progress" aria-label="Tu avance">
                    <span className="class-progress-bar">
                      <span style={{ width: `${Math.round((prog.max / prog.total) * 100)}%` }} />
                    </span>
                    <span className="class-progress-text">
                      {prog.completed ? "Vista" : `Vas por la ${prog.last} de ${prog.total}`}
                      {ev && ` · Evaluación: ${ev.best}/${ev.total}${ev.passed ? " aprobada" : ""}`}
                    </span>
                  </div>
                )}
              </div>
              <div className="actions">
                {open ? (
                  <>
                    {status.preview && <span className="tag warn">Oculta para alumnos</span>}
                    <a href={`${href}/resumen`} className="btn">Resumen PDF</a>
                    {/* Evaluación: los alumnos la ven solo habilitada; el admin, siempre (con aviso). */}
                    {evals.get(clase.num) && (evals.get(clase.num)!.isOpen || admin) && (
                      <Link href={`${href}/evaluacion`} className="btn">
                        {ev?.passed ? "Evaluación ✓" : "Evaluación"}
                      </Link>
                    )}
                    {admin && evals.get(clase.num) && !evals.get(clase.num)!.isOpen && (
                      <span className="tag">Evaluación deshabilitada</span>
                    )}
                    <Link href={inProgress ? `${href}#${prog.last}` : href} className="btn btn-primary">
                      {inProgress ? "Seguir →" : "Abrir clase →"}
                    </Link>
                  </>
                ) : (
                  <span className="status">{statusLabel(status)}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Admin: estado de la encuesta (los alumnos solo la ven cuando está habilitada). */}
      {course.survey && admin && viewer.kind !== "local" && !surveyOpen && (
        <div className="notice survey-cta">
          <strong>
            Encuesta final{" "}
            {state.survey.visible && state.survey.visibleFrom
              ? `programada para el ${formatDateTime(state.survey.visibleFrom)}`
              : "deshabilitada."}
          </strong>{" "}
          Los alumnos todavía no la ven.{" "}
          <Link href={`/admin/cursos/${course.slug}/encuesta`}>Habilitarla →</Link>
        </div>
      )}

      {course.survey && surveyOpen && viewer.kind !== "local" && (viewer.kind === "user" ? canSeeSomething : state.isPublic) && (
        <section className="notice survey-cta">
          {mine.surveyDone ? (
            <p style={{ margin: 0 }}>
              <strong>¡Gracias por responder la encuesta!</strong>
            </p>
          ) : (
            <>
              <p style={{ marginTop: 0 }}>
                <strong>{course.survey.title}</strong> Contanos en un minuto qué te pareció el curso.
              </p>
              <Link href={`/cursos/${course.slug}/encuesta`} className="btn btn-primary">Responder la encuesta</Link>
            </>
          )}
        </section>
      )}
    </SiteShell>
  );
}

function statusLabel(s: ClassStatus) {
  switch (s.kind) {
    case "empty":
      return "En preparación";
    case "scheduled":
      return `Disponible el ${formatDateTime(s.from)}`;
    case "hidden":
      return "Todavía no disponible";
    case "login":
      return "Ingresá para verla";
    case "enroll":
      return "Inscribite para verla";
    case "suspended":
      return "Inscripción suspendida";
    case "blocked":
      return "Cuenta suspendida";
    case "open":
      return "";
  }
}
