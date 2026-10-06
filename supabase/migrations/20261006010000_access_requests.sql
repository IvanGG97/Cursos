-- =====================================================================
-- Solicitudes de admisión (para quien no tiene cuenta de Google), presencial y manual:
--   1. la persona deja nombre y mail en "Pedí acceso" y su pantalla queda esperando;
--   2. el admin la aprueba en el panel (pestaña "Solicitudes de admisión");
--   3. se crea la cuenta, queda inscripta y la pantalla que esperaba entra sola (sin mail).
--
-- La pantalla que espera se identifica con un código secreto aleatorio (en una cookie de ese
-- dispositivo); acá se guarda solo su hash. La tabla la usa SOLO el servidor (clave secreta):
-- ni anon ni authenticated tienen permisos (tiene mails y esos hashes).
-- Correr una sola vez, después de 20261006000000_evaluation_settings.sql.
-- =====================================================================

create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 80),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  course_slug text references public.courses (slug) on delete set null on update cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  token_hash text not null unique,
  user_id uuid references auth.users (id) on delete set null,   -- la cuenta creada al aprobar
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users (id) on delete set null,
  claimed_at timestamptz                                          -- cuándo entró la pantalla que esperaba
);
create index access_requests_status_idx on public.access_requests (status, created_at desc);
create index access_requests_email_idx on public.access_requests (lower(email));

alter table public.access_requests enable row level security;
revoke all on public.access_requests from anon, authenticated;

-- Inscripciones: nuevo origen "request" (aprobada desde una solicitud de admisión).
alter table public.enrollments drop constraint if exists enrollments_source_check;
alter table public.enrollments
  add constraint enrollments_source_check check (source in ('code', 'admin', 'invite', 'request'));
