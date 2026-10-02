import Link from "next/link";
import { courses } from "@/content/registry";
import { AUDIT_LABELS, requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";

export default async function AdminHome() {
  const ctx = await requireAdmin("/admin");
  if (!ctx) return null;
  const { supabase } = ctx;

  const [people, active, invites, published, released, recentPeople, recentAudit] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("enrollments").select("user_id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("enrollment_invites").select("email", { count: "exact", head: true }),
    supabase.from("courses").select("slug", { count: "exact", head: true }).eq("published", true),
    supabase.from("class_releases").select("class_num", { count: "exact", head: true }).eq("visible", true),
    supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("admin_audit").select("id, action, target, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const tiles = [
    { label: "Personas registradas", value: people.count ?? 0, href: "/admin/personas" },
    { label: "Inscripciones activas", value: active.count ?? 0, href: "/admin/cursos" },
    { label: "Invitaciones pendientes", value: invites.count ?? 0, href: "/admin/cursos" },
    { label: "Cursos publicados", value: `${published.count ?? 0} / ${courses.length}`, href: "/admin/cursos" },
    { label: "Clases liberadas", value: released.count ?? 0, href: "/admin/cursos" },
  ];

  return (
    <>
      <div className="stat-grid">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="stat">
            <span className="stat-value">{t.value}</span>
            <span className="stat-label">{t.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-cols">
        <section className="panel">
          <div className="panel-head">
            <h2>Últimos registros</h2>
            <Link href="/admin/personas" className="btn btn-sm">Ver todas</Link>
          </div>
          {(recentPeople.data ?? []).length === 0 ? (
            <p className="muted">Todavía nadie se registró.</p>
          ) : (
            <ul className="alist">
              {(recentPeople.data ?? []).map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/personas/${p.id}`} className="alist-main">
                    <strong>{p.full_name || p.email}</strong>
                    <span className="muted">{p.full_name ? p.email : ""}</span>
                  </Link>
                  <span className="alist-meta">{formatDateTime(p.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Actividad reciente</h2>
            <Link href="/admin/actividad" className="btn btn-sm">Ver todo</Link>
          </div>
          {(recentAudit.data ?? []).length === 0 ? (
            <p className="muted">Sin actividad todavía.</p>
          ) : (
            <ul className="alist">
              {(recentAudit.data ?? []).map((a) => (
                <li key={a.id}>
                  <div className="alist-main">
                    <strong>{AUDIT_LABELS[a.action] ?? a.action}</strong>
                    <span className="muted mono">{a.target}</span>
                  </div>
                  <span className="alist-meta">{formatDateTime(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
