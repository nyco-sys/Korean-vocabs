-- Korean Speller Security Hardening v1
-- Run AFTER the existing multi-user migration. Safe/idempotent.

-- 1) Only the original bootstrap state can claim the first admin.
--    A disabled/deleted active-admin state must NOT let an arbitrary user self-promote.
create or replace function public.claim_first_admin()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_admin_exists boolean;
  v_profile_exists boolean;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  perform pg_advisory_xact_lock(hashtext('korean_speller_first_admin'));

  -- If ANY admin profile already exists, bootstrap is permanently closed.
  select exists(select 1 from public.profiles where role = 'admin') into v_admin_exists;
  if v_admin_exists then
    return jsonb_build_object('claimed', false, 'reason', 'admin_exists');
  end if;

  select exists(select 1 from public.profiles where id = v_user) into v_profile_exists;
  if v_profile_exists then
    update public.profiles
    set role = 'admin', status = 'active', updated_at = now()
    where id = v_user;
  else
    insert into public.profiles (id, email, role, status)
    select id, email, 'admin', 'active'
    from auth.users
    where id = v_user;
  end if;

  return jsonb_build_object('claimed', true);
end;
$$;
revoke all on function public.claim_first_admin() from public;
grant execute on function public.claim_first_admin() to authenticated;

-- 2) Make the admin predicate non-public and explicitly expose only to authenticated callers.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 3) Ensure profile data cannot be written from the browser role.
revoke all on table public.profiles from anon;
revoke insert, update, delete on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;

-- 4) Re-assert RLS on all user-owned tables used by the app.
alter table public.vocabularies enable row level security;
alter table public.text_vocabs enable row level security;
alter table public.study_mistakes enable row level security;
alter table public.study_activity enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

-- 5) Explicitly block anonymous access to user-owned data.
revoke all on table public.vocabularies from anon;
revoke all on table public.text_vocabs from anon;
revoke all on table public.study_mistakes from anon;
revoke all on table public.study_activity from anon;
revoke all on table public.ai_conversations from anon;
revoke all on table public.ai_messages from anon;

-- 6) Ensure only authenticated users can use the user-owned tables.
grant select, insert, update, delete on table public.vocabularies to authenticated;
grant select, insert, update, delete on table public.text_vocabs to authenticated;
grant select, delete on table public.study_mistakes to authenticated;
grant select, insert on table public.study_activity to authenticated;
grant select, insert, update, delete on table public.ai_conversations to authenticated;
grant select, insert, update, delete on table public.ai_messages to authenticated;

-- 7) Ensure the category helper functions cannot be called anonymously.
revoke all on function public.get_vocab_categories() from public;
revoke all on function public.get_text_vocab_categories() from public;
grant execute on function public.get_vocab_categories() to authenticated;
grant execute on function public.get_text_vocab_categories() to authenticated;

-- 8) The legacy vocabulary-claim RPC must remain authenticated-only.
revoke all on function public.claim_unowned_vocabulary() from public;
grant execute on function public.claim_unowned_vocabulary() to authenticated;

-- 9) Statistics/mistake RPCs are authenticated-only.
revoke all on function public.record_study_activity(text,text,text,text,text,text,text,boolean) from public;
grant execute on function public.record_study_activity(text,text,text,text,text,text,text,boolean) to authenticated;
revoke all on function public.record_study_mistake(text,text,text,text,text,text) from public;
grant execute on function public.record_study_mistake(text,text,text,text,text,text) to authenticated;

-- 10) Defense-in-depth: ensure no row can be inserted without a real owner.
alter table public.vocabularies alter column user_id set default auth.uid();
alter table public.text_vocabs alter column user_id set default auth.uid();

-- Verification queries (run separately if desired):
-- select tablename, policyname, cmd, roles, qual, with_check from pg_policies where schemaname='public';
-- select routine_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema='public';
