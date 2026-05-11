# Marketing Knowledge Garden — Next.js website

Production source for `marketing.theknowledgegardens.com`. Mirrors the
deploy pattern proven on `toxicology.theknowledgegardens.com`.

## Stack

- Next.js 16.1.6 (Turbopack)
- React 19
- TypeScript 5.9
- Static export (`output: "export"`) — never remove (umbrella `L-006`)
- Vercel hosting + DNS subdomain CNAME

## Routes

| Route | What it is |
|---|---|
| `/` | Garden landing page (placeholder, Cycle 001) |
| `/competitive-landscape/` | The GEO/AEO atlas v3, four-tab Species Experience |

## Development

```bash
cd website
npm install
npm run dev   # http://localhost:3000
```

## Production build

```bash
npm run build
# output goes to ./out
```

## Deploy (Vercel) — see `../DEPLOY_RUNBOOK.md`

The 10-minute path:

1. Push this repo to `github.com/<org>/knowledge-gardens-marketing`
2. In Vercel: Import project, **Root Directory = `website`** (mandatory
   per `L-031`)
3. Add env vars BEFORE clicking Deploy (per `L-031`) — even if empty,
   reserve the keys from `../.env.example`
4. Deploy — first build creates `marketing-knowledge-garden.vercel.app`
5. Add custom domain `marketing.theknowledgegardens.com`
6. Add CNAME at the DNS provider pointing to `cname.vercel-dns.com`
7. Verify `/competitive-landscape/` is live

## Brand rules in force

- `L-001` — parchment background (`#f5f0e8`), never dark
- `L-002` — tabs, not scroll cinematic
- `L-005` — Victorian engineering signature on every surface
- `L-006` — `output: "export"` is sacred
- `L-026` — bold sans-serif default; Cormorant italic via `.emphasis-italic`
  opt-in only
- `L-027` — motion always plays (no `prefers-reduced-motion` block)
- `L-031` — env vars + Root Directory set BEFORE first deploy
- `L-MKG-001` — JSON-LD on every entity surface

## Files

```
website/
├── package.json          — Next 16, React 19, TS 5.9
├── next.config.ts        — output: "export", trailingSlash: true
├── tsconfig.json
├── .gitignore
├── README.md             — this file
├── public/
│   ├── emblems/
│   │   ├── emblem-orrery.png
│   │   ├── emblem-tree.png
│   │   └── emblem-city.png
│   └── competitive-landscape/
│       └── index.html    — the v3 artifact, served as-is at /competitive-landscape/
└── src/
    └── app/
        ├── layout.tsx    — root layout, fonts, metadata, JSON-LD org
        ├── page.tsx      — / (landing)
        └── globals.css   — umbrella tokens
```

The landscape page lives in `public/` for now (fastest path to deploy).
Cycle 002+ migrates it to a proper Next.js route at
`src/app/competitive-landscape/page.tsx` reading from Supabase via the
MCP server (per `L-MKG-004`).
