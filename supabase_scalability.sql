-- Run this once in Supabase SQL Editor.
-- These read-only helper functions return categories without downloading
-- every vocabulary row to the browser.

create or replace function public.get_vocab_categories()
returns table(category text)
language sql
security definer
set search_path = public
as $$
  select distinct trim(v.category)::text as category
  from public.vocabularies v
  where v.category is not null
    and trim(v.category) <> ''
  order by category;
$$;

create or replace function public.get_text_vocab_categories()
returns table(category text)
language sql
security definer
set search_path = public
as $$
  select distinct trim(v.category)::text as category
  from public.text_vocabs v
  where v.category is not null
    and trim(v.category) <> ''
  order by category;
$$;

grant execute on function public.get_vocab_categories() to anon, authenticated;
grant execute on function public.get_text_vocab_categories() to anon, authenticated;
