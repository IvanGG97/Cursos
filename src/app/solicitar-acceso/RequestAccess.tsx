"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { checkAccessRequest, forgetAccessRequest, requestAccess, type RequestState, type RequestStatus } from "./actions";

const POLL_MS = 3000;

/** Formulario (nombre + mail) y, una vez enviado, la espera: entra sola cuando el docente aprueba. */
export function RequestAccess({ courseSlug }: { courseSlug: string }) {
  const [state, formAction, pending] = useActionState<RequestState, FormData>(requestAccess, {});
  const [status, setStatus] = useState<RequestStatus | null>(null);

  const check = useCallback(async () => {
    try {
      const s = await checkAccessRequest();
      setStatus(s);
      // Aprobada: la sesión ya quedó iniciada en este dispositivo. Recarga completa, ya adentro.
      if (s.status === "in") window.location.assign(s.next);
    } catch {
      /* sin conexión por un momento: se reintenta en la próxima vuelta */
    }
  }, []);

  // Al abrir (por si ya había una solicitud desde este dispositivo) y después de enviar.
  useEffect(() => {
    check();
  }, [check, state.sent]);

  // Mientras espera, consulta cada pocos segundos.
  useEffect(() => {
    if (status?.status !== "pending") return;
    const t = setInterval(check, POLL_MS);
    return () => clearInterval(t);
  }, [status?.status, check]);

  if (status === null) return <p className="muted" style={{ marginTop: 24 }}>Cargando…</p>;

  if (status.status === "in") {
    return (
      <>
        <h1 className="live-h1">¡Listo, ya estás adentro!</h1>
        <p className="muted">Entrando al curso…</p>
      </>
    );
  }

  if (status.status === "pending") {
    return (
      <>
        <h1 className="live-h1">Esperando aprobación…</h1>
        <div className="notice req-wait" role="status" aria-live="polite">
          <span className="req-dot" aria-hidden="true" />
          <div>
            <p style={{ margin: 0 }}>
              <strong>{status.name}</strong> · {status.email}
            </p>
            <p style={{ margin: "6px 0 0" }}>
              Tu docente tiene que aprobar la solicitud. <strong>No cierres esta página:</strong> cuando la apruebe, entrás
              sola, sin hacer nada.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          style={{ marginTop: 16 }}
          onClick={async () => {
            await forgetAccessRequest();
            setStatus({ status: "none" });
          }}
        >
          Me equivoqué en el nombre o el mail
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="live-h1">Pedí acceso</h1>
      <p className="muted">
        Si no tenés cuenta de Google, dejá tu nombre y tu mail. Tu docente aprueba la solicitud en clase y entrás sin
        contraseña.
      </p>
      {status.status === "rejected" && (
        <div className="notice err" style={{ margin: "16px 0" }}>
          <strong>Tu solicitud no fue aprobada.</strong> Consultá con tu docente; si querés, podés enviarla de nuevo.
        </div>
      )}
      <form action={formAction} className="live-join">
        <input type="hidden" name="course" value={courseSlug} />
        <label className="field">
          <span className="live-join-label">Nombre y apellido (así vas a figurar)</span>
          <input name="name" className="input" autoComplete="name" maxLength={80} required minLength={2} />
        </label>
        <label className="field">
          <span className="live-join-label">Tu mail</span>
          <input name="email" type="email" inputMode="email" className="input" autoComplete="email" maxLength={254} required />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "Enviando…" : "Pedir acceso"}
        </button>
        {state.error && <p className="live-msg err">{state.error}</p>}
      </form>
    </>
  );
}
