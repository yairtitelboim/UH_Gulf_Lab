# Texas Data Center Map: Student Starter

A small map app built with the same stack as our production project:

- **Vite + React** for the frontend
- **Mapbox GL JS** for the map
- **Supabase** for the data (a read-only `student_projects` view)
- **Vercel** for hosting

It runs out of the box with bundled sample data. Add keys to switch to live data.

## 1. Run it locally

You need Node 22 or newer.

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to get it | Required? |
| --- | --- | --- |
| `VITE_MAPBOX_ACCESS_TOKEN` | Your own free token from https://account.mapbox.com/access-tokens/ (starts with `pk.`) | Yes |
| `VITE_SUPABASE_URL` | Shared by your instructor, or your own Supabase project | No |
| `VITE_SUPABASE_ANON_KEY` | Shared by your instructor, or your own Supabase project | No |

```bash
npm run dev
```

The sidebar says whether you're seeing **live data from Supabase** or **sample data**.

## 2. Deploy to Vercel

1. Push this repo to your own GitHub account.
2. At https://vercel.com/new, import the repo. Vercel detects Vite automatically.
3. Under **Environment Variables**, add the same `VITE_*` values from your `.env.local`.
4. Click **Deploy**.

You don't need a Vercel API key. Your Vercel account connects to GitHub and redeploys on every push.

## About the keys

Every key in this app is **public by design**:

- The Mapbox `pk.` token is meant to be used in the browser. You can restrict it to your own domain in the Mapbox dashboard.
- The Supabase **anon** key can only read the `student_projects` view (see `supabase/student_projects_view.sql`). It can't write, and it can't see any other table.

Never put a Supabase `service_role` key or any other secret in a `VITE_*` variable. Vite ships those variables to every visitor's browser.

## Use your own Supabase project instead

1. Create a free project at https://supabase.com.
2. In the SQL editor, create a `student_projects` table with the same columns as the view: `id, name, county, city, status, lat, lon, announced_at`.
3. Enable RLS and add a `SELECT` policy for `anon`.
4. Import `public/sample-projects.json` as starter rows.
5. Put your project URL and anon key in `.env.local`.

## Project layout

```
src/
  App.jsx              sidebar + layout
  MapView.jsx          Mapbox map, circle layer, click-to-select
  lib/supabase.js      Supabase client (null if no keys)
  lib/loadProjects.js  Supabase query with sample-data fallback
  statusColors.js      color per project status
public/
  sample-projects.json fallback data
```

## Ideas to extend it

- Add a status filter to the sidebar.
- Show a Mapbox popup on click instead of (or alongside) the sidebar detail.
- Cluster points at low zoom (`cluster: true` on the GeoJSON source).
- Add a Vercel serverless function in `api/` that aggregates projects by county.
