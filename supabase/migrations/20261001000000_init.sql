-- =====================================================================
-- Plataforma de cursos — esquema inicial
--
-- El CONTENIDO de los cursos vive en el repo (src/content). La base guarda
-- solo lo que cambia en vivo: qué cursos están publicados, qué clases están
-- liberadas (y desde cuándo), quién está inscripto y los códigos de inscripción.
-- Los cursos se identifican por su slug y las clases por (slug, número).
-- =====================================================================

-- ---------- Perfiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- Crea el perfil automáticamente cuando alguien se registra.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ¿El usuario actual es admin? (security definer para no chocar con la RLS de profiles)
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Cursos ----------
create table public.courses (
  slug text primary key,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Código que el docente reparte para que los alumnos se inscriban.
-- Tabla aparte para que nunca sea legible por alumnos.
create table public.course_codes (
  course_slug text primary key references public.courses (slug) on delete cascade on update cascade,
  code text not null unique check (code = upper(code) and length(code) between 4 and 32)
);

-- Liberación de cada clase. Sin fila = clase oculta.
create table public.class_releases (
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  visible boolean not null default false,
  visible_from timestamptz,
  updated_at timestamptz not null default now(),
  primary key (course_slug, class_num)
);

-- ---------- Inscripciones ----------
create table public.enrollments (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  cohort text,
  created_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);
create index enrollments_course_idx on public.enrollments (course_slug);

-- Inscribirse con un código. Única vía de alta para alumnos.
create function public.join_course(p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slug text;
begin
  if auth.uid() is null then
    raise exception 'Tenés que iniciar sesión.' using errcode = '28000';
  end if;

  select cc.course_slug into v_slug
  from public.course_codes cc
  join public.courses c on c.slug = cc.course_slug
  where cc.code = upper(trim(p_code)) and c.published;

  if v_slug is null then
    raise exception 'Código inválido.' using errcode = 'P0002';
  end if;

  insert into public.enrollments (user_id, course_slug)
  values (auth.uid(), v_slug)
  on conflict do nothing;

  return v_slug;
end;
$$;

-- =====================================================================
-- Permisos de tabla (explícitos; la RLS de abajo restringe por fila)
-- =====================================================================
grant select on public.courses, public.class_releases to anon, authenticated;
grant select on public.profiles, public.enrollments, public.course_codes to authenticated;
grant insert, update, delete on public.courses, public.class_releases, public.course_codes, public.enrollments to authenticated;
grant execute on function public.join_course(text) to authenticated;
grant execute on function public.is_admin() to anon, authenticated; -- la usa la policy pública de courses
revoke execute on function public.join_course(text) from anon, public;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_codes enable row level security;
alter table public.class_releases enable row level security;
alter table public.enrollments enable row level security;

-- Perfiles: cada uno ve el suyo; el admin ve todos.
create policy "profiles: ver propio o admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles: editar propio" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Solo se puede editar el nombre: el rol no lo cambia nadie desde la app.
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;

-- Cursos: cualquiera ve los publicados (catálogo público); el admin ve y edita todo.
create policy "courses: ver publicados" on public.courses
  for select to anon, authenticated using (published or public.is_admin());
create policy "courses: admin" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Códigos: solo admin.
create policy "course_codes: admin" on public.course_codes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Liberaciones: el estado de las clases no es secreto (se muestra "Disponible desde...").
create policy "class_releases: ver" on public.class_releases
  for select to anon, authenticated using (true);
create policy "class_releases: admin" on public.class_releases
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Inscripciones: cada uno ve las suyas; el admin gestiona todas.
create policy "enrollments: ver propias o admin" on public.enrollments
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "enrollments: admin" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Datos iniciales
-- =====================================================================
insert into public.courses (slug, published) values ('ia-mi-nuevo-asistente', false);
insert into public.class_releases (course_slug, class_num, visible)
select 'ia-mi-nuevo-asistente', n, false from generate_series(1, 4) as n;
