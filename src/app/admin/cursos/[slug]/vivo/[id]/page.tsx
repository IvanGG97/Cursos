import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";
import { loadLiveResults } from "@/lib/live-results";
import { closeLiveSession, renameLiveSession } from "../../../../actions";
import { ActionForm, ConfirmSubmit, Submit } from "../../../../_ui";

export const metadata: Metadata = { title: "Clase en vivo" };

type Props = { params: Promise<{ slug: string; id: string }> };

export default async function LiveSessionAdmin({ params }: Props) {
  const { slug, id } = await params;
  const course = getCourse(slug);
  if (!course || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/vivo/${id}`);
  if (!ctx) return null;
  const { supabase } = ctx;

  const [s, att] = await Promise.all([
    supabase.from("live_sessions").select("id, code, title, class_num, status, created_at, closed_at").eq("id", id).maybeSingle(),
    supabase
      .from("live_attendance")
      .select("user_id, created_at, profiles(full_name, email)")
      .eq("session_id", id)
      .order("created_at"),
  ]);
  if (!s.data) notFound();
  const classNum = s.data.class_num;
  const clase = course.classes.find((c) => c.num === classNum);
  const { answers, ranking } = await loadLiveResults(id, clase);
  const quizCount = clase ? clase.slides.filter((x) => x.type === "quiz").length : 0;

  return (
    <div style={{ "--accent": clase?.accent ?? course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href={`/admin/cursos/${slug}/seguimiento`} className="back">← Seguimiento</Link>
        <h1>{s.data.title ?? `Clase ${classNum} en vivo`}</h1>
        <p className="muted">
          Clase {classNum}: {clase?.title} · {formatDateTime(s.data.created_at)}
          {s.data.closed_at ? ` a ${formatDateTime(s.data.closed_at)}` : ""}
        </p>
        <div className="card-row">
          <span className={`tag ${s.data.status === "open" ? "warn" : ""}`}>{s.data.status === "open" ? "En curso" : "Terminada"}</span>
          <span className="tag">Código {s.data.code}</span>
          <a href={`/admin/cursos/${slug}/vivo/${id}/ranking`} className="btn btn-sm">Ranking (CSV)</a>
          <a href={`/admin/cursos/${slug}/vivo/${id}/asistencia`} className="btn btn-sm">Asistencia (CSV)</a>
          {s.data.status === "open" && (
            <ActionForm action={closeLiveSession} fields={{ session: id }} inline>
              <ConfirmSubmit confirm="Sí, terminar">Terminar</ConfirmSubmit>
            </ActionForm>
          )}
        </div>
        <details className="more">
          <summary>Cambiar el nombre</summary>
          <ActionForm action={renameLiveSession} fields={{ session: id }}>
            <div className="form-row">
              <input name="title" className="input" defaultValue={s.data.title ?? ""} maxLength={80} required aria-label="Nombre de la partida" />
              <Submit>Guardar</Submit>
            </div>
          </ActionForm>
        </details>
      </div>

      <section className="panel" style={{ marginBottom: 20 }}>
        <h2>Ranking ({ranking.length} participante(s))</h2>
        <p className="muted">
          Correcta: de 1000 puntos (al instante) a 500 (a los 30 segundos o más). Incorrecta: 0. Empate: gana quien respondió más
          rápido.
        </p>
        {ranking.length === 0 ? (
          <p className="muted">Nadie participó.</p>
        ) : (
          <ol className="alist rank-admin">
            {ranking.map((r) => (
              <li key={r.participantId}>
                <span className="rank-n">{r.rank}</span>
                <div className="alist-main">
                  <strong>{r.nickname}</strong>
                  <span className="muted">
                    {r.correct} de {quizCount} correctas · respondió {r.answered}
                    {r.userId ? "" : " · sin cuenta"}
                  </span>
                </div>
                <span className="rank-points">{r.points.toLocaleString("es-AR")} pts</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="admin-cols">
        <section className="panel">
          <h2>Presentes ({(att.data ?? []).length})</h2>
          <p className="muted">Quienes se unieron con su cuenta. Las personas que participaron sin cuenta no figuran acá.</p>
          {(att.data ?? []).length === 0 ? (
            <p className="muted">Nadie se unió con su cuenta.</p>
          ) : (
            <ul className="alist compact">
              {(att.data ?? []).map((a) => {
                const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as { full_name: string | null; email: string | null } | null;
                return (
                  <li key={a.user_id}>
                    <Link href={`/admin/personas/${a.user_id}`} className="alist-main">
                      <strong>{p?.full_name || p?.email}</strong>
                      <span className="muted">{p?.full_name ? p.email : ""}</span>
                    </Link>
                    <span className="alist-meta">{formatDateTime(a.created_at)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>Respuestas a las preguntas</h2>
          {!clase ? (
            <p className="muted">La clase ya no existe en el contenido.</p>
          ) : (
            clase.slides.map((sl, i) => {
              if (sl.type !== "quiz") return null;
              const here = answers.filter((a) => a.slide === i + 1);
              const correct = sl.options.map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0);
              const right = here.filter((a) => {
                const ch = a.choices as number[];
                return ch.length === correct.length && correct.every((j) => ch.includes(j));
              }).length;
              return (
                <div key={i} style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600 }}>
                    Diapositiva {i + 1}: {sl.question}
                  </p>
                  <p className="hint" style={{ marginTop: 0 }}>
                    {here.length} respuesta(s){here.length ? ` · ${Math.round((right / here.length) * 100)}% acertó` : ""}
                  </p>
                  {sl.options.map((o, j) => {
                    const n = here.filter((a) => (a.choices as number[]).includes(j)).length;
                    const p = here.length ? Math.round((n / here.length) * 100) : 0;
                    return (
                      <div key={j} className="hbar">
                        <span className="hbar-label">
                          {o.correct ? "✓ " : ""}
                          {o.text}
                        </span>
                        <span className="hbar-n">{n}</span>
                        <span className={`hbar-track ${o.correct ? "ok" : ""}`}>
                          <span style={{ width: `${p}%` }} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
