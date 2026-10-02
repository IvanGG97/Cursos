import Link from "next/link";

/** Pestañas de la administración de un curso. */
export function CourseTabs({ slug, active, hasSurvey }: { slug: string; active: "config" | "seguimiento" | "encuesta"; hasSurvey: boolean }) {
  const tabs = [
    { key: "config", href: `/admin/cursos/${slug}`, label: "Configuración" },
    { key: "seguimiento", href: `/admin/cursos/${slug}/seguimiento`, label: "Seguimiento" },
    ...(hasSurvey ? [{ key: "encuesta", href: `/admin/cursos/${slug}/encuesta`, label: "Encuesta" }] : []),
  ];
  return (
    <nav className="admin-nav sub" aria-label="Secciones del curso">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href} className={t.key === active ? "active" : ""} aria-current={t.key === active ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
