
-- =========================================================
-- KOREAN SPELLER - AI TUTOR SETTINGS
-- Requires Supabase Vault (pgsodium/vault), available in
-- Supabase projects that have Vault enabled.
-- Run this in Supabase SQL Editor.
-- =========================================================

create table if not exists public.ai_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'openai'
    check (provider in ('openai', 'gemini', 'anthropic')),
  secret_id uuid not null,
  updated_at timestamptz not null default now()
);

alter table public.ai_settings enable row level security;

drop policy if exists "Users can view their own AI settings" on public.ai_settings;
create policy "Users can view their own AI settings"
on public.ai_settings
for select
to authenticated
using ((select auth.uid()) = user_id);

-- The API key itself is NEVER exposed by this table.
-- Users save/change/remove it through security-definer functions.

create or replace function public.save_ai_settings(
  p_provider text,
  p_api_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_old_secret uuid;
  v_new_secret uuid;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  if p_provider not in ('openai', 'gemini', 'anthropic') then
    raise exception 'Unsupported AI provider';
  end if;

  if p_api_key is null or length(trim(p_api_key)) < 10 then
    raise exception 'Please enter a valid API key';
  end if;

  select secret_id into v_old_secret
  from public.ai_settings
  where user_id = v_user;

  v_new_secret := vault.create_secret(
    trim(p_api_key),
    'korean-speller-' || v_user::text || '-' || extract(epoch from now())::bigint,
    'Korean Speller AI API key'
  );

  insert into public.ai_settings (user_id, provider, secret_id, updated_at)
  values (v_user, p_provider, v_new_secret, now())
  on conflict (user_id) do update
    set provider = excluded.provider,
        secret_id = excluded.secret_id,
        updated_at = now();

  if v_old_secret is not null then
    perform vault.delete_secret(v_old_secret);
  end if;

  return jsonb_build_object(
    'provider', p_provider,
    'configured', true
  );
end;
$$;

create or replace function public.remove_ai_settings()
returns jsonb
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_secret uuid;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  select secret_id into v_secret
  from public.ai_settings
  where user_id = v_user;

  delete from public.ai_settings where user_id = v_user;

  if v_secret is not null then
    perform vault.delete_secret(v_secret);
  end if;

  return jsonb_build_object('configured', false);
end;
$$;

grant execute on function public.save_ai_settings(text, text) to authenticated;
grant execute on function public.remove_ai_settings() to authenticated;

-- Never expose Vault internals to browser roles.
revoke all on public.ai_settings from anon;
grant select on public.ai_settings to authenticated;
