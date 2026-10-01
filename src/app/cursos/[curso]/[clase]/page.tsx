import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Deck } from "@/components/deck/Deck";
import { getClass, getCourse } from "@/content/registry";
import { classStatus, getCourseState, getViewer } from "@/lib/access";

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

  // Solo esta clase viaja al navegador.
  return (
    <Deck
      course={{ title: course.title, org: course.org }}
      clase={{ num: clase.num, title: clase.title, accent: clase.accent, slides: clase.slides }}
      backHref={base}
      pdfHref={`${base}/${slug}/resumen`}
    />
  );
}
