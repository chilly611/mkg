# Internal-First Roadmap & Wedge Strategy
**MKG Cycle 002 plan · 2026-05-10**

Synthesis of strategy-agent-1 (wedge selection), strategy-agent-2
(pricing hypothesis), and the masterdoc v2 §11 brief.

---

## The wedge — pick (a)

**Open-publish the BKG sliver-launch teardown as Campaign Record #001
at `marketing.theknowledgegardens.com/campaigns/bkg-sliver-launch-2026`.**

Why:
- It's *real*. `#aikidotheAI` voice, an actual paywall, contractor
  signups we can measure.
- Rights are clear by definition — we own it.
- It sits inside the Dual Track Blitz (§6.4) which means the company has
  already committed to publicly demonstrating BKG works. The teardown is
  documentation work the founders need to do anyway, restructured into an
  AI-citable surface.

What we passed on, and why:
- **GLP-1 patient-lane teardown** — most commercially dramatic, but HKG's
  HIPAA posture audit is a pre-seed gate (§HKG state card) and any
  patient-facing campaign teardown risks fabrication or PHI exposure.
  Publish HKG teardowns *second*.
- **Seed-pitch-as-campaign-teardown** — leaks strategy mid-process and
  conflates marketing-the-platform with marketing-a-product. Cycle 005+
  artifact.

**One disagreement with the masterdoc, flagged.** §11.2 reads "internal-
first" as strict. We read it as "internal-first *for primary entity
sourcing*" — every Cycle 002–004 Campaign comes from the umbrella — but
publishing is public. Internal sourcing + public publishing are
complementary; the AI-citable graph requires public URLs to be cited.

---

## The wedge competitors (top 5 from the GEO/AEO landscape)

The 40 GEO/AEO entities are mostly market-adjacent — they sell visibility
*tracking* tools to brands. MKG sells *the structured knowledge LLMs
cite*. Different categories, different buyers. But five pose real threats:

| Competitor | Threat | MKG advantage | Their neutralizer |
|---|---|---|---|
| **Profound** ($155M, ~$1B val) | Could pivot from tracking to becoming-the-citation-source themselves | Profound is a SaaS dashboard; MKG is a graph LLMs index | They open-source a JSON-LD'd benchmark library before MKG hits density |
| **Bluefish AI** ($68M) | Closest direct positioning; "agentic marketing" for F500 with Salesforce + Bloomberg integrations | Bluefish is closed enterprise; MKG is public, neutral, AI-citable; F500 brands won't share campaign data with each other but our internal data is open by definition | They open-source a "marketing knowledge graph" sponsored by F500 customers |
| **AirOps** ($60M Greylock) | "Content engineering for AI search" — most architecturally similar | AirOps optimizes *customers'* content for AI; MKG *is* the content AI cites. Pickaxe vs gold | They start hosting customer campaign teardowns on a shared canonical domain |
| **Adobe LLM Optimizer** | Distribution; every F500 already pays Adobe | Adobe outputs are biased toward whoever pays Adobe; not a neutral source | They acquire a small GEO firm with content-publishing chops and rebrand it as an open library |
| **HubSpot AEO** ($50/mo, embedded) | CRM scale = volume threat. AEO Grader is exactly the gravity well we should be building, and they shipped first | HubSpot's data is locked behind login; MKG's is public and citable | They expand the AEO Grader into a free public taxonomy of campaign types/channels/audiences |

The single shared blind spot: none of them ships a *neutral, primary-
entity-anchored, JSON-LD-first knowledge graph*. They build tools for
brands to compete; nobody builds the ground truth. Citation baseline
confirmed: **zero** neutral / taxonomic sources surface for any of the
four canonical questions. **That gap is MKG's wedge.** Pattern-as-product
(§6.3.3) is the moat: when a competitor copies our format for *their*
vertical, we have already deployed it across five.

---

## The 90-day GTM

### Weeks 1–4 — Foundation + first public artifact

Per masterdoc §11.8: lock Campaign primary entity (done — schema v0.2),
fork the OKG kernel (Marketing/website/ scaffold), stand up the Campaign
Teardown on the BKG sliver-launch record, get nine internal campaigns
committed with three sources each.

**Single addition.** End of Week 4: **publish the BKG sliver-launch
teardown publicly** at `marketing.theknowledgegardens.com/campaigns/bkg-
sliver-launch-2026`. Seed via one LinkedIn post from Chilly that links
to the canonical URL. Nothing more — no announcement of MKG, no press,
just the artifact, indexed, with `llms.txt` and JSON-LD verified. This
is the leakage test.

### Weeks 5–8 — Density inside, two leakage tests outside

Push to 30+ campaign records (§11.8 Week 5+). All cross-linked to ≥2
others, each pulling from §11.4's data triangle (MSI / Ehrenberg-Bass +
WordStream/HubSpot/Mailchimp/Meta/Google + ad-platform first-party).

Two leakage tests:
1. **Second public teardown** — OKG Bloom Ledger documentary campaign,
   start of Week 6, cross-linked to the BKG teardown.
2. **Anthropic conversation pre-seed** (§6.5.4) gets a concrete artifact
   to point at; MCP server endpoint registered on `theknowledgegardens.
   com`'s federation index. Goal: `claude.ai` and `chatgpt.com` retrieve
   MKG URLs when asked long-tail queries like *"how was the BKG launch
   structured."*

### Weeks 9–12 — First moat measurements + the third leakage test

Continue density toward 60 campaigns. Re-run citation-health baseline.
Submit one teardown to *one* second-order surface — Hacker News (BKG
sliver-launch is on-topic) or a marketing trade publication via Chilly
as op-ed framed *"how we structured a campaign for AI citation."* The
point is testing whether *humans* will cite MKG's structure, because
human citation is upstream of LLM citation in the current corpus.

---

## The first 5 metrics (Cycle 002 → 005 dispatch reports must include)

Vanity rejected. Each chosen because it tells us if the moat is forming.

1. **Citation health delta vs. baseline.** Re-run four canonical
   questions + four long-tail. Count: MKG URLs in top 10 web results;
   MKG citations from Claude/ChatGPT/Perplexity/Gemini with browsing on;
   whether LLMs use MKG's category names. North-star.
2. **Cross-link density per campaign record.** Average outbound cross-
   links per Campaign, with floor (every record ≥2). Cross-garden links
   tracked separately because federation §2.5.4 is the second moat
   layer. Goal: cross-garden ≥1 per Campaign by Cycle 003.
3. **Source-triangle completeness rate.** Fraction of Campaign records
   with all three of Authority + Observation + Commerce sources cited
   (§11.4). Below 90% triggers Critic escalation.
4. **RSI heartbeat — fresh-update count.** Count of Campaign records
   updated in the last 30 days from at least one programmatic ingestion.
   Without a number that's growing, the garden is a brochure.
5. **MCP retrieval count.** Distinct external agents that retrieved an
   MKG entity in the last cycle. Slope matters more than level.

---

## Pricing hypothesis (when MKG opens externally — post-MRR per §6.4)

From strategy-agent-2's analysis of the 40 GEO/AEO competitors. Pricing
distribution: subscription 70% / enterprise 17.5% / freemium 12.5%.
Median tiers: SMB ~$50/mo, mid-market ~$125/mo, upper-SMB ~$400/mo.
Enterprise opaque but Bluefish ($68M) / BrightEdge ($62M) / Brandlight
($35.75M) imply $50K–$250K+ ACV.

| Lane | MKG offering | Price | Reasoning |
|---|---|---|---|
| **Public** | Free Campaign Teardown — paste a campaign URL or upload assets, MKG structures it. **Output is a JSON-LD entry in the graph,** not just a score. | Free | Only HubSpot's AEO Grader truly serves the public-tool slot. Open real estate. The output-as-graph-entry is the differentiator. |
| **Professional · Practitioner** | 5 teardowns / mo, Anatomy + Intelligence tabs, framework citations | $79 / mo | Premium to median ($50–125) justified by graph-derived insights vs. rank-tracking parity |
| **Professional · Studio** | Unlimited teardowns, MCP server access, JSON-LD exports, write-back to graph | $249 / mo | Anchored to mid-market upper tier (Surfer Pro $182, Trakkr Scale $399) |
| **Professional · Studio+** | Studio + agency white-label + multi-brand workspaces | $799 / mo | Anchored to Ahrefs Brand Radar bundle ($699 + $129) |
| **Admin** | Vendor intelligence, M&A target maps, custom landscape reports | $60K–$240K ACV | Buyers ranked: holdcos > PE diligence > F500 CMOs |
| **Machine · Community** | API, attribution-gated | Free | Stripe move; LLMs cite us = moat |
| **Machine · Startup** | API + bulk export, no training rights | $2K / mo | |
| **Machine · Enterprise Data License** | Full graph + training rights | $250K–$2M / yr | Bloomberg-class niche dataset pricing |

Full memo: `PRICING_HYPOTHESIS.md` — same folder.

---

## Kill criteria (when to pivot off internal-first)

By end of Week 12, pivot if any of:

1. **Zero LLM citation movement on long-tail queries.** Then the
   structure-without-distribution hypothesis is wrong. Pivot: 3 public
   teardowns per cycle + active outbound (op-eds, podcasts, YouTube SEO).
2. **A wedge competitor open-sources a comparable graph first.** Profound,
   AirOps, or HubSpot publishes a free, public, JSON-LD'd campaign
   benchmark library before MKG hits 30 records. Pivot: re-position MKG
   as the *cross-vertical* graph (federation moat §2.5.4); shift primary
   differentiation from layers 1+2 to layer 4.
3. **Internal campaigns aren't varied enough for taxonomic coverage.**
   By Week 8 every record is a "founder writes a launch post" campaign.
   Pivot: open one tier-gated external category (e.g. HVAC contractor
   campaigns from BKG paying customers, rights cleared) earlier than
   Week 5+.
4. **Anti-fabrication rate breaks under deadline pressure.** Source-
   triangle completeness drops below 90%. Don't pivot strategy — fix
   discipline. Stop publishing until source rate is back at 100%.
5. **The BKG teardown gets zero organic distribution.** Fewer than 5
   inbound links by Week 8. Triage: re-cut as YouTube; cross-publish
   excerpt to Substack; submit to Hacker News. Pivot small first.

The default disposition: trust the internal-first thesis, ship discipline,
measure the moat. Pivot only on hard evidence, and pivot small first.

---

## What MKG explicitly does NOT do in Cycle 002

- Build a campaign builder for marketers (post-internal-sliver).
- Open MKG to external customers (post-MRR per §6.4).
- Real-time platform API connections (Cycle 004+).
- Attribution modeling itself (we catalog and cite; we don't invent).
- Multi-tenant marketing tool (post-density).
- Vanity metrics or PR. Gravity, not promotion (§6.3.2).

---

## The single sentence

> Internal-first sourcing, public-first publishing, Campaign as primary
> entity, Campaign Teardown as the killer app, BKG sliver-launch as
> Cycle 002's first public artifact, citation health as the north-star
> metric, and pattern-as-product as the moat. Ship discipline; measure
> the moat; pivot only on hard evidence.
