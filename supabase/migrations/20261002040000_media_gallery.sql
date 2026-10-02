-- =====================================================================
-- Galerías: cada lugar de imagen puede tener VARIAS imágenes/GIFs/videos, en orden.
-- Lo que ya estaba cargado queda como primera imagen (position 0).
-- Correr una sola vez, después de 20261002030000_media.sql.
-- =====================================================================

alter table public.slide_media add column id uuid not null default gen_random_uuid();
alter table public.slide_media add column position int not null default 0;

-- La clave pasa a ser el id de cada imagen (antes: una sola por lugar).
alter table public.slide_media drop constraint slide_media_pkey;
alter table public.slide_media add primary key (id);
create index slide_media_slot_idx on public.slide_media (course_slug, media_id, position);
