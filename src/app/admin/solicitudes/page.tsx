import Link from "next/link";
import type { Metadata } from "next";
import { courses, getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/admin";
import { approveAccessRequest, rejectAccessRequest } from "../actions";
import { ActionForm, AutoRefresh, ConfirmSubmit, Submit } from "../_ui";
import { BulkBar } from "./BulkBar";

/** Formulario de la barra "Seleccionar todas" (las casillas de cada fila se suman a él). */
const BULK_FORM = "bulk-requests";

export const metadata: Metadata = { title: "Solicitudes de admisión" };

const PAGE = 20;
const STATES: Record<string, string> = { pending: "Pendientes", approved: "Aprobadas", rejected: "Rechazadas", all: "Todas" };

type Props = { searchParams: Promise<{ q?: string; estado?: string; p?: string }> };

// Solicitudes de quienes no tienen Google. Se aprueban en clase: al aprobar, la pantalla de la
// persona entra sola. La tabla la lee solo el servidor (tiene mails).
export default async function AccessRequests({ searchParams }: Props) {
  const ctx = await requireAdmin("/admin/solicitudes");
  if (!ctx) return null;
  const { q = "", estado = "pending", p = "1" } = await searchParams;
  const status = estado in STATES ? estado : "pending";
  const page = Math.max(1, Number(p) || 1);

  let query = createServiceClient()
    .from("access_requests")
    .select("id, full_name, email, course_slug, status, user_id, created_at, decided_at, claimed_at", { count: "exact" })
    .order("created_at", { ascending: status === "pending" }) // pendientes: la más vieja primero
    .range((page - 1) * PAGE, page * PAGE - 1);
  const term = q.replace(/[,()*%\\]/g, " ").trim();
  if (term) query = query.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
  if (status !== "all") query = query.eq("status", status);
  const { data, count, error } = await query;

  if (error) {
    return (
      <div className="notice warn">
        {/access_requests/.test(error.message)
          ? "Falta correr la migración 20261006010000_access_requests.sql en Supabase."
          : error.message}
      </div>
    );
  }
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (n: number) => {
    const s = new URLSearchParams();
    if (q) s.set("q", q);
    s.set("estado", status);
    s.set("p", String(n));
    return `?${s}`;
  };

  return (
    <>
      {status === "pending" && <AutoRefresh ms={5000} />}

      <section className="panel" style={{ marginBottom: 16 }}>
        <h2>Solicitudes de admisión</h2>
        <p className="muted">
          Personas sin cuenta de Google que pidieron acceso desde «Pedí acceso» (nombre y mail). Al <strong>aprobar</strong>,
          se crea su cuenta con ese nombre, queda inscripta en el curso elegido y <strong>su pantalla entra sola</strong> en
          unos segundos, sin mail ni contraseña. Las pendientes se actualizan solas.
        </p>
      </section>

      <form className="filters" role="search">
        <input name="q" defaultValue={q} className="input" placeholder="Buscar por nombre o mail" aria-label="Buscar" />
        <select name="estado" defaultValue={status} className="input" aria-label="Estado">
          {Object.entries(STATES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Filtrar</button>
        {(q || status !== "pending") && <Link href="/admin/solicitudes" className="btn">Limpiar</Link>}
      </form>

      <section className="panel">
        <div className="panel-head">
          <h2>
            {total} {STATES[status].toLowerCase()}
          </h2>
          <span className="muted mono">Página {page} de {pages}</span>
        </div>
        {status === "pending" && (data ?? []).length > 0 && (
          <BulkBar
            courses={courses.map((c) => ({ slug: c.slug, title: c.title }))}
            defaultCourse={courses.length === 1 ? courses[0].slug : "__own"}
          />
        )}
        {(data ?? []).length === 0 ? (
          <p className="muted">
            {status === "pending"
              ? "No hay solicitudes pendientes. Cuando alguien pida acceso, aparece acá sola."
              : "Nada coincide con la búsqueda."}
          </p>
        ) : (
          <ul className="alist">
            {(data ?? []).map((r) => {
              const course = r.course_slug ? getCourse(r.course_slug) : undefined;
              return (
                <li key={r.id} className={r.status === "pending" ? "req-row" : ""}>
                  {r.status === "pending" && (
                    <input
                      type="checkbox"
                      name="ids"
                      value={r.id}
                      form={BULK_FORM}
                      data-keep-selection
                      className="req-check"
                      aria-label={`Seleccionar a ${r.full_name}`}
                    />
                  )}
                  <div className="alist-main">
                    <strong>{r.full_name}</strong>
                    <span className="muted">
                      {r.email} · {course ? course.title : "sin curso"} · pidió el {formatDateTime(r.created_at)}
                    </span>
                    {r.status !== "pending" && r.decided_at && (
                      <span className="muted">
                        {r.status === "approved" ? "Aprobada" : "Rechazada"} el {formatDateTime(r.decided_at)}
                        {r.status === "approved" && (r.claimed_at ? " · ya entró" : " · todavía no entró")}
                      </span>
                    )}
                  </div>
                  <div className="alist-actions">
                    {r.status === "pending" ? (
                      <>
                        <ActionForm action={approveAccessRequest} fields={{ id: r.id }} inline>
                          <span className="req-course">
                            <select name="course" defaultValue={r.course_slug ?? (courses.length === 1 ? courses[0].slug : "")} className="input" aria-label="Inscribir en">
                              <option value="">Sin inscribir en un curso</option>
                              {courses.map((c) => (
                                <option key={c.slug} value={c.slug}>{c.title}</option>
                              ))}
                            </select>
                            <Submit small variant="primary">Aprobar</Submit>
                          </span>
                        </ActionForm>
                        <ActionForm action={rejectAccessRequest} fields={{ id: r.id }} inline>
                          <ConfirmSubmit confirm="Sí, rechazar">Rechazar</ConfirmSubmit>
                        </ActionForm>
                      </>
                    ) : r.status === "approved" ? (
                      <>
                        <span className="tag ok">Aprobada</span>
                        {r.user_id && <Link href={`/admin/personas/${r.user_id}`} className="btn btn-sm">Ver ficha</Link>}
                      </>
                    ) : (
                      <span className="tag">Rechazada</span>
                    )}
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
