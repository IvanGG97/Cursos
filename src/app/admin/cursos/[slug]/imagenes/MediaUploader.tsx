"use client";

import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { attachMedia, detachMedia } from "@/app/admin/media-actions";

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
  /** Archivo subido desde el panel (si hay). */
  uploaded: { url: string; mime: string } | null;
  /** Archivo por defecto del repo (si hay). */
  fallback?: string;
};

export function MediaUploader({ slug, mediaId, caption, uploaded, fallback }: Props) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"" | "up" | "rm">("");
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [over, setOver] = useState(false);

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
    upload(e.dataTransfer.files?.[0]);
  };
  const onPaste = (e: ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files)[0];
    if (file) {
      e.preventDefault();
      upload(file);
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
            <img src={shown} alt={caption} />
          )
        ) : (
          <span className="drop-empty">
            <strong>Tocá para elegir un archivo</strong>
            <span>o arrastralo acá · o copialo y pegalo (Ctrl+V)</span>
          </span>
        )}
        {busy === "up" && <span className="drop-busy">Subiendo…</span>}
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
      <div className="btn-row">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => input.current?.click()} disabled={busy !== ""}>
          {shown ? "Reemplazar" : "Subir archivo"}
        </button>
        {uploaded && (
          <button type="button" className="btn btn-sm" onClick={remove} disabled={busy !== ""}>
            {busy === "rm" ? "Quitando…" : "Quitar"}
          </button>
        )}
        <span className="hint" style={{ margin: 0 }}>
          {uploaded ? "Subida desde el panel" : fallback ? "Imagen por defecto" : "Sin archivo"}
        </span>
      </div>
      {(msg.ok || msg.error) && <p className={`aform-msg ${msg.error ? "err" : "ok"}`}>{msg.error ?? msg.ok}</p>}
    </div>
  );
}
