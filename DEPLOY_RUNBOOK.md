# DEPLOY_RUNBOOK.md
**Marketing Knowledge Garden — 10-minute path to `marketing.theknowledgegardens.com/competitive-landscape`**

This runbook mirrors the proven TKG ship pattern from
`16_TKG_DEPLOYED.md`. Every step has a lesson behind it; the lessons are
inline so you don't have to re-learn them.

> **Time estimate:** 10 minutes once you have GitHub, Vercel, and DNS
> credentials ready.

---

## 0 · Pre-flight (do once, not per-cycle)

You need:
- A GitHub account and a personal access token with `repo` scope.
- A Vercel account on the same org as your other gardens
  (`chillyd-2693s-projects` based on `16_TKG_DEPLOYED.md`).
- Access to the DNS provider for `theknowledgegardens.com`. From the
  current live gardens (orchids, builders, health, toxicology), this is
  almost certainly already provisioned with a registrar that supports
  CNAME records.

If any of the three is missing, stop here.

---

## 1 · Create the GitHub repo (2 min)

From a terminal in `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/`:

```bash
cd "~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing"

# Init the repo locally
git init
git add .
git commit -m "Cycle 001 · scaffold + GEO/AEO landscape v3"

# Create the GitHub repo via gh CLI (cleanest path)
# If gh isn't installed: brew install gh && gh auth login
gh repo create knowledge-gardens-marketing \
  --public \
  --source . \
  --remote origin \
  --description "The Marketing Knowledge Garden — canonical, AI-citable atlas of marketing in the agentic era." \
  --push

# (Or do it manually on github.com/new and then `git remote add origin ...`
# followed by `git push -u origin main`.)
```

After this, the repo is at `github.com/<your-username>/knowledge-gardens-marketing`.

---

## 2 · Verify the build works locally (1 min)

```bash
cd website
npm install
npm run build   # produces ./out
```

If the build fails:
- Most likely cause is a smart-quote (per `L-030`). Run
  `grep -rn $'[''""]' src/` and replace any hits with ASCII quotes.
- Second most likely is a missing dep. `rm -rf node_modules
  package-lock.json && npm install`.

If the build succeeds, you'll see a `website/out/` directory with
`index.html` and `competitive-landscape/index.html`.

---

## 3 · Import to Vercel — **two settings before clicking Deploy** (3 min)

Per umbrella `L-031`, this is where TKG's first three deploys 404'd.
Don't skip the order.

1. Open <https://vercel.com/new>.
2. Pick the `knowledge-gardens-marketing` repo.
3. **MANDATORY · Set Root Directory.** Click "Edit" next to *Root
   Directory* and set it to `website`. Without this, Vercel will look
   for `package.json` at the repo root and fail.
4. Framework Preset: *Next.js* (Vercel auto-detects).
5. Build Command: `npm run build` (default).
6. Output Directory: `out` (default for static export).
7. **MANDATORY · Add Environment Variables.** Even if empty values for
   now, reserve the keys from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `PUBLIC_URL=https://marketing.theknowledgegardens.com`
   Use the *Import .env* button if you have a `.env` ready; otherwise
   paste keys with empty values. Adding env vars *after* the first
   deploy in Vercel is a known footgun (`L-031`).
8. Click **Deploy**.

First deploy takes ~60–90 seconds. You'll get a URL like
`marketing-knowledge-garden.vercel.app`.

Verify both:
- `https://marketing-knowledge-garden.vercel.app/` → landing page
- `https://marketing-knowledge-garden.vercel.app/competitive-landscape/`
  → the v3 atlas

---

## 4 · Add the custom domain (3 min)

In the Vercel dashboard for this project:

1. Settings → Domains.
2. Add `marketing.theknowledgegardens.com`.
3. Vercel will prompt for a CNAME record:
   - **Type:** `CNAME`
   - **Name:** `marketing`
   - **Value:** `cname.vercel-dns.com.`
4. Add that record at your DNS provider for `theknowledgegardens.com`.
   Propagation usually takes 1–5 minutes for a fresh CNAME.
5. Once Vercel shows "Valid Configuration", visit
   `https://marketing.theknowledgegardens.com/competitive-landscape/`.

---

## 5 · Smoke test (1 min)

Open the live URL and confirm:

- [ ] Background is parchment `#f5f0e8`. Never dark. (`L-001`)
- [ ] Three emblems load (the orrery in the top-right corner, the tree
      on the Profile tab, the city on the Architecture tab).
- [ ] Four tabs work — Profile / Architecture / Intelligence / Compare.
      No scroll-cinematic regression. (`L-002`)
- [ ] Headlines are bold sans-serif (Inter). Italics only where
      explicitly emphasized. (`L-026`)
- [ ] Compass rotates. (`L-027`)
- [ ] Filter chips on Intelligence tab work. Counter updates.
- [ ] Compare tab renders a side-by-side table.
- [ ] View source: at least one `<script type="application/ld+json">`
      block per entity. (`L-MKG-001`)

If any item fails: fix, push, redeploy, re-test. Don't paper over it.

---

## 6 · Post-deploy (the next move)

The site is live but the **machine lane is not yet wired**. Cycle 002
unblocks once Supabase + the API are stood up:

1. Provision the Supabase project (drop keys into Vercel env vars
   *before* the next deploy, per `L-031`).
2. Apply `SCHEMA.sql` v0.1 to live.
3. Ingest `data/entities-geo-aeo-cycle001.json` into the live
   `entities` + `citations` tables.
4. Build `build-api-1` per `dispatch/cycle-001-job-4-build-api.md`.
5. Migrate `public/competitive-landscape/index.html` to a real Next.js
   route at `src/app/competitive-landscape/page.tsx` reading from
   Supabase (per `L-MKG-004`).
6. Run citation health test post-deploy (per `L-MKG-005`).

---

## 7 · Known traps (lessons in force)

| Trap | Cause | Lesson |
|---|---|---|
| Site 404s after deploy | Root Directory not set | `L-031` |
| Env vars don't apply | Added after first deploy | `L-031` |
| Build error: unexpected token | Smart quotes substituted by editor | `L-030` |
| `next build` killed mid-run | Default 60s timeout | `L-012` |
| Site looks dark / cinematic | Background overridden | `L-001` |
| Headlines feel "precious" | Cormorant italic over-used | `L-026` |
| Animations don't fire | `prefers-reduced-motion` block re-added | `L-027` |
| Site goes 404 site-wide later | Someone removed `output: "export"` | `L-006` |
| Emblem invisible on dark surface | Hardcoded `mix-blend-mode: multiply` | `L-028` |

If you hit one not in this table, that's a new lesson. Append to
`MKG_LESSONS.md` immediately and have the Promote Agent review at
weekly cycle close (per `L-032`).

---

## 8 · The single command-line summary

If you remember nothing else from this runbook:

```bash
# from Marketing/
git init && git add . && git commit -m "init"
gh repo create knowledge-gardens-marketing --public --source . --push
cd website && npm install && npm run build
# then in Vercel: Root Directory=website, env vars set, Deploy
# then in DNS: CNAME marketing -> cname.vercel-dns.com
```

That's the 10 minutes. Welcome to the open web.
