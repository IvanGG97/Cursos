import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { classSlug, getCourse } from "@/content/registry";
import { canManage, classStatus, getCourseState, getViewer, getVisibleCourseSlugs, type ClassStatus } from "@/lib/access";
import { formatDateTime } from "@/lib/site";
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

      {admin && viewer.kind !== "local" && !state.published && (
        <div className="notice warn" style={{ marginBottom: 24 }}>
          <strong>Curso sin publicar.</strong> Solo lo ven los administradores y quienes tengan acceso individual.
          Publicalo desde <Link href={`/admin/cursos/${course.slug}`}>Admin</Link>.
        </div>
      )}

      {viewer.kind === "anon" && (
        <div className="notice" style={{ marginBottom: 32 }}>
          <p style={{ marginTop: 0 }}>
            <strong>Para ver las clases, ingresá con tu cuenta.</strong> Es un toque con Google, sin contraseñas nuevas.
          </p>
          <Link href={`/login?next=/cursos/${course.slug}`} className="btn btn-primary">Ingresar</Link>
        </div>
      )}

      {viewer.kind === "user" && viewer.blocked && (
        <div className="notice err" style={{ marginBottom: 32 }}>
          <strong>Tu cuenta está suspendida.</strong> Si creés que es un error, hablá con tu docente.
        </div>
      )}
      {viewer.kind === "user" && !viewer.blocked && !admin && state.enrollment === "suspended" && (
        <div className="notice warn" style={{ marginBottom: 32 }}>
          <strong>Tu inscripción a este curso está suspendida.</strong> Hablá con tu docente para reactivarla.
        </div>
      )}
      {viewer.kind === "user" && !viewer.blocked && !admin && state.enrollment === "none" && state.published && (
        <JoinForm />
      )}

      <div className="classes">
        {course.classes.map((clase) => {
          const status = classStatus(viewer, state, clase);
          const href = `/cursos/${course.slug}/${classSlug(clase)}`;
          const open = status.kind === "open";
          const minutes = clase.blocks.reduce((a, b) => a + b.min, 0);
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
              </div>
              <div className="actions">
                {open ? (
                  <>
                    {status.preview && <span className="tag warn">Oculta para alumnos</span>}
                    <a href={`${href}/resumen`} className="btn">Resumen PDF</a>
                    <Link href={href} className="btn btn-primary">Abrir clase →</Link>
                  </>
                ) : (
                  <span className="status">{statusLabel(status)}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
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
