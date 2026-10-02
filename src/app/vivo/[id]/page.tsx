import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getCourse } from "@/content/registry";
import { getViewer } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { LiveStudent, type LiveQuiz } from "./LiveStudent";
import "../vivo.css";

export const metadata: Metadata = { title: "Clase en vivo" };

type Props = { params: Promise<{ id: string }> };

export default async function LiveSessionPage({ params }: Props) {
  const { id } = await params;
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

  // Si entró directo al link con la sesión iniciada, igual queda registrada la asistencia.
  if (viewer.kind === "user") await supabase.rpc("join_live", { p_code: s.code });

  // Solo las preguntas de la clase viajan al celular (indexadas por número de diapositiva).
  const quizzes: Record<number, LiveQuiz> = {};
  clase.slides.forEach((sl, i) => {
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
        total={clase.slides.length}
        quizzes={quizzes}
        userId={viewer.kind === "user" ? viewer.id : null}
        defaultName={viewer.kind === "user" ? (viewer.name ?? "") : ""}
        classTitle={`Clase ${clase.num}: ${clase.title}`}
        accent={clase.accent}
        courseHref={`/cursos/${course.slug}`}
      />
    </SiteShell>
  );
}
