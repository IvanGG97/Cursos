import Link from "next/link";

type Tab = "config" | "seguimiento" | "imagenes" | "encuesta";

/** Pestañas de la administración de un curso. */
export function CourseTabs({ slug, active, hasSurvey }: { slug: string; active: Tab; hasSurvey: boolean }) {
  const tabs: { key: Tab; href: string; label: string }[] = [
    { key: "config", href: `/admin/cursos/${slug}`, label: "Configuración" },
    { key: "seguimiento", href: `/admin/cursos/${slug}/seguimiento`, label: "Seguimiento" },
    { key: "imagenes", href: `/admin/cursos/${slug}/imagenes`, label: "Imágenes" },
    ...(hasSurvey ? [{ key: "encuesta" as Tab, href: `/admin/cursos/${slug}/encuesta`, label: "Encuesta" }] : []),
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
