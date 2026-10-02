"use client";

import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { attachMedia, attachMediaUrl, detachMedia } from "@/app/admin/media-actions";

const MAX_BYTES = 15 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

type Props = {
  slug: string;
  mediaId: string;
  caption: string;
  /** Archivo subido o enlace cargado desde el panel (si hay). */
  uploaded: { url: string; mime: string; external: boolean } | null;
  /** Archivo por defecto del repo (si hay). */
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

export function MediaUploader({ slug, mediaId, caption, uploaded, fallback }: Props) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"" | "up" | "rm" | "link">("");
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [over, setOver] = useState(false);
  const [link, setLink] = useState("");

  const shown = uploaded?.url ?? fallback;
  const isVideo = uploaded?.mime.startsWith("video/") ?? false;

  const upload = async (file: File | undefined | null) => {
    if (!file) return;
    const ext = TYPES[file.type];
    if (!ext) return setMsg({ error: "Formato no admitido. Usá PNG, JPG, WEBP, GIF, SVG o un video MP4/WEBM." });
    if (file.size > MAX_BYTES) return setMsg({ error: "El archivo pesa más de 15 MB. Si es un GIF, probá grabarlo como video MP4." });

    setBusy("up");
    setMsg({});
    const path = `${slug}/${mediaId}-${Date.now()}.${ext}`;
    const { error } = await getBrowserClient()
      .storage.from("media")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) {
      setBusy("");
      return setMsg({ error: `No se pudo subir: ${error.message}` });
    }
    const res = await attachMedia(slug, mediaId, path, file.type);
    setBusy("");
    if (res.error) return setMsg({ error: res.error });
    const heavyGif = file.type === "image/gif" && file.size > 4 * 1024 * 1024;
    setMsg({ ok: heavyGif ? "Listo. Es un GIF pesado: en el celular puede tardar; un video MP4 pesa mucho menos." : "Listo, ya se ve en la clase." });
    router.refresh();
  };

  const applyLink = async (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (!/^https:\/\//i.test(value)) return setMsg({ error: "El enlace tiene que empezar con https://" });
    const warn = pageWarning(value);
    if (warn) return setMsg({ error: warn });

    const url = directLink(value);
    setBusy("link");
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
    setBusy("");
    if (res.error) return setMsg({ error: res.error });
    setLink("");
    setMsg({ ok: "Listo, ya se ve en la clase. Ojo: si el sitio de origen borra o cambia la imagen, deja de verse." });
    router.refresh();
  };

  const remove = async () => {
    setBusy("rm");
    setMsg({});
    const res = await detachMedia(slug, mediaId);
    setBusy("");
    if (res.error) return setMsg({ error: res.error });
    setMsg({ ok: fallback ? "Quitado: vuelve la imagen por defecto." : "Quitado." });
    router.refresh();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) return upload(file);
    // Arrastrar una imagen desde otra página trae su enlace.
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (url) applyLink(url);
  };
  const onPaste = (e: ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files)[0];
    if (file) {
      e.preventDefault();
      return upload(file);
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
      <div
        className={`drop${over ? " over" : ""}${shown ? " has" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`Subir archivo: ${caption}`}
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
        {shown ? (
          isVideo ? (
            <video src={shown} autoPlay loop muted playsInline />
          ) : (
            <img src={shown} alt={caption} referrerPolicy="no-referrer" />
          )
        ) : (
          <span className="drop-empty">
            <strong>Tocá para elegir un archivo</strong>
            <span>o arrastralo acá · o pegá un archivo o un enlace (Ctrl+V)</span>
          </span>
        )}
        {busy === "up" && <span className="drop-busy">Subiendo…</span>}
        {busy === "link" && <span className="drop-busy">Probando el enlace…</span>}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

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
        <button type="submit" className="btn btn-sm" disabled={busy !== "" || !link.trim()}>
          {busy === "link" ? "Probando…" : "Usar enlace"}
        </button>
      </form>

      <div className="btn-row">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => input.current?.click()} disabled={busy !== ""}>
          {shown ? "Reemplazar con archivo" : "Subir archivo"}
        </button>
        {uploaded && (
          <button type="button" className="btn btn-sm" onClick={remove} disabled={busy !== ""}>
            {busy === "rm" ? "Quitando…" : "Quitar"}
          </button>
        )}
        <span className="hint" style={{ margin: 0 }}>
          {uploaded ? (uploaded.external ? "Enlace externo" : "Subida desde el panel") : fallback ? "Imagen por defecto" : "Sin archivo"}
        </span>
      </div>
      {uploaded?.external && (
        <p className="hint link-src" title={uploaded.url}>
          {uploaded.url}
        </p>
      )}
      {(msg.ok || msg.error) && <p className={`aform-msg ${msg.error ? "err" : "ok"}`}>{msg.error ?? msg.ok}</p>}
    </div>
  );
}
