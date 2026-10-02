"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import type { Annotations, Media } from "@/content/types";
import { AnnotLayer } from "./AnnotLayer";

// Imágenes de las diapositivas:
// · Una sola imagen: se toca y se abre en pantalla completa.
// · Varias (galería): abanico en la diapositiva que se abre en pantalla completa.
// En pantalla completa hay ZOOM solo para la imagen (no toca el zoom general del navegador):
// botones − / + , rueda o pellizco del touchpad, doble clic / doble toque, pellizco con dos dedos,
// arrastrar para mover y teclas + − 0.

type Item = { src: string; mime?: string; annot?: Annotations };

const isVideo = (it: Item) => Boolean(it.mime?.startsWith("video/")) || /\.(mp4|webm)$/i.test(it.src);

/** Imagen (con sus flechas y recuadros, si tiene) o video. */
function Visual({ item, alt, active = true, hideAnnot }: { item: Item; alt: string; active?: boolean; hideAnnot?: boolean }) {
  return isVideo(item) ? (
    <video src={item.src} autoPlay={active} loop muted playsInline aria-label={alt} />
  ) : (
    <>
      <img src={item.src} alt={alt} referrerPolicy="no-referrer" draggable={false} />
      <AnnotLayer annot={item.annot} hidden={hideAnnot} />
    </>
  );
}

/** Imagen sola: se ve como siempre y al tocarla se abre en pantalla completa (con zoom). */
export function MediaSingle({ media }: { media: Media }) {
  const [open, setOpen] = useState(false);
  const item = { src: media.src!, mime: media.mime, annot: media.annot };
  return (
    <>
      <figure className="media zoomable">
        <button type="button" className="zoom-btn" onClick={() => setOpen(true)} aria-label={`Ampliar imagen: ${media.caption}`}>
          <Visual item={item} alt={media.caption} />
          <span className="zoom-hint" aria-hidden="true">
            Ampliar
          </span>
        </button>
      </figure>
      {open && <Lightbox items={[item]} caption={media.caption} start={0} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Abanico: la portada adelante y hasta dos imágenes más asomando detrás. */
export function MediaFan({ media }: { media: Media }) {
  const items = media.gallery ?? [];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <figure className="media fan">
        <button
          type="button"
          className="fan-btn"
          onClick={() => setOpen(0)}
          aria-label={`Abrir galería: ${items.length} imágenes. ${media.caption}`}
        >
          {items[2] && (
            <span className="fan-card back2" aria-hidden="true">
              <Visual item={items[2]} alt="" active={false} />
            </span>
          )}
          <span className="fan-card back1" aria-hidden="true">
            <Visual item={items[1]} alt="" active={false} />
          </span>
          <span className="fan-card front">
            <Visual item={items[0]} alt={media.caption} />
          </span>
          <span className="fan-badge">1 de {items.length} · Ver todas</span>
        </button>
      </figure>
      {open !== null && <Lightbox items={items} caption={media.caption} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Pantalla completa con zoom
// ---------------------------------------------------------------------------

const MIN = 1;
const MAX = 6;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type View = { s: number; x: number; y: number };
const RESET: View = { s: 1, x: 0, y: 0 };

function Lightbox({ items, caption, start, onClose }: { items: Item[]; caption: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [view, setView] = useState<View>(RESET);
  const [showAnnot, setShowAnnot] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const n = items.length;

  const go = useCallback(
    (d: number) => {
      if (n < 2) return;
      setI((x) => (x + d + n) % n);
      setView(RESET);
    },
    [n],
  );

  /** Mantiene la imagen dentro de la pantalla al moverla. */
  const bound = useCallback((v: View): View => {
    const r = stage.current?.getBoundingClientRect();
    if (!r || v.s <= 1) return RESET;
    const mx = (r.width * (v.s - 1)) / 2;
    const my = (r.height * (v.s - 1)) / 2;
    return { s: v.s, x: clamp(v.x, -mx, mx), y: clamp(v.y, -my, my) };
  }, []);

  /** Zoom hacia un punto de la pantalla (coordenadas de cliente); sin punto, hacia el centro. */
  const zoomTo = useCallback(
    (next: number, cx?: number, cy?: number) => {
      const r = stage.current?.getBoundingClientRect();
      setView((v) => {
        const s = clamp(next, MIN, MAX);
        if (!r || cx === undefined || cy === undefined) return bound({ s, x: v.x * (s / v.s), y: v.y * (s / v.s) });
        // Punto bajo el cursor, relativo al centro del escenario: que quede en el mismo lugar.
        const px = cx - (r.left + r.width / 2);
        const py = cy - (r.top + r.height / 2);
        return bound({ s, x: px - (px - v.x) * (s / v.s), y: py - (py - v.y) * (s / v.s) });
      });
    },
    [bound],
  );

  // Teclado: mientras está abierta, las teclas son de la galería (no de la clase).
  useEffect(() => {
    document.body.dataset.lightbox = "1";
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " ") go(1);
      else if (k === "ArrowLeft" || k === "PageUp") go(-1);
      else if (k === "+" || k === "=") zoomTo(viewRef.current.s * 1.5);
      else if (k === "-" || k === "_") zoomTo(viewRef.current.s / 1.5);
      else if (k === "0") setView(RESET);
      else if (k === "s" || k === "S") setShowAnnot((x) => !x);
      else if (k === "Escape") onClose();
      else return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", onKey, true); // en captura: antes que el teclado del visor
    return () => {
      delete document.body.dataset.lightbox;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [go, zoomTo, onClose]);

  // Rueda / pellizco del touchpad: zoom de la imagen (listener no pasivo para poder frenar el
  // zoom/scroll de la página SOLO dentro de la imagen).
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
      zoomTo(viewRef.current.s * factor, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomTo]);

  // Gestos con punteros (mouse, dedo, lápiz): arrastrar, pellizcar, doble toque, deslizar.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ kind: "pan" | "pinch" | "swipe"; sx: number; sy: number; v: View; dist: number } | null>(null);
  const lastTap = useRef(0);

  const onPointerDown = (e: RPointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const [a, b] = pts;
      gesture.current = { kind: "pinch", sx: (a.x + b.x) / 2, sy: (a.y + b.y) / 2, v: viewRef.current, dist: Math.hypot(a.x - b.x, a.y - b.y) };
    } else if (pts.length === 1) {
      gesture.current = { kind: viewRef.current.s > 1 ? "pan" : "swipe", sx: e.clientX, sy: e.clientY, v: viewRef.current, dist: 0 };
    }
  };

  const onPointerMove = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    if (g.kind === "pinch") {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const ratio = Math.hypot(a.x - b.x, a.y - b.y) / (g.dist || 1);
      const r = stage.current!.getBoundingClientRect();
      const s = clamp(g.v.s * ratio, MIN, MAX);
      const px = g.sx - (r.left + r.width / 2);
      const py = g.sy - (r.top + r.height / 2);
      const mx = (a.x + b.x) / 2 - g.sx;
      const my = (a.y + b.y) / 2 - g.sy;
      setView(bound({ s, x: px - (px - g.v.x) * (s / g.v.s) + mx, y: py - (py - g.v.y) * (s / g.v.s) + my }));
    } else if (g.kind === "pan") {
      setView(bound({ s: g.v.s, x: g.v.x + (e.clientX - g.sx), y: g.v.y + (e.clientY - g.sy) }));
    }
  };

  const onPointerUp = (e: RPointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) {
      // Quedó un dedo después de pellizcar: sigue como arrastre.
      const [p] = [...pointers.current.values()];
      gesture.current = { kind: "pan", sx: p.x, sy: p.y, v: viewRef.current, dist: 0 };
      return;
    }
    gesture.current = null;
    if (!g) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    const moved = Math.hypot(dx, dy);

    // Deslizar sin zoom: cambia de imagen.
    if (g.kind === "swipe" && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) return go(dx < 0 ? 1 : -1);

    // Doble toque / doble clic: acercar ahí, o volver al tamaño normal.
    if (moved < 10) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        lastTap.current = 0;
        if (viewRef.current.s > 1) setView(RESET);
        else zoomTo(2.5, e.clientX, e.clientY);
      } else lastTap.current = now;
    }
  };

  const zoomed = view.s > 1.01;
  const pct = Math.round(view.s * 100);

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ampliada: ${caption}`} onClick={onClose}>
      <div
        ref={stage}
        className={`lb-stage${zoomed ? " zoomed" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchEnd={(e) => e.stopPropagation() /* que el visor no cambie de diapositiva */}
      >
        <div className="lb-media" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
          <Visual key={i} item={items[i]} alt={`${caption}${n > 1 ? ` (${i + 1} de ${n})` : ""}`} hideAnnot={!showAnnot} />
        </div>
      </div>

      <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
        {n > 1 && (
          <>
            <button type="button" className="lb-nav" onClick={() => go(-1)} aria-label="Imagen anterior">←</button>
            <div className="lb-dots" role="tablist">
              {items.map((_, j) => (
                <button
                  key={j}
                  type="button"
                  role="tab"
                  aria-selected={j === i}
                  aria-label={`Imagen ${j + 1}`}
                  className={j === i ? "on" : ""}
                  onClick={() => {
                    setI(j);
                    setView(RESET);
                  }}
                />
              ))}
            </div>
            <span className="lb-count">
              {i + 1} / {n}
            </span>
            <button type="button" className="lb-nav" onClick={() => go(1)} aria-label="Imagen siguiente">→</button>
          </>
        )}
        <div className="lb-zoom" role="group" aria-label="Zoom de la imagen">
          <button type="button" onClick={() => zoomTo(view.s / 1.5)} disabled={!zoomed} aria-label="Alejar">−</button>
          <button type="button" className="lb-pct" onClick={() => setView(RESET)} title="Tamaño normal (0)" aria-label="Tamaño normal">
            {pct}%
          </button>
          <button type="button" onClick={() => zoomTo(view.s * 1.5)} disabled={view.s >= MAX} aria-label="Acercar">+</button>
        </div>
        {items[i].annot && !isVideo(items[i]) && (
          <button
            type="button"
            className="lb-annot"
            aria-pressed={showAnnot}
            onClick={() => setShowAnnot((x) => !x)}
            title="Mostrar u ocultar las flechas y recuadros (S)"
          >
            {showAnnot ? "Ocultar señales" : "Mostrar señales"}
          </button>
        )}
        <button type="button" className="lb-close" onClick={onClose}>Cerrar</button>
      </div>
      <p className="lb-hint" onClick={(e) => e.stopPropagation()}>
        {zoomed ? "Arrastrá para mover · doble toque para volver" : "Doble toque, rueda o pellizco para acercar"}
      </p>
    </div>,
    document.body,
  );
}
