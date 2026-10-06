"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/admin";

type ServerAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/**
 * Formulario de una acción del panel: muestra el resultado ("Guardado" o el error) debajo.
 * `fields` son los campos ocultos (slug, user, num...).
 */
export function ActionForm({
  action,
  fields = {},
  children,
  className,
  inline = false,
}: {
  action: ServerAction;
  fields?: Record<string, string | number>;
  children: ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const [shown, setShown] = useState<ActionResult>({});

  // El mensaje de éxito se va solo; el de error queda hasta el próximo intento.
  useEffect(() => {
    setShown(state);
    if (state.ok) {
      const t = setTimeout(() => setShown({}), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className={`${inline ? "aform-inline" : "aform"} ${className ?? ""}`}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
      {(shown.ok || shown.error) && (
        <p role="status" className={`aform-msg ${shown.error ? "err" : "ok"}`}>
          {shown.error ?? shown.ok}
        </p>
      )}
    </form>
  );
}

/** Botón de envío con estado "Guardando…". `name`/`value` para formularios con varios botones. */
export function Submit({
  children,
  variant = "",
  name,
  value,
  small = false,
}: {
  children: ReactNode;
  variant?: "" | "primary" | "danger";
  name?: string;
  value?: string;
  small?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`btn ${small ? "btn-sm" : ""} ${variant ? `btn-${variant}` : ""}`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

/** Acción delicada: primer toque pide confirmación, el segundo ejecuta. */
export function ConfirmSubmit({ children, confirm, small = true }: { children: ReactNode; confirm: string; small?: boolean }) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);

  if (!armed) {
    return (
      <button type="button" className={`btn ${small ? "btn-sm" : ""}`} onClick={() => setArmed(true)}>
        {children}
      </button>
    );
  }
  return (
    <button type="submit" disabled={pending} className={`btn btn-danger ${small ? "btn-sm" : ""}`}>
      {pending ? "Guardando…" : confirm}
    </button>
  );
}

const TABS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/personas", label: "Personas" },
  { href: "/admin/solicitudes", label: "Solicitudes de admisión" },
  { href: "/admin/actividad", label: "Actividad" },
];

/** `pending`: solicitudes de admisión sin resolver (se muestra como número en la pestaña). */
export function AdminNav({ pending = 0 }: { pending?: number }) {
  const path = usePathname();
  return (
    <nav className="admin-nav" aria-label="Secciones del panel">
      {TABS.map((t) => {
        const active = t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
            {t.label}
            {t.href === "/admin/solicitudes" && pending > 0 && (
              <span className="nav-badge" aria-label={`${pending} pendiente(s)`}>{pending}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}


/** Refresca la página cada `ms` (lista de solicitudes pendientes: aparecen solas en clase). */
export function AutoRefresh({ ms = 5000 }: { ms?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => {
      // No refrescar mientras se está eligiendo algo (un select abierto, un campo con foco).
      const el = document.activeElement;
      if (el && /^(SELECT|INPUT|TEXTAREA)$/.test(el.tagName)) return;
      router.refresh();
    }, ms);
    return () => clearInterval(t);
  }, [ms, router]);
  return null;
}
