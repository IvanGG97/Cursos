import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { classSlug } from "@/content/registry";
import { getLiveCourse } from "@/lib/class-content";
import { requireAdmin } from "@/lib/admin";
import { getCourseMedia, mediaSlots } from "@/lib/media";
import { CourseTabs } from "../tabs";
import { MediaUploader } from "./MediaUploader";

export const metadata: Metadata = { title: "Imágenes" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ clase?: string; pendientes?: string }> };

export default async function CourseMedia({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const course = await getLiveCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/imagenes`);
  if (!ctx) return null;

  const slots = mediaSlots(course);
  const uploaded = await getCourseMedia(slug);
  const isMissing = (s: (typeof slots)[number]) => !uploaded.get(s.media.id)?.length && !s.media.src;
  const missing = slots.filter(isMissing).length;

  // Separado por clase: se ve una clase por vez. Sin elegir, la primera que tenga imágenes pendientes.
  const byClass = course.classes.map((c) => {
    const here = slots.filter((s) => s.classNum === c.num);
    return { clase: c, slots: here, missing: here.filter(isMissing).length };
  });
  const withSlots = byClass.filter((b) => b.slots.length > 0);
  const asked = byClass.find((b) => String(b.clase.num) === sp.clase && b.slots.length > 0);
  const current = asked ?? withSlots.find((b) => b.missing > 0) ?? withSlots[0];
  const onlyMissing = sp.pendientes === "1";
  const shown = current ? (onlyMissing ? current.slots.filter(isMissing) : current.slots) : [];
  const base = `/admin/cursos/${slug}/imagenes`;

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="imagenes" hasSurvey={Boolean(course.survey)} />

      <div className="media-intro">
        <p className="muted">
          {slots.length} lugar(es) para imágenes · {missing ? `${missing} pendiente(s)` : "todas cargadas"}. Elegí la clase:
        </p>
        <details className="more">
          <summary>Cómo cargar imágenes (formatos y consejos)</summary>
          <p className="muted">
            Subí capturas, GIFs o videos cortos (MP4, en bucle y sin sonido: pesan mucho menos que un GIF), o pegá un{" "}
            <strong>enlace</strong> directo a una imagen, GIF o video (por ejemplo, de Giphy). Cada lugar admite{" "}
            <strong>varias imágenes</strong>: con dos o más, en la diapositiva se ven como un abanico que se abre como galería.
            Máximo 15 MB por archivo. Para lo importante conviene subir el archivo: un enlace deja de verse si el sitio de origen
            lo borra.
          </p>
        </details>
      </div>

      {!current ? (
        <p className="muted">Este curso no tiene lugares para imágenes.</p>
      ) : (
        <>
          <nav className="media-classes" aria-label="Elegí la clase">
            {byClass.map((b) => {
              const on = b.clase.num === current.clase.num;
              const style = { "--accent": b.clase.accent } as CSSProperties;
              const inner = (
                <>
                  <span className="media-class-n">Clase {b.clase.num}</span>
                  <span className="media-class-t">{b.clase.title}</span>
                  <span className="media-class-c">
                    {b.slots.length === 0
                      ? "Sin imágenes"
                      : `${b.slots.length} lugar(es) · ${b.missing ? `${b.missing} pendiente(s)` : "todas cargadas"}`}
                  </span>
                </>
              );
              return b.slots.length === 0 ? (
                <span key={b.clase.num} className="media-class off" style={style}>
                  {inner}
                </span>
              ) : (
                <Link
                  key={b.clase.num}
                  href={`${base}?clase=${b.clase.num}`}
                  className={`media-class${on ? " on" : ""}${b.missing ? " has-missing" : ""}`}
                  aria-current={on ? "page" : undefined}
                  style={style}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <div className="media-class-head" style={{ "--accent": current.clase.accent } as CSSProperties}>
            <h2>
              Clase {current.clase.num}: {current.clase.title}
            </h2>
            <div className="btn-row">
              {current.missing > 0 && current.missing < current.slots.length && (
                <Link href={onlyMissing ? `${base}?clase=${current.clase.num}` : `${base}?clase=${current.clase.num}&pendientes=1`} className="btn btn-sm">
                  {onlyMissing ? `Ver todas (${current.slots.length})` : `Ver solo las pendientes (${current.missing})`}
                </Link>
              )}
              <Link href={`/cursos/${slug}/${classSlug(current.clase)}`} className="btn btn-sm">
                Ver la clase
              </Link>
            </div>
          </div>

          <div className="media-grid">
            {shown.map((s) => {
              const up = uploaded.get(s.media.id);
              return (
                <section key={s.media.id} id={s.media.id} className="panel media-slot" style={{ "--accent": current.clase.accent } as CSSProperties}>
                  <div className="media-slot-top">
                    <span className="kicker-sm">
                      Diapositiva {s.slide} · {s.media.kind === "GIF" ? "GIF o video" : "Imagen"}
                    </span>
                    {isMissing(s) ? <span className="tag warn">Pendiente</span> : <span className="tag ok">Cargada</span>}
                  </div>
                  <h3>{s.slideTitle}</h3>
                  <p className="hint">{s.media.caption}</p>
                  <MediaUploader
                    slug={slug}
                    mediaId={s.media.id}
                    caption={s.media.caption}
                    items={(up ?? []).map((u) => ({ id: u.id, url: u.url, mime: u.mime, external: u.external, annot: u.annot }))}
                    fallback={s.media.src}
                  />
                  <Link href={`/cursos/${slug}/${classSlug(current.clase)}#${s.slide}`} className="btn btn-sm" style={{ marginTop: 10 }}>
                    Ver en la clase →
                  </Link>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
