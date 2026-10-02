"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Slide } from "@/content/types";
import { SlideView } from "./SlideView";
import "./deck.css";

// La diapositiva que está proyectando el docente, dentro de otra página (clase en vivo, celular
// del alumno). Por si el proyector no se ve bien: se lee en la propia pantalla.
// · Pantalla angosta (celular): versión acomodada al ancho, como el modo celular de la clase.
// · Pantalla ancha (tablet, compu): el lienzo 1920×1080 escalado, igual que el proyector.

const W = 1920;
const H = 1080;
const FLOW_BELOW = 0.45; // mismo criterio que el visor

type Props = {
  course: { title: string; org: string };
  clase: { num: number; title: string; accent: string };
  slide: Slide;
  index: number;
  total: number;
};

export function SlideMirror({ course, clase, slide, index, total }: Props) {
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
  const flow = scale > 0 && scale < FLOW_BELOW;
  const style = { "--accent": clase.accent } as CSSProperties;
  const view = <SlideView key={index} course={course} clase={clase} slide={slide} index={index} total={total} revealed={false} onReveal={() => {}} />;

  return (
    <div ref={box} className="mirror-box">
      {width > 0 &&
        (flow ? (
          <div className="deck flow live-mirror" style={style}>
            {view}
          </div>
        ) : (
          <div className="deck live-mirror canvas" style={style}>
            <div className="stage" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              {view}
            </div>
          </div>
        ))}
    </div>
  );
}
