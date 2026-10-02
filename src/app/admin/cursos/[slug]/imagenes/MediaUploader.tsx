"use client";

import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { attachMedia, attachMediaUrl, detachMedia, moveMedia } from "@/app/admin/media-actions";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_ITEMS = 12;
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export type GalleryItem = { id: string; url: string; mime: string; external: boolean };

type Props = {
  slug: string;
  mediaId: string;
  caption: string;
  /** Imágenes cargadas desde el panel, en orden (la primera es la portada). */
  items: GalleryItem[];
  /** Archivo por defecto del repo (se usa mientras no haya nada cargado). */
  fallback?: string;
};

// ---------------------------------------------------------------------------
// Enlaces externos
// ---------------------------------------------------------------------------

/** Convierte enlaces de página conocidos en el enlace directo a la imagen/GIF. */
function directLink(raw: string): string {
  const url = raw.trim();
  // Giphy: https://giphy.com/gifs/nombre-ID  →  https://media.giphy.com/media/ID/giphy.gif
  const g = url.match(/^https?:\/\/(?:www\.)?giphy\.com\/(?:gifs|stickers)\/(?:[\w-]*-)?([A-Za-z0-9]+)\/?(?:[?#].*)?$/);
  if (g) return `https://media.giphy.com/media/${g[1]}/giphy.gif`;
  return url;
}

/** Páginas que no son la imagen en sí (no se pueden mostrar con un enlace). */
function pageWarning(url: string): string | null {
  if (/drive\.google\.com|docs\.google\.com/.test(url)) return "Ese enlace es de Google Drive: abre una página, no la imagen. Descargala y subila como archivo.";
  if (/photos\.app\.goo\.gl|photos\.google\.com/.test(url)) return "Ese enlace es de Google Fotos: abre una página, no la imagen. Descargala y subila como archivo.";
  if (/(?:instagram|facebook|tiktok|x|twitter)\.com/.test(url)) return "Los enlaces de redes sociales abren una página, no la imagen. Descargala y subila como archivo.";
  if (/^https?:\/\/(?:www\.)?tenor\.com\/view\//.test(url)) return "Ese es el enlace de la página de Tenor. Tocá el GIF con el botón derecho → “Copiar dirección de imagen” y pegá ese enlace.";
  return null;
}

const extOf = (url: string) => new URL(url).pathname.split(".").pop()?.toLowerCase() ?? "";

/** Prueba si el enlace carga como imagen o como video. Devuelve el tipo, o null si no carga. */
function probe(url: string): Promise<string | null> {
  const asImage = () =>
    new Promise<string | null>((resolve) => {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      const t = setTimeout(() => resolve(null), 12000);
      img.onload = () => {
        clearTimeout(t);
        const ext = extOf(url);
        resolve(ext === "gif" ? "image/gif" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : /jpe?g/.test(ext) ? "image/jpeg" : "image/url");
      };
      img.onerror = () => {
        clearTimeout(t);
        resolve(null);
      };
      img.src = url;
    });
  const asVideo = () =>
    new Promise<string | null>((resolve) => {
      const v = document.createElement("video");
      v.muted = true;
      v.preload = "metadata";
      const t = setTimeout(() => resolve(null), 12000);
      v.onloadedmetadata = () => {
        clearTimeout(t);
        resolve(extOf(url) === "webm" ? "video/webm" : "video/mp4");
      };
      v.onerror = () => {
        clearTimeout(t);
        resolve(null);
      };
      v.src = url;
    });
  const videoFirst = ["mp4", "webm", "mov"].includes(extOf(url));
  return (videoFirst ? asVideo() : asImage()).then((r) => r ?? (videoFirst ? asImage() : asVideo()));
}

// ---------------------------------------------------------------------------

export function MediaUploader({ slug, mediaId, caption, items, fallback }: Props) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [over, setOver] = useState(false);
  const [link, setLink] = useState("");
  const full = items.length >= MAX_ITEMS;

  const done = (res: { error?: string }, ok: string) => {
    setBusy("");
    if (res.error) return setMsg({ error: res.error });
    setMsg({ ok });
    router.refresh();
  };

  /** Sube uno o varios archivos, en orden. */
  const upload = async (files: File[]) => {
    const list = files.slice(0, MAX_ITEMS - items.length);
    if (files.length && !list.length) return setMsg({ error: `Máximo ${MAX_ITEMS} imágenes por lugar.` });
    for (const [n, file] of list.entries()) {
      const ext = TYPES[file.type];
      if (!ext) return setMsg({ error: `“${file.name}”: formato no admitido. Usá PNG, JPG, WEBP, GIF, SVG o un video MP4/WEBM.` });
      if (file.size > MAX_BYTES) return setMsg({ error: `“${file.name}” pesa más de 15 MB. Si es un GIF, probá grabarlo como video MP4.` });
      setBusy(list.length > 1 ? `Subiendo ${n + 1} de ${list.length}…` : "Subiendo…");
      setMsg({});
      const path = `${slug}/${mediaId}-${Date.now()}-${n}.${ext}`;
      const { error } = await getBrowserClient()
        .storage.from("media")
        .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (error) {
        setBusy("");
        return setMsg({ error: `No se pudo subir “${file.name}”: ${error.message}` });
      }
      const res = await attachMedia(slug, mediaId, path, file.type);
      if (res.error) return done(res, "");
    }
    done({}, list.length > 1 ? `Listo: ${list.length} agregadas a la galería.` : "Listo, ya se ve en la clase.");
  };

  const applyLink = async (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (full) return setMsg({ error: `Máximo ${MAX_ITEMS} imágenes por lugar.` });
    if (!/^https:\/\//i.test(value)) return setMsg({ error: "El enlace tiene que empezar con https://" });
    const warn = pageWarning(value);
    if (warn) return setMsg({ error: warn });

    const url = directLink(value);
    setBusy("Probando el enlace…");
    setMsg({});
    const mime = await probe(url);
    if (!mime) {
      setBusy("");
      return setMsg({
        error:
          "Ese enlace no se pudo mostrar como imagen ni como video. Tiene que ser el enlace directo al archivo (en la imagen: botón derecho → “Copiar dirección de imagen”).",
      });
    }
    const res = await attachMediaUrl(slug, mediaId, url, mime);
    if (!res.error) setLink("");
    done(res, "Listo. Ojo: si el sitio de origen borra o cambia la imagen, deja de verse.");
  };

  const remove = async (id: string) => {
    setBusy("Quitando…");
    setMsg({});
    done(await detachMedia(slug, mediaId, id), "Quitada.");
  };
  const move = async (id: string, to: "up" | "down" | "first") => {
    setBusy("Ordenando…");
    setMsg({});
    done(await moveMedia(slug, mediaId, id, to), to === "first" ? "Ahora es la portada." : "Orden guardado.");
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) return upload(files);
    // Arrastrar una imagen desde otra página trae su enlace.
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (url) applyLink(url);
  };
  const onPaste = (e: ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length) {
      e.preventDefault();
      return upload(files);
    }
    const text = e.clipboardData.getData("text/plain").trim();
    if (/^https?:\/\//i.test(text)) {
      e.preventDefault();
      setLink(text);
      applyLink(text);
    }
  };

  return (
    <div className="uploader">
      {/* Galería actual */}
      {items.length > 0 ? (
        <ol className="gal-list">
          {items.map((it, i) => (
            <li key={it.id} className={i === 0 ? "cover" : ""}>
              <div className="gal-thumb">
                {it.mime.startsWith("video/") ? (
                  <video src={it.url} muted playsInline preload="metadata" />
                ) : (
                  <img src={it.url} alt={`${caption} (${i + 1})`} referrerPolicy="no-referrer" />
                )}
                <span className="gal-n">{i === 0 ? "Portada" : i + 1}</span>
                {it.external && <span className="gal-link">enlace</span>}
              </div>
              <div className="gal-actions">
                <button type="button" onClick={() => move(it.id, "up")} disabled={!!busy || i === 0} aria-label="Mover antes" title="Mover antes">←</button>
                <button type="button" onClick={() => move(it.id, "down")} disabled={!!busy || i === items.length - 1} aria-label="Mover después" title="Mover después">→</button>
                {i > 0 && (
                  <button type="button" onClick={() => move(it.id, "first")} disabled={!!busy} title="Usar como portada">Portada</button>
                )}
                <button type="button" onClick={() => remove(it.id)} disabled={!!busy} title="Quitar de la galería">Quitar</button>
              </div>
            </li>
          ))}
        </ol>
      ) : fallback ? (
        <div className="gal-fallback">
          <img src={fallback} alt={caption} />
          <span className="hint">Imagen por defecto. Lo que agregues la reemplaza.</span>
        </div>
      ) : null}

      {/* Agregar */}
      {!full && (
        <div
          className={`drop add${over ? " over" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={`Agregar imágenes: ${caption}`}
          onClick={() => input.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          onPaste={onPaste}
        >
          <span className="drop-empty">
            <strong>{items.length ? "+ Agregar más imágenes" : "Tocá para elegir archivos"}</strong>
            <span>podés elegir varios · arrastrarlos acá · o pegar un archivo o un enlace (Ctrl+V)</span>
          </span>
          {busy && <span className="drop-busy">{busy}</span>}
        </div>
      )}
      <input
        ref={input}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
        hidden
        onChange={(e) => {
          upload(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {!full && (
        <form
          className="link-row"
          onSubmit={(e) => {
            e.preventDefault();
            applyLink(link);
          }}
        >
          <input
            type="url"
            inputMode="url"
            className="input"
            placeholder="o pegá un enlace: https://…/imagen.gif"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            aria-label="Enlace a una imagen, GIF o video"
          />
          <button type="submit" className="btn btn-sm" disabled={!!busy || !link.trim()}>
            Agregar enlace
          </button>
        </form>
      )}

      <p className="hint">
        {items.length === 0
          ? "Una imagen se ve sola; con dos o más, en la diapositiva aparece un abanico que se abre como galería."
          : items.length === 1
            ? "Agregá otra y en la diapositiva se verá como abanico (galería)."
            : `${items.length} en la galería (máximo ${MAX_ITEMS}). En la diapositiva se ve como abanico.`}
      </p>
      {(msg.ok || msg.error) && <p className={`aform-msg ${msg.error ? "err" : "ok"}`}>{msg.error ?? msg.ok}</p>}
    </div>
  );
}
