import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getLiveCourse } from "@/lib/class-content";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";
import { getCourseEvaluations } from "@/lib/evaluations";
import { closeLiveSession } from "../../../actions";
import { ActionForm, ConfirmSubmit } from "../../../_ui";
import { CourseTabs } from "../tabs";

export const metadata: Metadata = { title: "Seguimiento" };

type Props = { params: Promise<{ slug: string }> };

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export default async function CourseTracking({ params }: Props) {
  const { slug } = await params;
  const course = await getLiveCourse(slug);
  if (!course) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/seguimiento`);
  if (!ctx) return null;
  const { supabase } = ctx;

  const [enr, prog, atts, sessions] = await Promise.all([
    supabase
      .from("enrollments")
      .select("user_id, profiles(full_name, email)")
      .eq("course_slug", slug)
      .eq("status", "active"),
    supabase.from("class_progress").select("user_id, class_num, max_slide, total_slides, completed_at").eq("course_slug", slug),
    supabase.from("evaluation_attempts").select("user_id, class_num, evaluation_id, score, total, passed, answers").eq("course_slug", slug),
    supabase
      .from("live_sessions")
      .select("id, code, title, class_num, status, created_at, closed_at, live_attendance(count), live_participants(count)")
      .eq("course_slug", slug)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const people = (enr.data ?? []).map((e) => {
    const p = (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles) as { full_name: string | null; email: string | null } | null;
    return { id: e.user_id as string, name: p?.full_name || p?.email || "Sin nombre" };
  });
  const enrolled = new Set(people.map((p) => p.id));
  const progress = prog.data ?? [];
  const attempts = atts.data ?? [];
  const classes = course.classes.filter((c) => c.slides.length > 0);
  const evals = await getCourseEvaluations(slug);

  // Mejor intento de cada persona en cada clase.
  const best = new Map<string, { score: number; total: number; passed: boolean }>();
  for (const a of attempts) {
    const k = `${a.user_id}/${a.class_num}`;
    const cur = best.get(k);
    if (!cur || a.score > cur.score) best.set(k, { score: a.score, total: a.total, passed: cur?.passed || a.passed });
    else if (a.passed) cur.passed = true;
  }

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="seguimiento" hasSurvey={Boolean(course.survey)} />

      {/* ---------------- Por clase ---------------- */}
      <h2 className="section">Avance y evaluaciones por clase</h2>
      {classes.length === 0 ? (
        <p className="muted">Todavía no hay clases con contenido.</p>
      ) : (
        <div className="stack">
          {classes.map((c) => {
            const pr = progress.filter((p) => p.class_num === c.num);
            const started = pr.length;
            const done = pr.filter((p) => p.completed_at).length;
            const at = attempts.filter((a) => a.class_num === c.num);
            const ce = evals.get(c.num);
            // Acierto por pregunta: solo los intentos de la versión vigente (si se editaron las
            // preguntas, los intentos anteriores eran de otras preguntas).
            const atNow = ce ? at.filter((a) => a.evaluation_id === ce.ev.id) : [];
            const takers = new Set(at.map((a) => a.user_id));
            const passed = [...takers].filter((u) => best.get(`${u}/${c.num}`)?.passed).length;
            const avgBest = takers.size
              ? Math.round(
                  [...takers].reduce((s, u) => {
                    const b = best.get(`${u}/${c.num}`)!;
                    return s + (b.score / b.total) * 100;
                  }, 0) / takers.size,
                )
              : 0;
            return (
              <section key={c.num} className="panel class-admin" style={{ "--accent": c.accent } as CSSProperties}>
                <div className="kicker-sm">Clase {String(c.num).padStart(2, "0")}</div>
                <h3>{c.title}</h3>
                <dl className="kv">
                  <div><dt>Inscriptos activos</dt><dd>{people.length}</dd></div>
                  <div><dt>Abrieron la clase</dt><dd>{started}</dd></div>
                  <div><dt>La vieron completa</dt><dd>{done}</dd></div>
                  {ce && (
                    <>
                      <div><dt>Rindieron la evaluación</dt><dd>{takers.size}</dd></div>
                      <div><dt>Aprobaron</dt><dd>{passed}</dd></div>
                      <div><dt>Promedio (mejor nota)</dt><dd>{takers.size ? `${avgBest}%` : "—"}</dd></div>
                    </>
                  )}
                </dl>

                {ce && atNow.length > 0 && (
                  <details className="more">
                    <summary>Acierto por pregunta ({atNow.length} intento(s){ce.edited ? " · versión editada" : ""})</summary>
                    <p className="hint">
                      Las preguntas con menos acierto son temas para repasar en clase.
                      {at.length > atNow.length && ` No se cuentan ${at.length - atNow.length} intento(s) de una versión anterior de las preguntas.`}
                    </p>
                    {ce.ev.questions.map((q, i) => {
                      const correct = q.options.map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0);
                      const right = atNow.filter((a) => {
                        const ch = ((a.answers as Record<string, number[]>)[q.id] ?? []) as number[];
                        return ch.length === correct.length && correct.every((j) => ch.includes(j));
                      }).length;
                      const p = pct(right, atNow.length);
                      return (
                        <div key={q.id} className="hbar">
                          <span className="hbar-label">
                            {i + 1}. {q.question}
                          </span>
                          <span className="hbar-n">{p}%</span>
                          <span className={`hbar-track ${p >= 70 ? "ok" : p < 50 ? "bad" : ""}`}>
                            <span style={{ width: `${p}%` }} />
                          </span>
                        </div>
                      );
                    })}
                  </details>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* ---------------- Clases en vivo ---------------- */}
      <h2 className="section">Clases en vivo y asistencia</h2>
      <section className="panel">
        <p className="muted">
          Se abren desde la clase con el botón <strong>Iniciar en vivo</strong>. Quien se une con su cuenta queda presente.
        </p>
        {(sessions.data ?? []).length === 0 ? (
          <p className="muted">Todavía no hubo clases en vivo.</p>
        ) : (
          <ul className="alist">
            {(sessions.data ?? []).map((s) => {
              const n = (s.live_attendance as { count: number }[] | null)?.[0]?.count ?? 0;
              const players = (s.live_participants as { count: number }[] | null)?.[0]?.count ?? 0;
              return (
                <li key={s.id}>
                  <Link href={`/admin/cursos/${slug}/vivo/${s.id}`} className="alist-main">
                    <strong>{s.title ?? `Clase ${s.class_num}`}</strong>
                    <span className="muted">
                      Clase {s.class_num} · {formatDateTime(s.created_at)} · {players} jugador(es) · {n} presente(s) con cuenta
                    </span>
                  </Link>
                  <div className="alist-actions">
                    {s.status === "open" ? <span className="tag warn">En curso</span> : <span className="tag">Terminada</span>}
                    {s.status === "open" && (
                      <ActionForm action={closeLiveSession} fields={{ session: s.id }} inline>
                        <ConfirmSubmit confirm="Sí, terminar">Terminar</ConfirmSubmit>
                      </ActionForm>
                    )}
                    <a href={`/admin/cursos/${slug}/vivo/${s.id}/asistencia`} className="btn btn-sm">CSV</a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------------- Personas ---------------- */}
      <h2 className="section">Cada persona</h2>
      <section className="panel">
        {people.length === 0 ? (
          <p className="muted">No hay inscripciones activas.</p>
        ) : (
          <ul className="alist">
            {people.map((u) => (
              <li key={u.id}>
                <Link href={`/admin/personas/${u.id}`} className="alist-main">
                  <strong>{u.name}</strong>
                </Link>
                <div className="chips">
                  {classes.map((c) => {
                    const p = progress.find((x) => x.user_id === u.id && x.class_num === c.num);
                    const b = best.get(`${u.id}/${c.num}`);
                    const label = p ? (p.completed_at ? "vista" : `${pct(p.max_slide, p.total_slides)}%`) : "—";
                    return (
                      <span key={c.num} className={`chip ${p?.completed_at ? "ok" : p ? "mid" : ""}`} title={`Clase ${c.num}`}>
                        C{c.num} {label}
                        {b ? ` · ${b.score}/${b.total}` : ""}
                      </span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
        {progress.some((p) => !enrolled.has(p.user_id)) && (
          <p className="hint">
            También hay avance de personas sin inscripción (curso libre o acceso individual): se ven en su ficha.
          </p>
        )}
      </section>
    </div>
  );
}
