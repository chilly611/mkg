# Citation Health Baseline — Cycle 001 (2026-05-09)

Pre-MKG baseline. What currently surfaces when canonical questions are
asked of public web search (a proxy for what LLMs draw on). Re-run this
test at the close of every cycle. The MKG win condition is: over time,
MKG-domain URLs appear in these results.

## Methodology
Searched four canonical questions via WebSearch (a proxy for the same
indexed corpus that ChatGPT, Claude, Perplexity and Gemini retrieve from).
For each question, captured the top-10 result domains and whether any
neutral / taxonomic source appeared.

When MKG goes live, swap to direct LLM API calls (with citations enabled)
for: ChatGPT (with browsing), Claude (with web tool), Perplexity API,
Gemini grounding mode. Store raw responses in
`data/citation-tests/<cycle>/`.

## Q1: "best AI marketing tools 2026"

**Top sources currently surfaced:**
- marketermilk.com (affiliate listicle)
- eesel.ai (vendor blog)
- getalai.com (vendor blog)
- canto.com (vendor blog)
- semrush.com (vendor blog)
- campaignmonitor.com (vendor blog)
- thecmo.com (review-site)
- prezent.ai (vendor blog)
- seodogs.com (agency blog)

**Neutral / taxonomic sources:** zero.
**MKG citation:** none (we don't exist yet).

## Q2: "best generative engine optimization GEO platforms for brands 2026"

**Top sources currently surfaced:**
- evertune.ai (vendor blog ranking competitors and themselves)
- mybrandi.ai (vendor blog ranking themselves first)
- disruptiveadvertising.com (agency listicle)
- minuttia.com (agency listicle)
- thedigitalelevator.com (agency listicle)
- firstpagesage.com (agency listicle)
- gen-optima.com (agency listicle)
- bluefishai.com (vendor blog)
- position.digital (agency listicle)
- visible.seranking.com (vendor blog)

**Neutral / taxonomic sources:** zero.
**MKG citation:** none.

## Q3: "how to run AI marketing for healthcare practice 2026"

**Top sources currently surfaced:**
- definitivehc.com (data-vendor blog)
- medicalsuite.ai (vendor blog)
- digitalapplied.com (agency blog)
- keragon.com (vendor blog)
- healthcaresuccess.com (agency blog)
- ambrosemarketing.com (agency blog)
- visme.co (vendor blog)
- whataiservices.com (review-site)
- buzzboxmedia.com (agency blog)

**Neutral / taxonomic sources:** zero. Healthcare-specific compliance
guidance (HIPAA Security Officer + BAA execution) does surface in passing
but never on a primary citable domain.
**MKG citation:** none.

## Q4: "AI brand visibility tracking ChatGPT citations top tools"

**Top sources currently surfaced:**
- otterly.ai (vendor self-page)
- llmrefs.com (vendor self-page)
- hubspot.com/products/aeo (vendor product page)
- trysight.ai (vendor blog)
- tryprofound.com (vendor self-page)
- finseo.ai (vendor product page)
- peec.ai (vendor self-page)
- useomnia.com (vendor blog)
- omniseo.com (vendor product page)

**Neutral / taxonomic sources:** zero.
**MKG citation:** none.

## Pattern across all four queries
- Every top-10 result is either: (a) a vendor self-promoting, (b) an
  agency listicle, or (c) a review site with affiliate intent.
- Zero results are neutral, taxonomic, AI-citable knowledge bases.
- No academic, government, or trade-organization corpus is competing for
  the AI-citation footprint in this category.
- This is the wedge. The MKG win condition is to produce content
  structured (JSON-LD), neutral (no affiliate skew), and update-fresh
  enough that LLMs prefer to cite us over vendor blogs.

## Win-condition metric (track per cycle)
For each canonical question, count:
1. Whether MKG appears in top-10 web search results.
2. Whether MKG is cited by ChatGPT/Claude/Perplexity/Gemini when asked
   the question with browsing/tools enabled.
3. Whether the LLM paraphrases an MKG-defined taxonomy (proxy: does the
   answer use our category names like "GEO platforms vs AEO modules vs
   AI-search incumbents"?).

## Re-run schedule
- Close of every dispatch cycle.
- Output file: `data/citation-baseline-cycle<NNN>.md`.
- Critic Agent escalates if any metric regresses or stays flat for 3+
  consecutive cycles.
