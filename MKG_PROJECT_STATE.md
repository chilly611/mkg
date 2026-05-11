# MKG_PROJECT_STATE.md

Living state of the Marketing Knowledge Garden. Updated at the close of every dispatch cycle by the Architect. Most recent cycle on top.

---

## Cycle 002 — 2026-05-10 — Masterdoc reconciliation + 12-agent fan-out

**Architect.** Cowork session. Masterdoc v2 + tasks.lessons.md + brand assets ZIP landed mid-cycle and triggered a paradigm shift.

**Three big paradigm shifts (now integrated).**
1. **MKG primary entity is `Campaign`** — not company-entities. Per masterdoc v2 §11.3. The Cycle 001 GEO/AEO landscape is competitor intel, not the primary graph.
2. **Named beachhead = the umbrella itself.** Internal-first sourcing for Cycles 002–004. BKG launch, HKG GLP-1, OKG Bloom Ledger, seed pitch are the Day-1 dataset.
3. **Supabase already exists** — `vlezoyalutexenbnzzui` (knowledge-gardens-prod). MKG namespaces into a `mkg.` schema. No new project to provision; brand-assets bucket already wired.

**Twelve parallel agents dispatched and returned.** All verified.
- research-msi-1 (marketing science authorities) — MSI + Ehrenberg-Bass + AMA journal triad as anchors
- research-bench-1 (performance benchmarks) — top-5 ingest list: WordStream, HubSpot, Mailchimp, Meta, Google
- research-2-autoagents (autonomous marketing agents wedge) — 28 entities, persisted to outputs
- research-4-vertical (vertical AI marketing for our gardens) — 4 verticals × 8–12 entities; OKG and TKG verticals are highest arbitrage
- research-5-geo-commerce (LATAM + agentic commerce) — 18 LATAM + 20 agentic; WhatsApp + AI + LATAM is the white space
- research-6-internal (internal campaign inventory) — 8–12 P1/P2 candidates identified; campaign-light state confirmed
- research-7-projscan (project scan) — confirmed L-026 font lesson; flagged TKG (react 19.2.3) vs MKG (19.0.0) version drift
- research-8-academic (open-source + academic) — Liu/Zhang/Liang + GEO paper + HELM as academic anchors; awesome-mcp-servers + promptfoo + Ragas as contribution targets
- strategy-agent-1 (wedge selection) — pick (a): BKG sliver-launch teardown as Campaign #001
- strategy-agent-2 (pricing) — 4-lane pricing card committed
- build-schema-2 (campaign schema) — full SCHEMA.sql v0.2 delivered
- deploy-agent-2 (Supabase migration plan) — full plan delivered
- critic-agent-1 (brand audit on v3) — 2 must-fix items: federation cross-link + signature compare device

**Shipped this cycle.**
- `SCHEMA.sql` v0.2 — campaign-centric, mkg.-namespaced, anti-fabrication enforced via NOT NULL constraints, applied-ready
- `MKG_LESSONS.md` (already reconciled in Cycle 001.5; PROVISIONAL queue still active for some L-MKG-NNN codes)
- `CAMPAIGN_TEARDOWN_PRD.md` — the killer-app product spec
- `INTERNAL_FIRST_ROADMAP.md` — 90-day plan with 5 metrics + 5 kill criteria
- `PRICING_HYPOTHESIS.md` — Public/Pro/Admin/Machine prices anchored to 40-entity dataset
- `SUPABASE_MIGRATION_PLAN.md` — applies SCHEMA.sql to existing project + brand-assets integration
- `HEARTBEAT_AND_DEPLOY.md` — GitHub init + Vercel + DNS + cron architecture
- `EXEC_ONE_PAGER.md` — 90-second exec brief
- `TEAM_READOUT_5MIN.md` — stand-up script with Q&A pre-empts
- `artifacts/team-atlas.html` — 8-tab interactive team brief, phone-friendly, embeds umbrella tree + observation eye + competitive landscape teaser
- `website/vercel.json` — weekly cron config (cycle-close + citation-test)
- `website/public/team-atlas/index.html` — deploy copy of Team Atlas
- v3 artifact and deploy copy patched with sister-gardens federation strip (per critic-agent-1 must-fix)
- `brand-assets/` — umbrella ZIP unzipped locally (umbrella tree marks, HKG plates, TKG 6-stage motions, observation eye)

**Blocked.**
- **Schema not yet applied to live Supabase.** Chilly's one-click step. Two paths in `SUPABASE_MIGRATION_PLAN.md`.
- **Repo not yet created on GitHub.** One command in `HEARTBEAT_AND_DEPLOY.md`.
- **Vercel project not yet imported.** 3-minute task.
- **DNS CNAME not yet added.** 1-minute task.
- **MCP server endpoints not yet built.** Cycle 003 build target.
- **`/api/cron/*` endpoints not yet built.** Cycle 003 build target.
- **MKG-specific brand mark not commissioned.** Currently using umbrella tree + observation eye. Cycle 004 candidate.

**Lessons added.** None new. The masterdoc reconciliation in Cycle 001.5 already mapped the [P] codes against L-001..L-032. No regressions caught this cycle.

**Compounding score (Cycle 001 baseline).** 254.6. Cycle 002 doesn't beat it because: no new high-confidence entities ingested (waiting on Supabase apply); no LLM citations achieved (waiting on Public Lane publish); lessons stayed flat (no new mistakes). Cycle 003 should reset the baseline once schema is live and the BKG teardown publishes.

**Citation health.** No re-run this cycle (citation-test endpoint not yet built). Baseline from Cycle 001 still stands: 0/4 canonical questions cite MKG.

**Decisions Chilly closed this cycle.**
- Supabase: Architect drafts plan, Chilly applies. ✓ Plan delivered.
- GitHub repo: `knowledge-gardens-marketing`. ✓ Confirmed.
- Persistence: weekly heartbeat. ✓ Cron architecture committed.
- Masterdoc: v2 from Chilly's upload. ✓ Read and integrated.

**Decisions still open.**
- Promote Agent commit authority (PR vs direct).
- Default graph license (CC-BY-SA vs CC-BY-NC).
- External onboarding trigger (specifics).
- Public-lane CAC budget.
- MKG-specific brand mark commission.

**Next cycle (003) — proposed sequence.**
1. Chilly executes the deploy: GitHub create + Vercel import + DNS CNAME + Supabase migration apply (≈10 min total).
2. Schema Agent verifies schema applied; seeds umbrella as `mkg.brands` row.
3. Research Agent ingests 40 GEO/AEO entities into `mkg.competitor_entities` + explodes claims into `mkg.citations`.
4. Build Agent (build-api-1) ships the MCP server + JSON-LD feed + sitemap + llms.txt.
5. Build Agent (build-ui-1) ships the Campaign Teardown surface for the BKG sliver-launch record.
6. Deploy Agent runs the first citation health test against live URLs.
7. Critic Agent files lessons.
8. Architect closes Cycle 003 with new compounding score baseline.

---

## Cycle 001 — 2026-05-09 — Bootstrap (preserved for audit)

See `dispatch/cycle-001-report.md` for the full Cycle 001 record.

**Headlines.** Local repo scaffolded. SCHEMA.sql v0.1 (entities-centric — superseded by v0.2). PROVISIONAL lessons committed and reconciled in Cycle 001.5. Research handback: 40 GEO/AEO entities, 31 high-confidence. Citation baseline established. Rebuilt landscape artifact (parchment, Cormorant + Space Mono — pre-L-026 reconciliation, refactored to v3 with Inter default). Next.js scaffold with `output: "export"` mirroring TKG ship pattern.

---

## Standing facts

- **Working dir:** `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/`
- **Domain (planned):** `marketing.theknowledgegardens.com`
- **Supabase project:** `vlezoyalutexenbnzzui` (knowledge-gardens-prod) — existing, MKG namespaces as `mkg.`
- **GitHub repo:** `knowledge-gardens-marketing` — to create
- **Vercel project:** to create; Root Directory = `website`
- **Heartbeat cadence:** weekly Sunday evening (per Chilly's decision)
- **Architect spawn entry point:** Cowork session with the architect prompt + masterdoc v2 + tasks.lessons.md + brand assets

---

## Anti-patterns in force (per masterdoc v2 §7.5 + 09_LESSONS.md)

1. Dark backgrounds (Garden Wars exception only). Reject.
2. Scroll-cinematic for entity views. Reject.
3. Flat card grids as the entity experience. Reject.
4. Brass/gold tones on metallic UI. Copper or Steel only. Reject.
5. Stock photography. Reject.
6. Auto-playing video. Reject.
7. Modal popups for newsletter signup. Reject.
8. AI-generated lorem ipsum / fabricated data. Reject — federation-wide cost.
9. Reimagining the kernel from scratch each session. Reject.
10. Modifying umbrella header/footer per garden. Reject.

Cycle 002 v3 patch addressed: federation cross-link gap (sister-gardens strip added). Still queued for Cycle 003: signature "two-views" compare slider on the Campaign Teardown.
