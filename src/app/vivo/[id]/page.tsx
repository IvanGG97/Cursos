import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { classSlug, getCourse } from "@/content/registry";
import { getViewer } from "@/lib/access";
import { getCourseMedia, withMedia } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { LiveStudent, type LiveQuiz } from "./LiveStudent";
import "../vivo.css";

export const metadata: Metadata = { title: "Clase en vivo" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ alumno?: string }> };

export default async function LiveSessionPage({ params, searchParams }: Props) {
  const { id } = await params;
  const asStudent = (await searchParams).alumno === "1";
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const viewer = await getViewer();
  if (viewer.kind === "local") notFound();

  const supabase = await createClient();
  const { data: s } = await supabase
    .from("live_sessions")
    .select("id, code, title, course_slug, class_num, status, current_slide, revealed")
    .eq("id", id)
    .maybeSingle();

  const course = s && getCourse(s.course_slug);
  const clase = course?.classes.find((c) => c.num === s?.class_num);
  if (!s || !course || !clase || s.status !== "open") {
    return (
      <SiteShell>
        <div className="live-wrap">
          <h1 className="live-h1">La clase en vivo terminó</h1>
          <p className="muted">Gracias por participar. Podés repasar la clase desde la página del curso.</p>
          <Link href={course ? `/cursos/${course.slug}` : "/"} className="btn btn-primary">Ir al curso</Link>
        </div>
      </SiteShell>
    );
  }

  // El admin es el presentador: no entra como alumno (salvo que lo elija, para probar).
  const isAdmin = viewer.kind === "user" && viewer.isAdmin;
  if (isAdmin && !asStudent) {
    const presentHref = `/cursos/${course.slug}/${classSlug(clase)}#${s.current_slide}`;
    return (
      <SiteShell>
        <div className="live-wrap">
          <div className="kicker-sm">En vivo · {s.title ?? `Clase ${clase.num}`}</div>
          <h1 className="live-h1">Sos el presentador de esta clase</h1>
          <p className="muted">
            Código {s.code} · Clase {clase.num}: {clase.title} · va por la diapositiva {s.current_slide}. Al volver, la clase
            sigue donde la dejaste, con las respuestas y el ranking.
          </p>
          <div className="btn-row">
            <Link href={presentHref} className="btn btn-primary">Volver a presentar</Link>
            <Link href={`/vivo/${s.id}?alumno=1`} className="btn">Entrar como alumno (para probar)</Link>
          </div>
        </div>
      </SiteShell>
    );
  }

  // Si entró directo al link con la sesión iniciada, igual queda registrada la asistencia
  // (el admin que entra para probar no suma asistencia).
  if (viewer.kind === "user" && !isAdmin) await supabase.rpc("join_live", { p_code: s.code });

  // Las preguntas van aparte (se responden desde el celular, indexadas por número de diapositiva).
  // El resto de las diapositivas viaja para mostrar en el celular la que se está proyectando.
  const slides = withMedia(clase.slides, await getCourseMedia(course.slug));
  const quizzes: Record<number, LiveQuiz> = {};
  slides.forEach((sl, i) => {
    if (sl.type === "quiz") {
      quizzes[i + 1] = { kind: sl.kind, question: sl.question, options: sl.options, explanation: sl.explanation };
    }
  });

  return (
    <SiteShell>
      <LiveStudent
        sessionId={s.id}
        sessionTitle={s.title}
        initial={{ slide: s.current_slide, revealed: s.revealed, open: true }}
        total={slides.length}
        quizzes={quizzes}
        slides={slides}
        course={{ title: course.title, org: course.org }}
        classNum={clase.num}
        classShortTitle={clase.title}
        userId={viewer.kind === "user" ? viewer.id : null}
        defaultName={viewer.kind === "user" ? (viewer.name ?? "") : ""}
        classTitle={`Clase ${clase.num}: ${clase.title}`}
        accent={clase.accent}
        courseHref={`/cursos/${course.slug}`}
      />
    </SiteShell>
  );
}
