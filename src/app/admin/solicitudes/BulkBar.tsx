"use client";

import { useEffect, useState } from "react";
import { bulkAccessRequests } from "../actions";
import { ActionForm, ConfirmSubmit, Submit } from "../_ui";

export const BULK_FORM = "bulk-requests";
const SELECTOR = `input[name="ids"][form="${BULK_FORM}"]`;

/**
 * Barra para resolver varias solicitudes a la vez: "Seleccionar todas", curso y Aprobar / Rechazar.
 * Las casillas de cada fila pertenecen a este formulario (atributo form), aunque estén en la lista.
 */
export function BulkBar({ courses, defaultCourse }: { courses: { slug: string; title: string }[]; defaultCourse: string }) {
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(0);

  // Contar las casillas (y las marcadas). La lista se refresca sola: se vuelve a contar cada vez.
  useEffect(() => {
    const count = () => {
      const boxes = [...document.querySelectorAll<HTMLInputElement>(SELECTOR)];
      setTotal(boxes.length);
      setSelected(boxes.filter((b) => b.checked).length);
    };
    count();
    document.addEventListener("change", count);
    const obs = new MutationObserver(count);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("change", count);
      obs.disconnect();
    };
  }, []);

  const toggleAll = (checked: boolean) => {
    document.querySelectorAll<HTMLInputElement>(SELECTOR).forEach((b) => (b.checked = checked));
    setSelected(checked ? total : 0);
  };

  if (total === 0) return null;
  const all = selected === total;

  return (
    <ActionForm action={bulkAccessRequests} id={BULK_FORM} className="bulk-bar">
      <label className="bulk-all">
        <input
          type="checkbox"
          checked={all}
          ref={(el) => {
            if (el) el.indeterminate = selected > 0 && !all;
          }}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        <span>{all ? "Deseleccionar todas" : `Seleccionar todas (${total})`}</span>
      </label>
      <span className="bulk-count muted">{selected} seleccionada(s)</span>
      <div className="bulk-actions">
        <select name="course" defaultValue={defaultCourse} className="input" aria-label="Inscribir en">
          <option value="__own">Inscribir en el curso que pidió cada una</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>Inscribir en {c.title}</option>
          ))}
          <option value="">Sin inscribir en un curso</option>
        </select>
        {selected > 0 ? (
          <>
            <Submit small variant="primary" name="op" value="approve">
              Aprobar seleccionadas ({selected})
            </Submit>
            <ConfirmSubmit name="op" value="reject" confirm={`Sí, rechazar ${selected}`}>
              Rechazar seleccionadas
            </ConfirmSubmit>
          </>
        ) : (
          <span className="hint" style={{ margin: 0 }}>Marcá las solicitudes (o «Seleccionar todas») para aprobarlas juntas.</span>
        )}
      </div>
    </ActionForm>
  );
}
