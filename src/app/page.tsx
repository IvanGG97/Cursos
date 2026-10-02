import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteShell } from "@/components/SiteShell";
import { courses } from "@/content/registry";
import { getPublicCourseSlugs, getVisibleCourseSlugs } from "@/lib/access";

export default async function CatalogPage() {
  const [published, open] = await Promise.all([getVisibleCourseSlugs(), getPublicCourseSlugs()]);
  const visible = courses.filter((c) => published === "all" || published.has(c.slug));

  return (
    <SiteShell>
      <div className="page-head">
        <div className="kicker-sm">Cursos</div>
        <h1>Aprender haciendo</h1>
        <p>Cursos cortos y prácticos, con ejemplos reales y ejercicios en cada clase.</p>
      </div>

      {visible.length === 0 ? (
        <div className="notice">Todavía no hay cursos publicados.</div>
      ) : (
        <div className="grid">
          {visible.map((c) => {
            const ready = c.classes.filter((k) => k.slides.length > 0).length;
            const adminView = published === "all";
            return (
              <article key={c.slug} className="card" style={{ "--accent": c.accent } as CSSProperties}>
                <div className="card-top">
                  <span className="kicker-sm">{c.classes.length} clases</span>
                  {open.has(c.slug) && <span className="tag ok">Libre · sin registro</span>}
                </div>
                <h2>{c.title}</h2>
                <p>{c.tagline}</p>
                <p className="muted" style={{ fontSize: 13 }}>{c.org}</p>
                <div className="actions">
                  <Link href={`/cursos/${c.slug}`} className="btn btn-primary">Ver curso →</Link>
                  {adminView && <span className="tag">{ready}/{c.classes.length} con contenido</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SiteShell>
  );
}
