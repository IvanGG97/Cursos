-- =====================================================================
-- Imágenes, GIFs y videos cortos de las diapositivas, subidos desde el panel.
-- El texto sigue en el repo; acá solo se asocia un archivo a cada lugar (Media.id).
-- Correr una sola vez, después de 20261002020000_live_game.sql.
-- =====================================================================

-- Espacio de archivos: lectura pública (se ven en las clases), escritura solo admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  15728640, -- 15 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

create policy "media: admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin reemplaza" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media: admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- Qué archivo va en cada lugar.
create table public.slide_media (
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  media_id text not null check (media_id ~ '^[a-z0-9-]{2,60}$'),
  path text not null, -- ruta dentro del bucket "media"
  mime text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (course_slug, media_id)
);

alter table public.slide_media enable row level security;
grant select on public.slide_media to anon, authenticated;
grant insert, update, delete on public.slide_media to authenticated;

create policy "slide_media: ver" on public.slide_media for select to anon, authenticated using (true);
create policy "slide_media: admin" on public.slide_media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
