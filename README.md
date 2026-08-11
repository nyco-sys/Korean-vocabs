# Korean Speller

Modular frontend structure for the GitHub Pages + Supabase Korean vocabulary app.

## JavaScript structure

- `config/` — Supabase connection
- `core/` — shared state and app bootstrap
- `api/` — Supabase data access
- `study/` — image/text study and quiz logic
- `components/` — reusable keyboards
- `audio/` — correct/wrong feedback sounds
- `admin/` — authentication, add, and manage features
- `utils/` — import/export helpers

The app intentionally keeps classic script loading (rather than bundling) so it remains simple to deploy directly to GitHub Pages.
## Manage pagination

The Manage page displays 5 vocabulary items per page. Search and category filtering are performed server-side.


## Mistake Review

Run `supabase_mistakes.sql` in Supabase SQL Editor to create the per-user `study_mistakes` table and secure recording function. Incorrect answers are saved for authenticated users. The Review Mistakes page lets the user filter image/text mistakes, remove entries, and launch a focused review session. Correct answers during a review remove that vocabulary from the mistake list.

## Study Statistics

Run `supabase_study_statistics.sql` once in Supabase. Statistics are private per authenticated user and track correct, wrong, and skipped study activity for the selected period.

## Responsive hamburger navigation

The navbar collapses into a hamburger menu at 800px and below. Navigation remains horizontal on larger screens.
