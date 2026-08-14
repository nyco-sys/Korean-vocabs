
# AI Tutor — Multi-Provider Fallback Setup

IMPORTANT:
The multi-provider version does NOT use the `ai_settings` table for provider
keys. Provider keys are server-side Supabase Edge Function secrets.

## Provider priority

1. OpenRouter
2. Groq
3. Gemini
4. OpenAI
5. Anthropic

The first configured provider is tried first. If it fails, the function tries
the next configured provider.

## Add secrets

In Supabase Dashboard:
Project -> Edge Functions -> Secrets

Add whichever providers you have keys for:

OPENROUTER_API_KEY = your OpenRouter key
OPENROUTER_MODEL = openrouter/free

GROQ_API_KEY = your Groq key
GROQ_MODEL = llama-3.1-8b-instant

GEMINI_API_KEY = your Gemini key
GEMINI_MODEL = gemini-2.5-flash

Optional paid/other fallbacks:

OPENAI_API_KEY = your OpenAI key
OPENAI_MODEL = gpt-4.1-mini

ANTHROPIC_API_KEY = your Anthropic key
ANTHROPIC_MODEL = claude-3-5-haiku-latest

Optional:
AI_APP_URL = https://your-site.example

## Deploy after changing the function

supabase functions deploy ai-tutor

## Why the old SQL does not make the provider appear

The earlier AI Tutor used a user-specific `ai_settings` row. The multi-provider
version changed that architecture. It reads provider secrets directly from the
Edge Function environment.

Therefore, inserting rows into `ai_settings` will NOT configure OpenRouter,
Groq, or Gemini.

## Test

After deploying and adding at least one secret:
1. Log in.
2. Open AI Tutor.
3. The status pill should show something like:
   `✓ OpenRouter → Groq → Gemini`
4. The chat box should appear.
5. Ask a Korean question.

If the status says `No AI provider configured`, the Edge Function cannot see
any provider secret. Check the secret name exactly and redeploy.

Never put provider keys in frontend JavaScript, GitHub, localStorage, or HTML.
