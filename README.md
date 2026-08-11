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
