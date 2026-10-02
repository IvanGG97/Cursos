import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { courses } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Cursos" };

export default async function AdminCourses() {
  const ctx = await requireAdmin("/admin/cursos");
  if (!ctx) return null;
  const { supabase } = ctx;

  const [rows, codes, releases, enrollments, invites] = await Promise.all([
    supabase.from("courses").select("slug, published"),
    supabase.from("course_codes").select("course_slug, code"),
    supabase.from("class_releases").select("course_slug, class_num, visible, visible_from"),
    supabase.from("enrollments").select("course_slug, status"),
    supabase.from("enrollment_invites").select("course_slug"),
  ]);

  const published = new Map((rows.data ?? []).map((r) => [r.slug as string, r.published as boolean]));
  const code = new Map((codes.data ?? []).map((r) => [r.course_slug as string, r.code as string]));
  const now = new Date();

  return (
    <div className="grid">
      {courses.map((c) => {
        const isPub = published.get(c.slug) ?? false;
        const rel = (releases.data ?? []).filter(
          (r) => r.course_slug === c.slug && r.visible && (!r.visible_from || new Date(r.visible_from) <= now),
        ).length;
        const enr = (enrollments.data ?? []).filter((e) => e.course_slug === c.slug);
        const act = enr.filter((e) => e.status === "active").length;
        const inv = (invites.data ?? []).filter((i) => i.course_slug === c.slug).length;
        const ready = c.classes.filter((k) => k.slides.length > 0).length;
        return (
          <article key={c.slug} className="card" style={{ "--accent": c.accent } as CSSProperties}>
            <div className="card-row">
              <span className={`tag ${isPub ? "ok" : ""}`}>{isPub ? "Publicado" : "Sin publicar"}</span>
              <span className="tag">{code.get(c.slug) ? `Código ${code.get(c.slug)}` : "Sin código"}</span>
            </div>
            <h2>{c.title}</h2>
            <dl className="kv">
              <div><dt>Inscripciones activas</dt><dd>{act}</dd></div>
              <div><dt>Suspendidas</dt><dd>{enr.length - act}</dd></div>
              <div><dt>Invitaciones pendientes</dt><dd>{inv}</dd></div>
              <div><dt>Clases liberadas</dt><dd>{rel} / {c.classes.length}</dd></div>
              <div><dt>Clases con contenido</dt><dd>{ready} / {c.classes.length}</dd></div>
            </dl>
            <div className="actions">
              <Link href={`/admin/cursos/${c.slug}`} className="btn btn-primary">Administrar →</Link>
              <Link href={`/cursos/${c.slug}`} className="btn">Ver página del curso</Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
