-- =====================================================================
-- Estilo de las diapositivas de cada clase (fuentes y colores), elegido desde el editor de la clase.
--   · style: id de un estilo de src/content/styles.ts ("original", "diario", "pizarra"...).
--   · Sin fila para una clase = el estilo que diga su archivo de contenido (o "original").
--   · Se aplica al instante (no pasa por borrador ni publicar): no cambia textos ni preguntas.
-- La tabla la usa SOLO el servidor (clave secreta, después de verificar que es admin).
-- Correr una sola vez, después de 20261010000000_class_content.sql.
-- =====================================================================

create table public.class_styles (
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  style text not null check (style ~ '^[a-z0-9-]{1,40}$'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (course_slug, class_num)
);

alter table public.class_styles enable row level security;
revoke all on public.class_styles from anon, authenticated;
