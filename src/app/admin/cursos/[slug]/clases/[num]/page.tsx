import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import type { Media } from "@/content/types";
import { classSlug } from "@/content/registry";
import { getEditorData, getLiveCourse } from "@/lib/class-content";
import { requireAdmin } from "@/lib/admin";
import { getCourseMedia } from "@/lib/media";
import { formatDateTime } from "@/lib/site";
import { CourseTabs } from "../../tabs";
import { ClassEditor, type EditorVersion } from "./ClassEditor";

export const metadata: Metadata = { title: "Editar clase" };

type Props = { params: Promise<{ slug: string; num: string }> };

export default async function EditClass({ params }: Props) {
  const { slug, num: numStr } = await params;
  const num = Number(numStr);
  const course = await getLiveCourse(slug);
  const clase = course?.classes.find((c) => c.num === num);
  if (!course || !clase) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/clases/${num}`);
  if (!ctx) return null;

  const [data, uploaded, open] = await Promise.all([
    getEditorData(slug, num),
    getCourseMedia(slug),
    ctx.supabase.from("live_sessions").select("id").eq("course_slug", slug).eq("class_num", num).eq("status", "open").limit(1),
  ]);

  // Lo subido desde "Imágenes", para que la vista previa muestre la imagen real.
  const media: Record<string, Pick<Media, "src" | "mime" | "annot" | "gallery">> = {};
  for (const [id, items] of uploaded) {
    if (!items.length) continue;
    const [first] = items;
    media[id] = {
      src: first.url,
      mime: first.mime,
      annot: first.annot,
      gallery: items.length > 1 ? items.map((i) => ({ src: i.url, mime: i.mime, annot: i.annot })) : undefined,
    };
  }

  const versions: EditorVersion[] = data.versions.map((v, i) => ({
    id: v.id,
    when: formatDateTime(v.created_at),
    note: v.note,
    author: v.author,
    original: v.original,
    current: i === 0,
  }));

  return (
    <div style={{ "--accent": clase.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href={`/admin/cursos/${slug}/clases`} className="back">← Contenido</Link>
        <h1>Clase {clase.num}: {clase.title}</h1>
      </div>
      <CourseTabs slug={slug} active="contenido" hasSurvey={Boolean(course.survey)} />
      {!data.ready && (
        <p className="notice warn">
          Podés probar el editor, pero para guardar falta correr la migración{" "}
          <span className="mono">20261010000000_class_content.sql</span> en Supabase.
        </p>
      )}
      <ClassEditor
        slug={slug}
        course={{ title: course.title, org: course.org }}
        clase={{ num: clase.num, title: clase.title, accent: clase.accent }}
        published={clase.slides}
        draft={data.draft}
        draftWhen={data.draftUpdatedAt ? formatDateTime(data.draftUpdatedAt) : null}
        versions={versions}
        media={media}
        liveOpen={Boolean(open.data?.length)}
        classHref={`/cursos/${slug}/${classSlug(clase)}`}
      />
    </div>
  );
}
