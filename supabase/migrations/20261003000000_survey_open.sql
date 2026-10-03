-- =====================================================================
-- Encuesta final: habilitar / deshabilitar (y programar) desde el panel.
-- Igual que la liberación de clases: habilitada sí/no + una fecha y hora opcional a partir de la
-- cual se abre sola. Arranca CERRADA: se habilita cuando el admin quiera (por lo general, el
-- último día). Mientras está cerrada, la base rechaza respuestas nuevas.
-- Correr una sola vez, después de 20261002050000_media_annotations.sql.
-- =====================================================================

alter table public.courses
  add column survey_open boolean not null default false,
  add column survey_open_from timestamptz;

-- ¿Se puede responder la encuesta de este curso ahora?
create function public.survey_is_open(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select c.survey_open and (c.survey_open_from is null or c.survey_open_from <= now())
     from public.courses c where c.slug = p_slug),
    false
  );
$$;

revoke execute on function public.survey_is_open(text) from public;
grant execute on function public.survey_is_open(text) to anon, authenticated;

-- Responder: solo la propia respuesta y solo con la encuesta abierta.
drop policy "survey_responses: responder propia" on public.survey_responses;
create policy "survey_responses: responder propia con la encuesta abierta" on public.survey_responses
  for insert to authenticated
  with check (user_id = auth.uid() and public.survey_is_open(course_slug));
