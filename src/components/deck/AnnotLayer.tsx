import type { AnnotShape, Annotations } from "@/content/types";

// Flechas y recuadros dibujados sobre una imagen (se cargan desde el panel → Imágenes → Señalar).
// Es una capa SVG encima de la imagen, con las mismas proporciones: como la imagen se muestra
// "contenida" (object-fit: contain) en su caja, el viewBox con "meet" cae exactamente encima.
// Las medidas están en píxeles de la imagen original, así que al hacer zoom crecen con ella.

/** Grosor del trazo en píxeles de la imagen (proporcional al tamaño de la imagen). */
export const strokeOf = (a: { w: number; h: number }, s: 1 | 2 | 3) => Math.max(a.w, a.h) * [0, 0.0045, 0.0075, 0.0115][s];

/** Punta de flecha: triángulo en (x2, y2); la línea termina en la base para que la punta quede filosa. */
export function arrowGeometry(sh: Extract<AnnotShape, { t: "arrow" }>, sw: number) {
  const dx = sh.x2 - sh.x1;
  const dy = sh.y2 - sh.y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(sw * 4.2, len * 0.6);
  const half = head * 0.6;
  const bx = sh.x2 - ux * head;
  const by = sh.y2 - uy * head;
  return {
    line: { x1: sh.x1, y1: sh.y1, x2: bx + ux * 1, y2: by + uy * 1 },
    head: `${sh.x2},${sh.y2} ${bx - uy * half},${by + ux * half} ${bx + uy * half},${by - ux * half}`,
  };
}

/** Dibuja una figura: primero un contorno oscuro (se ve sobre fondos claros y en proyector), encima el color. */
export function ShapeView({ a, sh }: { a: { w: number; h: number }; sh: AnnotShape }) {
  const sw = strokeOf(a, sh.s);
  const halo = sw * 0.9;
  if (sh.t === "rect") {
    const r = { x: sh.x, y: sh.y, width: sh.w, height: sh.h, rx: sw * 0.8 };
    return (
      <g>
        <rect {...r} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={sw + halo} />
        <rect {...r} fill="none" stroke={sh.c} strokeWidth={sw} />
      </g>
    );
  }
  const g = arrowGeometry(sh, sw);
  return (
    <g>
      <line {...g.line} stroke="rgba(0,0,0,0.55)" strokeWidth={sw + halo} strokeLinecap="round" />
      <polygon points={g.head} fill="rgba(0,0,0,0.55)" stroke="rgba(0,0,0,0.55)" strokeWidth={halo} strokeLinejoin="round" />
      <line {...g.line} stroke={sh.c} strokeWidth={sw} strokeLinecap="round" />
      <polygon points={g.head} fill={sh.c} stroke={sh.c} strokeWidth={sw * 0.3} strokeLinejoin="round" />
    </g>
  );
}

/** Capa de solo lectura que se apoya sobre la imagen (el contenedor tiene que estar posicionado). */
export function AnnotLayer({ annot, hidden }: { annot?: Annotations; hidden?: boolean }) {
  if (!annot?.shapes.length) return null;
  return (
    <svg
      className={`annot-layer${hidden ? " off" : ""}`}
      viewBox={`0 0 ${annot.w} ${annot.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {annot.shapes.map((sh, i) => (
        <ShapeView key={i} a={annot} sh={sh} />
      ))}
    </svg>
  );
}
