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

type Props = { params: Promise<{ slug: string }> };

export default async function CourseMedia({ params }: Props) {
  const { slug } = await params;
  const course = await getLiveCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/imagenes`);
  if (!ctx) return null;

  const slots = mediaSlots(course);
  const uploaded = await getCourseMedia(slug);
  const missing = slots.filter((s) => !uploaded.get(s.media.id)?.length && !s.media.src).length;

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="imagenes" hasSurvey={Boolean(course.survey)} />

      <section className="panel" style={{ marginBottom: 20 }}>
        <h2>Imágenes, GIFs y videos de las clases</h2>
        <p className="muted">
          {slots.length} lugar(es) · {missing} pendiente(s). Subí capturas, GIFs o videos cortos (MP4, en bucle y sin sonido:
          pesan mucho menos que un GIF), o pegá un <strong>enlace</strong> directo a una imagen, GIF o video (por ejemplo, de
          Giphy). Cada lugar admite <strong>varias imágenes</strong>: con dos o más, en la diapositiva se ven como un abanico
          que se abre como galería. Máximo 15 MB por archivo. Para lo importante conviene subir el archivo: un enlace deja de
          verse si el sitio de origen lo borra.
        </p>
      </section>

      {slots.length === 0 ? (
        <p className="muted">Este curso no tiene lugares para imágenes.</p>
      ) : (
        <div className="media-grid">
          {slots.map((s) => {
            const clase = course.classes.find((c) => c.num === s.classNum)!;
            const up = uploaded.get(s.media.id);
            return (
              <section key={s.media.id} id={s.media.id} className="panel media-slot" style={{ "--accent": clase.accent } as CSSProperties}>
                <div className="kicker-sm">
                  Clase {s.classNum} · diapositiva {s.slide} · {s.media.kind === "GIF" ? "GIF o video" : "Imagen"}
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
                <Link href={`/cursos/${slug}/${classSlug(clase)}#${s.slide}`} className="btn btn-sm" style={{ marginTop: 10 }}>
                  Ver en la clase →
                </Link>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
