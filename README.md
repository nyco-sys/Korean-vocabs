# Korean Speller

Modular Korean vocabulary study web app using Supabase, with account-based data isolation and optional AI Tutor access.

See `MULTI_USER_SETUP.md` before deploying this version.


## Study Dashboard / Statistics

Run `supabase_study_statistics.sql` in Supabase SQL Editor. This creates `study_activity` and the `record_study_activity` RPC used by the Dashboard. After running it, refresh the app.
