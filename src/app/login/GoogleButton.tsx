"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { signInWithGoogleToken } from "./actions";

// Botón oficial de Google (Google Identity Services). El login ocurre en nuestro sitio y Google
// muestra nuestro dominio en lugar del de Supabase. Supabase valida el token con signInWithIdToken.

type GsiCredentialResponse = { credential: string };
type Gsi = {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (r: GsiCredentialResponse) => void;
        nonce: string;
        ux_mode?: "popup" | "redirect";
        use_fedcm_for_button?: boolean;
        context?: "signin" | "signup" | "use";
      }): void;
      renderButton(el: HTMLElement, options: Record<string, string | number>): void;
    };
  };
};
declare global {
  interface Window {
    google?: Gsi;
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const s = existing ?? document.createElement("script");
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject(new Error("gsi")));
    if (!existing) {
      s.src = SCRIPT_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

/** Nonce aleatorio: Google recibe su SHA-256 y Supabase el original, y los compara. */
async function makeNonce() {
  const raw = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return { raw, hashed };
}

type Props = {
  clientId: string;
  next: string;
  /** Se muestra si el script de Google no carga (bloqueadores, red): el flujo por redirección. */
  fallback: ReactNode;
};

export function GoogleButton({ clientId, next, fallback }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ raw, hashed }] = await Promise.all([makeNonce(), loadScript()]);
        if (cancelled || !box.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce: hashed,
          ux_mode: "popup",
          use_fedcm_for_button: true,
          context: "signin",
          callback: ({ credential }) => {
            setError(undefined);
            startTransition(async () => {
              const res = await signInWithGoogleToken(credential, raw, next);
              if (res?.error) setError(res.error);
            });
          },
        });
        window.google.accounts.id.renderButton(box.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          locale: "es-419",
          width: Math.min(box.current.clientWidth || 400, 400),
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId, next]);

  if (status === "failed") return <>{fallback}</>;

  return (
    <div className="google-gsi">
      <div ref={box} className="google-gsi-box" aria-busy={status === "loading"} />
      {status === "loading" && <div className="google-gsi-placeholder">Cargando Google…</div>}
      {pending && <p className="muted" style={{ margin: "12px 0 0" }}>Ingresando…</p>}
      {error && <p style={{ color: "var(--bad)", margin: "12px 0 0" }}>{error}</p>}
    </div>
  );
}
