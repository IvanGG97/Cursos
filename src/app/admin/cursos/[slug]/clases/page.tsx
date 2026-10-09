import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getContentStatus, getLiveCourse } from "@/lib/class-content";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";
import { CourseTabs } from "../tabs";

export const metadata: Metadata = { title: "Contenido de las clases" };

type Props = { params: Promise<{ slug: string }> };

export default async function CourseContent({ params }: Props) {
  const { slug } = await params;
  const course = await getLiveCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/clases`);
  if (!ctx) return null;
  const { ready, byClass } = await getContentStatus(slug);

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="contenido" hasSurvey={Boolean(course.survey)} />

      <section className="panel" style={{ marginBottom: 20 }}>
        <h2>Diapositivas de las clases</h2>
        <p className="muted">
          Cambiá textos, preguntas y el orden de las diapositivas, o agregá y quitá diapositivas. Lo que edites queda como{" "}
          <strong>borrador</strong> (los alumnos no lo ven) hasta que lo <strong>publiques</strong>. Cada publicación queda en el
          historial y se puede volver atrás, incluso a la versión original.
        </p>
        {!ready && (
          <p className="notice warn" style={{ margin: 0 }}>
            Para guardar cambios falta correr la migración <span className="mono">20261010000000_class_content.sql</span> en
            Supabase.
          </p>
        )}
      </section>

      <div className="stack">
        {course.classes.map((c) => {
          const st = byClass.get(c.num);
          return (
            <article key={c.num} className="panel class-admin" style={{ "--accent": c.accent } as CSSProperties}>
              <div className="panel-head">
                <div>
                  <div className="kicker-sm">Clase {String(c.num).padStart(2, "0")}</div>
                  <h3>{c.title}</h3>
                </div>
                <div className="card-row">
                  <span className="tag">{c.slides.length ? `${c.slides.length} diapositivas` : "En preparación"}</span>
                  {st?.editedAt ? (
                    <span className="tag warn">Editada · {formatDateTime(st.editedAt)}</span>
                  ) : (
                    <span className="tag">Versión original</span>
                  )}
                  {st?.draftAt && <span className="tag warn">Borrador sin publicar</span>}
                </div>
              </div>
              <div className="btn-row">
                <Link href={`/admin/cursos/${slug}/clases/${c.num}`} className="btn btn-sm btn-primary">
                  Editar diapositivas
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
