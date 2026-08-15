# Listening Practice v1

## What was added
- 🎧 Listening item in the Learn sidebar
- Listening settings: category, difficulty, question count
- EPS-TOPIK-style multiple-choice listening practice
- Browser-native Korean `ko-KR` speech synthesis
- Normal 1x and slow 0.7x playback
- Play/stop behavior
- Automatic audio stop when moving to another question or section
- Session result with correct/incorrect/accuracy
- Supabase-backed `listening_questions` table
- Five original practice questions

## Supabase setup
Run `supabase_listening.sql` once in the Supabase SQL Editor.

The table is protected by RLS. Authenticated users can read active questions.

## Current audio
If `audio_url` is empty, the app uses the browser's Korean TTS using `audio_text`.
Later, an admin management page can be added for uploading real MP3 files and using `audio_url`.

## GitHub Pages
No PHP or server-side code was added. The feature works with the existing static/GitHub Pages architecture and Supabase.
