"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type TextareaHTMLAttributes } from "react";
import type { Media, QuizOption, Row, Slide } from "@/content/types";
import { typeset } from "@/content/typeset";
import { SlideMirror } from "@/components/deck/SlideMirror";
import { VF_OPTIONS } from "@/lib/evaluation-rules";
import {
  LIMITS,
  SLIDE_TYPES,
  classProblems,
  newMediaId,
  newSlide,
  normalizeSlides,
  slideProblems,
  slideSummary,
  slideWarnings,
  typeLabel,
  type SlideType,
} from "@/lib/slide-rules";
import { discardClassDraft, publishClass, restoreClassVersion, saveClassDraft } from "@/app/admin/content-actions";

// Editor de las diapositivas de una clase. Se edita en el navegador; "Guardar borrador" lo deja en el
// servidor (los alumnos no lo ven) y "Publicar" lo convierte en la versión vigente. En el celular se
// alterna entre la lista y la diapositiva elegida; en la compu se ven lista, formulario y vista previa.

export type EditorVersion = { id: number; when: string; note: string | null; author: string | null; original: boolean; current: boolean };
type MediaMap = Record<string, Pick<Media, "src" | "mime" | "annot" | "gallery">>;

type Props = {
  slug: string;
  course: { title: string; org: string };
  clase: { num: number; title: string; accent: string };
  published: Slide[];
  draft: Slide[] | null;
  draftWhen: string | null;
  versions: EditorVersion[];
  media: MediaMap;
  liveOpen: boolean;
  classHref: string;
};

/** Para el campo de imagen: adónde se sube y qué lugares ya existen en la clase publicada. */
const MediaCtx = createContext<{ imagesHref: string; publishedIds: Set<string> }>({ imagesHref: "", publishedIds: new Set() });

type Sheet = null | { kind: "add"; at: number } | { kind: "publish" } | { kind: "history" } | { kind: "big" };
type Msg = { ok?: string; error?: string };

const pad = (n: number) => String(n).padStart(2, "0");
const json = (s: Slide[]) => JSON.stringify(s);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const LETTERS = "ABCDEFGH";

/** La diapositiva como se va a ver: comillas tipográficas y la imagen subida desde "Imágenes". */
function forPreview(s: Slide, media: MediaMap): Slide {
  const withMedia = "media" in s && s.media && media[s.media.id] ? ({ ...s, media: { ...s.media, ...media[s.media.id] } } as Slide) : s;
  return typeset(withMedia);
}

export function ClassEditor({ slug, course, clase, published, draft, draftWhen, versions, media, liveOpen, classHref }: Props) {
  const router = useRouter();
  const serverSlides = draft ?? published;
  const serverKey = useMemo(() => json(serverSlides), [serverSlides]);

  const [slides, setSlides] = useState<Slide[]>(serverSlides);
  const [baseline, setBaseline] = useState(serverKey);
  const [hasDraft, setHasDraft] = useState(draft !== null);
  const [sel, setSel] = useState<number | null>(null);
  const [pane, setPane] = useState<"form" | "preview">("form");
  const [previewMode, setPreviewMode] = useState<"canvas" | "flow">("canvas");
  const [reveal, setReveal] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [msg, setMsg] = useState<Msg>({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [moveTo, setMoveTo] = useState("");
  const [recover, setRecover] = useState<{ slides: Slide[]; at: number } | null>(null);
  const [overflow, setOverflow] = useState<{ key: string; issues: string[] }>({ key: "", issues: [] });
  const undo = useRef<{ stack: Slide[][]; last: number }>({ stack: [], last: 0 });
  const [undoN, setUndoN] = useState(0);
  const top = useRef<HTMLDivElement>(null);

  const dirty = json(slides) !== baseline;
  const storeKey = `ced:${slug}:${clase.num}`;

  // Si cambia lo que hay en el servidor (al guardar, publicar o restaurar), arrancar de ahí, salvo
  // que justo se esté escribiendo algo.
  const seen = useRef(serverKey);
  const dirtyNow = useRef(dirty);
  useEffect(() => {
    dirtyNow.current = dirty;
  });
  useEffect(() => {
    if (seen.current === serverKey) return;
    seen.current = serverKey;
    setHasDraft(draft !== null);
    if (!dirtyNow.current) {
      setSlides(JSON.parse(serverKey) as Slide[]);
      setBaseline(serverKey);
    }
  }, [serverKey, draft]);

  // ¿Quedaron cambios sin guardar de la última vez (se cerró la pestaña, se quedó sin batería)?
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { slides: unknown; at: number };
      const clean = normalizeSlides(saved.slides);
      if (clean && json(clean) !== serverKey) setRecover({ slides: clean, at: saved.at });
      else localStorage.removeItem(storeKey);
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
    // Solo al abrir.
  }, []);

  // Copia local mientras hay cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storeKey, JSON.stringify({ slides, at: Date.now() }));
      } catch {
        /* lleno o bloqueado: no pasa nada */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [slides, dirty, storeKey]);

  const forgetLocal = () => {
    try {
      localStorage.removeItem(storeKey);
    } catch {
      /* nada */
    }
  };

  // Avisar si se va de la página con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Escape cierra la ventana abierta.
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  /** Aplica un cambio. Lo que se escribe seguido se deshace junto; mover, agregar o quitar, de a uno. */
  const commit = (next: Slide[], grouped = false) => {
    const u = undo.current;
    const now = Date.now();
    if (!grouped || now - u.last > 1200) {
      u.stack.push(slides);
      if (u.stack.length > 80) u.stack.shift();
      setUndoN(u.stack.length);
    }
    u.last = grouped ? now : 0;
    setSlides(next);
    setMsg({});
    setConfirm(null);
  };
  const doUndo = () => {
    const prev = undo.current.stack.pop();
    setUndoN(undo.current.stack.length);
    undo.current.last = 0;
    if (!prev) return;
    setSlides(prev);
    if (sel !== null && sel >= prev.length) setSel(prev.length - 1);
    setMsg({});
  };

  const select = (i: number | null) => {
    const back = i === null ? sel : null;
    setSel(i);
    setReveal(false);
    setConfirm(null);
    setMoveTo("");
    if (i !== null) {
      // En el celular la diapositiva reemplaza a la lista: mostrarla desde el principio.
      if (window.innerWidth < 1000) requestAnimationFrame(() => top.current?.querySelector(".ced-edit")?.scrollIntoView({ block: "start" }));
    } else if (back !== null) {
      requestAnimationFrame(() => document.getElementById(`ced-item-${back}`)?.scrollIntoView({ block: "center" }));
    }
  };

  const setSlide = (i: number, s: Slide) => commit(slides.map((x, j) => (j === i ? s : x)), true);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= slides.length || to === from) return;
    const next = [...slides];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    commit(next);
    setSel(to);
  };
  const duplicate = (i: number) => {
    const copy = structuredClone(slides[i]);
    // La copia no comparte el lugar de imagen: lleva uno nuevo (la imagen se sube aparte).
    if ("media" in copy && copy.media) copy.media = { id: newMediaId(clase.num), kind: copy.media.kind, caption: copy.media.caption };
    const next = [...slides];
    next.splice(i + 1, 0, copy);
    commit(next);
    setSel(i + 1);
  };
  const remove = (i: number) => {
    if (slides.length === 1) return setMsg({ error: "La clase tiene que tener al menos una diapositiva." });
    if (confirm !== `del-${i}`) return setConfirm(`del-${i}`);
    const next = slides.filter((_, j) => j !== i);
    commit(next);
    setSel(Math.min(i, next.length - 1));
    setMsg({ ok: `Diapositiva ${i + 1} eliminada. Si fue sin querer, tocá “Deshacer”.` });
  };
  const add = (type: SlideType, at: number) => {
    if (slides.length >= LIMITS.slides) return setMsg({ error: `Máximo ${LIMITS.slides} diapositivas.` });
    const next = [...slides];
    next.splice(at, 0, newSlide(type));
    commit(next);
    setSheet(null);
    select(at);
  };

  // ---------------------------------------------------------------- servidor
  const clean = () => {
    const c = normalizeSlides(slides);
    if (!c) setMsg({ error: "La clase tiene que tener al menos una diapositiva." });
    return c;
  };

  const save = async () => {
    const c = clean();
    if (!c) return;
    setBusy(true);
    setMsg({});
    const res = await saveClassDraft(slug, clase.num, c);
    setBusy(false);
    if (res.error) return setMsg({ error: res.error });
    setSlides(c);
    setBaseline(json(c));
    setHasDraft(true);
    forgetLocal();
    setMsg({ ok: res.ok });
    router.refresh();
  };

  const problems = useMemo(() => classProblems(slides), [slides]);
  const warned = useMemo(
    () => slides.map((s, i) => ({ i, w: slideWarnings(s) })).filter((x) => x.w.length > 0),
    [slides],
  );

  const publish = async () => {
    const c = clean();
    if (!c) return;
    if (problems.length) return setMsg({ error: "Hay diapositivas para corregir antes de publicar." });
    setBusy(true);
    setMsg({});
    const res = await publishClass(slug, clase.num, c, note);
    setBusy(false);
    if (res.error) return setMsg({ error: res.error });
    setSlides(c);
    setBaseline(json(c));
    setHasDraft(false);
    setNote("");
    setSheet(null);
    forgetLocal();
    setMsg({ ok: res.ok });
    router.refresh();
  };

  const discard = async () => {
    if (confirm !== "discard") return setConfirm("discard");
    setConfirm(null);
    if (hasDraft) {
      setBusy(true);
      const res = await discardClassDraft(slug, clase.num);
      setBusy(false);
      if (res.error) return setMsg({ error: res.error });
    }
    undo.current.stack.push(slides);
    setUndoN(undo.current.stack.length);
    setSlides(published);
    setBaseline(json(published));
    setHasDraft(false);
    forgetLocal();
    if (sel !== null && sel >= published.length) setSel(published.length - 1);
    setMsg({ ok: "Listo: volviste a lo publicado." });
    router.refresh();
  };

  const restore = async (id: number | null) => {
    const k = `restore-${id ?? "orig"}`;
    if (confirm !== k) return setConfirm(k);
    setConfirm(null);
    setBusy(true);
    const res = await restoreClassVersion(slug, clase.num, id);
    setBusy(false);
    if (res.error) return setMsg({ error: res.error });
    const loaded = normalizeSlides(res.slides);
    if (!loaded) return setMsg({ error: "No se pudo leer esa versión." });
    undo.current.stack.push(slides);
    setUndoN(undo.current.stack.length);
    setSlides(loaded);
    setBaseline(json(loaded));
    setHasDraft(true);
    forgetLocal();
    setSel(null);
    setSheet(null);
    setMsg({ ok: res.ok });
    router.refresh();
  };

  // ---------------------------------------------------------------- vista
  const current = sel !== null ? slides[sel] : null;
  const preview = useMemo(() => (current ? forPreview(current, media) : null), [current, media]);
  const curProblems = current ? slideProblems(current) : [];
  const curKey = current ? json([current]) : "";
  const curWarnings = current ? [...slideWarnings(current), ...(overflow.key === curKey ? overflow.issues : [])] : [];

  const needle = query.trim().toLowerCase();
  const listed = slides
    .map((s, i) => ({ s, i, p: slideProblems(s).length, w: slideWarnings(s).length }))
    .filter(({ s, p, w }) => (!onlyIssues || p + w > 0) && (!needle || JSON.stringify(s).toLowerCase().includes(needle)));

  const statusText = dirty
    ? "Cambios sin guardar"
    : hasDraft
      ? `Borrador guardado${draftWhen ? ` (${draftWhen})` : ""} · los alumnos todavía ven lo publicado`
      : "Igual a lo publicado";

  const style = { "--accent": clase.accent } as CSSProperties;
  const mediaCtx = useMemo(
    () => ({
      imagesHref: `/admin/cursos/${slug}/imagenes`,
      publishedIds: new Set(published.flatMap((s) => ("media" in s && s.media ? [s.media.id] : []))),
    }),
    [slug, published],
  );

  return (
    <div className={`ced${sel !== null ? " has-sel" : ""}`} ref={top} style={style}>
      {recover && (
        <div className="notice warn ced-recover">
          <span>
            Quedaron cambios sin guardar de la última vez ({new Date(recover.at).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}).
          </span>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                commit(recover.slides);
                setRecover(null);
                setSel(null);
              }}
            >
              Recuperarlos
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                forgetLocal();
                setRecover(null);
              }}
            >
              Descartarlos
            </button>
          </div>
        </div>
      )}

      <div className="ced-top">
        <span className={`tag ${hasDraft || dirty ? "warn" : ""}`}>{hasDraft || dirty ? "Con cambios sin publicar" : "Publicada"}</span>
        <span className="tag">{slides.length} diapositivas</span>
        {problems.length > 0 && <span className="tag bad">{problems.length} para corregir</span>}
        <div className="ced-top-actions">
          <button type="button" className="btn btn-sm" onClick={() => setSheet({ kind: "history" })}>
            Historial
          </button>
          {(hasDraft || dirty) && (
            <button type="button" className="btn btn-sm" onClick={discard} disabled={busy}>
              {confirm === "discard" ? "¿Seguro? Tocá de nuevo" : hasDraft ? "Descartar borrador" : "Descartar cambios"}
            </button>
          )}
          <a href={sel !== null ? `${classHref}#${sel + 1}` : classHref} target="_blank" rel="noreferrer" className="btn btn-sm">
            {sel !== null ? `Ver la diapositiva ${sel + 1} publicada` : "Ver la clase publicada"}
          </a>
        </div>
      </div>

      {liveOpen && (
        <p className="notice warn ced-live">
          Hay una <strong>clase en vivo abierta</strong> de esta clase. Podés editar y guardar el borrador, pero para publicar
          primero terminala.
        </p>
      )}

      <div className="ced-grid">
        {/* ------------------------------------------------ lista */}
        <aside className="ced-list" aria-label="Diapositivas">
          <div className="ced-filter">
            <input
              className="input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar un texto"
              aria-label="Buscar en las diapositivas"
            />
            <label className="ced-check">
              <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} />
              <span>Solo con avisos</span>
            </label>
          </div>
          <ol className="ced-items">
            {listed.map(({ s, i, p, w }) => (
              <li key={i}>
                <button
                  type="button"
                  id={`ced-item-${i}`}
                  className={`ced-item${i === sel ? " on" : ""}${p ? " bad" : w ? " warn" : ""}`}
                  aria-current={i === sel ? "true" : undefined}
                  onClick={() => select(i)}
                >
                  <span className="ced-item-n">{pad(i + 1)}</span>
                  <span className="ced-item-main">
                    <span className="ced-item-type">
                      {typeLabel(s.type)}
                      {s.type === "quiz" ? ` · ${s.kind === "vf" ? "V o F" : s.kind === "multi" ? "varias" : "una"}` : ""}
                      {"media" in s && s.media ? " · con imagen" : ""}
                    </span>
                    <span className="ced-item-sum">{typeset(slideSummary(s)) || "(sin título)"}</span>
                  </span>
                  {p > 0 ? (
                    <span className="ced-flag bad" title="Hay algo para corregir">Corregir</span>
                  ) : w > 0 ? (
                    <span className="ced-flag warn" title="Puede no entrar en el proyector">Aviso</span>
                  ) : null}
                </button>
              </li>
            ))}
            {listed.length === 0 && <li className="muted ced-none">Ninguna diapositiva coincide.</li>}
          </ol>
          <button type="button" className="btn ced-add" onClick={() => setSheet({ kind: "add", at: sel !== null ? sel + 1 : slides.length })}>
            + Agregar diapositiva
          </button>
        </aside>

        {/* ------------------------------------------------ diapositiva elegida */}
        {current && sel !== null && preview ? (
          <section className="ced-edit" data-pane={pane} aria-label={`Diapositiva ${sel + 1}`}>
            <div className="ced-edit-head">
              <button type="button" className="btn btn-sm ced-back" onClick={() => select(null)}>
                ← Todas
              </button>
              <div className="ced-pos">
                <strong>
                  {sel + 1} / {slides.length}
                </strong>
                <span>{typeLabel(current.type)}</span>
              </div>
              <div className="ced-nav">
                <button type="button" onClick={() => select(sel - 1)} disabled={sel === 0} aria-label="Diapositiva anterior">
                  ‹
                </button>
                <button type="button" onClick={() => select(sel + 1)} disabled={sel === slides.length - 1} aria-label="Diapositiva siguiente">
                  ›
                </button>
              </div>
            </div>

            <div className="ced-tools">
              <button type="button" onClick={() => move(sel, sel - 1)} disabled={sel === 0}>
                ↑ Subir
              </button>
              <button type="button" onClick={() => move(sel, sel + 1)} disabled={sel === slides.length - 1}>
                ↓ Bajar
              </button>
              <button type="button" onClick={() => duplicate(sel)}>
                Duplicar
              </button>
              <button type="button" onClick={() => setSheet({ kind: "add", at: sel + 1 })}>
                + Agregar después
              </button>
              <button type="button" className="danger" onClick={() => remove(sel)}>
                {confirm === `del-${sel}` ? "¿Seguro? Tocá de nuevo" : "Eliminar"}
              </button>
              <span className="ced-moveto">
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={slides.length}
                  value={moveTo}
                  onChange={(e) => setMoveTo(e.target.value)}
                  placeholder="N.º"
                  aria-label="Mover a la posición"
                />
                <button
                  type="button"
                  disabled={!moveTo || Number(moveTo) < 1 || Number(moveTo) > slides.length || Number(moveTo) === sel + 1}
                  onClick={() => {
                    move(sel, Number(moveTo) - 1);
                    setMoveTo("");
                  }}
                >
                  Mover a esa posición
                </button>
              </span>
            </div>

            <div className="ced-panes" role="tablist" aria-label="Ver">
              <button type="button" role="tab" aria-selected={pane === "form"} className={pane === "form" ? "on" : ""} onClick={() => setPane("form")}>
                Editar
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={pane === "preview"}
                className={pane === "preview" ? "on" : ""}
                onClick={() => setPane("preview")}
              >
                Vista previa
                {curWarnings.length > 0 && <span className="ced-dot" aria-label="con avisos" />}
              </button>
            </div>

            <div className="ced-cols">
              <div className="ced-form">
                {curProblems.length > 0 && (
                  <ul className="ev-problems">
                    {curProblems.map((p) => (
                      <li key={p}>{cap(p)}</li>
                    ))}
                  </ul>
                )}
                <MediaCtx.Provider value={mediaCtx}>
                  <SlideForm slide={current} onChange={(s) => setSlide(sel, s)} classNum={clase.num} media={media} />
                </MediaCtx.Provider>
              </div>

              <div className="ced-preview">
                <div className="ced-preview-bar">
                  <div className="ced-seg" role="group" aria-label="Cómo se ve">
                    <button type="button" className={previewMode === "canvas" ? "on" : ""} aria-pressed={previewMode === "canvas"} onClick={() => setPreviewMode("canvas")}>
                      Proyector
                    </button>
                    <button type="button" className={previewMode === "flow" ? "on" : ""} aria-pressed={previewMode === "flow"} onClick={() => setPreviewMode("flow")}>
                      Celular
                    </button>
                  </div>
                  {current.type === "quiz" && (
                    <label className="ced-check">
                      <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} />
                      <span>Mostrar respuesta</span>
                    </label>
                  )}
                  <button type="button" className="btn btn-sm" onClick={() => setSheet({ kind: "big" })}>
                    Ver en grande
                  </button>
                </div>
                <div className={`ced-frame ${previewMode}`}>
                  <SlideMirror
                    key={`${previewMode}-${sel}`}
                    course={course}
                    clase={clase}
                    slide={preview}
                    index={sel}
                    total={slides.length}
                    mode={previewMode}
                    revealed={reveal}
                  />
                </div>
                {curWarnings.length > 0 ? (
                  <ul className="ced-warnings">
                    {curWarnings.map((w) => (
                      <li key={w}>{cap(w)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="hint ced-fits">Entra bien en el proyector.</p>
                )}
              </div>
            </div>
            <OverflowProbe slide={preview} course={course} clase={clase} index={sel} total={slides.length} onResult={(issues) => setOverflow({ key: curKey, issues })} />
          </section>
        ) : (
          <section className="ced-empty">
            <p className="muted">Elegí una diapositiva de la lista para editarla y ver cómo queda.</p>
          </section>
        )}
      </div>

      {/* ------------------------------------------------ barra de guardar */}
      <div className="ev-bar ced-bar">
        <div className="ev-bar-msg" role="status">
          {msg.error ? (
            <span className="aform-msg err">{msg.error}</span>
          ) : msg.ok ? (
            <span className="aform-msg ok">{msg.ok}</span>
          ) : (
            <span className="muted">{statusText}</span>
          )}
        </div>
        <div className="ev-bar-actions">
          <button type="button" className="btn btn-sm" onClick={doUndo} disabled={undoN === 0 || busy}>
            Deshacer
          </button>
          <button type="button" className="btn btn-sm" onClick={save} disabled={busy || !dirty}>
            {busy ? "Guardando…" : "Guardar borrador"}
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => setSheet({ kind: "publish" })} disabled={busy || (!dirty && !hasDraft)}>
            Publicar…
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ ventanas */}
      {sheet && (
        <div className={`ced-sheet-back${sheet.kind === "big" ? " big" : ""}`} onClick={(e) => e.target === e.currentTarget && setSheet(null)}>
          {sheet.kind === "big" && preview && sel !== null ? (
            <div className="ced-big" role="dialog" aria-modal="true" aria-label="Vista previa en grande">
              <div className="ced-big-bar">
                <span>
                  {sel + 1} / {slides.length} · {previewMode === "canvas" ? "Proyector" : "Celular"}
                </span>
                <div className="ced-nav">
                  <button type="button" onClick={() => select(sel - 1)} disabled={sel === 0} aria-label="Diapositiva anterior">
                    ‹
                  </button>
                  <button type="button" onClick={() => select(sel + 1)} disabled={sel === slides.length - 1} aria-label="Diapositiva siguiente">
                    ›
                  </button>
                  <button type="button" onClick={() => setSheet(null)} aria-label="Cerrar">
                    ✕
                  </button>
                </div>
              </div>
              <div className={`ced-big-frame ${previewMode}`}>
                <SlideMirror key={`big-${previewMode}-${sel}`} course={course} clase={clase} slide={preview} index={sel} total={slides.length} mode={previewMode} revealed={reveal} />
              </div>
            </div>
          ) : (
            <div className="ced-sheet" role="dialog" aria-modal="true" aria-labelledby="ced-sheet-title">
              <div className="ced-sheet-head">
                <h2 id="ced-sheet-title">
                  {sheet.kind === "add" ? "Agregar diapositiva" : sheet.kind === "publish" ? "Publicar la clase" : "Historial de versiones"}
                </h2>
                <button type="button" className="ced-close" onClick={() => setSheet(null)} aria-label="Cerrar">
                  ✕
                </button>
              </div>

              {sheet.kind === "add" && (
                <>
                  <p className="muted">
                    Va en el lugar {sheet.at + 1}. Viene con textos de ejemplo para reemplazar.
                  </p>
                  <div className="ced-types">
                    {SLIDE_TYPES.map((t) => (
                      <button key={t.type} type="button" className="ced-type" onClick={() => add(t.type, sheet.at)}>
                        <strong>{t.label}</strong>
                        <span>{t.help}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {sheet.kind === "publish" && (
                <>
                  <p className="muted">
                    Al publicar, todos (alumnos, PDF, clase en vivo) pasan a ver esta versión. La anterior queda en el historial.
                  </p>
                  {liveOpen && <p className="notice warn">Hay una clase en vivo abierta de esta clase: terminala antes de publicar.</p>}
                  {problems.length > 0 && (
                    <div className="ced-issues bad">
                      <strong>Para corregir antes de publicar ({problems.length})</strong>
                      <ul>
                        {problems.slice(0, 12).map((p) => {
                          const n = Number(p.match(/^Diapositiva (\d+)/)?.[1] ?? 0);
                          return (
                            <li key={p}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSheet(null);
                                  select(n - 1);
                                }}
                              >
                                {p}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {warned.length > 0 && (
                    <div className="ced-issues warn">
                      <strong>Avisos de diseño ({warned.length}): se puede publicar igual</strong>
                      <ul>
                        {warned.slice(0, 12).map(({ i, w }) => (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => {
                                setSheet(null);
                                select(i);
                              }}
                            >
                              Diapositiva {i + 1}: {w[0]}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <label className="field">
                    <span>Qué cambiaste (opcional, queda en el historial)</span>
                    <input className="input" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Corregí la pregunta de la diapositiva 12" />
                  </label>
                  {msg.error && <p className="aform-msg err">{msg.error}</p>}
                  <div className="btn-row">
                    <button type="button" className="btn btn-primary" onClick={publish} disabled={busy || liveOpen || problems.length > 0}>
                      {busy ? "Publicando…" : "Publicar ahora"}
                    </button>
                    <button type="button" className="btn" onClick={() => setSheet(null)}>
                      Seguir editando
                    </button>
                  </div>
                </>
              )}

              {sheet.kind === "history" && (
                <>
                  <p className="muted">
                    Cargar una versión la trae al <strong>borrador</strong> para revisarla; los alumnos la ven recién cuando la
                    publicás.{dirty ? " Ojo: reemplaza los cambios que no guardaste." : ""}
                  </p>
                  {versions.length === 0 && <p className="muted">Todavía no se publicó ninguna versión desde el panel: se ve la original.</p>}
                  <ul className="alist ced-versions">
                    {versions.map((v) => (
                      <li key={v.id}>
                        <div className="alist-main">
                          <strong>
                            {v.when}
                            {v.current && <span className="tag ok">Vigente</span>}
                            {v.original && <span className="tag">Vuelta a la original</span>}
                          </strong>
                          <span className="muted">
                            {v.author ?? "Admin"}
                            {v.note ? ` · ${v.note}` : ""}
                          </span>
                        </div>
                        {!v.current && !v.original && (
                          <button type="button" className="btn btn-sm" onClick={() => restore(v.id)} disabled={busy}>
                            {confirm === `restore-${v.id}` ? "¿Seguro? Tocá de nuevo" : "Cargar en el borrador"}
                          </button>
                        )}
                      </li>
                    ))}
                    <li>
                      <div className="alist-main">
                        <strong>
                          Versión original
                          {(versions.length === 0 || versions[0].original) && <span className="tag ok">Vigente</span>}
                        </strong>
                        <span className="muted">La que viene escrita con la plataforma.</span>
                      </div>
                      <button type="button" className="btn btn-sm" onClick={() => restore(null)} disabled={busy}>
                        {confirm === "restore-orig" ? "¿Seguro? Tocá de nuevo" : "Cargar en el borrador"}
                      </button>
                    </li>
                  </ul>
                  {msg.error && <p className="aform-msg err">{msg.error}</p>}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Medición: ¿algo se sale del lienzo del proyector?
// ---------------------------------------------------------------------------

type ProbeProps = {
  slide: Slide;
  course: { title: string; org: string };
  clase: { num: number; title: string; accent: string };
  index: number;
  total: number;
  onResult: (issues: string[]) => void;
};

/** Dibuja la diapositiva fuera de la pantalla, en el lienzo del proyector, y mide si algo se sale. */
function OverflowProbe({ slide, course, clase, index, total, onResult }: ProbeProps) {
  const box = useRef<HTMLDivElement>(null);
  const report = useRef(onResult);
  useEffect(() => {
    report.current = onResult;
  });

  useEffect(() => {
    let alive = true;
    const measure = () => {
      const root = box.current;
      if (!root || !alive) return;
      const issues: string[] = [];
      for (const side of root.querySelectorAll<HTMLElement>(".ced-probe-one")) {
        const stage = side.querySelector(".stage");
        if (!stage) return;
        const sb = stage.getBoundingClientRect();
        const k = sb.width / 1920;
        const foot = side.querySelector(".slide-foot")?.getBoundingClientRect();
        const limit = foot ? foot.top : sb.bottom;
        let down = 0;
        let right = 0;
        for (const el of side.querySelectorAll(".slide .s *, .slide-quiz *")) {
          if (el.closest(".slide-foot") || el.matches(".s-quiz")) continue;
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) continue;
          down = Math.max(down, (b.bottom - limit) / k);
          right = Math.max(right, (b.right - sb.right) / k);
        }
        const when = side.dataset.revealed === "1" ? " (con la respuesta a la vista)" : "";
        if (down > 4) issues.push(`en el proyector, el contenido se pasa ${Math.round(down)} px para abajo${when}: acortá textos o sacá una fila.`);
        if (right > 4) issues.push(`en el proyector, algo se sale ${Math.round(right)} px por la derecha${when}.`);
        if (issues.length) break;
      }
      report.current(issues);
    };
    const timers = [setTimeout(measure, 150), setTimeout(measure, 700)];
    const imgs = [...(box.current?.querySelectorAll("img") ?? [])];
    imgs.forEach((i) => i.addEventListener("load", measure));
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      imgs.forEach((i) => i.removeEventListener("load", measure));
    };
  }, [slide]);

  const states = slide.type === "quiz" ? [false, true] : [false];
  return (
    <div className="ced-probe" ref={box} aria-hidden="true">
      {states.map((r) => (
        <div key={String(r)} className="ced-probe-one" data-revealed={r ? "1" : "0"}>
          <SlideMirror course={course} clase={clase} slide={slide} index={index} total={total} mode="canvas" revealed={r} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formularios por tipo de diapositiva
// ---------------------------------------------------------------------------

/** Cuadro de texto que crece con lo escrito (en el celular no hay que andar scrolleando adentro). */
function AutoText(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fit = () => {
    const el = ref.current;
    if (!el || el.offsetParent === null) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  };
  useLayoutEffect(fit, [props.value]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Al volver a mostrarse (pestaña "Editar") o cambiar el ancho, se acomoda de nuevo.
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== w) {
        w = el.clientWidth;
        fit();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <textarea ref={ref} {...props} />;
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  max?: number;
  /** Largo recomendado para que entre en el proyector (muestra el contador). */
  soft?: number;
  hint?: ReactNode;
  placeholder?: string;
};

function Field({ label, value, onChange, rows, max = rows ? LIMITS.long : LIMITS.short, soft, hint, placeholder }: FieldProps) {
  const over = soft !== undefined && value.length > soft;
  return (
    <label className="field ced-field">
      <span className="ced-label">
        <span>{label}</span>
        {soft !== undefined && <em className={over ? "over" : ""}>{value.length} / {soft}</em>}
      </span>
      {rows ? (
        <AutoText className="input" rows={rows} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input" value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <small className="hint">{hint}</small>}
    </label>
  );
}

function ItemTools({ i, n, onMove, onRemove, label }: { i: number; n: number; onMove: (d: number) => void; onRemove?: () => void; label: string }) {
  return (
    <div className="ced-item-tools">
      <button type="button" onClick={() => onMove(-1)} disabled={i === 0} aria-label={`Subir ${label} ${i + 1}`} title="Subir">
        ↑
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={i === n - 1} aria-label={`Bajar ${label} ${i + 1}`} title="Bajar">
        ↓
      </button>
      {onRemove && (
        <button type="button" className="danger" onClick={onRemove} aria-label={`Quitar ${label} ${i + 1}`} title="Quitar">
          ✕
        </button>
      )}
    </div>
  );
}

function swap<T>(list: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function ListField({
  label,
  itemLabel,
  items,
  onChange,
  fits,
  rows = 2,
  hint,
}: {
  label: string;
  itemLabel: string;
  items: string[];
  onChange: (v: string[]) => void;
  /** Cuántos entran en el proyector. */
  fits: number;
  rows?: number;
  hint?: string;
}) {
  return (
    <fieldset className="ced-list-field">
      <legend>
        {label} <em className={items.length > fits ? "over" : ""}>{items.length} / {fits}</em>
      </legend>
      {hint && <p className="hint">{hint}</p>}
      {items.map((it, i) => (
        <div key={i} className="ced-li">
          <span className="ced-li-n">{i + 1}</span>
          <AutoText
            className="input"
            rows={rows}
            value={it}
            maxLength={LIMITS.long}
            aria-label={`${cap(itemLabel)} ${i + 1}`}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <ItemTools
            i={i}
            n={items.length}
            label={itemLabel}
            onMove={(d) => onChange(swap(items, i, d))}
            onRemove={items.length > 1 ? () => onChange(items.filter((_, j) => j !== i)) : undefined}
          />
        </div>
      ))}
      {items.length < LIMITS.list && (
        <button type="button" className="btn btn-sm" onClick={() => onChange([...items, ""])}>
          + Agregar {itemLabel}
        </button>
      )}
    </fieldset>
  );
}

function RowsField({ rows, onChange, fits }: { rows: Row[]; onChange: (v: Row[]) => void; fits: number }) {
  return (
    <fieldset className="ced-list-field">
      <legend>
        Filas <em className={rows.length > fits ? "over" : ""}>{rows.length} / {fits}</em>
      </legend>
      <p className="hint">Cada fila: un título corto en negrita y su descripción al lado.</p>
      {rows.map((r, i) => (
        <div key={i} className="ced-li ced-row">
          <span className="ced-li-n">{i + 1}</span>
          <div className="ced-row-fields">
            <input
              className="input"
              value={r.h}
              maxLength={LIMITS.short}
              placeholder="Título de la fila"
              aria-label={`Título de la fila ${i + 1}`}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, h: e.target.value } : x)))}
            />
            <AutoText
              className="input"
              rows={2}
              value={r.d}
              maxLength={LIMITS.long}
              placeholder="Descripción"
              aria-label={`Descripción de la fila ${i + 1}`}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, d: e.target.value } : x)))}
            />
          </div>
          <ItemTools
            i={i}
            n={rows.length}
            label="la fila"
            onMove={(d) => onChange(swap(rows, i, d))}
            onRemove={rows.length > 1 ? () => onChange(rows.filter((_, j) => j !== i)) : undefined}
          />
        </div>
      ))}
      {rows.length < LIMITS.list && (
        <button type="button" className="btn btn-sm" onClick={() => onChange([...rows, { h: "", d: "" }])}>
          + Agregar fila
        </button>
      )}
    </fieldset>
  );
}

function MediaField({ value, onChange, classNum, media }: { value?: Media; onChange: (m: Media | undefined) => void; classNum: number; media: MediaMap }) {
  const uploaded = value ? Boolean(media[value.id]) || Boolean(value.src) : false;
  const { imagesHref, publishedIds } = useContext(MediaCtx);
  const live = value ? publishedIds.has(value.id) : false;
  return (
    <fieldset className="ced-list-field ced-media">
      <legend>Imagen</legend>
      <label className="ced-check">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked ? { id: newMediaId(classNum), kind: "IMAGEN", caption: "" } : undefined)}
        />
        <span>Lleva imagen, GIF o video</span>
      </label>
      {value && (
        <>
          <Field
            label="Qué tiene que mostrar"
            rows={2}
            value={value.caption}
            onChange={(caption) => onChange({ ...value, caption })}
            hint="Se ve como aviso en la diapositiva mientras no subas la imagen."
          />
          <p className="hint">
            {live
              ? uploaded
                ? "Ya tiene imagen cargada."
                : "Todavía sin imagen."
              : "Lugar nuevo: publicá la clase y después subí la imagen desde la pestaña Imágenes."}{" "}
            Lugar: <span className="mono">{value.id}</span>
          </p>
          {live && (
            <a href={`${imagesHref}?clase=${classNum}#${value.id}`} target="_blank" rel="noreferrer" className="btn btn-sm ced-media-link">
              {uploaded ? "Cambiar la imagen →" : "Subir la imagen →"}
            </a>
          )}
        </>
      )}
    </fieldset>
  );
}

type QuizSlide = Extract<Slide, { type: "quiz" }>;
const KINDS: { k: QuizSlide["kind"]; label: string }[] = [
  { k: "vf", label: "Verdadero o falso" },
  { k: "single", label: "Una correcta" },
  { k: "multi", label: "Varias correctas" },
];

/** Cambiar el tipo de pregunta sin perder lo que se pueda. */
function withKind(q: QuizSlide, kind: QuizSlide["kind"]): QuizSlide {
  if (kind === q.kind) return q;
  if (kind === "vf") {
    const firstCorrect = q.options.findIndex((o) => o.correct);
    return { ...q, kind, options: VF_OPTIONS.map((text, i) => ({ text, correct: i === (firstCorrect === 1 ? 1 : 0) })) };
  }
  let options: QuizOption[] =
    q.kind === "vf"
      ? [
          { text: "", correct: true },
          { text: "", correct: false },
          { text: "", correct: false },
        ]
      : q.options;
  if (kind === "single") {
    const first = Math.max(0, options.findIndex((o) => o.correct));
    options = options.map((o, i) => ({ ...o, correct: i === first }));
  }
  return { ...q, kind, options };
}

function QuizForm({ q, onChange }: { q: QuizSlide; onChange: (q: QuizSlide) => void }) {
  return (
    <>
      <div className="ev-kinds" role="radiogroup" aria-label="Tipo de pregunta">
        {KINDS.map((k) => (
          <button key={k.k} type="button" role="radio" aria-checked={q.kind === k.k} className={q.kind === k.k ? "on" : ""} onClick={() => onChange(withKind(q, k.k))}>
            {k.label}
          </button>
        ))}
      </div>
      <Field
        label="Pregunta"
        rows={2}
        value={q.question}
        onChange={(question) => onChange({ ...q, question })}
        soft={q.options.length >= 4 ? 55 : 140}
        hint={q.options.length >= 4 ? "Con 4 opciones, la pregunta tiene que entrar en una línea." : undefined}
      />
      <fieldset className="ev-opts">
        <legend>{q.kind === "vf" ? "Cuál es la correcta" : q.kind === "multi" ? "Opciones (marcá todas las correctas)" : "Opciones (marcá la correcta)"}</legend>
        {q.options.map((o, j) => (
          <div key={j} className={`ev-opt${o.correct ? " correct" : ""}`}>
            <label className="ev-mark" title={o.correct ? "Correcta" : "Marcar como correcta"}>
              <input
                type={q.kind === "multi" ? "checkbox" : "radio"}
                name="ced-correct"
                checked={o.correct}
                onChange={(e) =>
                  onChange({
                    ...q,
                    options: q.options.map((x, k) => (q.kind === "multi" ? (k === j ? { ...x, correct: e.target.checked } : x) : { ...x, correct: k === j })),
                  })
                }
              />
              <span>{LETTERS[j]}</span>
            </label>
            {q.kind === "vf" ? (
              <span className="ev-vf-text">{o.text}</span>
            ) : (
              <AutoText
                className="input"
                rows={2}
                value={o.text}
                maxLength={LIMITS.short}
                placeholder={`Opción ${LETTERS[j]}`}
                aria-label={`Opción ${LETTERS[j]}`}
                onChange={(e) => onChange({ ...q, options: q.options.map((x, k) => (k === j ? { ...x, text: e.target.value } : x)) })}
              />
            )}
            {q.kind !== "vf" && q.options.length > 2 && (
              <button
                type="button"
                className="ev-opt-del"
                aria-label={`Quitar la opción ${LETTERS[j]}`}
                title="Quitar la opción"
                onClick={() => onChange({ ...q, options: q.options.filter((_, k) => k !== j) })}
              >
                ✕
              </button>
            )}
            {o.correct && <span className="ev-ok">Correcta</span>}
          </div>
        ))}
        {q.kind !== "vf" && q.options.length < LIMITS.quizOptions && (
          <button type="button" className="btn btn-sm" onClick={() => onChange({ ...q, options: [...q.options, { text: "", correct: false }] })}>
            + Agregar opción
          </button>
        )}
      </fieldset>
      <Field
        label="Explicación (aparece al mostrar la respuesta)"
        rows={3}
        value={q.explanation ?? ""}
        onChange={(explanation) => onChange({ ...q, explanation })}
        soft={200}
      />
    </>
  );
}

function SlideForm({ slide, onChange, classNum, media }: { slide: Slide; onChange: (s: Slide) => void; classNum: number; media: MediaMap }) {
  const s = slide;
  switch (s.type) {
    case "title":
      return (
        <>
          <Field label="Línea de la clase" value={s.claseLine} onChange={(claseLine) => onChange({ ...s, claseLine })} hint="Ej. Clase 4 — Automatizar y cuidarte. El título grande es el nombre del curso." />
          <Field label="Subtítulo" value={s.subtitle} onChange={(subtitle) => onChange({ ...s, subtitle })} soft={90} />
          <Field label="Duración" value={s.duracion} onChange={(duracion) => onChange({ ...s, duracion })} />
        </>
      );
    case "agenda":
      return <ListField label="Temas" itemLabel="tema" items={s.items} onChange={(items) => onChange({ ...s, items })} fits={6} rows={1} />;
    case "divider":
      return (
        <>
          <Field label="Etiqueta" value={s.badge} onChange={(badge) => onChange({ ...s, badge })} hint="Ej. BLOQUE 2 · 25 MIN" />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <Field label="Subtítulo (opcional)" value={s.subtitle ?? ""} onChange={(subtitle) => onChange({ ...s, subtitle })} soft={120} />
        </>
      );
    case "concept":
      return (
        <>
          <Field label="Etiqueta" value={s.kicker} onChange={(kicker) => onChange({ ...s, kicker })} />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <Field label="Texto" rows={4} value={s.body} onChange={(body) => onChange({ ...s, body })} soft={s.media ? 280 : 340} />
          <Field label="Analogía (opcional)" rows={2} value={s.analogy ?? ""} onChange={(analogy) => onChange({ ...s, analogy })} soft={200} />
          <MediaField value={s.media} onChange={(m) => onChange({ ...s, media: m })} classNum={classNum} media={media} />
        </>
      );
    case "content":
      return (
        <>
          <Field label="Etiqueta" value={s.kicker} onChange={(kicker) => onChange({ ...s, kicker })} />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <RowsField rows={s.rows} onChange={(rows) => onChange({ ...s, rows })} fits={s.media ? 3 : 4} />
          <MediaField value={s.media} onChange={(m) => onChange({ ...s, media: m })} classNum={classNum} media={media} />
        </>
      );
    case "steps":
      return (
        <>
          <Field label="Etiqueta" value={s.kicker} onChange={(kicker) => onChange({ ...s, kicker })} />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <ListField label="Pasos" itemLabel="paso" items={s.steps} onChange={(steps) => onChange({ ...s, steps })} fits={4} />
          <MediaField value={s.media} onChange={(m) => onChange({ ...s, media: m })} classNum={classNum} media={media} />
        </>
      );
    case "quote":
      return (
        <>
          <Field label="Etiqueta" value={s.kicker} onChange={(kicker) => onChange({ ...s, kicker })} />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <Field label="Rótulo del recuadro" value={s.quoteLabel} onChange={(quoteLabel) => onChange({ ...s, quoteLabel })} hint="Ej. LE PEDIMOS · PLANTILLA" />
          <Field
            label="Texto destacado"
            rows={4}
            value={s.quoteText}
            onChange={(quoteText) => onChange({ ...s, quoteText })}
            soft={260}
            hint="Las comillas rectas se ven como comillas tipográficas. Los [espacios] de una plantilla van entre corchetes."
          />
          <Field label="Nota abajo (opcional)" rows={2} value={s.caption ?? ""} onChange={(caption) => onChange({ ...s, caption })} soft={200} />
        </>
      );
    case "practice":
      return (
        <>
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <Field label="Consigna" rows={6} value={s.instructions} onChange={(instructions) => onChange({ ...s, instructions })} soft={420} />
        </>
      );
    case "compare":
      return (
        <>
          <Field label="Etiqueta" value={s.kicker} onChange={(kicker) => onChange({ ...s, kicker })} />
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <div className="ced-two">
            <div>
              <Field label="Rótulo izquierda (opcional)" value={s.leftLabel ?? ""} onChange={(leftLabel) => onChange({ ...s, leftLabel })} />
              <Field label="Texto izquierda" rows={4} value={s.left} onChange={(left) => onChange({ ...s, left })} soft={260} />
            </div>
            <div>
              <Field label="Rótulo derecha (opcional)" value={s.rightLabel ?? ""} onChange={(rightLabel) => onChange({ ...s, rightLabel })} />
              <Field label="Texto derecha" rows={4} value={s.right} onChange={(right) => onChange({ ...s, right })} soft={260} />
            </div>
          </div>
        </>
      );
    case "checkpoint":
      return (
        <>
          <Field label="Título" value={s.title} onChange={(title) => onChange({ ...s, title })} soft={70} />
          <ListField label="Ítems" itemLabel="ítem" items={s.items} onChange={(items) => onChange({ ...s, items })} fits={4} />
        </>
      );
    case "quiz":
      return <QuizForm q={s} onChange={onChange} />;
  }
}
