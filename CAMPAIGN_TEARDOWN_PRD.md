# Campaign Teardown — Product Requirements
**The MKG killer-app spec. Cycle 002.**

Per masterdoc v2 §11.5: every Campaign record renders as a four-tab Species
Experience that mirrors OKG's Photo / Blueprint / Intelligence / Compare
pattern. This is the kernel pattern with a marketing-shaped skin.

## Goal

Make every Campaign in the MKG knowledge graph a legible, citable,
AI-retrievable artifact that a CMO, an agency planner, an AI agent, or a
freshman marketing student can each get value from in 90 seconds.

## URL pattern

```
marketing.theknowledgegardens.com/campaigns/<slug>
```

Slug = brand + objective + window (e.g. `bkg-sliver-launch-2026-q2`).

## The four tabs

### Tab 01 — Creative
The raw asset. Image, video, copy, landing page screenshot, podcast
embed. **No annotations.** This is the artifact as it ran. If we don't
have rights to show it, we show a placeholder plate with the words
*"asset not yet rights-cleared"* and the structured anatomy still works.

### Tab 02 — Anatomy
The structured breakdown. Engineering-style annotations on the creative
itself: dimension lines on copy length, callout on the CTA, brackets
around the audience-cue, copper-underlined claim references. Anatomy
fields populate from `mkg.campaigns.anatomy_jsonb`:

- `objective_one_liner` — what the campaign is trying to do
- `target_audience` — links to `mkg.audiences`
- `hook` — the opening attention move (max 280 chars)
- `cta` — the single thing the asset asks the reader to do
- `channel_fit` — why the format suits the channel
- `framework_links[]` — the marketing-science principles the campaign
  applies (links to `mkg.frameworks`)
- `tradeoffs` — what's left out and why
- `risks` — what would break this campaign

### Tab 03 — Intelligence
The benchmark + outcome layer. Three rows:

1. **Benchmarks the campaign was measured against.** Pulled from
   `mkg.benchmarks` via `cites_benchmark` edges. Every row carries the
   source name, retrieved-at date, sample size (or "not disclosed"
   surfaced honestly), and a deep link to the citation.
2. **Actual measured performance.** Pulled from `mkg.metrics`. Every
   row declares `source_kind` (platform-reported / inferred / claimed-
   by-brand / third-party-audited / observed-internal). Anti-fabrication
   is enforced at the schema level — no metric ships without a source.
3. **Frameworks cited.** Marketing-science principles (Ehrenberg-Bass
   laws, MSI research priorities, IPA effectiveness rules) the anatomy
   relies on, with deep links to authority sources.

### Tab 04 — Compare
The signature device. **Draggable slider** showing two views of the
same artifact:

- Left of the handle: the Creative.
- Right of the handle: the Anatomy overlay (annotations, dimension
  lines, framework references rendered in copper on parchment).

This satisfies masterdoc §7.2 *"Show two views of the same thing with a
draggable compare slider between them"* and is OKG's photograph ↔
blueprint pattern, applied to marketing.

A secondary compare mode: **Campaign × Campaign**. Two slugs, side-by-
side anatomy + intelligence rows. Designed for agency RFPs and enterprise
diligence.

## Voice rules (per masterdoc §7.4 + L-026)

- Inter bold sans-serif for headlines, titles, CTAs (L-026 supersedes
  the old "Cormorant for everything" rule).
- Cormorant Garamond italic via `.emphasis-italic` opt-in only —
  reserved for primary entity names ("BKG sliver launch") and true
  emphasis ("the wedge").
- Space Mono uppercase wide-tracked for measurements, IDs, timestamps.
- Numbers and citations over adjectives. *"Hit a 4.2× ROAS over 30 days
  against a 3.0× WordStream search benchmark"* beats *"performed
  exceptionally well."*
- Voice over-corrects toward restraint. Marketing is the domain most
  prone to LLM hallucination and bombast.

## Anti-fabrication rules (per masterdoc §11.7, codified in schema)

1. **Never invent performance numbers.** No verified benchmark → write
   *"benchmark not yet sourced"* and surface that gap in the UI.
2. **Never invent attribution paths.** Show the framework and assumption
   explicitly. If we don't know whether MMM, last-click, or platform-
   reported is the basis, the metric row carries a confidence flag.
3. **Never publish a campaign without rights.** Either we own it, the
   brand released it publicly, or we show only the structured anatomy
   without the creative.
4. **Never imply success without a defined success metric.** "Successful"
   alone is meaningless. "Hit X against Y benchmark" is meaningful.

## Federation contract

Every Campaign Teardown surface must:

- Render the umbrella header (link to `theknowledgegardens.com`).
- Cross-link to ≥1 sister garden (OKG, BKG, HKG, TKG, or Garden Wars).
  For a Campaign whose `garden_scope = 'bkg'`, the natural cross-link
  is `builders.theknowledgegardens.com`.
- Emit valid JSON-LD via the `mkg.campaigns_jsonld` view (`@type:
  CreativeWork`).
- Live in the sitemap referenced by `marketing.theknowledgegardens.com/
  llms.txt`.
- Be reachable via the MKG MCP server's `get_campaign(slug)` tool.

## Layout

Desktop: 1180px max width, parchment background with the 40px subtle
grid texture, herbarium plate framing on each tab panel, copper
dimension lines on the Anatomy overlays. Cormorant emphasis-italic
sparse. The orrery emblem rotates slowly in the top-right at low
opacity. The conveyor belt (Public → Pro → Admin → Machine) sits at
the foot of every page as the federation reminder.

Mobile: tabs collapse into a horizontal scroll, the compare slider
becomes a tap-to-toggle (handle on mobile is finicky), all dimension
annotations stay in copper. No layout regresses to "flat card grid"
(L-004).

## Cycle 002 scope (the first three teardowns)

1. **`bkg-sliver-launch-2026-q2`** — first and primary. The first
   contractor paywall conversion, launched alongside #aikidotheAI
   voice. This is the public artifact MKG ships at end of Week 4 per
   the wedge strategy.
2. **`tkg-sky-valley-pcb-case`** — toxicology case study reframed as a
   marketing campaign for the TKG Counsel Lane. Demonstrates the
   pattern works for technical/legal verticals.
3. **`okg-bloom-ledger-documentary-eta`** — orchid documentary as a
   long-burn brand campaign. Demonstrates the pattern works for
   content-led / press-led campaigns.

These three together prove the Campaign Teardown surface is
domain-flexible (B2B SaaS, expert-witness legal, brand documentary).

## What this PRD intentionally does NOT cover

- **Campaign Builder.** Helping marketers *create* a campaign from
  scratch is post-internal-sliver. Cycle 003 or 004.
- **Multi-tenant marketing tool.** External marketers sign up to make
  their own campaigns — post-MRR, per masterdoc §11.2.
- **Real-time performance ingestion.** Live API connections to Meta /
  Google / TikTok ad accounts — Cycle 004+.
- **Attribution modeling.** MMM, MTA, and similar are out of scope
  forever. We catalog and cite them; we don't invent them.

## Verification criteria (Architect signs off only when)

- A live `bkg-sliver-launch-2026-q2` Campaign Teardown renders all four
  tabs from a real Supabase row.
- Every benchmark in Intelligence has a source URL and a retrieved-at
  date.
- Every metric carries a `source_kind`.
- The Compare slider works on desktop and mobile.
- View source: ≥1 `<script type="application/ld+json">` block,
  validates against schema.org.
- The page cross-links to ≥1 sister garden URL.
- Copy passes the §7.4 voice rule grep — no banned adjectives.
- Brand audit passes critic-agent-1's L-001 / L-002 / L-005 / L-006 /
  L-026 / L-027 checks.
