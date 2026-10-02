import { useEffect, useState } from "react";
import type { Slide } from "@/content/types";

type QuizSlide = Extract<Slide, { type: "quiz" }>;

const KICKER: Record<QuizSlide["kind"], string> = {
  vf: "Verdadero o falso",
  single: "Elegí una opción",
  multi: "Marcá todas las correctas",
};

const LETTERS = "ABCDEFGH";

type Props = {
  slide: QuizSlide;
  revealed: boolean;
  onReveal: () => void;
  /** Clase en vivo: respuestas que llegan desde los celulares (por opción y cantidad de personas). */
  liveCounts?: { opts: number[]; n: number };
};

export function Quiz({ slide, revealed, onReveal, liveCounts }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (i: number) => {
    if (revealed) return;
    setSelected((prev) =>
      slide.kind === "multi"
        ? prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
        : [i],
    );
  };

  // Teclas 1..n para elegir opción desde el teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < slide.options.length) toggle(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="s s-quiz">
      <div className="kicker">{KICKER[slide.kind]}</div>
      <h2 className="title">{slide.question}</h2>

      <div className={`opts${slide.kind === "vf" ? " opts-vf" : ""}`}>
        {slide.options.map((o, i) => {
          const isSel = selected.includes(i);
          let state = isSel ? "selected" : "";
          if (revealed) state = o.correct ? "correct" : isSel ? "wrong" : "dim";
          return (
            <button key={i} type="button" className={`opt ${state}`} onClick={() => toggle(i)}>
              <span className="mark">{revealed && o.correct ? "✓" : revealed && isSel ? "✕" : LETTERS[i]}</span>
              <span className="opt-text">{o.text}</span>
              {revealed && (o.correct || isSel) && (
                <span className="verdict">{o.correct ? "Correcta" : "Incorrecta"}</span>
              )}
              {liveCounts && (
                <span className="live-bar" aria-label={`${liveCounts.opts[i] ?? 0} respuestas`}>
                  <span
                    className="live-bar-fill"
                    style={{ width: `${liveCounts.n ? ((liveCounts.opts[i] ?? 0) / liveCounts.n) * 100 : 0}%` }}
                  />
                  <span className="live-bar-n">{liveCounts.opts[i] ?? 0}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="quiz-foot">
        {liveCounts && (
          <span className="live-total">
            {liveCounts.n} {liveCounts.n === 1 ? "respuesta" : "respuestas"} desde los celulares
          </span>
        )}
        {revealed ? (
          slide.explanation && <p className="explanation">{slide.explanation}</p>
        ) : (
          <button type="button" className="reveal" onClick={onReveal}>
            Ver respuesta <kbd>R</kbd>
          </button>
        )}
      </div>
    </div>
  );
}
