# Korean Speller — Multi-user setup

This update changes the app from one shared vocabulary library into user-owned accounts with admin-created users and private AI Tutor history.

## 1. Run the SQL

Open Supabase Dashboard → SQL Editor and run:

`supabase_multiuser.sql`

The migration:
- creates `profiles` with `user/admin`, active/disabled, and AI Tutor permission;
- adds `user_id` ownership to `vocabularies` and `text_vocabs`;
- replaces vocabulary policies with per-user RLS;
- makes categories user-specific;
- creates private `ai_conversations` and `ai_messages` tables;
- keeps mistakes/statistics private through their existing `user_id` policies;
- includes a one-time admin claim for the existing account and existing unowned vocabulary.

## 2. Disable public sign-up

In Supabase Dashboard:

Authentication → Providers → Email → turn **Allow new users to sign up** OFF.

Do not add a Sign Up button to the application. Users are created only by an administrator.

## 3. Make your existing account the first admin

After the SQL is run, sign in with the existing account once. The application calls `claim_first_admin()` when no active admin exists.

The existing vocabulary records are then claimed by that admin account.

## 4. Deploy the Edge Functions

From the project root:

```powershell
npx.cmd supabase functions deploy ai-tutor
npx.cmd supabase functions deploy admin-users
```

`admin-users` uses Supabase's server-side service-role environment to create/update/delete Auth accounts. Never put the service-role key in frontend JavaScript.

## 5. Provider keys

Keep the AI provider secrets in Supabase Edge Function secrets, exactly as the current `ai-tutor` function expects:

- `OPENROUTER_API_KEY`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

The browser never receives these keys.

## 6. Resulting permissions

### Logged out
Only the sign-in screen is shown.

### Normal user
- Study Image
- Text Vocabs
- Add Image Vocab
- Add Text Vocab
- Manage own Vocabs
- Review own Mistakes
- Statistics
- Account logout
- AI Tutor only when the admin enables it

### Admin
Everything above plus:
- User Management
- Create user accounts
- Edit user accounts
- Disable/enable accounts
- Reset passwords
- Change role
- Enable/disable AI Tutor per user

## 7. Data isolation

All users share the same Supabase project, but RLS isolates their records by `user_id`.

User A cannot read or modify User B's vocabulary, mistakes, statistics, or AI conversations.

The admin's own vocabulary remains separate from other users. Existing unowned vocabulary is claimed by the first admin account.
