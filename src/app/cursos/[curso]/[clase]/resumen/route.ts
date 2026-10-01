import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { classSlug, getClass, getCourse } from "@/content/registry";
import { classStatus, getCourseState, getViewer } from "@/lib/access";
import { buildResumen } from "@/lib/pdf/resumen";
import { ResumenDocument } from "@/lib/pdf/ResumenDocument";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ curso: string; clase: string }> };

// Resumen en PDF de una clase. Mismas reglas de acceso que la clase.
export async function GET(request: NextRequest, { params }: Ctx) {
  const { curso, clase: slug } = await params;
  const course = getCourse(curso);
  const clase = course && getClass(course, slug);
  if (!course || !clase) return new NextResponse("No encontrado", { status: 404 });

  const viewer = await getViewer();
  const status = classStatus(viewer, await getCourseState(course.slug), clase);
  if (status.kind === "login") {
    const next = `/cursos/${course.slug}/${slug}/resumen`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.nextUrl.origin));
  }
  if (status.kind !== "open") return new NextResponse("Esta clase todavía no está disponible.", { status: 403 });

  const pdf = await renderToBuffer(
    createElement(ResumenDocument, {
      course: { title: course.title, org: course.org },
      clase: { num: clase.num, title: clase.title, summary: clase.summary, accent: clase.accent },
      resumen: buildResumen(clase.slides),
    }) as Parameters<typeof renderToBuffer>[0],
  );

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${course.slug}-${classSlug(clase)}-resumen.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
