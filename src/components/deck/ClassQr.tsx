"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { setRelease } from "@/app/admin/actions";

// QR de la clase (tecla Q, solo admin): los alumnos la abren en el celular, sin clase en vivo.
// En un curso con inscripción, el link inscribe solo a quien entra (ver src/lib/class-qr.ts).

export type ClassQrConfig = {
  url: string;
  /** La dirección para escribir a mano (sin el permiso del QR). */
  shortUrl: string;
  slug: string;
  num: number;
  /** hidden = curso sin publicar · enrolled = con inscripción · public = libre, sin cuenta. */
  mode: "hidden" | "enrolled" | "public";
  hasCode: boolean;
  /** ¿La clase está liberada para los alumnos? */
  released: boolean;
};

export function ClassQrOverlay({ qr, title, onClose }: { qr: ClassQrConfig; title: string; onClose: () => void }) {
  const router = useRouter();
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});

  useEffect(() => {
    QRCode.toString(qr.url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0b0f14", light: "#ffffff" } })
      .then(setSvg)
      .catch(() => setSvg(""));
  }, [qr.url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qr.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setMsg({ error: "No se pudo copiar. Mantené apretado el link para copiarlo." });
    }
  };

  const release = async () => {
    setBusy(true);
    const f = new FormData();
    f.set("slug", qr.slug);
    f.set("num", String(qr.num));
    f.set("visible", "true");
    f.set("visible_from", "");
    const res = await setRelease({}, f);
    setBusy(false);
    setMsg(res);
    if (res.ok) router.refresh();
  };

  const how =
    qr.mode === "public"
      ? "Se abre la clase directamente, sin registrarse."
      : qr.hasCode
        ? "Entrás con tu cuenta de Google y la clase se abre sola (te inscribe al curso)."
        : "Entrás con tu cuenta de Google y se abre la clase.";

  return (
    <div className="join-overlay" role="dialog" aria-label="Código QR de la clase">
      <div className="join-card">
        <div className="join-text">
          <div className="join-kicker">{title} · abrila en tu celular</div>
          <p className="join-step">1. Escaneá el código QR con la cámara del celular.</p>
          <p className="join-step">2. {how}</p>
          <p className="join-url">
            O escribí: <strong>{qr.shortUrl}</strong>
          </p>
          {/* Avisos para el docente: por qué los alumnos todavía no podrían entrar. */}
          {qr.mode === "hidden" ? (
            <p className="join-warn">El curso no está publicado: los alumnos no pueden entrar. Publicalo desde Admin → el curso.</p>
          ) : (
            !qr.released && (
              <div className="join-warn">
                <p>Esta clase todavía no está liberada: los alumnos que escaneen no la van a poder abrir.</p>
                <button type="button" className="join-btn primary" onClick={release} disabled={busy}>
                  {busy ? "Liberando…" : "Liberar la clase ahora"}
                </button>
              </div>
            )
          )}
          {qr.mode === "enrolled" && !qr.hasCode && (
            <p className="join-warn">
              El curso no tiene código de inscripción: el QR solo sirve para quienes ya están inscriptos. Generá un código en Admin →
              el curso y los nuevos se inscriben solos al escanear.
            </p>
          )}
          {msg.error && <p className="join-warn">{msg.error}</p>}
          {msg.ok && <p className="join-ok">{msg.ok}</p>}
        </div>
        {svg && <div className="join-qr" dangerouslySetInnerHTML={{ __html: svg }} />}
      </div>
      <div className="join-actions">
        <button type="button" className="join-btn" onClick={copy}>
          {copied ? "¡Link copiado!" : "Copiar el link"}
        </button>
        <button type="button" className="join-close" onClick={onClose}>
          Volver a la clase
        </button>
      </div>
    </div>
  );
}
