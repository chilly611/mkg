# The Marketing Architect

**Product spec, v1. 2026-05-10. Author: spec-architect-1.**

---

## The single sentence

**The Marketing Architect reads your business and tells you the three things to do, the seven things to ignore, and exactly who else is fighting for your buyer's attention — with a citation behind every claim.**

---

## 1. What it is

The Marketing Architect is a senior strategist you hire by the hour, except it works in twelve minutes and it has read the entire 2026 AI marketing landscape so you don't have to. You give it a URL, a brief, or a sentence about your business. It gives you back a recommendation memo that names channels, names competitors, names the campaign you should ship next, and — most importantly — names the four things every other tool would tell you to do that you should refuse. It is a marketing brain that has done the homework, refuses to make up numbers, and has an opinion.

It is not software you log into every day. It is a service you call when a real decision is on the table.

---

## 2. Who uses it

Four named personas. Anyone who isn't one of these is not a v1 customer.

- **Sera, founder of a $5M Series A B2B SaaS** (38 people, vertical software, sells to ops teams at mid-market companies). Just raised, board pressure to show a marketing function, can't justify a $250K CMO yet, drowning in vendor pitches. Uses The Marketing Architect to decide whether to hire a head of growth or a fractional CMO, and what the first 90 days should target.
- **Marcus, head of growth at a 50-person Series B** (vertical: prosumer creative tools, $12M ARR, 22% MoM new logos slowing to 6%). Has a team of three, an agency on retainer, and a CEO asking why CAC tripled. Uses The Marketing Architect to pressure-test whether the agency's plan is real or theater, and to find the channel his competitors are quietly winning on.
- **Priya, fractional CMO** (works with four portfolio companies at once, $18K/mo per engagement). Sells diagnostic depth as her wedge. Uses The Marketing Architect to do in two hours the kind of competitive teardown that used to take her a week, so she can sell five engagements instead of four.
- **Daniel, agency planner at a 30-person shop** (mid-market B2B accounts, $8K–$25K monthly retainers). Pitches against four competitors per RFP. Uses The Marketing Architect to walk into a pitch with a teardown of the prospect's last campaign already done, and to spot which of his agency's standard tactics will not work for this account.

We are not selling to: enterprise CMOs (they have teams), small businesses under $1M revenue (they need ads, not strategy), or in-house content marketers shopping for a writing tool (wrong product entirely).

---

## 3. What it actually does

Three input modes. Three output modes. Each pairing is real and shippable.

### Inputs

**Input A — Paste a URL.** The Architect crawls the homepage, the pricing page, the blog index, and the last six months of LinkedIn posts from the founder if findable. It produces a brand-voice profile (sentence rhythm, claim style, what the brand never says), a positioning read, and a three-sentence summary of who this company is selling to.

**Input B — Describe a business in 200 words.** Free-text intake: who you sell to, what you sell, what's working, what's stuck. The Architect asks four targeted follow-ups, no more.

**Input C — Upload a brief or pitch deck.** PDF, deck, or doc. The Architect extracts the actual claims (revenue, ICP, GTM thesis), flags the unsupported ones, and asks where each verifiable number came from before it will use them in any output.

### Outputs

**Output 1 — The Recommendation Memo (the core SKU).** A 6–10 page document with one job: tell the customer the three plays to run in the next 90 days and the seven to refuse. Structure:

1. *Read of the business* — one paragraph, no flattery.
2. *Three plays, ranked* — for each: the channel, why it fits this specific business, the rough cost, the rough timeline to signal, and the named competitor or operator who has already done it well.
3. *Seven refusals* — channels, tactics, and tools we tell them not to spend on, with the reason. (E.g. "Do not buy a HubSpot AI Search Grader subscription. Your buyer doesn't ask LLMs about you yet — they ask their network.")
4. *Two campaigns to ship in the next 30 days* — with the exact creative brief.
5. *Citations* — every number tied to a named source.

**Output 2 — The Campaign Teardown.** Pick a campaign — yours, a competitor's, or one we recommend. The Architect produces a structured teardown: the hook, the audience read, the channel mix, the production cost (estimated, with method shown), the result (when public), and what to steal versus what was specific to that brand and won't transfer. Reads like Stripe Press wrote a Mark Ritson column.

**Output 3 — The Market Map.** Given an audience definition, the Architect returns a one-page map of the 12–25 companies (from the curated 150-co landscape and ongoing research) currently fighting for that buyer's attention: the GEO platforms, the agencies, the AI-content tools, the incumbents pivoting in. For each: tier, region, what they actually do, and whether they should be a competitor, a partner, or a tool the customer should buy.

A real example end-to-end: Marcus pastes his URL. Twelve minutes later he has a memo telling him (1) ship a Reddit-native answer campaign, the only channel his three closest competitors are ignoring, $4K test, (2) cancel his SEO agency contract this quarter — they're optimizing for a SERP his ICP no longer uses, (3) start his founder posting on LinkedIn three times a week with the exact thesis his product earns the right to claim. Plus a teardown of his closest competitor's last campaign (it failed, here's why). Plus a market map showing two AI-UGC tools his agency hasn't told him about.

---

## 4. The agent's actual capabilities

Six things the system must do well. Anything outside this list is out of scope.

1. **Read a site and extract a brand-voice profile.** Sentence-level analysis: average length, claim density, hedging frequency, what the brand asserts versus what it implies. Output is descriptive, not prescriptive.
2. **Pull from the curated 150-company AI marketing landscape** (the file Chilly already built) plus a continuously updated index, and recommend specific tools, competitors, and partners by name with the reason for each.
3. **Write campaign briefs that are actually shippable.** A real brief: hook, audience, channel, asset list, production cost estimate, success criteria, kill criteria. Not "drive engagement through compelling content."
4. **Refuse to fabricate numbers.** Every numeric claim in any output must be tied to a named source row. If the source doesn't exist, the number doesn't ship — the memo says "unknown" and recommends how to find out.
5. **Tell the user what NOT to do.** Every memo has a Refusals section equal in weight to the Recommendations section. The product is judged half on what it leaves out.
6. **Hold an opinion.** When two paths are defensible, the Architect picks one and says why. It does not present "options to consider." It is a strategist, not a search engine.

---

## 5. Pricing

Three tiers. No usage metering, no seats.

- **$249 — Single Recommendation Memo.** One business, one memo, 24-hour turnaround. The wedge product.
- **$1,499 — The Quarterly.** One memo, plus two campaign teardowns of the customer's choice (theirs or competitors'), plus one market map for their audience, plus a 45-minute Loom walkthrough from a human strategist. Refreshed quarterly. The fractional-CMO replacement product for founders who don't want to hire one yet.
- **$8,000/quarter — The Embedded.** Everything in The Quarterly, plus monthly memos, plus a private Slack channel where the strategist (human) responds inside one business day, plus the customer's brand becomes a published Architect entity (with permission) that contributes to and benefits from the broader citation graph. Capped at 30 customers in year one.

The $249 memo exists primarily to produce case-study material and qualified leads for the two upper tiers. We expect 70% of revenue to come from The Quarterly.

---

## 6. The wedge customer (first 30)

Founders and heads-of-growth at **Series A and Series B vertical B2B SaaS companies, $3M–$15M ARR, sold to a non-tech buyer** (operations, finance, HR, legal, healthcare admin, field services). 38–80 employees. Either no marketing leader or a single one promoted from within.

Why this segment specifically:

- They have budget. ($249 is a no-brainer; $1,499 is a board-meeting line item, not a procurement event.)
- They are drowning in the AI marketing tool wave and have no internal authority to evaluate it.
- Their buyers are not on Twitter and do not yet ask LLMs about vendors. The Architect's "what NOT to do" muscle saves them from buying tools their buyer isn't reachable through.
- They produce excellent case studies because the result of a good memo is visible inside one quarter.
- John's network is dense in this segment. Warm intros are real.

The list of the first 30 is buildable from John's LinkedIn first-degree network plus three named verticals (vertical SaaS for healthcare admin, vertical SaaS for field services, vertical SaaS for legal ops). We can name 80 candidates by Friday and close 30 by Cycle 005.

---

## 7. What it is NOT

Said sharply, because the leave-out list is half the product:

- **Not a content generator.** It does not write your blog posts. It tells you whether you should be writing blog posts at all.
- **Not an SEO tool.** It does not return keyword lists, rank tracking, or backlink reports.
- **Not a social media scheduler.** It will recommend posting; it will not post.
- **Not a GEO/AEO platform.** It does not monitor LLM citations of your brand. (Profound, AthenaHQ, Evertune already do that.)
- **Not a CRM, an outbound tool, or an email platform.** It writes the brief Apollo or Klaviyo executes against.
- **Not a marketing agency.** No retainers for execution. The Embedded tier is advisory, not done-for-you.
- **Not a knowledge garden.** It is a service that uses a knowledge garden underneath. Customers do not browse it; they receive its output.
- **Not a chatbot.** No infinite-conversation interface. Inputs are bounded; outputs are deliverables.

---

## 8. The LinkedIn-ad sentence

*"Stop buying marketing tools your buyer can't be reached through. The Marketing Architect reads your business and tells you the three things to do, the seven things to ignore, and the exact campaign to ship next — for $249."*

---

## What this means for the next 30 days

Six concrete moves before June 10.

1. **Build the $249 memo end-to-end as a manual service.** Chilly + one human strategist deliver the first ten by hand. We are not building software in May; we are calibrating the deliverable.
2. **Sell the first ten memos to John's first-degree network at $249.** Goal: ten paid customers, ten testimonials, ten signed permissions to publish the memo as a public Architect entity.
3. **Productize the memo template.** Lock the seven-section structure. Lock the citation discipline. Lock the Refusals section as mandatory.
4. **Stand up the agent loop behind the manual service.** The 150-company landscape becomes the first searchable substrate. Brand-voice extraction and the market-map generator are the first two automated capabilities.
5. **Ship one piece of distribution.** Chilly's LinkedIn POV voice, four posts a week, anchored on the "what to leave out" thesis. Each post seeds memo demand.
6. **Refuse to build:** a dashboard, an integrations marketplace, a freemium tier, a chat interface, a "leverage AI" landing page.

By June 10 we should have ten paid customers, ten case studies in motion, the memo template locked, and one channel of inbound demand running. If we don't, the kill criterion is clear: the product is wrong, not the marketing. We rewrite the memo.

The pattern is the product. The pattern just got an opinion.
