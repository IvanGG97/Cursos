-- =====================================================================
-- Modo de acceso de un curso
--   enrolled → hace falta cuenta + inscripción (lo de siempre)
--   public   → "Libre": cualquiera ve las clases liberadas, sin registrarse
-- Solo tiene efecto con el curso publicado. Las clases ocultas siguen ocultas.
-- Correr una sola vez, después de 20261001020000_admin_panel.sql.
-- =====================================================================

alter table public.courses
  add column access text not null default 'enrolled' check (access in ('enrolled', 'public'));

-- La columna nueva es legible por todos (catálogo público), igual que el resto de courses;
-- solo el admin la modifica (policy "courses: admin" ya existente).
