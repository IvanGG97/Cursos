"use client";

import { useActionState } from "react";
import { joinCourse, type JoinState } from "./actions";

export function JoinForm() {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinCourse, {});

  return (
    <form action={action} className="notice" style={{ marginBottom: 32 }}>
      <p style={{ marginTop: 0 }}>
        <strong>Inscribite al curso.</strong> Escribí el código que te dio tu docente para ver las clases.
      </p>
      <div className="form-row">
        <input
          name="code"
          className="input mono"
          placeholder="CÓDIGO"
          autoComplete="off"
          autoCapitalize="characters"
          aria-label="Código de inscripción"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Verificando…" : "Inscribirme"}
        </button>
      </div>
      {state.error && <p style={{ color: "var(--bad)", marginBottom: 0 }}>{state.error}</p>}
    </form>
  );
}
