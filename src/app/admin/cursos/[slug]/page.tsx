import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { classSlug, getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { getCourseState, isSurveyOpen } from "@/lib/access";
import { formatDateTime, toLocalInput } from "@/lib/site";
import {
  addPeople,
  cancelInvite,
  removeEnrollCode,
  removeEnrollment,
  setEnrollCode,
  setEnrollmentStatus,
  releaseAllClasses,
  setCourseMode,
  setGrant,
  setRelease,
} from "../../actions";
import { ActionForm, ConfirmSubmit, Submit } from "../../_ui";
import { CourseTabs } from "./tabs";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getCourse((await params).slug)?.title ?? "Curso" };
}

const SOURCE: Record<string, string> = { code: "con código", admin: "por admin", invite: "por invitación" };

const MODES = {
  hidden: {
    label: "Sin publicar",
    short: "Solo admins e inscriptos",
    tag: "Sin publicar",
    help: "No aparece en el catálogo. Lo ven los admins y quienes ya estén inscriptos o tengan acceso individual.",
  },
  enrolled: {
    label: "Publicado",
    short: "Con cuenta e inscripción",
    tag: "Publicado · con inscripción",
    help: "Aparece en el catálogo. Para ver las clases hay que entrar con Google e inscribirse (código, invitación o admin).",
  },
  public: {
    label: "Libre",
    short: "Sin registrarse",
    tag: "Libre · sin registro",
    help: "Aparece en el catálogo y cualquiera ve las clases liberadas, sin cuenta ni código. Las clases ocultas siguen ocultas.",
  },
} as const;

export default async function AdminCourse({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const course = getCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}`);
  if (!ctx) return null;
  const { supabase } = ctx;

  const [row, codeRow, releases, enrollments, invites, grants] = await Promise.all([
    supabase.from("courses").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("course_codes").select("code").eq("course_slug", slug).maybeSingle(),
    supabase.from("class_releases").select("class_num, visible, visible_from").eq("course_slug", slug),
    supabase
      .from("enrollments")
      .select("user_id, status, source, created_at, profiles(full_name, email, status)")
      .eq("course_slug", slug)
      .order("created_at", { ascending: false }),
    supabase.from("enrollment_invites").select("email, created_at").eq("course_slug", slug).order("created_at", { ascending: false }),
    supabase
      .from("class_grants")
      .select("user_id, class_num, created_at, profiles(full_name, email)")
      .eq("course_slug", slug)
      .order("class_num"),
  ]);

  const courseState = await getCourseState(slug);
  const published = Boolean(row.data?.published);
  const mode: "hidden" | "enrolled" | "public" = !published
    ? "hidden"
    : row.data?.access === "public"
      ? "public"
      : "enrolled";
  const code = codeRow.data?.code as string | undefined;
  const rel = new Map((releases.data ?? []).map((r) => [r.class_num as number, r]));
  const now = new Date();

  type Prof = { full_name: string | null; email: string | null; status?: string } | null;
  const one = (p: unknown) => (Array.isArray(p) ? p[0] : p) as Prof;

  const needle = q.trim().toLowerCase();
  const allEnr = enrollments.data ?? [];
  const enr = needle
    ? allEnr.filter((e) => {
        const p = one(e.profiles);
        return `${p?.full_name ?? ""} ${p?.email ?? ""}`.toLowerCase().includes(needle);
      })
    : allEnr;
  const activeCount = allEnr.filter((e) => e.status === "active").length;
  const f = { slug };

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
        <div className="card-row">
          <span className={`tag ${published ? "ok" : ""}`}>{MODES[mode].tag}</span>
          <span className="tag">{activeCount} inscripciones activas</span>
          <Link href={`/cursos/${slug}`} className="btn btn-sm">Ver página del curso</Link>
        </div>
      </div>
      <CourseTabs slug={slug} active="config" hasSurvey={Boolean(course.survey)} />

      {/* ---------------- Publicación y código ---------------- */}
      <div className="admin-cols">
        <section className="panel">
          <h2>Estado del curso</h2>
          <p className="muted">{MODES[mode].help}</p>
          <div className="mode-picker" role="group" aria-label="Estado del curso">
            {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
              <ActionForm key={m} action={setCourseMode} fields={{ ...f, mode: m }} inline className="mode-option">
                <button
                  type="submit"
                  className={`mode-btn${m === mode ? " active" : ""}`}
                  disabled={m === mode}
                  aria-pressed={m === mode}
                >
                  <strong>{MODES[m].label}</strong>
                  <span>{MODES[m].short}</span>
                </button>
              </ActionForm>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Inscripción con código</h2>
          <p className="muted">
            {code ? (
              <>
                Código activo: <strong className="mono code-big">{code}</strong>
              </>
            ) : (
              "Sin código: nadie puede inscribirse por su cuenta."
            )}
          </p>
          <ActionForm action={setEnrollCode} fields={f}>
            <div className="form-row">
              <input
                name="code"
                className="input mono"
                placeholder="Ej. SALTA2026"
                defaultValue={code ?? ""}
                aria-label="Código de inscripción"
                autoCapitalize="characters"
              />
              <Submit>Guardar</Submit>
            </div>
          </ActionForm>
          <div className="btn-row">
            <ActionForm action={setEnrollCode} fields={{ ...f, generate: "1" }} inline>
              <Submit small>Generar uno al azar</Submit>
            </ActionForm>
            {code && (
              <ActionForm action={removeEnrollCode} fields={f} inline>
                <ConfirmSubmit confirm="Sí, desactivar">Desactivar código</ConfirmSubmit>
              </ActionForm>
            )}
          </div>
        </section>
      </div>

      {/* ---------------- Encuesta final (atajo: se maneja en la pestaña Encuesta) ---------------- */}
      {course.survey && (
        <div className="notice" style={{ marginTop: 20 }}>
          <strong>Encuesta final:</strong>{" "}
          {isSurveyOpen(courseState)
            ? "habilitada, los alumnos la pueden responder."
            : courseState.survey.visible && courseState.survey.visibleFrom
              ? `se habilita sola el ${formatDateTime(courseState.survey.visibleFrom)}`
              : "deshabilitada, los alumnos no la ven."}{" "}
          <Link href={`/admin/cursos/${slug}/encuesta`}>Habilitar o deshabilitar →</Link>
        </div>
      )}

      {/* ---------------- Clases ---------------- */}
      <div className="section-head">
        <h2 className="section">Clases</h2>
        <ActionForm action={releaseAllClasses} fields={f} inline>
          <ConfirmSubmit confirm="Sí, liberar todas">Liberar todas las clases</ConfirmSubmit>
        </ActionForm>
      </div>
      <div className="stack">
        {course.classes.map((clase) => {
          const r = rel.get(clase.num);
          const visible = Boolean(r?.visible);
          const from = (r?.visible_from as string | null) ?? null;
          const live = published && visible && (!from || new Date(from) <= now);
          const scheduled = visible && from && new Date(from) > now;
          const grantsHere = (grants.data ?? []).filter((g) => g.class_num === clase.num).length;
          const cf = { ...f, num: clase.num };
          return (
            <article key={clase.num} className="panel class-admin" style={{ "--accent": clase.accent } as CSSProperties}>
              <div className="panel-head">
                <div>
                  <div className="kicker-sm">Clase {String(clase.num).padStart(2, "0")}</div>
                  <h3>{clase.title}</h3>
                </div>
                <div className="card-row">
                  {live ? (
                    <span className="tag ok">Visible para alumnos</span>
                  ) : scheduled ? (
                    <span className="tag warn">Se libera el {formatDateTime(from!)}</span>
                  ) : visible && !published ? (
                    <span className="tag warn">Liberada (curso sin publicar)</span>
                  ) : (
                    <span className="tag">Oculta</span>
                  )}
                  <span className="tag">{clase.slides.length ? `${clase.slides.length} slides` : "En preparación"}</span>
                  {grantsHere > 0 && <span className="tag">{grantsHere} con acceso individual</span>}
                </div>
              </div>

              <div className="btn-row">
                {!live && (
                  <ActionForm action={setRelease} fields={{ ...cf, visible: "true", visible_from: "" }} inline>
                    <Submit small variant="primary">Liberar ahora</Submit>
                  </ActionForm>
                )}
                {visible && (
                  <ActionForm action={setRelease} fields={{ ...cf, visible: "false", visible_from: "" }} inline>
                    <Submit small>Ocultar</Submit>
                  </ActionForm>
                )}
                {clase.slides.length > 0 && (
                  <>
                    <Link href={`/cursos/${slug}/${classSlug(clase)}`} className="btn btn-sm">Presentar</Link>
                    <a href={`/cursos/${slug}/${classSlug(clase)}/resumen`} className="btn btn-sm">PDF</a>
                  </>
                )}
              </div>

              <details className="more">
                <summary>Programar liberación</summary>
                <ActionForm action={setRelease} fields={{ ...cf, visible: "true" }}>
                  <div className="form-row">
                    <input
                      type="datetime-local"
                      name="visible_from"
                      className="input"
                      defaultValue={toLocalInput(from)}
                      aria-label="Liberar desde (hora de Argentina)"
                      required
                    />
                    <Submit>Programar</Submit>
                  </div>
                  <p className="hint">Hora de Argentina. La clase se habilita sola a esa hora.</p>
                </ActionForm>
              </details>
            </article>
          );
        })}
      </div>

      {/* ---------------- Personas ---------------- */}
      <h2 className="section">Personas inscriptas</h2>
      <div className="admin-cols">
        <section className="panel">
          <h3>Agregar personas</h3>
          <p className="muted">
            Pegá uno o varios mails (separados por coma o uno por renglón). Quien ya tiene cuenta queda inscripto al
            instante; quien no, queda invitado y se inscribe solo cuando entre por primera vez con ese mail.
          </p>
          <ActionForm action={addPeople} fields={f}>
            <textarea name="emails" className="input" rows={4} placeholder="ana@gmail.com, juan@gmail.com" required />
            <div className="btn-row">
              <Submit variant="primary">Inscribir / invitar</Submit>
            </div>
          </ActionForm>
        </section>

        <section className="panel">
          <h3>Invitaciones pendientes ({(invites.data ?? []).length})</h3>
          {(invites.data ?? []).length === 0 ? (
            <p className="muted">No hay invitaciones pendientes.</p>
          ) : (
            <ul className="alist">
              {(invites.data ?? []).map((i) => (
                <li key={i.email}>
                  <div className="alist-main">
                    <strong>{i.email}</strong>
                    <span className="muted">Invitado el {formatDateTime(i.created_at)}</span>
                  </div>
                  <ActionForm action={cancelInvite} fields={{ ...f, email: i.email }} inline>
                    <ConfirmSubmit confirm="Sí, cancelar">Cancelar</ConfirmSubmit>
                  </ActionForm>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h3>
            {allEnr.length} inscripción(es){needle && ` · ${enr.length} coinciden con "${q}"`}
          </h3>
          <form className="form-row search" role="search">
            <input name="q" defaultValue={q} className="input" placeholder="Buscar por nombre o mail" aria-label="Buscar" />
            <button type="submit" className="btn">Buscar</button>
          </form>
        </div>
        {enr.length === 0 ? (
          <p className="muted">{needle ? "Nadie coincide con la búsqueda." : "Todavía no hay personas inscriptas."}</p>
        ) : (
          <ul className="alist">
            {enr.map((e) => {
              const p = one(e.profiles);
              const suspended = e.status === "suspended";
              return (
                <li key={e.user_id}>
                  <Link href={`/admin/personas/${e.user_id}`} className="alist-main">
                    <strong>{p?.full_name || p?.email || "Sin nombre"}</strong>
                    <span className="muted">
                      {p?.full_name ? `${p.email} · ` : ""}
                      {SOURCE[e.source as string] ?? e.source} · {formatDateTime(e.created_at)}
                    </span>
                  </Link>
                  <div className="alist-actions">
                    {p?.status === "blocked" && <span className="tag warn">Cuenta suspendida</span>}
                    {suspended && <span className="tag warn">Inscripción suspendida</span>}
                    <ActionForm
                      action={setEnrollmentStatus}
                      fields={{ ...f, user: e.user_id, status: suspended ? "active" : "suspended" }}
                      inline
                    >
                      <Submit small>{suspended ? "Reactivar" : "Suspender"}</Submit>
                    </ActionForm>
                    <ActionForm action={removeEnrollment} fields={{ ...f, user: e.user_id }} inline>
                      <ConfirmSubmit confirm="Sí, quitar">Quitar</ConfirmSubmit>
                    </ActionForm>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------------- Accesos individuales ---------------- */}
      <h2 className="section">Accesos individuales a clases</h2>
      <section className="panel">
        <p className="muted">
          Dejan ver una clase puntual a una persona aunque la clase esté oculta o no esté inscripta (por ejemplo, alguien
          que faltó y querés que la repase). Se dan desde la ficha de cada persona.
        </p>
        {(grants.data ?? []).length === 0 ? (
          <p className="muted">No hay accesos individuales en este curso.</p>
        ) : (
          <ul className="alist">
            {(grants.data ?? []).map((g) => {
              const p = one(g.profiles);
              return (
                <li key={`${g.user_id}-${g.class_num}`}>
                  <Link href={`/admin/personas/${g.user_id}`} className="alist-main">
                    <strong>{p?.full_name || p?.email}</strong>
                    <span className="muted">Clase {g.class_num} · desde {formatDateTime(g.created_at)}</span>
                  </Link>
                  <ActionForm action={setGrant} fields={{ ...f, num: g.class_num, user: g.user_id, on: "false" }} inline>
                    <ConfirmSubmit confirm="Sí, quitar">Quitar acceso</ConfirmSubmit>
                  </ActionForm>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
