"use client";

import { useEffect, useRef, useState } from "react";
import type { Slide } from "@/content/types";
import { deckLook } from "@/content/styles";
import { SlideView } from "./SlideView";
import "./deck.css";
import "./style-fonts";

// La diapositiva que está proyectando el docente, dentro de otra página (clase en vivo, celular
// del alumno). Por si el proyector no se ve bien: se lee en la propia pantalla.
// · Pantalla angosta (celular): versión acomodada al ancho, como el modo celular de la clase.
// · Pantalla ancha (tablet, compu): el lienzo 1920×1080 escalado, igual que el proyector.

const W = 1920;
const H = 1080;
const FLOW_BELOW = 0.45; // mismo criterio que el visor

type Props = {
  course: { title: string; org: string };
  clase: { num: number; title: string; accent: string; style?: string };
  slide: Slide;
  index: number;
  total: number;
  /** "auto" (por el ancho, como en la clase en vivo) o forzado: "canvas" = proyector, "flow" = celular. */
  mode?: "auto" | "canvas" | "flow";
  /** Para la vista previa del editor: mostrar la respuesta de una pregunta. */
  revealed?: boolean;
};

export function SlideMirror({ course, clase, slide, index, total, mode = "auto", revealed = false }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = width / W;
  const flow = mode === "flow" || (mode === "auto" && scale > 0 && scale < FLOW_BELOW);
  const look = deckLook(clase.style, clase.accent);
  const view = <SlideView key={index} course={course} clase={clase} slide={slide} index={index} total={total} revealed={revealed} onReveal={() => {}} />;

  return (
    <div ref={box} className="mirror-box">
      {width > 0 &&
        (flow ? (
          <div className={`deck${look.className} flow live-mirror`} style={look.style}>
            {view}
          </div>
        ) : (
          <div className={`deck${look.className} live-mirror canvas`} style={look.style}>
            <div className="stage" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              {view}
            </div>
          </div>
        ))}
    </div>
  );
}
