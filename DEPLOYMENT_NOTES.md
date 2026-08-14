# Korean Speller — Deployment Notes

## Before publishing
- Do not commit `.env` files or provider API keys.
- Keep AI provider secrets in Supabase Edge Function Secrets.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- The frontend may contain the Supabase publishable key; protect data with RLS.

## Supabase
The existing production database has already been configured and security-tested.
Do not blindly rerun the historical SQL setup/migration files against the live project.

## AI Tutor
Provider credentials should be stored as Supabase Edge Function secrets:
- OPENROUTER_API_KEY
- GROQ_API_KEY
- GEMINI_API_KEY
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- SUPABASE_SERVICE_ROLE_KEY
