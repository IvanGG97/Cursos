-- =====================================================================
-- Participación de los alumnos
--   · class_progress: hasta dónde vio cada persona cada clase
--   · evaluation_attempts: intentos de evaluación (los escribe SOLO el servidor)
--   · live_sessions / live_answers / live_attendance: clase en vivo
--     (código + QR, asistencia y quiz en vivo desde el celular)
--   · survey_responses: encuesta de satisfacción
-- Correr una sola vez, después de 20261002000000_course_access.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Progreso
-- ---------------------------------------------------------------------
create table public.class_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  last_slide int not null default 1 check (last_slide > 0),
  max_slide int not null default 1 check (max_slide > 0),
  total_slides int not null check (total_slides > 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_slug, class_num)
);
create index class_progress_course_idx on public.class_progress (course_slug, class_num);

alter table public.class_progress enable row level security;
grant select, insert, update on public.class_progress to authenticated;

create policy "class_progress: ver propio o admin" on public.class_progress
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "class_progress: crear propio" on public.class_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy "class_progress: actualizar propio" on public.class_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Evaluaciones
-- Las preguntas y respuestas correctas viven en el repo. El servidor corrige y
-- guarda el intento con la clave secreta: los usuarios NO pueden insertar.
-- ---------------------------------------------------------------------
create table public.evaluation_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  evaluation_id text not null,
  score int not null check (score >= 0),
  total int not null check (total > 0),
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb, -- { preguntaId: [índices elegidos] }
  created_at timestamptz not null default now()
);
create index evaluation_attempts_user_idx on public.evaluation_attempts (user_id, course_slug, class_num);
create index evaluation_attempts_course_idx on public.evaluation_attempts (course_slug, class_num);

alter table public.evaluation_attempts enable row level security;
grant select on public.evaluation_attempts to authenticated;
-- Sin grant de insert/update/delete: solo el rol de servicio (clave secreta) escribe.

create policy "evaluation_attempts: ver propios o admin" on public.evaluation_attempts
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- Clase en vivo: asistencia + quiz desde el celular
-- ---------------------------------------------------------------------
create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null check (code ~ '^[0-9]{4}$'),
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  class_num int not null check (class_num > 0),
  status text not null default 'open' check (status in ('open', 'closed')),
  current_slide int not null default 1, -- base 1, igual que el hash del visor
  revealed boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
-- Un código no se repite entre sesiones abiertas.
create unique index live_sessions_open_code_idx on public.live_sessions (code) where status = 'open';
create index live_sessions_course_idx on public.live_sessions (course_slug, class_num, created_at desc);

create table public.live_attendance (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table public.live_answers (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  slide int not null check (slide > 0),
  participant_id text not null check (length(participant_id) between 8 and 64), -- usuario o anónimo (id del dispositivo)
  user_id uuid references public.profiles (id) on delete set null,
  choices int[] not null check (cardinality(choices) between 1 and 10),
  created_at timestamptz not null default now(),
  primary key (session_id, slide, participant_id)
);

alter table public.live_sessions enable row level security;
alter table public.live_attendance enable row level security;
alter table public.live_answers enable row level security;

grant select on public.live_sessions to anon, authenticated;
grant insert, update, delete on public.live_sessions to authenticated;
grant select on public.live_attendance to authenticated;
grant insert on public.live_answers to anon, authenticated;
grant select on public.live_answers to authenticated;

-- Sesiones abiertas: las ve cualquiera (los alumnos siguen la diapositiva actual en tiempo real).
create policy "live_sessions: ver abiertas o admin" on public.live_sessions
  for select to anon, authenticated using (status = 'open' or public.is_admin());
create policy "live_sessions: admin" on public.live_sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "live_attendance: ver propia o admin" on public.live_attendance
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- Respuestas: cualquiera puede responder mientras la sesión esté abierta (también sin cuenta).
create policy "live_answers: responder en sesión abierta" on public.live_answers
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.live_sessions s where s.id = session_id and s.status = 'open')
    and (user_id is null or user_id = auth.uid())
  );
create policy "live_answers: admin lee" on public.live_answers
  for select to authenticated using (public.is_admin());

-- Unirse con el código: devuelve la sesión y, si hay sesión iniciada, registra la asistencia.
create function public.join_live(p_code text)
returns table (session_id uuid, course_slug text, class_num int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.live_sessions;
begin
  select * into v from public.live_sessions s
  where s.code = trim(p_code) and s.status = 'open'
  limit 1;

  if v.id is null then
    raise exception 'Código inválido o clase terminada.' using errcode = 'P0002';
  end if;

  if auth.uid() is not null and exists (select 1 from public.profiles where id = auth.uid()) then
    insert into public.live_attendance (session_id, user_id)
    values (v.id, auth.uid())
    on conflict do nothing;
  end if;

  return query select v.id, v.course_slug, v.class_num;
end;
$$;
grant execute on function public.join_live(text) to anon, authenticated;

-- Tiempo real: los alumnos escuchan cambios de la sesión; el presentador, las respuestas.
alter publication supabase_realtime add table public.live_sessions, public.live_answers, public.live_attendance;

-- ---------------------------------------------------------------------
-- Encuesta de satisfacción (una respuesta por persona y encuesta)
-- ---------------------------------------------------------------------
create table public.survey_responses (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_slug text not null references public.courses (slug) on delete cascade on update cascade,
  survey_id text not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, course_slug, survey_id)
);

alter table public.survey_responses enable row level security;
grant select, insert on public.survey_responses to authenticated;

create policy "survey_responses: ver propia o admin" on public.survey_responses
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "survey_responses: responder propia" on public.survey_responses
  for insert to authenticated with check (user_id = auth.uid());
