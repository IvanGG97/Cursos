"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getBrowserClient } from "@/lib/supabase/client";
import { endLive, startLive, type LiveSession } from "@/app/cursos/[curso]/[clase]/live-actions";

// Clase en vivo, lado presentador (solo admin): abre/cierra la sesión, sincroniza la diapositiva
// actual y el "revelar" con los celulares, y cuenta presentes y respuestas en tiempo real.

export type LiveConfig = { slug: string; num: number; initial: LiveSession | null; joinBase: string };

/** counts[slide] = respuestas en esa diapositiva (base 1): por opción y cantidad de personas. */
export type SlideCounts = { opts: number[]; n: number };
type Counts = Record<number, SlideCounts>;

export function useLivePresenter(cfg: LiveConfig | undefined, slide: number, revealed: boolean) {
  const [session, setSession] = useState<LiveSession | null>(cfg?.initial ?? null);
  const [counts, setCounts] = useState<Counts>({});
  const [present, setPresent] = useState(0);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  // Suscripción en tiempo real a respuestas y asistencia de la sesión.
  useEffect(() => {
    if (!session) return;
    const sb = getBrowserClient();
    let alive = true;

    const add = (c: Counts, s: number, choices: number[]) => {
      const prev = c[s] ?? { opts: [], n: 0 };
      const opts = [...prev.opts];
      for (const ch of choices) opts[ch] = (opts[ch] ?? 0) + 1;
      return { ...c, [s]: { opts, n: prev.n + 1 } };
    };

    (async () => {
      const [ans, att] = await Promise.all([
        sb.from("live_answers").select("slide, choices").eq("session_id", session.id),
        sb.from("live_attendance").select("user_id", { count: "exact", head: true }).eq("session_id", session.id),
      ]);
      if (!alive) return;
      let c: Counts = {};
      for (const a of ans.data ?? []) c = add(c, a.slide, a.choices as number[]);
      setCounts(c);
      setPresent(att.count ?? 0);
    })();

    const ch = sb
      .channel(`live-presenter-${session.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_answers", filter: `session_id=eq.${session.id}` },
        (p) => {
          const r = p.new as { slide: number; choices: number[] };
          setCounts((c) => add(c, r.slide, r.choices));
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_attendance", filter: `session_id=eq.${session.id}` },
        () => setPresent((n) => n + 1),
      )
      .subscribe();

    return () => {
      alive = false;
      sb.removeChannel(ch);
    };
  }, [session]);

  // Los celulares siguen la diapositiva actual y el "revelar" del presentador.
  const last = useRef<string>("");
  useEffect(() => {
    if (!session) return;
    const key = `${slide}:${revealed}`;
    if (key === last.current) return;
    last.current = key;
    getBrowserClient().from("live_sessions").update({ current_slide: slide, revealed }).eq("id", session.id).then();
  }, [session, slide, revealed]);

  const start = async () => {
    if (!cfg) return;
    setBusy(true);
    setError(undefined);
    const res = await startLive(cfg.slug, cfg.num);
    setBusy(false);
    if ("error" in res) setError(res.error);
    else setSession(res);
  };

  const end = async () => {
    if (!session) return;
    setBusy(true);
    const res = await endLive(session.id);
    setBusy(false);
    if (res.error) setError(res.error);
    else {
      setSession(null);
      setCounts({});
      setPresent(0);
    }
  };

  return { enabled: Boolean(cfg), session, counts, present, error, busy, start, end };
}

/** Pantalla completa con el código y el QR para que los alumnos se unan. */
export function JoinOverlay({ code, joinBase, present, onClose }: { code: string; joinBase: string; present: number; onClose: () => void }) {
  const [svg, setSvg] = useState("");
  const url = `${joinBase}/vivo?c=${code}`;

  useEffect(() => {
    QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0b0f14", light: "#ffffff" } })
      .then(setSvg)
      .catch(() => setSvg(""));
  }, [url]);

  return (
    <div className="join-overlay" role="dialog" aria-label="Código para unirse a la clase">
      <div className="join-card">
        <div className="join-text">
          <div className="join-kicker">Clase en vivo · sumate desde el celular</div>
          <p className="join-step">
            1. Escaneá el código QR, o entrá a <strong>{joinBase.replace(/^https?:\/\//, "")}/vivo</strong>
          </p>
          <p className="join-step">2. Escribí este número:</p>
          <div className="join-code">{code}</div>
          <p className="join-present">{present} presente(s) con cuenta</p>
        </div>
        {svg && <div className="join-qr" dangerouslySetInnerHTML={{ __html: svg }} />}
      </div>
      <button type="button" className="join-close" onClick={onClose}>
        Volver a la clase
      </button>
    </div>
  );
}
