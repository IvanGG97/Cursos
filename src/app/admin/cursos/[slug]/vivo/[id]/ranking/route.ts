import { NextResponse, type NextRequest } from "next/server";
import { getCourse } from "@/content/registry";
import { getSessionClass } from "@/lib/class-content";
import { getViewer } from "@/lib/access";
import { loadLiveResults } from "@/lib/live-results";
import { formatDateTime } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ slug: string; id: string }> };

// Ranking final de una clase en vivo en CSV (Excel / Google Sheets). Solo admin.
export async function GET(_req: NextRequest, { params }: Ctx) {
  const viewer = await getViewer();
  if (viewer.kind !== "user" || !viewer.isAdmin) return new NextResponse("No autorizado", { status: 403 });
  const { slug, id } = await params;
  const course = getCourse(slug);

  const supabase = await createClient();
  const { data: s } = await supabase
    .from("live_sessions")
    .select("title, class_num, created_at")
    .eq("id", id)
    .eq("course_slug", slug)
    .maybeSingle();
  if (!s || !course) return new NextResponse("No encontrada", { status: 404 });

  const clase = await getSessionClass(id, slug, s.class_num);
  const { ranking } = await loadLiveResults(id, clase);

  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    [esc("Partida"), esc(s.title ?? `Clase ${s.class_num}`)].join(";"),
    [esc("Fecha"), esc(formatDateTime(s.created_at))].join(";"),
    "",
    ["Puesto", "Nombre", "Puntos", "Correctas", "Respondidas", "Con cuenta"].map(esc).join(";"),
    ...ranking.map((r) => [r.rank, r.nickname, r.points, r.correct, r.answered, r.userId ? "Sí" : "No"].map(esc).join(";")),
  ];
  const csv = "﻿" + rows.join("\r\n");
  const date = s.created_at.slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ranking-${slug}-clase-${s.class_num}-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
