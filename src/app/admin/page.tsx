import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { classSlug, courses } from "@/content/registry";
import { canManage, getCourseState, getViewer, isReleased } from "@/lib/access";
import { formatDateTime, toLocalInput } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { setEnrollCode, setPublished, setRelease } from "./actions";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const viewer = await getViewer();
  if (viewer.kind === "anon") redirect("/login?next=/admin");
  if (!canManage(viewer)) notFound();

  if (viewer.kind === "local") {
    return (
      <SiteShell>
        <div className="page-head">
          <div className="kicker-sm">Admin</div>
          <h1>Administración</h1>
        </div>
        <div className="notice warn">
          <strong>Modo local.</strong> Para publicar cursos, liberar clases e inscribir alumnos hace falta conectar
          Supabase (ver README y .env.example). Mientras tanto podés ver y presentar todas las clases.
        </div>
      </SiteShell>
    );
  }

  const supabase = await createClient();
  const { data: codes } = await supabase.from("course_codes").select("course_slug, code");
  const codeBySlug = new Map((codes ?? []).map((c) => [c.course_slug as string, c.code as string]));

  const rows = await Promise.all(
    courses.map(async (course) => {
      const { count } = await supabase
        .from("enrollments")
        .select("user_id", { count: "exact", head: true })
        .eq("course_slug", course.slug);
      return { course, state: await getCourseState(course.slug), enrolled: count ?? 0 };
    }),
  );

  return (
    <SiteShell>
      <div className="page-head">
        <div className="kicker-sm">Admin</div>
        <h1>Administración</h1>
        <p>Publicá cursos, repartí el código de inscripción y liberá cada clase cuando la dictes.</p>
      </div>

      {rows.map(({ course, state, enrolled }) => (
        <section key={course.slug} className="admin-course">
          <header>
            <h2>{course.title}</h2>
            <span className={`tag ${state.published ? "ok" : ""}`}>
              {state.published ? "Publicado" : "Sin publicar"} · {enrolled} inscriptos
            </span>
          </header>

          <div className="admin-controls">
            <form action={setPublished}>
              <input type="hidden" name="slug" value={course.slug} />
              <input type="hidden" name="published" value={String(!state.published)} />
              <div className="field">
                <label>Catálogo</label>
                <button type="submit" className="btn">
                  {state.published ? "Despublicar curso" : "Publicar curso"}
                </button>
              </div>
            </form>

            <form action={setEnrollCode}>
              <input type="hidden" name="slug" value={course.slug} />
              <div className="field">
                <label htmlFor={`code-${course.slug}`}>Código de inscripción</label>
                <div className="form-row">
                  <input
                    id={`code-${course.slug}`}
                    name="code"
                    className="input mono"
                    defaultValue={codeBySlug.get(course.slug) ?? ""}
                    placeholder="Ej. SALTA2026"
                    pattern="[A-Za-z0-9\-]{4,32}"
                    title="Entre 4 y 32 letras, números o guiones"
                  />
                  <button type="submit" className="btn">Guardar</button>
                </div>
              </div>
            </form>
          </div>

          <div className="table-wrap">
            <table className="admin">
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Contenido</th>
                  <th>Estado para alumnos</th>
                  <th>Liberación</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {course.classes.map((clase) => {
                  const r = state.releases.get(clase.num);
                  const released = isReleased(state, clase.num);
                  const formId = `rel-${course.slug}-${clase.num}`;
                  return (
                    <tr key={clase.num}>
                      <td>
                        <span className="swatch" style={{ background: clase.accent }} />
                        {clase.num}. {clase.title}
                      </td>
                      <td className="mono muted">
                        {clase.slides.length ? `${clase.slides.length} slides` : "En preparación"}
                      </td>
                      <td>
                        {released ? (
                          <span className="tag ok">Visible</span>
                        ) : r?.visible && r.visibleFrom ? (
                          <span className="tag warn">Desde {formatDateTime(r.visibleFrom)}</span>
                        ) : (
                          <span className="tag">Oculta</span>
                        )}
                      </td>
                      <td>
                        <form id={formId} action={setRelease} className="form-row">
                          <input type="hidden" name="slug" value={course.slug} />
                          <input type="hidden" name="num" value={clase.num} />
                          <select name="visible" className="input" defaultValue={String(Boolean(r?.visible))} style={{ width: "auto" }}>
                            <option value="false">Oculta</option>
                            <option value="true">Liberada</option>
                          </select>
                          <input
                            type="datetime-local"
                            name="visible_from"
                            className="input"
                            defaultValue={toLocalInput(r?.visibleFrom ?? null)}
                            aria-label="Liberar desde (hora de Argentina)"
                            title="Opcional: liberar recién desde esta fecha y hora (Argentina)"
                          />
                          <button type="submit" className="btn btn-sm">Guardar</button>
                        </form>
                      </td>
                      <td>
                        {clase.slides.length > 0 && (
                          <Link href={`/cursos/${course.slug}/${classSlug(clase)}`} className="btn btn-sm">
                            Presentar
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </SiteShell>
  );
}
