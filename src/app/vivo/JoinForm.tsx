"use client";

import { useActionState } from "react";
import { joinLive, type JoinState } from "./actions";

export function JoinLiveForm({ initialCode = "", initialError }: { initialCode?: string; initialError?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinLive, { error: initialError });

  return (
    <form action={action} className="live-join">
      <label htmlFor="code" className="live-join-label">Código de la clase</label>
      <input
        id="code"
        name="code"
        className="input live-code-input"
        inputMode="numeric"
        pattern="[0-9]{4}"
        maxLength={4}
        autoComplete="one-time-code"
        placeholder="0000"
        defaultValue={initialCode}
        required
        autoFocus
      />
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Conectando…" : "Entrar a la clase"}
      </button>
      {state.error && <p className="live-msg err">{state.error}</p>}
    </form>
  );
}
