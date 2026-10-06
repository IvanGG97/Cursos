import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { courses } from "@/content/registry";
import { AUDIT_LABELS, requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";
import { enrollUser, removeEnrollment, setEnrollmentStatus, setGrant, setRole, setUserStatus } from "../../actions";
import { ActionForm, ConfirmSubmit, Submit } from "../../_ui";

export const metadata: Metadata = { title: "Ficha" };

type Props = { params: Promise<{ id: string }> };

const SOURCE: Record<string, string> = { code: "con código", admin: "por admin", invite: "por invitación", request: "por solicitud" };

export default async function AdminPerson({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const ctx = await requireAdmin(`/admin/personas/${id}`);
  if (!ctx) return null;
  const { supabase, viewer } = ctx;

  const [profile, enrollments, grants, releases, history, publishedRows, progRows, attRows, liveRows] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, status, created_at, last_sign_in_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("enrollments").select("course_slug, status, source, created_at").eq("user_id", id),
    supabase.from("class_grants").select("course_slug, class_num").eq("user_id", id),
    supabase.from("class_releases").select("course_slug, class_num, visible, visible_from"),
    supabase
      .from("admin_audit")
      .select("id, action, target, created_at, details")
      .or(`target.eq.${id},details->>user.eq.${id}`)
      .order("created_at", { ascending: false })
      .limit(15),
    supabase.from("courses").select("slug").eq("published", true),
    supabase.from("class_progress").select("course_slug, class_num, max_slide, total_slides, completed_at").eq("user_id", id),
    supabase.from("evaluation_attempts").select("course_slug, class_num, score, total, passed").eq("user_id", id),
    supabase.from("live_attendance").select("session_id", { count: "exact", head: true }).eq("user_id", id),
  ]);
  const publishedSet = new Set((publishedRows.data ?? []).map((c) => c.slug as string));
  const progBy = new Map((progRows.data ?? []).map((p) => [`${p.course_slug}/${p.class_num}`, p]));
  const bestBy = new Map<string, { score: number; total: number; passed: boolean; n: number }>();
  for (const a of attRows.data ?? []) {
    const k = `${a.course_slug}/${a.class_num}`;
    const cur = bestBy.get(k) ?? { score: 0, total: a.total, passed: false, n: 0 };
    bestBy.set(k, { score: Math.max(cur.score, a.score), total: a.total, passed: cur.passed || a.passed, n: cur.n + 1 });
  }

  const u = profile.data;
  if (!u) notFound();
  const isSelf = u.id === viewer.id;
  const isAdmin = u.role === "admin";
  const blocked = u.status === "blocked";
  const enrBy = new Map((enrollments.data ?? []).map((e) => [e.course_slug as string, e]));
  const grantSet = new Set((grants.data ?? []).map((g) => `${g.course_slug}/${g.class_num}`));
  const now = new Date();
  const releasedSet = new Set(
    (releases.data ?? [])
      .filter(
        (r) =>
          publishedSet.has(r.course_slug as string) &&
          r.visible &&
          (!r.visible_from || new Date(r.visible_from) <= now),
      )
      .map((r) => `${r.course_slug}/${r.class_num}`),
  );
  const uf = { user: u.id };

  return (
    <>
      <div className="page-head admin-page-head">
        <Link href="/admin/personas" className="back">← Personas</Link>
        <h1>{u.full_name || u.email}</h1>
        <p className="muted">{u.email}</p>
        <div className="card-row">
          <span className={`tag ${isAdmin ? "ok" : ""}`}>{isAdmin ? "Admin" : "Alumno"}</span>
          <span className={`tag ${blocked ? "warn" : "ok"}`}>{blocked ? "Cuenta suspendida" : "Cuenta activa"}</span>
          <span className="tag">Registrada el {formatDateTime(u.created_at)}</span>
          <span className="tag">Último ingreso {u.last_sign_in_at ? formatDateTime(u.last_sign_in_at) : "—"}</span>
          <span className="tag">{liveRows.count ?? 0} clase(s) en vivo presente</span>
        </div>
      </div>

      <div className="admin-cols">
        <section className="panel">
          <h2>Cuenta</h2>
          <p className="muted">
            {blocked
              ? "Suspendida: puede iniciar sesión pero no ve ninguna clase ni puede inscribirse."
              : "Activa. Suspenderla le corta el acceso a todos los cursos sin borrar sus inscripciones."}
          </p>
          {isSelf ? (
            <p className="hint">Es tu propia cuenta: no podés suspenderla ni quitarte el rol de admin.</p>
          ) : (
            <div className="btn-row">
              <ActionForm action={setUserStatus} fields={{ ...uf, status: blocked ? "active" : "blocked" }} inline>
                {blocked ? (
                  <Submit variant="primary">Reactivar cuenta</Submit>
                ) : (
                  <ConfirmSubmit confirm="Sí, suspender" small={false}>Suspender cuenta</ConfirmSubmit>
                )}
              </ActionForm>
              <ActionForm action={setRole} fields={{ ...uf, role: isAdmin ? "student" : "admin" }} inline>
                <ConfirmSubmit confirm={isAdmin ? "Sí, quitar admin" : "Sí, hacer admin"} small={false}>
                  {isAdmin ? "Quitar rol de admin" : "Hacer admin"}
                </ConfirmSubmit>
              </ActionForm>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Historial</h2>
          {(history.data ?? []).length === 0 ? (
            <p className="muted">Sin acciones del admin sobre esta persona.</p>
          ) : (
            <ul className="alist compact">
              {(history.data ?? []).map((h) => (
                <li key={h.id}>
                  <div className="alist-main">
                    <strong>{AUDIT_LABELS[h.action] ?? h.action}</strong>
                    <span className="muted mono">{h.target === u.id ? "" : h.target}</span>
                  </div>
                  <span className="alist-meta">{formatDateTime(h.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <h2 className="section">Cursos y clases</h2>
      <div className="stack">
        {courses.map((c) => {
          const e = enrBy.get(c.slug);
          const suspended = e?.status === "suspended";
          const cf = { ...uf, slug: c.slug };
          return (
            <section key={c.slug} className="panel" style={{ "--accent": c.accent } as CSSProperties}>
              <div className="panel-head">
                <div>
                  <h3>{c.title}</h3>
                  <span className="muted">
                    {e
                      ? `${suspended ? "Inscripción suspendida" : "Inscripta"} ${SOURCE[e.source as string] ?? ""} · ${formatDateTime(e.created_at)}`
                      : "No inscripta"}
                  </span>
                </div>
                <div className="btn-row">
                  {!e && (
                    <ActionForm action={enrollUser} fields={cf} inline>
                      <Submit small variant="primary">Inscribir</Submit>
                    </ActionForm>
                  )}
                  {e && (
                    <ActionForm
                      action={setEnrollmentStatus}
                      fields={{ ...cf, status: suspended ? "active" : "suspended" }}
                      inline
                    >
                      <Submit small>{suspended ? "Reactivar" : "Suspender"}</Submit>
                    </ActionForm>
                  )}
                  {e && (
                    <ActionForm action={removeEnrollment} fields={cf} inline>
                      <ConfirmSubmit confirm="Sí, quitar">Quitar</ConfirmSubmit>
                    </ActionForm>
                  )}
                </div>
              </div>

              <p className="hint">
                Acceso individual: habilita una clase para esta persona aunque esté oculta o no esté inscripta.
              </p>
              <ul className="alist compact">
                {c.classes.map((k) => {
                  const key = `${c.slug}/${k.num}`;
                  const granted = grantSet.has(key);
                  const released = releasedSet.has(key);
                  const seesIt = granted || (Boolean(e) && !suspended && !blocked && released);
                  return (
                    <li key={k.num}>
                      <div className="alist-main">
                        <strong>
                          {k.num}. {k.title}
                        </strong>
                        <span className="muted">
                          {k.slides.length === 0
                            ? "En preparación"
                            : blocked
                              ? "No la ve (cuenta suspendida)"
                              : seesIt
                                ? granted
                                  ? "La ve por acceso individual"
                                  : "La ve (clase liberada)"
                                : "No la ve"}
                        </span>
                        {(() => {
                          const pr = progBy.get(key);
                          const b = bestBy.get(key);
                          if (!pr && !b) return null;
                          return (
                            <span className="chips" style={{ marginTop: 6 }}>
                              {pr && (
                                <span className={`chip ${pr.completed_at ? "ok" : "mid"}`}>
                                  {pr.completed_at ? "Vista completa" : `Vio ${pr.max_slide} de ${pr.total_slides}`}
                                </span>
                              )}
                              {b && (
                                <span className={`chip ${b.passed ? "ok" : ""}`}>
                                  Evaluación {b.score}/{b.total}
                                  {b.passed ? " aprobada" : ""} · {b.n} intento(s)
                                </span>
                              )}
                            </span>
                          );
                        })()}
                      </div>
                      {k.slides.length > 0 && (
                        <ActionForm
                          action={setGrant}
                          fields={{ ...cf, num: k.num, on: String(!granted) }}
                          inline
                        >
                          <Submit small variant={granted ? "" : "primary"}>
                            {granted ? "Quitar acceso" : "Dar acceso"}
                          </Submit>
                        </ActionForm>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
