import type { Media, Slide } from "@/content/types";
import { Quiz } from "./Quiz";
import { MediaFan } from "./Gallery";

type CourseInfo = { title: string; org: string };
type ClaseInfo = { num: number; title: string };

type Props = {
  course: CourseInfo;
  clase: ClaseInfo;
  slide: Slide;
  index: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  liveCounts?: { opts: number[]; n: number };
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Renderiza una diapositiva en el lienzo de 1920×1080. */
export function SlideView({ course, clase, slide, index, total, revealed, onReveal, liveCounts }: Props) {
  if (slide.type === "quiz") {
    // El quiz necesita los conteos en vivo; el resto de los tipos se arma en renderBody.
    return (
      <div className="slide slide-quiz">
        <Quiz slide={slide} revealed={revealed} onReveal={onReveal} liveCounts={liveCounts} />
        <footer className="slide-foot">
          <span>
            Clase {clase.num} — {clase.title}
          </span>
          <span>{pad(index + 1)} / {pad(total)}</span>
        </footer>
      </div>
    );
  }
  const counter = `${pad(index + 1)} / ${pad(total)}`;
  // Portada y divisores no llevan pie: son pantallas "limpias".
  const bare = slide.type === "title" || slide.type === "divider";

  return (
    <div className={`slide slide-${slide.type}`}>
      {renderBody(course, clase, slide, counter, revealed, onReveal)}
      {!bare && (
        <footer className="slide-foot">
          <span>
            Clase {clase.num} — {clase.title}
          </span>
          <span>{counter}</span>
        </footer>
      )}
    </div>
  );
}

function renderBody(
  course: CourseInfo,
  clase: ClaseInfo,
  s: Slide,
  counter: string,
  revealed: boolean,
  onReveal: () => void,
) {
  switch (s.type) {
    case "title":
      return (
        <div className="s s-title">
          <div className="kicker">
            {s.claseLine} · {s.duracion}
          </div>
          <h1>{course.title}</h1>
          <p className="sub">{s.subtitle}</p>
          <div className="org">{course.org}</div>
          <div className="counter">{counter}</div>
        </div>
      );

    case "agenda":
      return (
        <div className="s s-agenda">
          <div className="kicker">Agenda de hoy</div>
          <h2 className="title">Qué vamos a ver</h2>
          <ol className="agenda">
            {s.items.map((item, i) => (
              <li key={i}>
                <span className="n">{pad(i + 1)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "divider":
      return (
        <div className="s s-divider">
          <div className="badge">{s.badge}</div>
          <h1>{s.title}</h1>
          {s.subtitle && <p className="sub">{s.subtitle}</p>}
          <div className="line" />
          <div className="counter">Clase {clase.num} · {counter}</div>
        </div>
      );

    case "concept":
      return (
        <div className={`s s-concept${s.media ? " with-media" : ""}`}>
          <div className="main">
            <div className="kicker">{s.kicker}</div>
            <h2 className="title">{s.title}</h2>
            <p className="body">{s.body}</p>
            {s.analogy && (
              <div className="analogy">
                <b>Analogía</b>
                {s.analogy}
              </div>
            )}
          </div>
          {s.media && <MediaBox media={s.media} />}
        </div>
      );

    case "content":
      return (
        <div className={`s s-content${s.media ? " with-media" : ""}`}>
          <div className="main">
            <div className="kicker">{s.kicker}</div>
            <h2 className="title">{s.title}</h2>
            <div className={`rows rows-${s.rows.length}`}>
              {s.rows.map((r, i) => (
                <div className="row" key={i}>
                  <strong>{r.h}</strong>
                  <span>{r.d}</span>
                </div>
              ))}
            </div>
          </div>
          {s.media && <MediaBox media={s.media} />}
        </div>
      );

    case "quiz":
      return <Quiz slide={s} revealed={revealed} onReveal={onReveal} />;

    case "quote":
      return (
        <div className="s s-quote">
          <div className="kicker">{s.kicker}</div>
          <h2 className="title">{s.title}</h2>
          <blockquote>
            <b>{s.quoteLabel}</b>
            <p>{s.quoteText}</p>
          </blockquote>
          {s.caption && <p className="caption">{s.caption}</p>}
        </div>
      );

    case "steps":
      return (
        <div className={`s s-steps${s.media ? " with-media" : ""}`}>
          <div className="main">
            <div className="kicker">{s.kicker}</div>
            <h2 className="title">{s.title}</h2>
            <ol className="steps">
              {s.steps.map((step, i) => (
                <li key={i}>
                  <span className="n">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {s.media && <MediaBox media={s.media} />}
        </div>
      );

    case "practice":
      return (
        <div className="s s-practice">
          <div className="kicker">Práctica · Manos a la obra</div>
          <h2 className="title">{s.title}</h2>
          <div className="instructions">{s.instructions}</div>
        </div>
      );

    case "compare":
      return (
        <div className="s s-compare">
          <div className="kicker">{s.kicker}</div>
          <h2 className="title">{s.title}</h2>
          <div className="cols">
            <div className="col bad">
              <div className="tag2">{s.leftLabel ?? "Vago"}</div>
              <p>{s.left}</p>
            </div>
            <div className="col good">
              <div className="tag2">{s.rightLabel ?? "Claro"}</div>
              <p>{s.right}</p>
            </div>
          </div>
        </div>
      );

    case "checkpoint":
      return (
        <div className="s s-checkpoint">
          <div className="kicker">Checkpoint</div>
          <h2 className="title">{s.title}</h2>
          <ul className="checks">
            {s.items.map((item, i) => (
              <li key={i}>
                <span className="box">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

function MediaBox({ media }: { media: Media }) {
  // Varias imágenes en el mismo lugar: abanico que se abre como galería.
  if (media.gallery && media.gallery.length > 1) return <MediaFan media={media} />;
  if (media.src) {
    const isVideo = media.mime?.startsWith("video/") || /\.(mp4|webm)$/i.test(media.src);
    return (
      <figure className="media">
        {isVideo ? (
          // Video corto en bucle, sin sonido: se comporta como un GIF pero pesa mucho menos.
          <video src={media.src} autoPlay loop muted playsInline aria-label={media.caption} />
        ) : (
          // no-referrer: muchos sitios bloquean imágenes enlazadas desde otro dominio si ven el origen.
          <img src={media.src} alt={media.caption} referrerPolicy="no-referrer" />
        )}
      </figure>
    );
  }
  return (
    <figure className="media placeholder">
      <span className="media-kind">{media.kind} pendiente</span>
      <figcaption>{media.caption}</figcaption>
    </figure>
  );
}
