import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Deck } from "@/components/deck/Deck";
import type { ClassQrConfig } from "@/components/deck/ClassQr";
import { getClass } from "@/content/registry";
import { getLiveCourse } from "@/lib/class-content";
import { classStatus, getCourseState, getViewer, isReleased } from "@/lib/access";
import { courseCode, joinWithQr, qrToken } from "@/lib/class-qr";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/urls";
import { getCourseMedia, withMedia } from "@/lib/media";
import type { LiveConfig } from "@/components/deck/LivePresenter";

type Params = { params: Promise<{ curso: string; clase: string }> };
type Props = Params & { searchParams: Promise<{ k?: string | string[] }> };

async function load(params: Params["params"]) {
  const { curso, clase: slug } = await params;
  const course = await getLiveCourse(curso);
  const clase = course && getClass(course, slug);
  if (!course || !clase) notFound();
  return { course, clase, slug };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, clase } = await load(params);
  return { title: `Clase ${clase.num}: ${clase.title} — ${course.title}` };
}

export default async function ClassPage({ params, searchParams }: Props) {
  const { course, clase, slug } = await load(params);
  const base = `/cursos/${course.slug}`;
  const here = `${base}/${slug}`;
  // Permiso del QR de la clase (ver src/lib/class-qr.ts).
  const rawK = (await searchParams).k;
  const k = typeof rawK === "string" && /^[\w-]{8,64}$/.test(rawK) ? rawK : undefined;

  const viewer = await getViewer();
  const state = await getCourseState(course.slug);
  const status = classStatus(viewer, state, clase);
  // Sin sesión: a ingresar, y de vuelta acá con el permiso del QR.
  if (status.kind === "login") redirect(`/login?next=${encodeURIComponent(k ? `${here}?k=${k}` : here)}`);
  // Llegó por el QR sin estar inscripto: se inscribe solo y vuelve a entrar (ya inscripto).
  if (status.kind === "enroll" && k && (await joinWithQr(course.slug, k))) redirect(here);
  if (status.kind !== "open") redirect(base);
  // Ya puede verla: se saca el permiso de la dirección (que no quede para compartir).
  if (k) redirect(here);

  // Admin: datos para la clase en vivo. Si ya hay una abierta para esta clase, se retoma donde
  // estaba (diapositiva y respuesta revelada), aunque el presentador haya cerrado la pestaña.
  let live: LiveConfig | undefined;
  let qr: ClassQrConfig | undefined;
  if (viewer.kind === "user" && viewer.isAdmin) {
    const supabase = await createClient();
    const { data: open } = await supabase
      .from("live_sessions")
      .select("id, code, title, current_slide, revealed")
      .eq("course_slug", course.slug)
      .eq("class_num", clase.num)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const origin = await getOrigin();
    live = { slug: course.slug, num: clase.num, initial: open ?? null, joinBase: origin };

    // QR para que los alumnos abran la clase en el celular, fuera de la clase en vivo.
    const code = state.published && !state.isPublic ? await courseCode(course.slug) : null;
    qr = {
      url: `${origin}${here}${code ? `?k=${qrToken(course.slug, code)}` : ""}`,
      shortUrl: `${origin.replace(/^https?:\/\//, "")}${here}`,
      slug: course.slug,
      num: clase.num,
      mode: !state.published ? "hidden" : state.isPublic ? "public" : "enrolled",
      hasCode: Boolean(code),
      released: isReleased(state, clase.num),
    };
  }

  // Solo esta clase viaja al navegador.
  return (
    <Deck
      course={{ title: course.title, org: course.org }}
      clase={{
        num: clase.num,
        title: clase.title,
        accent: clase.accent,
        style: clase.style,
        slides: withMedia(clase.slides, await getCourseMedia(course.slug)),
      }}
      backHref={base}
      pdfHref={`${base}/${slug}/resumen`}
      trackProgress={viewer.kind === "user" && !viewer.isAdmin ? { slug: course.slug, num: clase.num } : undefined}
      live={live}
      qr={qr}
    />
  );
}
