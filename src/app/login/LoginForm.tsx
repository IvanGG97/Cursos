"use client";

import { useActionState, useEffect, useState } from "react";
import { sendMagicLink, signInWithGoogle, type LoginState } from "./actions";
import { GoogleButton } from "./GoogleButton";

/** Navegadores dentro de apps (Instagram, Facebook, TikTok...): Google bloquea el login ahí. */
function isInAppBrowser(ua: string) {
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|TikTok|musical_ly|Snapchat|Twitter|; wv\)/i.test(ua);
}

type Props = {
  next: string;
  google: boolean;
  /** Si está, se usa el botón oficial de Google en nuestro sitio; si no, la redirección vía Supabase. */
  googleClientId?: string;
};

export function LoginForm({ next, google, googleClientId }: Props) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendMagicLink, {});
  const [inApp, setInApp] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  useEffect(() => setInApp(isInAppBrowser(navigator.userAgent)), []);

  if (state.sent) {
    return (
      <div className="notice ok">
        <p style={{ marginTop: 0 }}>
          <strong>Listo, revisá tu mail.</strong> Te mandamos un link a <strong>{state.sent}</strong>.
        </p>
        <p style={{ marginBottom: 0 }}>
          Abrilo desde este mismo celular o computadora. Si no lo ves, buscalo en "Spam" o "Promociones".
        </p>
      </div>
    );
  }

  const emailForm = (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Tu mail</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" inputMode="email" required />
      </div>
      <button type="submit" className={`btn btn-block ${google ? "" : "btn-primary"}`} disabled={pending}>
        {pending ? "Enviando…" : "Mandame el link"}
      </button>
      {state.error && <p style={{ color: "var(--bad)" }}>{state.error}</p>}
    </form>
  );

  if (!google) return emailForm;

  // Flujo por redirección a través de Supabase (Google muestra el dominio de Supabase).
  const redirectButton = (
    <form action={signInWithGoogle} onSubmit={() => setGooglePending(true)}>
      <input type="hidden" name="next" value={next} />
      <button type="submit" className="btn btn-google btn-block" disabled={googlePending}>
        <GoogleMark />
        {googlePending ? "Abriendo Google…" : "Continuar con Google"}
      </button>
    </form>
  );

  return (
    <>
      {inApp && (
        <div className="notice warn" style={{ marginBottom: 20 }}>
          <strong>Abrí esta página en Chrome o Safari.</strong> Desde Instagram, Facebook y otras apps, Google no
          deja iniciar sesión. Tocá los tres puntitos (⋮ o ···) y elegí "Abrir en el navegador".
        </div>
      )}

      {googleClientId ? (
        <GoogleButton clientId={googleClientId} next={next} fallback={redirectButton} />
      ) : (
        redirectButton
      )}

      <details className="alt-login">
        <summary>¿No tenés cuenta de Google? Entrá con tu mail</summary>
        {emailForm}
      </details>
    </>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
