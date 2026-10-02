"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import type { Media } from "@/content/types";

// Galería de imágenes de un lugar: en la diapositiva se ve como un abanico (para que se note que
// hay varias sin llenar la diapositiva) y al tocarlo se abre en pantalla completa.

type Item = { src: string; mime?: string };

const isVideo = (it: Item) => Boolean(it.mime?.startsWith("video/")) || /\.(mp4|webm)$/i.test(it.src);

function Visual({ item, alt, active = true }: { item: Item; alt: string; active?: boolean }) {
  return isVideo(item) ? (
    <video src={item.src} autoPlay={active} loop muted playsInline aria-label={alt} />
  ) : (
    <img src={item.src} alt={alt} referrerPolicy="no-referrer" />
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
          <span className="fan-badge">
            1 de {items.length} · Ver todas
          </span>
        </button>
      </figure>
      {open !== null && <Lightbox items={items} caption={media.caption} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/** Galería en pantalla completa: flechas, deslizar, tocar los puntos; Esc cierra. */
function Lightbox({ items, caption, start, onClose }: { items: Item[]; caption: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const touch = useRef<number | null>(null);
  const n = items.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  // Mientras está abierta, las teclas manejan la galería (no la clase).
  useEffect(() => {
    document.body.dataset.lightbox = "1";
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " ") go(1);
      else if (k === "ArrowLeft" || k === "PageUp") go(-1);
      else if (k === "Escape") onClose();
      else return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    // En captura: se ejecuta antes que el teclado del visor.
    window.addEventListener("keydown", onKey, true);
    return () => {
      delete document.body.dataset.lightbox;
      window.removeEventListener("keydown", onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = (e: TouchEvent) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    e.stopPropagation(); // que el visor no cambie de diapositiva
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería: ${caption}`}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        <Visual key={i} item={items[i]} alt={`${caption} (${i + 1} de ${n})`} />
      </div>
      <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lb-nav" onClick={() => go(-1)} aria-label="Anterior">←</button>
        <div className="lb-dots" role="tablist">
          {items.map((_, j) => (
            <button
              key={j}
              type="button"
              role="tab"
              aria-selected={j === i}
              aria-label={`Imagen ${j + 1}`}
              className={j === i ? "on" : ""}
              onClick={() => setI(j)}
            />
          ))}
        </div>
        <span className="lb-count">
          {i + 1} / {n}
        </span>
        <button type="button" className="lb-nav" onClick={() => go(1)} aria-label="Siguiente">→</button>
        <button type="button" className="lb-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>,
    document.body,
  );
}
