-- =====================================================================
-- Clase en vivo estilo Kahoot: nombre de la partida, participantes con apodo,
-- inicio de cada pregunta (para puntuar por rapidez) y ranking.
-- Correr una sola vez, después de 20261002010000_engagement.sql.
-- =====================================================================

-- Nombre que elige el admin para identificar la partida (ej. "Comisión martes 16 hs").
alter table public.live_sessions add column title text check (length(title) <= 80);

-- Participantes con apodo (con o sin cuenta). participant_id = id de usuario o del dispositivo.
create table public.live_participants (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  participant_id text not null check (length(participant_id) between 8 and 64),
  user_id uuid references public.profiles (id) on delete set null,
  nickname text not null check (length(trim(nickname)) between 1 and 30),
  joined_at timestamptz not null default now(),
  primary key (session_id, participant_id)
);

-- Cuándo apareció cada pregunta en el proyector: base del puntaje por rapidez.
-- La hora la pone la base (no el navegador), igual que la de cada respuesta.
create table public.live_questions (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  slide int not null check (slide > 0),
  started_at timestamptz not null default now(),
  primary key (session_id, slide)
);

alter table public.live_participants enable row level security;
alter table public.live_questions enable row level security;

grant select, insert, update on public.live_participants to anon, authenticated;
grant select on public.live_questions to anon, authenticated;
grant insert on public.live_questions to authenticated;

-- Participantes: cualquiera se suma (o cambia su apodo) mientras la sesión esté abierta.
create policy "live_participants: sumarse en sesión abierta" on public.live_participants
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.live_sessions s where s.id = session_id and s.status = 'open')
    and (user_id is null or user_id = auth.uid())
  );
create policy "live_participants: cambiar apodo en sesión abierta" on public.live_participants
  for update to anon, authenticated
  using (exists (select 1 from public.live_sessions s where s.id = session_id and s.status = 'open'))
  with check (user_id is null or user_id = auth.uid());
-- Leer: el admin (ranking y resultados). Para el upsert del propio apodo alcanza con insert/update.
create policy "live_participants: admin lee" on public.live_participants
  for select to authenticated using (public.is_admin());
-- El upsert necesita poder "ver" la fila en conflicto: permitimos leer filas de sesiones abiertas.
create policy "live_participants: ver en sesión abierta" on public.live_participants
  for select to anon, authenticated
  using (exists (select 1 from public.live_sessions s where s.id = session_id and s.status = 'open'));

-- Preguntas: las ve cualquiera de una sesión abierta; las marca el admin al proyectarlas.
create policy "live_questions: ver" on public.live_questions
  for select to anon, authenticated
  using (public.is_admin() or exists (select 1 from public.live_sessions s where s.id = session_id and s.status = 'open'));
create policy "live_questions: admin" on public.live_questions
  for insert to authenticated with check (public.is_admin());

alter publication supabase_realtime add table public.live_participants, public.live_questions;
