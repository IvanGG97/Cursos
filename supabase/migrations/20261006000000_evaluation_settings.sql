-- =====================================================================
-- Evaluaciones administrables desde el panel, por clase:
--   · habilitar / deshabilitar (y programar fecha y hora), igual que la encuesta final;
--   · preguntas editadas en el panel (reemplazan a las del repo; se puede volver al original).
-- Sin fila para una clase = evaluación DESHABILITADA y con las preguntas originales del repo.
--
-- `content` tiene las respuestas correctas: los alumnos NO pueden leer esta tabla (ni anon ni
-- authenticated). La lee y la escribe solo el servidor (clave secreta), después de verificar
-- que quien edita es admin. Así las correctas nunca llegan al navegador antes de entregar.
-- Correr una sola vez, después de 20261003000000_survey_open.sql.
-- =====================================================================

create table public.evaluation_settings (
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  open boolean not null default false,
  open_from timestamptz,
  content jsonb, -- null = preguntas originales del repo
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (course_slug, class_num)
);

alter table public.evaluation_settings enable row level security;
-- Sin grants para anon/authenticated y sin políticas: solo el rol de servicio la usa.
revoke all on public.evaluation_settings from anon, authenticated;
