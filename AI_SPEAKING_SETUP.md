# AI Speaking Partner — v1

Adds a new authenticated Learn section: **🗣️ Speaking Partner**.

## What it does
- Browser Korean speech recognition (`ko-KR`) using Chrome/Edge Web Speech API.
- Conversation with a named AI partner: **Minji**.
- Korean AI replies with browser Korean TTS.
- Conversation scenarios: free, self-introduction, restaurant, shopping, workplace, directions, EPS-TOPIK workplace.
- Gentle or detailed correction mode.
- Visual correction card showing original sentence, improved Korean, and explanation.
- Conversation history is kept in the current browser session only in v1.

## Supabase Edge Function
A new function was added:

`supabase/functions/ai-speaking-partner`

Deploy it from the project root:

```powershell
supabase.cmd functions deploy ai-speaking-partner --no-verify-jwt
```

It uses the same AI provider secrets already used by the existing AI Tutor function.

## Security
The function accepts browser requests for CORS, but it verifies the Supabase JWT inside the function and requires an active profile. No AI provider key is exposed to the frontend.

## Browser support
Speech recognition is browser-dependent. Chrome/Edge are recommended. On unsupported browsers, the microphone button will explain that speech recognition is unavailable.

## Important
This v1 uses browser speech recognition and browser TTS. It does **not** yet provide professional pronunciation scoring or server-side voice generation. Those can be added later after the basic conversation flow is stable.
