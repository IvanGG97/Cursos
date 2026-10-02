import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Deck } from "@/components/deck/Deck";
import { getClass, getCourse } from "@/content/registry";
import { classStatus, getCourseState, getViewer } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/urls";
import type { LiveConfig } from "@/components/deck/LivePresenter";

type Params = { params: Promise<{ curso: string; clase: string }> };

async function load(params: Params["params"]) {
  const { curso, clase: slug } = await params;
  const course = getCourse(curso);
  const clase = course && getClass(course, slug);
  if (!course || !clase) notFound();
  return { course, clase, slug };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, clase } = await load(params);
  return { title: `Clase ${clase.num}: ${clase.title} — ${course.title}` };
}

export default async function ClassPage({ params }: Params) {
  const { course, clase, slug } = await load(params);
  const base = `/cursos/${course.slug}`;

  const viewer = await getViewer();
  const status = classStatus(viewer, await getCourseState(course.slug), clase);
  if (status.kind === "login") redirect(`/login?next=${base}/${slug}`);
  if (status.kind !== "open") redirect(base);

  // Admin: datos para la clase en vivo (si ya hay una abierta para esta clase, se retoma).
  let live: LiveConfig | undefined;
  if (viewer.kind === "user" && viewer.isAdmin) {
    const supabase = await createClient();
    const { data: open } = await supabase
      .from("live_sessions")
      .select("id, code, title")
      .eq("course_slug", course.slug)
      .eq("class_num", clase.num)
      .eq("status", "open")
      .maybeSingle();
    live = { slug: course.slug, num: clase.num, initial: open ?? null, joinBase: await getOrigin() };
  }

  // Solo esta clase viaja al navegador.
  return (
    <Deck
      course={{ title: course.title, org: course.org }}
      clase={{ num: clase.num, title: clase.title, accent: clase.accent, slides: clase.slides }}
      backHref={base}
      pdfHref={`${base}/${slug}/resumen`}
      trackProgress={viewer.kind === "user" && !viewer.isAdmin ? { slug: course.slug, num: clase.num } : undefined}
      live={live}
    />
  );
}
