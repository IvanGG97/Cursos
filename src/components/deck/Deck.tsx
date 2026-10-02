"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import Link from "next/link";
import type { Slide } from "@/content/types";
import { SlideView } from "./SlideView";
import { ThemeToggle } from "../ThemeToggle";
import { JoinOverlay, RankingOverlay, StartDialog, useLivePresenter, type LiveConfig } from "./LivePresenter";
import { saveProgress } from "@/app/cursos/[curso]/[clase]/actions";
import "./deck.css";

const W = 1920;
const H = 1080;
/** Por debajo de esta escala el texto del lienzo queda chico (~16px de cuerpo): se pasa a modo celular. */
const FLOW_BELOW = 0.45;

export type DeckProps = {
  course: { title: string; org: string };
  clase: { num: number; title: string; accent: string; slides: Slide[] };
  /** Adónde vuelve el botón "Índice" (y la tecla I). */
  backHref: string;
  pdfHref?: string;
  /** Si está, se guarda hasta dónde vio la clase la persona (alumnos con sesión). */
  trackProgress?: { slug: string; num: number };
  /** Solo admin: controles de la clase en vivo (código + QR, quiz desde el celular). */
  live?: LiveConfig;
};

export function Deck({ course, clase, backHref, pdfHref, trackProgress, live }: DeckProps) {
  const total = clase.slides.length;
  const [index, setIndex] = useSlideHash(total);
  const current = clase.slides[index];

  const scale = useStageScale();
  // Modo celular: si el lienzo quedara demasiado chico para leer, las diapositivas se acomodan al ancho.
  const flow = scale > 0 && scale < FLOW_BELOW;
  const [revealed, setRevealed] = useState(false);
  const idle = useIdle(2500) && !flow;
  const back = useRef<HTMLAnchorElement>(null);

  // Al cambiar de diapositiva, el quiz vuelve a quedar sin revelar (y en celular, volvemos arriba).
  useEffect(() => {
    setRevealed(false);
    window.scrollTo(0, 0);
  }, [index]);

  // Progreso: se guarda con un pequeño retraso para no escribir en cada toque de flecha.
  useEffect(() => {
    if (!trackProgress) return;
    const t = setTimeout(() => {
      saveProgress(trackProgress.slug, trackProgress.num, index + 1).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [index, trackProgress]);

  // Clase en vivo (solo admin): respuestas correctas de cada quiz, para el ranking.
  const correctBySlide = useMemo(() => {
    const m: Record<number, number[]> = {};
    clase.slides.forEach((s, i) => {
      if (s.type === "quiz") m[i + 1] = s.options.map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0);
    });
    return m;
  }, [clase.slides]);
  const liveState = useLivePresenter(live, index + 1, revealed, correctBySlide);
  const [showJoin, setShowJoin] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showRank, setShowRank] = useState(false);

  const next = () => index < total - 1 && setIndex(index + 1);
  const prev = () => index > 0 && setIndex(index - 1);

  // Teclado: flechas / espacio / PageUp-PageDown (clickers de presentación).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Escribiendo en un campo (ej. el nombre de la partida): las teclas no mueven la clase.
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key;
      let handled = true;
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") next();
      else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") prev();
      else if (k === "Home") setIndex(0);
      else if (k === "End") setIndex(total - 1);
      else if (k === "f" || k === "F") toggleFullscreen();
      else if (k === "r" || k === "R") setRevealed(true);
      else if (k === "i" || k === "I") back.current?.click();
      else if ((k === "c" || k === "C") && liveState.session) {
        setShowRank(false);
        setShowJoin((v) => !v);
      } else if ((k === "t" || k === "T") && liveState.session) {
        setShowJoin(false);
        setShowRank((v) => !v);
      } else if (k === "Escape" && (showJoin || showRank || showStart)) {
        setShowJoin(false);
        setShowRank(false);
        setShowStart(false);
      }
      else handled = false;
      if (handled) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Swipe horizontal en pantallas táctiles (sin confundirlo con el scroll vertical).
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) next();
    else prev();
  };

  const style = { "--accent": clase.accent } as CSSProperties;
  const progress = <div className="progress" style={{ width: `${((index + 1) / total) * 100}%` }} />;
  const slide = (
    <SlideView
      key={index}
      course={course}
      clase={clase}
      slide={current}
      index={index}
      total={total}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
      liveCounts={liveState.session ? liveState.counts(index + 1) : undefined}
    />
  );

  // Hasta medir la pantalla no sabemos qué modo usar: evitamos el parpadeo.
  if (scale === 0) return <div className="deck" style={style} />;

  return (
    <div
      className={`deck${flow ? " flow" : ""}${idle ? " idle" : ""}`}
      style={style}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {flow ? (
        <>
          {slide}
          {progress}
        </>
      ) : (
        <div className="stage" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
          {slide}
          {progress}
        </div>
      )}

      <nav className="controls" aria-label="Navegación">
        <Link ref={back} href={backHref} title="Volver al curso (I)">{flow ? "Curso" : "Índice"}</Link>
        <button type="button" className="nav-btn" onClick={prev} disabled={index === 0} title="Anterior (←)" aria-label="Anterior">←</button>
        <span className="pos">
          {index + 1} / {total}
        </span>
        <button type="button" className="nav-btn" onClick={next} disabled={index === total - 1} title="Siguiente (→)" aria-label="Siguiente">→</button>
        {pdfHref && <a href={pdfHref} title="Descargar resumen en PDF">PDF</a>}
        {liveState.enabled &&
          (liveState.session ? (
            <>
              <button type="button" className="live-on" onClick={() => setShowJoin(true)} title="Mostrar código y QR (C)">
                En vivo · {liveState.session.code} · {liveState.players}
              </button>
              <button type="button" onClick={() => setShowRank(true)} title="Ranking (T)">
                Ranking
              </button>
              <button type="button" onClick={liveState.end} disabled={liveState.busy} title="Terminar la clase en vivo">
                Terminar
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setShowStart(true)} disabled={liveState.busy} title="Abrir la clase en vivo: asistencia y quiz con ranking desde el celular">
              Iniciar en vivo
            </button>
          ))}
        <ThemeToggle className="theme-toggle" />
        <button type="button" className="fs" onClick={toggleFullscreen} title="Pantalla completa (F)">Pantalla completa</button>
      </nav>

      {liveState.error && <div className="live-error" role="alert">{liveState.error}</div>}
      {showStart && !liveState.session && (
        <StartDialog
          defaultTitle=""
          busy={liveState.busy}
          onCancel={() => setShowStart(false)}
          onStart={async (t) => {
            await liveState.start(t);
            setShowStart(false);
            setShowJoin(true);
          }}
        />
      )}
      {showJoin && liveState.session && live && (
        <JoinOverlay
          code={liveState.session.code}
          title={liveState.session.title}
          joinBase={live.joinBase}
          players={liveState.players}
          onClose={() => setShowJoin(false)}
        />
      )}
      {showRank && liveState.session && (
        <RankingOverlay title={liveState.session.title} ranking={liveState.ranking} onClose={() => setShowRank(false)} />
      )}
    </div>
  );
}

/** Diapositiva actual (base 0) sincronizada con el hash de la URL: #12 = diapositiva 12. */
function useSlideHash(total: number) {
  const [index, setIndexState] = useState(0);

  useEffect(() => {
    const read = () => {
      const n = Number(location.hash.slice(1));
      setIndexState(Number.isInteger(n) && n >= 1 ? Math.min(n, total) - 1 : 0);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [total]);

  const setIndex = (i: number) => {
    // replaceState: moverse entre diapositivas no llena el historial del navegador.
    history.replaceState(history.state, "", `#${i + 1}`);
    setIndexState(i);
  };

  return [index, setIndex] as const;
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

/** Escala el lienzo 1920×1080 para que entre completo en la ventana. */
function useStageScale() {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const calc = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return scale;
}

/** true cuando el mouse no se movió en `ms` — oculta controles y cursor al proyectar. */
function useIdle(ms: number) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t = window.setTimeout(() => setIdle(true), ms);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), ms);
    };
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, [ms]);
  return idle;
}
