-- KOREAN SPELLER MULTI-USER / ROLES / AI ACCESS / USER-OWNED DATA
-- Run once in Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active' check (status in ('active','disabled')),
  ai_tutor_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Existing Auth users get profiles. The first admin is established with claim_first_admin().
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update set email = excluded.email;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
  );
$$;

grant execute on function public.is_admin() to authenticated;

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

  -- Prevent two first-time logins from claiming admin simultaneously.
  perform pg_advisory_xact_lock(hashtext('korean_speller_first_admin'));

  select exists(select 1 from public.profiles where role='admin' and status='active') into v_admin_exists;
  if v_admin_exists then
    return jsonb_build_object('claimed', false, 'reason', 'admin_exists');
  end if;

  select exists(select 1 from public.profiles where id=v_user) into v_profile_exists;
  if not v_profile_exists then
    insert into public.profiles (id, email, role, status)
    select id, email, 'admin', 'active' from auth.users where id=v_user;
  else
    update public.profiles
    set role='admin', status='active', updated_at=now()
    where id=v_user;
  end if;

  return jsonb_build_object('claimed', true);
end;
$$;

grant execute on function public.claim_first_admin() to authenticated;

-- Keep profiles synced for accounts created by Supabase Auth.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles for select to authenticated
using (public.is_admin());

-- User-owned vocabulary.
alter table public.vocabularies add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.text_vocabs add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Old records are intentionally left unowned until the existing admin claims them.
-- This avoids accidentally assigning your existing library to the wrong account.

alter table public.vocabularies alter column user_id set default auth.uid();
alter table public.text_vocabs alter column user_id set default auth.uid();

-- Replace existing policies so users only see/change their own vocabulary.

-- Explicit policy cleanup per table (covers common previous policy names).
do $$
declare r record;
begin
  for r in select policyname from pg_policies where schemaname='public' and tablename='vocabularies' loop
    execute format('drop policy if exists %I on public.vocabularies', r.policyname);
  end loop;
  for r in select policyname from pg_policies where schemaname='public' and tablename='text_vocabs' loop
    execute format('drop policy if exists %I on public.text_vocabs', r.policyname);
  end loop;
end $$;

alter table public.vocabularies enable row level security;
alter table public.text_vocabs enable row level security;

create policy "Users read own image vocabulary" on public.vocabularies
for select to authenticated using (user_id = auth.uid());
create policy "Users insert own image vocabulary" on public.vocabularies
for insert to authenticated with check (user_id = auth.uid());
create policy "Users update own image vocabulary" on public.vocabularies
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own image vocabulary" on public.vocabularies
for delete to authenticated using (user_id = auth.uid());

create policy "Users read own text vocabulary" on public.text_vocabs
for select to authenticated using (user_id = auth.uid());
create policy "Users insert own text vocabulary" on public.text_vocabs
for insert to authenticated with check (user_id = auth.uid());
create policy "Users update own text vocabulary" on public.text_vocabs
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own text vocabulary" on public.text_vocabs
for delete to authenticated using (user_id = auth.uid());

-- Claim existing unowned vocabulary for the current admin account.
create or replace function public.claim_unowned_vocabulary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_image integer := 0;
  v_text integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  update public.vocabularies set user_id=v_user where user_id is null;
  get diagnostics v_image = row_count;
  update public.text_vocabs set user_id=v_user where user_id is null;
  get diagnostics v_text = row_count;
  return jsonb_build_object('image_claimed',v_image,'text_claimed',v_text);
end;
$$;

grant execute on function public.claim_unowned_vocabulary() to authenticated;

-- Category helpers must only return the signed-in user's categories.
create or replace function public.get_vocab_categories()
returns table(category text)
language sql
stable
security definer
set search_path = public
as $$
  select distinct trim(v.category)::text
  from public.vocabularies v
  where v.user_id = auth.uid() and v.category is not null and trim(v.category) <> ''
  order by 1;
$$;

create or replace function public.get_text_vocab_categories()
returns table(category text)
language sql
stable
security definer
set search_path = public
as $$
  select distinct trim(v.category)::text
  from public.text_vocabs v
  where v.user_id = auth.uid() and v.category is not null and trim(v.category) <> ''
  order by 1;
$$;

grant execute on function public.get_vocab_categories() to authenticated;
grant execute on function public.get_text_vocab_categories() to authenticated;

-- AI conversations: private to each user.
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id bigint generated by default as identity primary key,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  provider text,
  created_at timestamptz not null default now()
);

create index if not exists ai_conversations_user_updated_idx on public.ai_conversations(user_id, updated_at desc);
create index if not exists ai_messages_conversation_created_idx on public.ai_messages(conversation_id, created_at);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

grant select, insert, update, delete on public.ai_conversations to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;

drop policy if exists "Users manage own AI conversations" on public.ai_conversations;
create policy "Users manage own AI conversations" on public.ai_conversations
for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists "Users manage own AI messages" on public.ai_messages;
create policy "Users manage own AI messages" on public.ai_messages
for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- AI access is controlled by admin.
-- Existing users default to disabled; admin enables it per account.

-- Prevent public role changes through direct SQL/API by not granting UPDATE on profiles.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
