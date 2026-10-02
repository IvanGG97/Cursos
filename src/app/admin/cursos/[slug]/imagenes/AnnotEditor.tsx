"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import type { AnnotShape, Annotations } from "@/content/types";
import { ShapeView, strokeOf } from "@/components/deck/AnnotLayer";

// Editor de señalamientos: flechas y recuadros de color sobre una imagen, para explicar pasos
// sin tener que señalar con el mouse durante la clase. No modifica la imagen: guarda las figuras
// aparte (en píxeles de la imagen original) y la clase las dibuja encima.

type Tool = "arrow" | "rect";
type Size = 1 | 2 | 3;
type Pt = { x: number; y: number };

export const ANNOT_COLORS = [
  { c: "#ff3b30", name: "Rojo" },
  { c: "#ffd60a", name: "Amarillo" },
  { c: "#22d3ee", name: "Cian" },
  { c: "#a3e635", name: "Verde" },
  { c: "#ffffff", name: "Blanco" },
  { c: "#111111", name: "Negro" },
];
const SIZES: { s: Size; name: string }[] = [
  { s: 1, name: "Fino" },
  { s: 2, name: "Medio" },
  { s: 3, name: "Grueso" },
];
const MAX_SHAPES = 50;

type Drag =
  | { kind: "draw"; start: Pt; idx: number; before: AnnotShape[] }
  | { kind: "move"; start: Pt; idx: number; orig: AnnotShape; before: AnnotShape[] }
  | { kind: "handle"; idx: number; h: string; orig: AnnotShape; before: AnnotShape[] };

const clampPt = (p: Pt, w: number, h: number): Pt => ({ x: Math.min(w, Math.max(0, p.x)), y: Math.min(h, Math.max(0, p.y)) });

/** Recuadro a partir de dos esquinas cualesquiera. */
const rectFrom = (a: Pt, b: Pt) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

function moved(sh: AnnotShape, dx: number, dy: number): AnnotShape {
  return sh.t === "arrow"
    ? { ...sh, x1: sh.x1 + dx, y1: sh.y1 + dy, x2: sh.x2 + dx, y2: sh.y2 + dy }
    : { ...sh, x: sh.x + dx, y: sh.y + dy };
}

/** Puntos de agarre de la figura seleccionada. */
function handlesOf(sh: AnnotShape): { h: string; x: number; y: number }[] {
  if (sh.t === "arrow") return [{ h: "a", x: sh.x1, y: sh.y1 }, { h: "b", x: sh.x2, y: sh.y2 }];
  return [
    { h: "nw", x: sh.x, y: sh.y },
    { h: "ne", x: sh.x + sh.w, y: sh.y },
    { h: "sw", x: sh.x, y: sh.y + sh.h },
    { h: "se", x: sh.x + sh.w, y: sh.y + sh.h },
  ];
}

function dragHandle(sh: AnnotShape, h: string, p: Pt): AnnotShape {
  if (sh.t === "arrow") return h === "a" ? { ...sh, x1: p.x, y1: p.y } : { ...sh, x2: p.x, y2: p.y };
  // La esquina opuesta queda fija.
  const opp = { x: h.includes("w") ? sh.x + sh.w : sh.x, y: h.includes("n") ? sh.y + sh.h : sh.y };
  return { ...sh, ...rectFrom(opp, p) };
}

function scaled(a: Annotations, w: number, h: number): AnnotShape[] {
  if (a.w === w && a.h === h) return a.shapes;
  const kx = w / a.w;
  const ky = h / a.h;
  return a.shapes.map((s) =>
    s.t === "arrow"
      ? { ...s, x1: s.x1 * kx, y1: s.y1 * ky, x2: s.x2 * kx, y2: s.y2 * ky }
      : { ...s, x: s.x * kx, y: s.y * ky, w: s.w * kx, h: s.h * ky },
  );
}

const round = (s: AnnotShape): AnnotShape => {
  const r = (v: number) => Math.round(v * 10) / 10;
  return s.t === "arrow"
    ? { ...s, x1: r(s.x1), y1: r(s.y1), x2: r(s.x2), y2: r(s.y2) }
    : { ...s, x: r(s.x), y: r(s.y), w: r(s.w), h: r(s.h) };
};

type Props = {
  src: string;
  caption: string;
  initial?: Annotations;
  /** Guarda; con null, borra todos los señalamientos. Devuelve el error, si lo hubo. */
  onSave: (a: Annotations | null) => Promise<{ error?: string }>;
  onClose: () => void;
};

export function AnnotEditor({ src, caption, initial, onSave, onClose }: Props) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [shapes, setShapes] = useState<AnnotShape[]>([]);
  const [history, setHistory] = useState<AnnotShape[][]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [tool, setTool] = useState<Tool>("arrow");
  const [color, setColor] = useState(ANNOT_COLORS[0].c);
  const [thick, setThick] = useState<Size>(2);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const [unit, setUnit] = useState(1); // píxeles de imagen por píxel de pantalla
  const [handleR, setHandleR] = useState(9);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const shapesRef = useRef(shapes);
  shapesRef.current = shapes;

  // Mientras está abierto, la página de atrás no se desplaza.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onLoad = (img: HTMLImageElement) => {
    // Algunos SVG no traen tamaño propio: se usa la proporción con que se ve.
    const w = img.naturalWidth || 1000;
    const h = img.naturalHeight || Math.round((1000 * img.clientHeight) / Math.max(1, img.clientWidth)) || 750;
    setSize({ w, h });
    if (initial) setShapes(scaled(initial, w, h));
  };

  // Tamaño de los puntos de agarre: constante en pantalla, sin importar la resolución de la imagen.
  useEffect(() => {
    const el = svg.current;
    if (!el || !size) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const update = () => {
      const r = el.getBoundingClientRect();
      // En pantallas táctiles, puntos de agarre más grandes.
      setHandleR(coarse ? 15 : 9);
      const k = Math.max(size.w / Math.max(1, r.width), size.h / Math.max(1, r.height));
      setUnit(k);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  const toImage = (e: { clientX: number; clientY: number }): Pt => {
    const el = svg.current!;
    const m = el.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return clampPt(p, size!.w, size!.h);
  };

  const change = useCallback((next: AnnotShape[], before?: AnnotShape[]) => {
    setHistory((h) => [...h.slice(-49), before ?? shapesRef.current]);
    setShapes(next);
    setDirty(true);
    setConfirmClose(false);
  }, []);

  const historyRef = useRef(history);
  historyRef.current = history;
  const undo = useCallback(() => {
    const h = historyRef.current;
    if (!h.length) return;
    setShapes(h[h.length - 1]);
    setHistory(h.slice(0, -1));
    setSel(null);
    setDirty(true);
  }, []);

  const removeSel = useCallback(() => {
    if (sel === null) return;
    change(shapesRef.current.filter((_, i) => i !== sel));
    setSel(null);
  }, [sel, change]);

  /** Cambiar color o grosor: si hay una figura elegida, se aplica a ella; y queda para las próximas. */
  const pickColor = (c: string) => {
    setColor(c);
    if (sel !== null) change(shapes.map((s, i) => (i === sel ? { ...s, c } : s)));
  };
  const pickThick = (s: Size) => {
    setThick(s);
    if (sel !== null) change(shapes.map((x, i) => (i === sel ? { ...x, s } : x)));
  };

  // Teclado: Supr borra, Ctrl+Z deshace, flechas mueven la figura elegida, Esc suelta la selección.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && sel !== null) {
        e.preventDefault();
        removeSel();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSel(null);
      } else if (sel !== null && size && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = Math.max(size.w, size.h) * (e.shiftKey ? 0.02 : 0.004);
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        change(shapesRef.current.map((s, i) => (i === sel ? moved(s, dx, dy) : s)));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, size, undo, removeSel, change]);

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (!size || e.button > 0) return;
    e.preventDefault();
    svg.current!.setPointerCapture(e.pointerId);
    setError("");
    const p = toImage(e);
    const target = e.target as Element;
    const handle = target.closest("[data-h]")?.getAttribute("data-h");
    const hit = target.closest("[data-i]")?.getAttribute("data-i");

    if (handle && sel !== null) {
      drag.current = { kind: "handle", idx: sel, h: handle, orig: shapes[sel], before: shapes };
      return;
    }
    if (hit !== null && hit !== undefined) {
      const idx = Number(hit);
      setSel(idx);
      const sh = shapes[idx];
      setColor(sh.c);
      setThick(sh.s);
      drag.current = { kind: "move", start: p, idx, orig: sh, before: shapes };
      return;
    }
    if (shapes.length >= MAX_SHAPES) {
      setError(`Máximo ${MAX_SHAPES} señalamientos por imagen.`);
      return;
    }
    // Empezar a dibujar.
    const sh: AnnotShape =
      tool === "arrow"
        ? { t: "arrow", x1: p.x, y1: p.y, x2: p.x, y2: p.y, c: color, s: thick }
        : { t: "rect", x: p.x, y: p.y, w: 0, h: 0, c: color, s: thick };
    drag.current = { kind: "draw", start: p, idx: shapes.length, before: shapes };
    setShapes([...shapes, sh]);
    setSel(null);
  };

  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || !size) return;
    const p = toImage(e);
    setShapes((list) =>
      list.map((s, i) => {
        if (i !== d.idx) return s;
        if (d.kind === "draw") return s.t === "arrow" ? { ...s, x2: p.x, y2: p.y } : { ...s, ...rectFrom(d.start, p) };
        if (d.kind === "move") return moved(d.orig, p.x - d.start.x, p.y - d.start.y);
        return dragHandle(d.orig, d.h, p);
      }),
    );
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !size) return;
    const cur = shapesRef.current;
    const sh = cur[d.idx];
    if (!sh) return;
    const min = Math.max(size.w, size.h) * 0.015;
    if (d.kind === "draw") {
      const big = sh.t === "arrow" ? Math.hypot(sh.x2 - sh.x1, sh.y2 - sh.y1) >= min : sh.w >= min && sh.h >= min;
      if (!big) {
        // Fue un toque, no un trazo: no se crea nada.
        setShapes(d.before);
        return;
      }
      change(cur, d.before);
      setSel(d.idx);
      return;
    }
    if (JSON.stringify(sh) !== JSON.stringify(d.orig)) change(cur, d.before);
  };

  const save = async () => {
    if (!size) return;
    setSaving(true);
    setError("");
    const res = await onSave(shapes.length ? { w: size.w, h: size.h, shapes: shapes.map(round) } : null);
    setSaving(false);
    if (res.error) return setError(res.error);
    onClose();
  };

  const close = () => {
    if (dirty && !confirmClose) return setConfirmClose(true);
    onClose();
  };

  const selShape = sel !== null ? shapes[sel] : null;
  const hr = unit * handleR; // radio del punto de agarre, en píxeles de pantalla

  return createPortal(
    <div className="annot-editor" role="dialog" aria-modal="true" aria-label={`Señalar sobre la imagen: ${caption}`}>
      <div className="ae-bar" role="toolbar" aria-label="Herramientas">
        <div className="ae-group" role="radiogroup" aria-label="Figura">
          <button type="button" role="radio" aria-checked={tool === "arrow"} className={tool === "arrow" ? "on" : ""} onClick={() => setTool("arrow")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 L18 6 M10 6 H18 V14" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
            Flecha
          </button>
          <button type="button" role="radio" aria-checked={tool === "rect"} className={tool === "rect" ? "on" : ""} onClick={() => setTool("rect")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
            Recuadro
          </button>
        </div>

        <div className="ae-group ae-colors" role="radiogroup" aria-label="Color">
          {ANNOT_COLORS.map((k) => (
            <button
              key={k.c}
              type="button"
              role="radio"
              aria-checked={color === k.c}
              aria-label={k.name}
              title={k.name}
              className={`ae-swatch${color === k.c ? " on" : ""}`}
              style={{ background: k.c }}
              onClick={() => pickColor(k.c)}
            />
          ))}
          <label className="ae-custom" title="Otro color">
            <input type="color" value={color} onChange={(e) => pickColor(e.target.value.toLowerCase())} aria-label="Otro color" />
            <span>Otro</span>
          </label>
        </div>

        <div className="ae-group" role="radiogroup" aria-label="Grosor">
          {SIZES.map((k) => (
            <button key={k.s} type="button" role="radio" aria-checked={thick === k.s} className={thick === k.s ? "on" : ""} onClick={() => pickThick(k.s)}>
              {k.name}
            </button>
          ))}
        </div>

        <div className="ae-group">
          <button type="button" onClick={undo} disabled={!history.length} title="Deshacer (Ctrl+Z)">Deshacer</button>
          <button type="button" onClick={removeSel} disabled={sel === null} title="Borrar la figura elegida (Supr)">Borrar</button>
          <button
            type="button"
            onClick={() => {
              change([]);
              setSel(null);
            }}
            disabled={!shapes.length}
          >
            Borrar todo
          </button>
        </div>
      </div>

      <div className="ae-stage">
        <img src={src} alt={caption} referrerPolicy="no-referrer" draggable={false} onLoad={(e) => onLoad(e.currentTarget)} />
        {size && (
          <svg
            ref={svg}
            className={`ae-svg tool-${tool}`}
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <rect x={0} y={0} width={size.w} height={size.h} fill="transparent" />
            {shapes.map((sh, i) => {
              const sw = strokeOf(size, sh.s);
              const hitW = Math.max(sw * 3, unit * 22);
              return (
                <g key={i} data-i={i} className="ae-shape">
                  <ShapeView a={size} sh={sh} />
                  {sh.t === "arrow" ? (
                    <line x1={sh.x1} y1={sh.y1} x2={sh.x2} y2={sh.y2} stroke="transparent" strokeWidth={hitW} strokeLinecap="round" />
                  ) : (
                    <rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} fill="none" stroke="transparent" strokeWidth={hitW} pointerEvents="stroke" />
                  )}
                </g>
              );
            })}
            {selShape && (
              <g className="ae-sel">
                {selShape.t === "rect" ? (
                  <rect x={selShape.x} y={selShape.y} width={selShape.w} height={selShape.h} fill="none" stroke="#fff" strokeWidth={unit * 1.5} strokeDasharray={`${unit * 6} ${unit * 4}`} pointerEvents="none" />
                ) : (
                  <line x1={selShape.x1} y1={selShape.y1} x2={selShape.x2} y2={selShape.y2} stroke="#fff" strokeWidth={unit * 1.5} strokeDasharray={`${unit * 6} ${unit * 4}`} pointerEvents="none" />
                )}
                {handlesOf(selShape).map((h) => (
                  <circle key={h.h} data-h={h.h} cx={h.x} cy={h.y} r={hr} fill="#fff" stroke="#111" strokeWidth={unit * 2} className="ae-handle" />
                ))}
              </g>
            )}
          </svg>
        )}
      </div>

      <div className="ae-foot">
        <p className="ae-help">
          {!size
            ? "Cargando la imagen…"
            : shapes.length === 0
              ? `Arrastrá sobre la imagen para dibujar ${tool === "arrow" ? "una flecha (de la cola a la punta)" : "un recuadro"}.`
              : "Tocá una figura para elegirla: arrastrala para moverla o tirá de sus puntos blancos. Cambiar color o grosor la modifica."}
        </p>
        {error && <p className="aform-msg err">{error}</p>}
        <div className="ae-actions">
          <button type="button" className="btn btn-sm" onClick={close} disabled={saving}>
            {confirmClose ? "¿Descartar cambios? Tocá de nuevo" : "Cancelar"}
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={save} disabled={saving || !size || !dirty}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
