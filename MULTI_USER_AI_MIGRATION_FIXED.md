# Multi-user + AI Tutor migration (fixed)

The previous multi-user SQL had a syntax error in `ai_messages` (duplicate `created_at`). That prevented the migration from creating `ai_conversations`, `ai_messages`, and `claim_unowned_vocabulary`, which caused the 404/500 errors.

## Run in Supabase SQL Editor

Run the entire `supabase_multiuser.sql` from this package.

It is designed with `create table if not exists` and `add column if not exists`, so it preserves existing vocabulary data.

After it succeeds, verify:

```sql
select * from public.ai_conversations limit 1;
select * from public.ai_messages limit 1;
select public.claim_unowned_vocabulary();
```

The last command must be run while signed in as the admin.

## Deploy the AI Tutor function

From the project folder:

```powershell
npx.cmd supabase functions deploy ai-tutor
```

Make sure the provider secrets are already configured.

## What changed in the UI

- After login, the first screen is now **Dashboard** (the existing Statistics view).
- Dashboard shows the user's own study statistics.
- Normal authenticated users see **Logout**.
- Logged-out users see **Sign In**, never Logout.
- AI Tutor remains hidden unless `ai_tutor_enabled = true` for that user.
- AI history is private per user.
