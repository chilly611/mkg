# The Not-Doing List
**The Marketing Architect · Cycle 003 curation · 2026-05-10**

There are 1,000 things we could build and 100 channels we could test. The
constraint is not ideas; it is discipline about what to refuse. This
document is the refusal list. The team should walk away knowing what they
are *freed from* — not what they are still on the hook for.

The product is **The Marketing Architect**: a paid Campaign Teardown SKU
that produces a JSON-LD entity in a public graph. That is it. Everything
below is something we are *not* doing in v1, with the trigger that would
make us reconsider.

---

## Section 1 — Architectural traps we are explicitly NOT building

### 1. The full Knowledge Garden (4 lanes × 3 surfaces) for marketing
**No.** A Public/Pro/Admin/Machine matrix with all the surfaces
(teardowns, dashboards, MCP, exports, white-label) is the 24-month
endgame, not the v1. Building it now means shipping nothing well and
selling nothing. Reconsider trigger: 100+ paid teardowns shipped and a
Pro tier waitlist of 50+ self-identified buyers.

### 2. The RSI heartbeat with all 5 separate loops
**No.** Three RSI loops, eight cron schedules, nine agents, embedding
jobs — this is the operating system of a mature graph, not a v1 product.
We will run *one* loop in v1: the human-curated teardown queue. The
other loops get scaffolded only after the first 30 paid teardowns prove
demand. Reconsider trigger: ingestion volume exceeds what one human can
queue, or duplicate-entity rate exceeds 10%.

### 3. Internal-first sourcing as a 12-week wall
**No.** Twelve weeks of only-umbrella campaigns produces a graph that
looks like a self-portrait. The devil's-advocate critique was right: by
the time the falsifying signal arrives, we are a quarter underwater.
We will sell paid teardowns of *external* campaigns from Day One.
Internal teardowns continue, but as anchor cases, not as the wall.
Reconsider trigger: never. This is a permanent change.

### 4. Citation health as the only metric
**No.** Citation health is one of three metrics, not the north-star.
Revenue (paid teardowns shipped) and qualified pipeline (enterprise
conversations booked) get equal weight. A north-star you cannot move for
90 days is not a north-star, it is a wish. Reconsider trigger: revenue
crosses $50K cumulative, at which point citation health can re-take
primacy because the calibration loop is funded.

### 5. A marketplace of consultants
**No.** A two-sided marketplace where marketers can list themselves and
brands can hire them is a tempting "platform" extension. Two-sided
marketplaces are the hardest business in software, and we have neither
side yet. Reconsider trigger: 500+ Pro-tier subscribers asking
unprompted for "who can implement this for me."

### 6. A community / Slack / Discord
**No.** A community is a 12–18 month build before revenue impact, and a
community without an audience is an empty room with a moderator. We do
not have an audience yet. Build the audience first via Chilly's POV
voice; the room can come later. Reconsider trigger: 5,000+ LinkedIn
followers on Chilly's account, plus 10+ inbound DMs/week asking "is
there a place where people who think like this hang out?"

### 7. A certification program
**No.** "Marketing Architect Certified" is the Clay-style endgame and it
is a real lever, but it requires a curriculum, an exam, a registry, and
a community of certified practitioners *to* certify. We have none of
these. Reconsider trigger: 50+ Studio-tier customers and a documented
methodology used by 5+ outside agencies in client work.

### 8. A "dashboard" of any kind in v1
**No.** No graphs, no rank-tracking, no LLM-citation counter, no
"score." Every GEO/AEO competitor ships a dashboard; ours is the entity
itself. The teardown *is* the deliverable. A dashboard is the trap that
makes us look like Profound or Trakkr, which is a category we lose.
Reconsider trigger: a paying customer asks for one in writing, twice.

### 9. A 60-page benchmark report
**No.** Original research-as-marketing is a strong play, but a 60-page
PDF is a one-time artifact masquerading as a flywheel. Each *paid
teardown* is already a benchmark report-of-one, distributable, citable,
and revenue-funded. Reconsider trigger: we have 30+ teardowns and an
agency holdco asks for a synthesized cross-cut.

### 10. The MCP server in v1
**No.** The MCP server is the Machine Lane and it matters — but until
external agents are actually retrieving MKG entities at volume, building
the server is shipping infrastructure to an empty audience. Static
JSON-LD on every entity page is enough for v1; agents and crawlers can
read HTML. Reconsider trigger: the citation health test shows Claude or
ChatGPT reaching for MKG URLs, or a frontier lab inquires about the
data.

### 11. Multi-tenant architecture
**No.** Per-customer workspaces, isolated graphs, role-based access on
private branches — all of this is needed for the Admin Lane and none of
it is needed in v1. The first 100 customers buy a public deliverable
that lives in a public graph. Reconsider trigger: a $60K+ Admin
contract is signed with a private-branch requirement.

### 12. Inheriting the "Knowledge Garden" tagline as the product brand
**No.** "The ground truth marketing AI cites" is the umbrella tagline.
The product is **The Marketing Architect**, and it carries its own
positioning: *the paid teardown that produces a citable entity*. Leading
with "Knowledge Garden" forces every prospect through a 90-second
explanation before they can buy. Reconsider trigger: federation effects
become large enough that the Garden brand is doing inbound work for the
product (measurably, via referring traffic).

---

## Section 2 — Marketing tactics we are explicitly NOT using in v1

### 1. Paid Meta / Google
**No.** B2B paid social ROAS at our ACV is a 6-month optimization curve
and we have neither the creative volume nor the conversion infrastructure
to feed it. Burning $5K/month here while we are still iterating the offer
is lighting calibration money on fire. Reconsider trigger: a repeatable
$500-CAC organic acquisition path exists; paid is then used to scale it.

### 2. LinkedIn ads
**No.** LinkedIn ads ROAS is inconsistent except for highly-targeted ABM
lists. We don't have the list, the offer-market fit, or the retargeting
pool yet. Warm LinkedIn outbound from John (free) statistically dominates
LinkedIn ads at our stage. Reconsider trigger: John's outbound saturates
his network and we need to reach matched-audience CMOs cold.

### 3. Cold email blast
**No.** 0.3% reply rates, deliverability risk to our future domain
reputation, and a brand position ("the ground truth") that is
incompatible with spray-and-pray. AI-personalized direct mail to a named
list of 200 CMOs replaces this entirely. Reconsider trigger: never at
volume. We may run signal-based 1:1 outbound to <50 named accounts, but
that is sales, not "cold email."

### 4. SEO content engine
**No.** We are not writing 4 blog posts a week to rank for
"best marketing analytics tool." AI Overviews are eating that funnel and
the corpus we want to live in is structured entities, not blog posts.
Each paid teardown *is* the SEO asset. Reconsider trigger: Google ships
something that materially restores informational-query click-through;
even then, we revisit cautiously.

### 5. A newsletter
**No.** A newsletter without an audience is a 6-month investment in
writing into a void. Chilly's LinkedIn POV voice builds the audience
first; the newsletter follows when there is somewhere for it to land.
Reconsider trigger: 3,000+ LinkedIn followers and >5 unprompted "where
do I subscribe?" DMs.

### 6. Referral program
**No.** Referral programs work when there is something to refer to and
someone to refer it. Day One we have neither customers nor a flow ready
to handle inbound. Building a referral mechanic before the first 30
customers is solving a problem we don't have. Reconsider trigger: 30
paid customers, with 3+ of them having organically referred a friend
without a program.

### 7. VC portfolio Slack networks
**No, unless natural.** We do not pursue access to a16z, Sequoia, or
Bessemer portfolio Slacks as a tactic — that is positioning ourselves as
a vendor begging for distribution. If a portfolio company surfaces
organically through John's network and a Slack intro happens, we accept.
Reconsider trigger: a portfolio company *asks* to share us.

### 8. Conference sponsorships
**No.** $50K–$150K for a logo on a banner, payback 6–12 months, and the
audience is wrong-stage for a $149 SKU. Small executive dinners (8–12
people, $400–$800/qualified meeting) are the version of this tactic
that fits, and even those are a Cycle 005+ test. Reconsider trigger:
the Admin Lane has 5+ closed deals and we are sourcing F500 logos.

### 9. Webinars
**No.** Webinars require a list (we don't have one), a speaker calendar
(we don't have one), and a follow-up sequence (we don't have one).
Three things we don't have, in service of a tactic with declining
attendance. Reconsider trigger: a partner with an existing list invites
us to co-host, and the work is theirs.

### 10. A podcast we host
**No.** Hosting a podcast is a 12-month-minimum brand investment with a
production load that competes directly with shipping teardowns. Going on
*other* people's podcasts is the v1 version of this tactic. Reconsider
trigger: 50+ teardowns shipped and a clear content thesis that the
written form cannot carry.

### 11. Hiring an SDR
**No.** An SDR before product-market fit is hiring a person to scale a
script that doesn't yet exist. John's warm outbound writes the script;
the SDR comes later to execute it. Reconsider trigger: John's outbound
produces a repeatable conversion pattern (e.g. 25%+ meeting-to-pilot)
across 20+ conversations.

---

## Section 3 — Conversations we are NOT having yet

### 1. Garden federation cross-links beyond the required minimum
**No.** Each Campaign Teardown cross-links to ≥1 sister garden because
that is in the spec. We are *not* having the meeting about a federation
search index, a unified umbrella nav, or cross-garden recommendation
engines. Tabled until v1 ships. Reconsider trigger: the Marketing
Architect ships and produces revenue; then federation is a distribution
multiplier worth designing for.

### 2. Frontier 52 expansion
**No.** Expanding the wedge research from GEO/AEO into the next 52
frontier categories is a Cycle 008+ conversation. Doing it now is
breadth at the expense of depth. Reconsider trigger: 100+ teardowns
and a credible signal that GEO/AEO category has matured (e.g. consolidation,
clear winner emerging).

### 3. HKG / BKG marketing teardowns of *their* campaigns as MKG inventory
**No.** HKG GLP-1 and BKG sliver-launch teardowns happen because they
are anchor cases for MKG itself. We are *not* having the conversation
about MKG running marketing-as-a-service for the sister gardens.
Reconsider trigger: a sister garden hits product-market fit and explicitly
asks for marketing support that MKG is uniquely positioned to provide.

### 4. The Marketing Architect for non-English markets
**No.** LATAM, EMEA, APAC localization is a real opportunity per the
research, but it is a 2027 conversation. v1 ships in English to a US/UK
buyer. Reconsider trigger: 200+ paid teardowns and >15% of inbound
inquiries arriving in non-English.

### 5. Anthropic conversation pre-seed
**No, not yet.** Reaching out to Anthropic to make MKG part of Claude's
retrieval corpus is high-leverage *once we have something to point at*.
Reaching out before the first 30 teardowns are public is asking for a
favor instead of offering value. Tabled until Cycle 005. Reconsider
trigger: 30 public teardowns live and citation health test shows zero
movement after two cycles — at which point we ask why, with artifacts in
hand.

### 6. Whether to incorporate as a separate entity
**No.** Spinning MKG out as its own legal entity, with its own cap
table, its own bank account, its own operating agreement, is a
distraction from shipping. The umbrella holds it for now. Reconsider
trigger: an outside investor wants to write a check specifically into
MKG, or revenue exceeds $250K cumulative.

### 7. Hiring (anyone)
**No.** No SDR, no designer, no engineer, no ops hire. The current team
plus the agent roster is the team for v1. Adding humans before the
machine + founder loop is fully utilized is solving for headcount, not
output. Reconsider trigger: founder weeks consistently exceed 60 hours
across two consecutive cycles *and* there is a clearly-scoped role that
unblocks revenue.

---

## The 5-thing list of what we ARE doing.

1. **Ship the paid Campaign Teardown SKU** ($149 / $499 / $1,999) with Stripe, on the parchment site, with public JSON-LD entity output.
2. **Publish the BKG sliver-launch teardown** as Campaign Record #001 — the first leakage test, the first proof.
3. **Chilly posts on LinkedIn 4×/week** with the Knowledge Gardens federation thesis. Founder voice, no ghost-writing.
4. **John runs warm outbound** to 5 enterprise contacts/week from his Modio/CHG network — learning conversations, not pitches.
5. **Send one AI-personalized direct-mail wave** to 200 named CMOs in Week 6 — printed teardown of *their* campaign, handwritten note.

Five things. That is the cycle. Everything else on this list stays on
the list until something on those five lines changes.
