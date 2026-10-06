import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getViewer } from "@/lib/access";
import { requestCourse } from "@/lib/access-requests";
import { RequestAccess } from "./RequestAccess";
import "@/app/vivo/vivo.css";

export const metadata: Metadata = { title: "Pedí acceso" };

type Props = { searchParams: Promise<{ curso?: string }> };

// Para quien no tiene cuenta de Google: deja nombre y mail, el docente aprueba en el panel
// (presencial) y esta pantalla entra sola.
export default async function RequestAccessPage({ searchParams }: Props) {
  const { curso } = await searchParams;
  const course = requestCourse(curso);
  const viewer = await getViewer();
  // Ya tiene sesión: no hace falta pedir acceso.
  if (viewer.kind === "user") redirect(course ? `/cursos/${course.slug}` : "/");

  return (
    <SiteShell>
      <div className="live-wrap">
        <div className="kicker-sm">{course ? course.title : "Acceso"} · sin cuenta de Google</div>
        <RequestAccess courseSlug={course?.slug ?? ""} />
        <p className="hint" style={{ marginTop: 24 }}>
          ¿Tenés cuenta de Google? Es más rápido:{" "}
          <Link href={`/login${course ? `?next=${encodeURIComponent(`/cursos/${course.slug}`)}` : ""}`}>entrá con Google</Link>.
        </p>
      </div>
    </SiteShell>
  );
}
