-- =====================================================================
-- Editor de clases desde el panel.
--   · class_versions: cada "Publicar" guarda una versión nueva (historial). La versión vigente de
--     una clase es la última. slides = null significa "volver a la versión original del repo".
--     Sin filas para una clase = se usa la del repo.
--   · class_drafts: el borrador en curso de cada clase (lo que se edita antes de publicar).
--   · live_sessions.content_version: con qué versión se dio cada clase en vivo, para que sus
--     resultados (que se guardan por número de diapositiva) sigan apuntando a las preguntas correctas
--     aunque después la clase se edite. null = la versión del repo.
-- Las dos tablas las usa SOLO el servidor (clave secreta, después de verificar que es admin):
-- el borrador no lo puede ver nadie más.
-- Correr una sola vez, después de 20261006010000_access_requests.sql.
-- =====================================================================

create table public.class_versions (
  id bigint generated always as identity primary key,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  slides jsonb,              -- null = la versión original del repo
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);
create index class_versions_class_idx on public.class_versions (course_slug, class_num, id desc);

create table public.class_drafts (
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  slides jsonb not null,
  base_version bigint references public.class_versions (id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (course_slug, class_num)
);

alter table public.class_versions enable row level security;
alter table public.class_drafts enable row level security;
revoke all on public.class_versions from anon, authenticated;
revoke all on public.class_drafts from anon, authenticated;

alter table public.live_sessions
  add column content_version bigint references public.class_versions (id) on delete set null;
