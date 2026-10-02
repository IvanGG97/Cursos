import Link from "next/link";
import type { Metadata } from "next";
import { AUDIT_LABELS, requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";

export const metadata: Metadata = { title: "Actividad" };

const PAGE = 50;

type Props = { searchParams: Promise<{ p?: string }> };

export default async function AdminActivity({ searchParams }: Props) {
  const ctx = await requireAdmin("/admin/actividad");
  if (!ctx) return null;
  const page = Math.max(1, Number((await searchParams).p) || 1);

  const { data, count, error } = await ctx.supabase
    .from("admin_audit")
    .select("id, actor, action, target, details, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE, page * PAGE - 1);
  if (error) throw error;

  // Nombres de quienes hicieron cada acción y de las personas afectadas.
  const ids = new Set<string>();
  for (const a of data ?? []) {
    if (a.actor) ids.add(a.actor);
    const d = a.details as Record<string, unknown>;
    if (typeof d?.user === "string") ids.add(d.user);
    if (/^[0-9a-f-]{36}$/i.test(a.target ?? "")) ids.add(a.target!);
  }
  const { data: people } = ids.size
    ? await ctx.supabase.from("profiles").select("id, full_name, email").in("id", [...ids])
    : { data: [] };
  const name = new Map((people ?? []).map((p) => [p.id as string, (p.full_name || p.email) as string]));

  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Registro de actividad</h2>
        <span className="muted mono">Página {page} de {pages}</span>
      </div>
      {(data ?? []).length === 0 ? (
        <p className="muted">Todavía no hay actividad registrada.</p>
      ) : (
        <ul className="alist">
          {(data ?? []).map((a) => {
            const d = (a.details ?? {}) as Record<string, unknown>;
            const who = typeof d.user === "string" ? d.user : /^[0-9a-f-]{36}$/i.test(a.target ?? "") ? a.target : null;
            const emails = Array.isArray(d.emails) ? (d.emails as string[]) : [];
            return (
              <li key={a.id}>
                <div className="alist-main">
                  <strong>{AUDIT_LABELS[a.action] ?? a.action}</strong>
                  <span className="muted">
                    {who ? (
                      <Link href={`/admin/personas/${who}`}>{name.get(who) ?? "persona"}</Link>
                    ) : (
                      <span className="mono">{a.target}</span>
                    )}
                    {who && a.target !== who && <span className="mono"> · {a.target}</span>}
                    {emails.length > 0 && ` · ${emails.slice(0, 3).join(", ")}${emails.length > 3 ? ` y ${emails.length - 3} más` : ""}`}
                    {typeof d.code === "string" && ` · ${d.code}`}
                    {" · por "}
                    {a.actor ? name.get(a.actor) ?? "admin" : "—"}
                  </span>
                </div>
                <span className="alist-meta">{formatDateTime(a.created_at)}</span>
              </li>
            );
          })}
        </ul>
      )}
      {pages > 1 && (
        <div className="btn-row pager">
          {page > 1 && <Link href={`?p=${page - 1}`} className="btn btn-sm">← Anterior</Link>}
          {page < pages && <Link href={`?p=${page + 1}`} className="btn btn-sm">Siguiente →</Link>}
        </div>
      )}
    </section>
  );
}
