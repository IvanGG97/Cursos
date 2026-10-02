import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getCourse } from "@/content/registry";
import { requireAdmin } from "@/lib/admin";
import { CourseTabs } from "../tabs";

export const metadata: Metadata = { title: "Encuesta" };

type Props = { params: Promise<{ slug: string }> };

// Resultados de la encuesta: en conjunto y sin nombres (así se le promete a quien responde).
export default async function SurveyResults({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course?.survey) notFound();
  const ctx = await requireAdmin(`/admin/cursos/${slug}/encuesta`);
  if (!ctx) return null;

  const survey = course.survey;
  const { data } = await ctx.supabase
    .from("survey_responses")
    .select("answers")
    .eq("course_slug", slug)
    .eq("survey_id", survey.id);
  const rows = (data ?? []).map((r) => r.answers as Record<string, string | number>);

  return (
    <div style={{ "--accent": course.accent } as CSSProperties}>
      <div className="page-head admin-page-head">
        <Link href="/admin/cursos" className="back">← Cursos</Link>
        <h1>{course.title}</h1>
      </div>
      <CourseTabs slug={slug} active="encuesta" hasSurvey />

      <section className="panel">
        <h2>{survey.title}</h2>
        <p className="muted">
          {rows.length} respuesta(s). Se muestran en conjunto y sin nombres, como se le dice a quien responde.
        </p>
      </section>

      <div className="stack" style={{ marginTop: 14 }}>
        {survey.questions.map((q) => {
          const vals = rows.map((r) => r[q.id]).filter((v) => v !== undefined && v !== "");
          return (
            <section key={q.id} className="panel">
              <h3>{q.label}</h3>
              <p className="hint">{vals.length} respuesta(s)</p>

              {q.kind === "scale" && (
                <>
                  <p className="code-big mono" style={{ margin: "4px 0 12px" }}>
                    {vals.length ? (vals.reduce<number>((s, v) => s + Number(v), 0) / vals.length).toFixed(1) : "—"}{" "}
                    <span className="muted" style={{ fontSize: 13 }}>
                      promedio de {q.min} a {q.max}
                    </span>
                  </p>
                  {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.max - i).map((v) => {
                    const n = vals.filter((x) => Number(x) === v).length;
                    return (
                      <div key={v} className="hbar">
                        <span className="hbar-label">
                          {v}
                          {v === q.max ? ` · ${q.maxLabel}` : v === q.min ? ` · ${q.minLabel}` : ""}
                        </span>
                        <span className="hbar-n">{n}</span>
                        <span className="hbar-track">
                          <span style={{ width: `${vals.length ? (n / vals.length) * 100 : 0}%` }} />
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

              {q.kind === "choice" &&
                q.options.map((o) => {
                  const n = vals.filter((x) => x === o).length;
                  return (
                    <div key={o} className="hbar">
                      <span className="hbar-label">{o}</span>
                      <span className="hbar-n">{n}</span>
                      <span className="hbar-track">
                        <span style={{ width: `${vals.length ? (n / vals.length) * 100 : 0}%` }} />
                      </span>
                    </div>
                  );
                })}

              {q.kind === "text" &&
                (vals.length === 0 ? (
                  <p className="muted">Sin respuestas todavía.</p>
                ) : (
                  <ul className="quote-list">
                    {vals.map((v, i) => (
                      <li key={i}>{String(v)}</li>
                    ))}
                  </ul>
                ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
