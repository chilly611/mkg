# MKG Packaging Hypothesis — Cycle 002

*Strategy memo from strategy-agent-2 to the Architect. Pricing card is a hypothesis for when MKG opens externally; MKG remains internal-first today.*

---

## One-page price card

| Lane | Tier | Price | What's included | Anchor |
|------|------|-------|-----------------|--------|
| **Public** | Free | $0 | One free **Campaign Teardown** per email/month — paste a URL or upload a deck/landing page, MKG returns a structured JSON-LD profile (positioning, claims, motifs, citations) plus a public shareable card. Read-only graph browse. AEO Grader-style scorecard. | HubSpot AEO Grader (free), Knowatoa free audit, LLMrefs free LLMs.txt generator |
| **Professional** | **Practitioner** | **$79/mo** | 25 teardowns/mo, full graph search, Compare tab (head-to-head), CSV/JSON-LD export, 1 seat. | Trakkr Growth $79, Mangools $15.60, Rankscale $99 |
| | **Studio** | **$249/mo** | 200 teardowns/mo, white-label exports, MCP server access (read), 5 seats, weekly graph delta digests, agency multi-client dashboard. | Trakkr Scale $399, Searchable Scale $400, Surfer Pro $182, SE Visible Pro €199 |
| | **Studio+** | **$799/mo** | Unlimited teardowns, custom taxonomies, write-back to graph (proposed entities queue), 15 seats, Slack/HubSpot/Salesforce integrations, SSO. | Ahrefs Brand Radar bundle $699 + $129 base, Semrush AI Toolkit ~$265, SE Visible Enterprise €499 |
| **Admin** | **Enterprise** | **$60K–$240K/yr** | Annual contract; private graph branches for confidential brands/campaigns; dedicated entity research analyst hours; PE/holdco diligence packages; on-prem mirror option; audit logs; custom JSON-LD schemas; SLAs. | Bluefish ($68M raised, F500 CMOs), Brandlight, Evertune, Adobe LLM Optimizer, BrightEdge, Conductor — all enterprise-only |
| **Machine** | **Community API** | **$0** (rate-limited) | 1,000 calls/mo, public entities only, attribution required, no commercial AI training use. | OpenAI free tier model, Crunchbase Basic |
| | **Startup API** | **$2,000/mo** | 250K calls/mo, all public entities + relationships, embeddings endpoint, no attribution required, commercial use allowed for products <$10M ARR. | Twilio dev, Stripe-style scaling |
| | **Enterprise Data License** | **$250K–$2M/yr** | Bulk dump + delta feed, training-rights license, named-graph access (private branches if negotiated), MNDA, vendor diligence support. | Reddit–Google ($60M/yr), Stack Overflow–OpenAI, Shutterstock–OpenAI |

---

## 1. Pricing-pattern analysis (n=40 GEO/AEO entities)

**Model mix.** Subscription dominates at **70% (28/40)**; enterprise-only **17.5% (7)**: Bluefish, Brandlight, Evertune, Adobe LLM Optimizer, Conductor, BrightEdge, Meltwater GenAI Lens. Freemium **12.5% (5)**: Otterly.AI, Knowatoa, Trakkr, Writesonic, LLMrefs. Notably, **only one truly free public-graph tool exists** (HubSpot's AEO Grader as a CRM funnel) — the public-lane real estate is wide open.

**Public-price tiers (where disclosed).**
- **SMB/entry median:** ~$50/mo. Range from Mangools $15.60 (annual) → Rankscale Essentials $20 → Airefs $24 → Nightwatch base $32 → Surfer Discovery $49 → HubSpot AEO standalone $50 → Searchable Starter $50.
- **Mid-market median:** ~$125/mo. Surfer Standard $99, Rankscale Pro $99, Semrush AI Toolkit add-on $99, Nightwatch AI add-on $99, Searchable Professional $125, Surfer Pro $182, SE Visible Pro €199 (~$215).
- **Upper-SMB / agency median:** ~$400/mo. Trakkr Scale $399, Searchable Scale $400, SE Visible Enterprise €499 (~$540), Ahrefs Brand Radar bundle $699 + base.

**Outliers.** Low: **Mangools $15.60/mo** is the floor — explicitly an SEO suite add-on, not a standalone GEO tool. High end of public pricing: **Ahrefs Brand Radar $699/mo bundle on top of $129+ base**. True enterprise contracts are demo-gated; based on funding (Profound $155M, Bluefish $68M, BrightEdge $62M, Brandlight $35.75M), Fortune-500 ACVs likely run **$50K–$250K+** per logo with a long tail to $1M for Adobe/BrightEdge.

**Insight.** The category has bifurcated. SMB tools cluster at $20–$200 against ChatGPT/Perplexity tracking. Enterprise sits at $50K+ ACV and is opaque. **The $200–$800 mid-market band is crowded but undifferentiated** — every tool tracks the same 5–10 LLMs. MKG's wedge is *what they don't have*: a structured, citable, JSON-LD knowledge graph instead of a rank-tracker dashboard.

---

## 2. Four-lane MKG packaging

### Public Lane (free) — gravity well
**The one tool: Campaign Teardown.** User pastes a campaign URL or uploads assets (landing page, deck, ad). MKG returns a structured profile: positioning, claims, motifs, comparable entities in the graph, JSON-LD that's instantly citable. Public, shareable, embedded with MKG attribution. This is the **MLP**: it does one thing AEO Grader and Knowatoa don't — it produces a *graph entry*, not a score. Each teardown also seeds discovery for the public graph, compounding citation surface. Cost-managed via 1/email/month with email capture funneling to Practitioner.

### Professional Lane (subscription) — in-house marketers + agencies
Three tiers, named to reinforce craft over surveillance:
- **Practitioner $79/mo** — solo marketer/consultant. Sits exactly at Trakkr Growth.
- **Studio $249/mo** — small agency or in-house team. Slots between Trakkr Scale ($399) and Surfer Pro ($182). Includes MCP read access — a differentiator competitors don't ship.
- **Studio+ $799/mo** — agencies and mid-market. Aggressive vs. Ahrefs Brand Radar's $699+$129 bundle but justified because MKG ships *write-back* (your graph edits become part of the canonical knowledge surface — economic incentive to participate).

### Admin Lane (enterprise)
**Buyer profiles, in order of pursue-priority:**
1. **Agency holdcos** (WPP, Publicis, IPG, Omnicom, Stagwell). They need structured competitive intelligence across hundreds of clients. ACV: **$120K–$240K** for holdco license.
2. **PE firms doing martech diligence.** MKG = the truth-layer for "is this acquisition target's category narrative real?" One-off engagements $40K–$80K + recurring $60K/yr subscription.
3. **F500 CMOs of regulated/governance-sensitive industries** (financial services, pharma, CPG). Bluefish and Brandlight have proven willingness to pay here. ACV: **$80K–$180K**.

**Package:** private branch of the graph for confidential brand/launch work, dedicated research analyst (4–20 hrs/mo bundled), custom JSON-LD schemas, SSO, audit logs, on-prem mirror, SLA. **Floor $60K, target median $120K, ceiling $240K** in year 1; expand from there.

### Machine Lane (data API to AI providers)
Highest-margin, lowest-effort once the graph is canonical. Three tiers (next section).

---

## 3. The Stripe move — 3-tier API license

| Tier | Price | Calls | Rights | What's gated |
|------|-------|-------|--------|--------------|
| **Community** | Free | 1,000/mo, 10 RPM | Attribution required ("Source: Marketing Knowledge Garden, mkg.ai/[entity]"); no AI training use; non-commercial or revenue <$1M ARR | Public entities only. No private branches, no embeddings, no relationship graph traversal beyond depth-2. No bulk export. |
| **Startup** | $2,000/mo | 250K/mo, 100 RPM | Commercial use up to $10M ARR; no attribution required; no model-training rights | Adds: full relationship traversal, embeddings endpoint, webhook deltas, SLA 99.5%. Still no training rights, no private branches. |
| **Enterprise Data License** | $250K–$2M/yr | Unlimited or bulk | **Training-rights license**, MNDA, named-graph access negotiated, vendor diligence package | Adds: full bulk dump + nightly delta feed, custom embeddings, dedicated representation rep, indemnification. The model-training right is the gate that justifies the price. |

**Comparable benchmarks.**
- Reddit's licensing deal with Google: **~$60M/yr** for training rights.
- Stack Overflow–OpenAI: undisclosed but estimated 8-figure annual.
- Shutterstock–OpenAI: ~$25M/yr image data deal.
- Twilio API: ~$0.0085/SMS — per-call works for high-volume utility data but doesn't fit MKG (low volume, high uniqueness).
- **MKG should price like a niche dataset license, not like Twilio.** Per-MAU pricing is the wrong frame — MKG isn't a runtime dependency, it's a knowledge supply. Flat annual with usage caps fits the buyer's mental model (Bloomberg Terminal, S&P Capital IQ, Crunchbase Enterprise).

---

## 4. Anchoring math (median → MKG → reasoning)

| Lane | Competitor median | MKG suggested | Premium/discount | Reasoning |
|------|-------------------|---------------|------------------|-----------|
| Public | $0 (HubSpot AEO Grader, Knowatoa free audit) | **$0 + email** | Parity | Match the table-stakes free tier but ship a teardown that produces a graph entry, not a score. Differentiator is *output structure*, not price. |
| Pro entry | ~$50/mo | **$79/mo** | +58% | We skip the lowest-cost rank-tracker tier intentionally — MKG's value is the graph, not bot-emulation rank tracking. Practitioner tier matches Trakkr Growth $79 exactly; positions us as "the graph layer," not "another tracker." |
| Pro mid | ~$125/mo | **$249/mo** | +99% | Justified by MCP server read access (no competitor ships this), white-label JSON-LD exports, multi-client dashboard. Studio is meaningfully cheaper than Ahrefs Brand Radar bundle ($699+) and Searchable Scale ($400) once seats are factored. |
| Pro top | ~$400/mo | **$799/mo** | +100% | Sits above the public mid-market ceiling because of write-back and integrations. Buyer is a 5–15 person agency doing client work; the MKG graph becomes their proprietary research asset. Still ~50% under the Ahrefs+base bundle when calculated all-in. |
| Admin | Opaque, est. $80K–$200K ACV (Bluefish, Brandlight, Evertune, Adobe) | **$120K target** | At median | We do not undercut here. Enterprise buyers read low prices as low credibility. We match the field but ship the only product that is *citable by AI by construction*. |
| Machine free | OpenAI/Anthropic dev tier free | **Free, attribution-gated** | At parity | Standard dev-tier mechanic. Attribution is the asset — every Community-tier call seeds canonicality. |
| Machine startup | ~$1K–$5K/mo for dataset APIs (Crunchbase, Clearbit) | **$2K/mo** | Mid-band | Anchored to Crunchbase Pro/Enterprise API. Low enough that an AI-native startup expenses it without procurement. |
| Machine enterprise | Reddit–Google $60M, Shutterstock–OpenAI $25M, Stack Overflow undisclosed | **$250K–$2M/yr** | Far below mega-deals | We are not Reddit-scale. Floor at $250K matches Bloomberg Terminal-class niche data; ceiling at $2M reserved for full bulk + training rights to a frontier lab. Walk before running — first deal is the proof, not the windfall. |

---

## Open questions for the Architect

1. **Public lane CAC absorption.** One free teardown/email/month assumes LLM API costs ~$0.20–$2 per teardown. At 50K monthly teardowns that's $10K–$100K/mo. Need a budget cap or tiered free quotas.
2. **Write-back economics.** Studio+ users edit the graph. Do those edits become CC-BY MKG property? The Wikipedia/OSM-style legal frame matters before launch.
3. **Holdco vs. F500 sequencing.** Pursuing one agency holdco delivers more graph density faster than 5 F500 logos. Recommendation: holdco first.
4. **Machine Lane training-rights default.** For Cycle 002 internal-only, decide now whether the public graph is CC-BY-SA or CC-BY-NC by default — that constraint determines whether the $2M Enterprise License has anything to gate.
