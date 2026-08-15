# Listening AI Generator

Run `supabase_listening_admin.sql` after `supabase_listening.sql`.

Deploy the Edge Function:

`supabase functions deploy ai-listening-generator`

The generator uses the existing AI provider secrets used by AI Tutor (OpenRouter, Groq, Gemini, or OpenAI). It checks the logged-in user's `profiles.role` and `status` before generating.

Generated questions are shown in the Admin Listening Manager for review/editing. They are NOT inserted automatically. Only approved questions are saved to `listening_questions`.

The generator creates original EPS-TOPIK-style material and does not copy official exam questions.
