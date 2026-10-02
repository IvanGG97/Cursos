"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="notice err">
      <p style={{ marginTop: 0 }}>
        <strong>No se pudo cargar esta sección del panel.</strong> Puede ser un problema de conexión o que falte correr
        la última migración de la base (ver README).
      </p>
      <button type="button" className="btn" onClick={reset}>
        Reintentar
      </button>
    </div>
  );
}
