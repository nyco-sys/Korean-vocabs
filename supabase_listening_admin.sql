-- Listening admin permissions. Run after supabase_listening.sql.
alter table public.listening_questions enable row level security;
revoke all on table public.listening_questions from anon;
grant select on table public.listening_questions to authenticated;
grant insert, update, delete on table public.listening_questions to authenticated;
drop policy if exists "Authenticated users can read active listening questions" on public.listening_questions;
create policy "Authenticated users can read active listening questions" on public.listening_questions for select to authenticated using (is_active = true or public.is_admin());
drop policy if exists "Admins manage listening questions" on public.listening_questions;
create policy "Admins manage listening questions" on public.listening_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
