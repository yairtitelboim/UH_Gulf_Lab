# UH Gulf Lab: Texas Data Center Map

A small web map of Texas data center projects. It uses the same stack as our production research app:

| Piece | What it does here |
| --- | --- |
| **Vite + React** | Builds and runs the frontend |
| **Mapbox GL JS** | Draws the map and the project points |
| **Supabase** | Stores the project data (you get read-only access to our class database) |
| **Vercel** | Hosts your app on the internet |
| **GitHub** | Holds your code; Vercel deploys from it |

The app runs right away on bundled sample data. Add the keys below to switch to live data.

---

## 0. Before you start

Install these once:

- **Node.js 22 or newer**: https://nodejs.org (check with `node -v`)
- **Git**: https://git-scm.com (check with `git --version`)
- A code editor, e.g. **VS Code**

Create free accounts on:

- **GitHub**: https://github.com
- **Mapbox**: https://account.mapbox.com
- **Vercel**: https://vercel.com (sign up with your GitHub account, which makes deploying easier)

You do **not** need a Supabase account to use the class data.

---

## 1. Get your own copy of the code

1. On https://github.com/yairtitelboim/UH_Gulf_Lab, click **Fork**. This creates `github.com/<your-username>/UH_Gulf_Lab`, a copy you own and can push to.
2. Clone **your fork** (not the original) to your computer:

```bash
git clone https://github.com/<your-username>/UH_Gulf_Lab.git
cd UH_Gulf_Lab
npm install
```

---

## 2. Set up your keys

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```
VITE_MAPBOX_ACCESS_TOKEN=pk.your-own-token
VITE_SUPABASE_URL=https://gzhmontqydxtqvkjcegh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6TKTU8neoxyH17YJ6V-m9A_FdAAve-l
```

Then start the app:

```bash
npm run dev
```

Open the URL it prints (usually http://localhost:5173). The sidebar says whether you're on **Live data from Supabase** or **Sample data**.

> `.env.local` is listed in `.gitignore`, so Git will never commit it. Keep it that way.
> After changing `.env.local`, stop the dev server (Ctrl+C) and run `npm run dev` again.

---

## 3. Mapbox: what you need to know

Mapbox provides the basemap (roads, labels, terrain) and the library that draws our data on top of it.

**Your token**
- On https://account.mapbox.com/access-tokens/, copy your **Default public token**. It starts with `pk.`
- Public `pk.` tokens are meant to be used in the browser. They're safe in front-end code.
- **Never** use a secret token (starts with `sk.`) in this app.
- Optional but recommended: once your site is deployed, edit the token and add your Vercel URL under **URL restrictions**, so nobody else can use it.

**Free tier.** Mapbox is free up to 50,000 map loads per month, which is far more than a class project needs.

**Where Mapbox is used in this code:** `src/MapView.jsx`
- `style: 'mapbox://styles/mapbox/dark-v11'` sets the basemap. Try `light-v11`, `streets-v12`, `satellite-streets-v12` or `outdoors-v12`.
- The projects become a **GeoJSON source** (`map.addSource`) drawn by a **circle layer** (`map.addLayer`).
- Colors come from `src/statusColors.js` through a Mapbox `match` expression.

**Docs:** https://docs.mapbox.com/mapbox-gl-js/ and the examples at https://docs.mapbox.com/mapbox-gl-js/example/

---

## 4. Supabase: what you need to know

Supabase is a hosted Postgres database with an automatic API. The app asks it for data straight from the browser.

**What you can access.** The class key can only **read** one view, `student_projects`:

| Column | Meaning |
| --- | --- |
| `id` | Unique project ID |
| `name` | Project name |
| `county`, `city` | Location in Texas |
| `status` | `announced`, `construction`, `operating`, `paused`, `cancelled` or `unknown` |
| `lat`, `lon` | Coordinates |
| `announced_at` | Announcement date, if known |

You can't write, update or delete. You can't see any other table either. If you try, you'll get `permission denied` or an empty result. That's expected.

**About the keys**
- The **publishable / anon key** is designed to be public. Database rules (row-level security and grants) decide what it can do.
- A **service_role / secret key** bypasses all of those rules. It must **never** go in front-end code or in a `VITE_*` variable, because Vite puts every `VITE_*` value into the JavaScript that visitors download.

**Where Supabase is used in this code:**
- `src/lib/supabase.js` creates the client.
- `src/lib/loadProjects.js` runs the query:

```js
supabase.from('student_projects').select('id, name, county, status, lat, lon')
```

Some common query patterns to try:

```js
.eq('status', 'construction')        // only projects under construction
.eq('county', 'Travis')              // one county
.order('announced_at', { ascending: false })
.limit(20)
```

**Docs:** https://supabase.com/docs/reference/javascript/select

**Want your own database?** Create a free project at https://supabase.com. In the SQL editor, create a `student_projects` table with the columns above. Enable RLS and add a `SELECT` policy for `anon`. Import `public/sample-projects.json` as starter rows. Then put your own URL and anon key in `.env.local`.

---

## 5. Git & GitHub: how to save and push your work

Git tracks changes on your computer. GitHub stores them online. Vercel watches GitHub and redeploys on every push.

**The everyday loop:**

```bash
git status                      # what changed?
git add .                       # stage all changes
git commit -m "Add status filter to sidebar"   # save a snapshot with a message
git push                        # upload to your fork on GitHub
```

**Work on a branch for each feature (recommended):**

```bash
git checkout -b status-filter   # create and switch to a new branch
# ...edit code, then add/commit as above...
git push -u origin status-filter
```

On GitHub, open a **Pull Request** from your branch into your own `main`, then merge it. Vercel gives each branch its own **preview URL**, so you can test before merging.

**Getting updates from the class repo:**

```bash
git remote add upstream https://github.com/yairtitelboim/UH_Gulf_Lab.git   # once
git pull upstream main
```

**Good habits**
- Commit small and often, with messages that say *what* and *why*.
- Run `git status` before `git add .` to make sure you aren't committing something you didn't mean to.
- Never commit `.env.local` or any key. If you ever do, tell your instructor, and rotate (regenerate) the key.

---

## 6. Vercel: putting your app online

1. Go to https://vercel.com/new and **import** your `UH_Gulf_Lab` fork. Vercel detects Vite automatically, so leave the build settings as they are.
2. Open **Environment Variables** and add the same three values from your `.env.local`:
   - `VITE_MAPBOX_ACCESS_TOKEN`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Click **Deploy**. You'll get a URL like `uh-gulf-lab-yourname.vercel.app`.

**What happens next**
- Every `git push` to `main` updates your live site automatically.
- Every push to another branch gets its own **preview URL**.
- `VITE_*` variables are baked in **at build time**. If you change one in the Vercel dashboard, go to **Deployments → ⋯ → Redeploy** to apply it.
- You don't need any Vercel API key. The connection to GitHub handles everything.

**Docs:** https://vercel.com/docs/frameworks/vite

---

## 7. Project layout

```
src/
  App.jsx              sidebar + layout
  MapView.jsx          Mapbox map, circle layer, click-to-select
  lib/supabase.js      Supabase client (null if no keys)
  lib/loadProjects.js  Supabase query with sample-data fallback
  statusColors.js      color per project status
  styles.css           all styling
public/
  sample-projects.json fallback data when no Supabase keys are set
supabase/
  student_projects_view.sql   how the class view is defined (for reference)
.env.example           template for your .env.local
```

---

## 8. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Page says "Add VITE_MAPBOX_ACCESS_TOKEN…" | Token missing from `.env.local`, or you didn't restart `npm run dev` |
| Map area is blank or gray | Bad Mapbox token. Check that it starts with `pk.` and has no quotes or spaces |
| Sidebar says "Sample data" | Supabase values missing or mistyped. Check the browser console (F12) for the error |
| Works locally, broken on Vercel | Env vars not added in Vercel, or added after deploying. Redeploy |
| `npm install` warns about the engine | Upgrade to Node 22 or newer |
| `git push` rejected | Run `git pull` first, fix any conflicts, then push again |

---

## 9. Ideas to extend it

- Add a status filter (checkboxes) to the sidebar.
- Show a Mapbox popup on click.
- Cluster points at low zoom (`cluster: true` on the GeoJSON source).
- Size circles by something meaningful, or add a county boundary layer.
- Add a Vercel serverless function in `api/` that counts projects per county.
