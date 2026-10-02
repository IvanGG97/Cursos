-- =====================================================================
-- Panel de administración
--   · profiles: mail, estado (activa/suspendida) y último ingreso
--   · enrollments: estado (activa/suspendida) y origen
--   · enrollment_invites: inscripción anticipada por mail
--   · class_grants: acceso individual a una clase
--   · admin_audit: registro de acciones del admin
--   · funciones protegidas para cambiar rol/estado de una persona
-- Correr una sola vez, después de 20261001000000_init.sql.
-- =====================================================================

-- ---------- Perfiles ----------
alter table public.profiles
  add column email text,
  add column status text not null default 'active' check (status in ('active', 'blocked')),
  add column last_sign_in_at timestamptz;

update public.profiles p
set email = lower(u.email), last_sign_in_at = u.last_sign_in_at
from auth.users u
where u.id = p.id;

create index profiles_email_idx on public.profiles (email);

-- El admin tiene que estar activo para ser admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

-- ---------- Inscripciones ----------
alter table public.enrollments
  add column status text not null default 'active' check (status in ('active', 'suspended')),
  add column source text not null default 'code' check (source in ('code', 'admin', 'invite')),
  add column updated_at timestamptz not null default now();

-- Relación directa con profiles para poder traer nombre y mail en una sola consulta.
alter table public.enrollments
  add constraint enrollments_profile_fk foreign key (user_id) references public.profiles (id) on delete cascade;

-- Invitaciones: el admin carga mails; al registrarse, la persona queda inscripta sola.
create table public.enrollment_invites (
  email text not null check (email = lower(email)),
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  primary key (email, course_slug)
);

-- ---------- Acceso individual a clases ----------
create table public.class_grants (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  primary key (user_id, course_slug, class_num)
);
create index class_grants_course_idx on public.class_grants (course_slug);

-- ---------- Registro de actividad ----------
create table public.admin_audit (
  id bigint generated always as identity primary key,
  actor uuid references auth.users (id) on delete set null,
  action text not null,
  target text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index admin_audit_created_idx on public.admin_audit (created_at desc);

-- ---------- Altas y cambios de usuarios ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, last_sign_in_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    lower(new.email),
    new.last_sign_in_at
  );

  -- Invitaciones pendientes para este mail → inscripciones.
  insert into public.enrollments (user_id, course_slug, source)
  select new.id, i.course_slug, 'invite'
  from public.enrollment_invites i
  where i.email = lower(new.email)
  on conflict do nothing;

  delete from public.enrollment_invites where email = lower(new.email);
  return new;
end;
$$;

-- Mantener mail y último ingreso sincronizados.
create function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = lower(new.email),
      last_sign_in_at = new.last_sign_in_at,
      full_name = coalesce(full_name, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated
  after update of email, last_sign_in_at, raw_user_meta_data on auth.users
  for each row execute function public.handle_user_updated();

-- Inscribirse con código: no puede usarlo una cuenta suspendida, y no reactiva una inscripción suspendida.
create or replace function public.join_course(p_code text)
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

  if exists (select 1 from public.profiles where id = auth.uid() and status = 'blocked') then
    raise exception 'Cuenta suspendida.' using errcode = '42501';
  end if;

  select cc.course_slug into v_slug
  from public.course_codes cc
  join public.courses c on c.slug = cc.course_slug
  where cc.code = upper(trim(p_code)) and c.published;

  if v_slug is null then
    raise exception 'Código inválido.' using errcode = 'P0002';
  end if;

  insert into public.enrollments (user_id, course_slug, source)
  values (auth.uid(), v_slug, 'code')
  on conflict do nothing;

  return v_slug;
end;
$$;

-- ---------- Funciones del admin sobre personas ----------
-- El rol y el estado no se pueden editar por UPDATE directo (la RLS de profiles
-- deja a cada uno editar su fila); solo por estas funciones, que exigen admin.
create function public.admin_set_role(p_user uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo administradores.' using errcode = '42501';
  end if;
  if p_role not in ('student', 'admin') then
    raise exception 'Rol inválido.' using errcode = '22023';
  end if;
  if p_user = auth.uid() and p_role <> 'admin' then
    raise exception 'No podés quitarte el rol de admin a vos mismo.' using errcode = '42501';
  end if;
  update public.profiles set role = p_role where id = p_user;
end;
$$;

create function public.admin_set_status(p_user uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo administradores.' using errcode = '42501';
  end if;
  if p_status not in ('active', 'blocked') then
    raise exception 'Estado inválido.' using errcode = '22023';
  end if;
  if p_user = auth.uid() and p_status <> 'active' then
    raise exception 'No podés suspender tu propia cuenta.' using errcode = '42501';
  end if;
  update public.profiles set status = p_status where id = p_user;
end;
$$;

-- =====================================================================
-- Permisos y RLS de lo nuevo
-- =====================================================================
grant select, insert, update, delete on public.enrollment_invites, public.class_grants to authenticated;
grant select, insert on public.admin_audit to authenticated;
revoke execute on function public.admin_set_role(uuid, text), public.admin_set_status(uuid, text) from anon, public;
grant execute on function public.admin_set_role(uuid, text), public.admin_set_status(uuid, text) to authenticated;
-- Las columnas nuevas de profiles (email, status, last_sign_in_at) NO son editables por los usuarios:
-- sigue vigente el grant de update solo sobre full_name.

alter table public.enrollment_invites enable row level security;
alter table public.class_grants enable row level security;
alter table public.admin_audit enable row level security;

create policy "enrollment_invites: admin" on public.enrollment_invites
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "class_grants: ver propios o admin" on public.class_grants
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "class_grants: admin" on public.class_grants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_audit: admin lee" on public.admin_audit
  for select to authenticated using (public.is_admin());
create policy "admin_audit: admin escribe" on public.admin_audit
  for insert to authenticated with check (public.is_admin() and actor = auth.uid());
