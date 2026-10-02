import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";

export const metadata: Metadata = { title: "Personas" };

const PAGE = 30;

type Props = { searchParams: Promise<{ q?: string; rol?: string; estado?: string; p?: string }> };

export default async function AdminPeople({ searchParams }: Props) {
  const ctx = await requireAdmin("/admin/personas");
  if (!ctx) return null;
  const { q = "", rol = "", estado = "", p = "1" } = await searchParams;
  const page = Math.max(1, Number(p) || 1);

  let query = ctx.supabase
    .from("profiles")
    .select("id, full_name, email, role, status, created_at, last_sign_in_at, enrollments(count)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE, page * PAGE - 1);

  // Sin caracteres que rompan el filtro de PostgREST.
  const term = q.replace(/[,()*%\\]/g, " ").trim();
  if (term) query = query.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
  if (rol === "admin" || rol === "student") query = query.eq("role", rol);
  if (estado === "active" || estado === "blocked") query = query.eq("status", estado);

  const { data, count, error } = await query;
  if (error) throw error;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  const qs = (n: number) => {
    const s = new URLSearchParams();
    if (q) s.set("q", q);
    if (rol) s.set("rol", rol);
    if (estado) s.set("estado", estado);
    s.set("p", String(n));
    return `?${s}`;
  };

  return (
    <>
      <form className="filters" role="search">
        <input name="q" defaultValue={q} className="input" placeholder="Buscar por nombre o mail" aria-label="Buscar" />
        <select name="rol" defaultValue={rol} className="input" aria-label="Rol">
          <option value="">Todos los roles</option>
          <option value="student">Alumnos</option>
          <option value="admin">Admins</option>
        </select>
        <select name="estado" defaultValue={estado} className="input" aria-label="Estado">
          <option value="">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="blocked">Suspendidas</option>
        </select>
        <button type="submit" className="btn btn-primary">Filtrar</button>
        {(q || rol || estado) && <Link href="/admin/personas" className="btn">Limpiar</Link>}
      </form>

      <section className="panel">
        <div className="panel-head">
          <h2>{total} persona(s)</h2>
          <span className="muted mono">Página {page} de {pages}</span>
        </div>
        {(data ?? []).length === 0 ? (
          <p className="muted">
            Nadie coincide. Las personas aparecen acá cuando entran por primera vez. Para sumar a alguien que todavía no
            entró, invitalo por mail desde el curso.
          </p>
        ) : (
          <ul className="alist">
            {(data ?? []).map((u) => {
              const n = (u.enrollments as { count: number }[] | null)?.[0]?.count ?? 0;
              return (
                <li key={u.id}>
                  <Link href={`/admin/personas/${u.id}`} className="alist-main">
                    <strong>{u.full_name || u.email}</strong>
                    <span className="muted">
                      {u.full_name ? `${u.email} · ` : ""}
                      {n} curso(s) · último ingreso {u.last_sign_in_at ? formatDateTime(u.last_sign_in_at) : "—"}
                    </span>
                  </Link>
                  <div className="alist-actions">
                    {u.role === "admin" && <span className="tag ok">Admin</span>}
                    {u.status === "blocked" && <span className="tag warn">Suspendida</span>}
                    <Link href={`/admin/personas/${u.id}`} className="btn btn-sm">Ver ficha</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {pages > 1 && (
          <div className="btn-row pager">
            {page > 1 && <Link href={qs(page - 1)} className="btn btn-sm">← Anterior</Link>}
            {page < pages && <Link href={qs(page + 1)} className="btn btn-sm">Siguiente →</Link>}
          </div>
        )}
      </section>
    </>
  );
}
