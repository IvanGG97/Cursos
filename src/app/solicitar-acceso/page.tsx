import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { courses } from "@/content/registry";
import { getViewer, getVisibleCourseSlugs } from "@/lib/access";
import { requestCourse } from "@/lib/access-requests";
import { RequestAccess } from "./RequestAccess";
import "@/app/vivo/vivo.css";

export const metadata: Metadata = { title: "Pedí acceso" };

type Props = { searchParams: Promise<{ curso?: string }> };

// Para quien no tiene cuenta de Google: deja nombre y mail, el docente aprueba en el panel
// (presencial) y esta pantalla entra sola.
export default async function RequestAccessPage({ searchParams }: Props) {
  const { curso } = await searchParams;
  const viewer = await getViewer();
  // Sin curso en el link: si hay un solo curso publicado, es ese; si hay varios, se elige primero.
  const visible = await getVisibleCourseSlugs();
  const options = courses.filter((c) => visible === "all" || visible.has(c.slug));
  const course = requestCourse(curso) ?? (options.length === 1 ? options[0] : undefined);
  const choose = !course && options.length > 1;
  // Ya tiene sesión: no hace falta pedir acceso.
  if (viewer.kind === "user") redirect(course ? `/cursos/${course.slug}` : "/");

  return (
    <SiteShell>
      <div className="live-wrap">
        <div className="kicker-sm">{course ? course.title : "Acceso"} · sin cuenta de Google</div>
        {choose ? (
          <>
            <h1 className="live-h1">¿Para qué curso pedís acceso?</h1>
            <div className="stack">
              {options.map((c) => (
                <Link key={c.slug} href={`/solicitar-acceso?curso=${c.slug}`} className="btn btn-block">
                  {c.title}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <RequestAccess courseSlug={course?.slug ?? ""} />
        )}
        <p className="hint" style={{ marginTop: 24 }}>
          ¿Tenés cuenta de Google? Es más rápido:{" "}
          <Link href={`/login${course ? `?next=${encodeURIComponent(`/cursos/${course.slug}`)}` : ""}`}>entrá con Google</Link>.
        </p>
      </div>
    </SiteShell>
  );
}
