"use client";

import { useEffect, useRef, useState } from "react";

// Quién inició sesión, en la cabecera: la foto de perfil de Google (o la inicial, si no hay foto)
// y el nombre de la cuenta. En el celular se ve solo la foto.

export function UserBadge({ name, avatar }: { name: string; avatar: string | null }) {
  const [broken, setBroken] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // Si la foto falló antes de que la página terminara de cargar, el aviso de error ya pasó: revisarla.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, []);
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span className="who" title={name}>
      {avatar && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element -- foto externa de Google, chica
        <img
          ref={img}
          src={avatar}
          alt=""
          className="who-pic"
          width={30}
          height={30}
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="who-pic who-initial" aria-hidden="true">
          {initial}
        </span>
      )}
      <span className="who-name">{name}</span>
    </span>
  );
}
