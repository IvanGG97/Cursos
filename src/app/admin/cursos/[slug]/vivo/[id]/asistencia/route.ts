import { NextResponse, type NextRequest } from "next/server";
import { getViewer } from "@/lib/access";
import { formatDateTime } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ slug: string; id: string }> };

// Asistencia de una clase en vivo en CSV (se abre directo en Excel / Google Sheets). Solo admin.
export async function GET(_req: NextRequest, { params }: Ctx) {
  const viewer = await getViewer();
  if (viewer.kind !== "user" || !viewer.isAdmin) return new NextResponse("No autorizado", { status: 403 });
  const { slug, id } = await params;

  const supabase = await createClient();
  const [s, att] = await Promise.all([
    supabase.from("live_sessions").select("class_num, created_at").eq("id", id).eq("course_slug", slug).maybeSingle(),
    supabase.from("live_attendance").select("created_at, profiles(full_name, email)").eq("session_id", id).order("created_at"),
  ]);
  if (!s.data) return new NextResponse("No encontrada", { status: 404 });

  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = [["Nombre", "Mail", "Hora de ingreso"].map(esc).join(";")];
  for (const a of att.data ?? []) {
    const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as { full_name: string | null; email: string | null } | null;
    rows.push([p?.full_name ?? "", p?.email ?? "", formatDateTime(a.created_at)].map(esc).join(";"));
  }
  // BOM + ";" para que Excel en español lo abra con acentos y columnas bien.
  const csv = "﻿" + rows.join("\r\n");
  const date = s.data.created_at.slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asistencia-${slug}-clase-${s.data.class_num}-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
