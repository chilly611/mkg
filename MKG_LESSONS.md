# MKG_LESSONS.md
**The Marketing Architect — Lessons Log**
*Last reconciled with umbrella `09_LESSONS.md`: 2026-05-09*
*Last MKG-specific additions: 2026-05-11 (Mother's Day cycle, L-MKG-010..013)*

This file holds the lessons that govern Marketing Knowledge Garden agents.

**Hierarchy.**
- Lessons numbered `L-NNN` are inherited from the umbrella `09_LESSONS.md`
  and apply to every garden. The MKG copy is here for fast local lookup;
  the umbrella file remains canonical.
- Lessons numbered `L-MKG-NNN` are MKG-specific — they came from this
  garden's work and may or may not be promoted later by the Promote Agent
  (per umbrella `L-032`).

**Reconciliation note.** The Cycle 001 lessons file used `L-PNNN`
provisional codes derived from the architect prompt. As of 2026-05-09
those have been mapped against the real umbrella file and either
collapsed into a canonical `L-NNN` or promoted to a stable `L-MKG-NNN`.
The provisional codes are dead.

---

## A. Inherited from umbrella (read-only here)

The full canonical text lives in `../09_LESSONS.md`. Summaries below for
fast in-context retrieval.

### Brand / design

- **`L-001` — Parchment is sacred.** Light parchment `#f5f0e8` on every
  public surface. Dark is never the answer.
- **`L-002` — Tabs, not scrolling.** Knowledge Gardens interfaces are
  tab-based unless a surface genuinely benefits from vertical narrative.
  The Species Experience is a reference instrument, not a scroll essay.
- **`L-003` — Read the golden reference first.** Enhance, don't reimagine.
- **`L-004` — Flat card layouts are a regression.** Every species-level
  experience must include tabs, blueprint visual, comparative view,
  intelligence/data panel.
- **`L-005` — Victorian engineering signature per surface.** At least one
  of: dimension-line annotation, hand-drawn flourish, gear/compass
  ornament, source-citation footer, graph visualization texture.

### Platform / technical

- **`L-006` — `output: "export"` is sacred.** Never removed from
  `next.config.ts`. Any change to that file requires deploy verification
  before commit.
- **`L-007` — Morph animation: rAF + `stroke-dashoffset`.** V21 approach.
- **`L-008` — Foreground segmentation, not edge detection.**
- **`L-009` — Compass hover: `bottom:100%` + negative margin.**
- **`L-010` — Desktop Commander for Windows filesystem work.** N/A on
  this Mac-driven session, but inherited.
- **`L-011` — PowerShell multi-step uses semicolons or `cmd /c`.** N/A
  same.
- **`L-012` — `next build` timeout ≥ 120s.**

### Process / workflow

- **`L-013` — One deliverable per session.** Multi-deliverable sessions
  cause context bloat.
- **`L-014` — Read PROJECT_STATE first, every time.** Session start =
  state + lessons, always.
- **`L-015` — Enhance, don't replace.**
- **`L-016` — Build → push → verify → next chunk.** Small deployable
  increments.
- **`L-017` — Match what's visible on Chilly's screen.** Annotated
  screenshot = the spec.

### Strategic

- **`L-018` — Dominate density before spreading.**
- **`L-019` — The pattern is the product, not the gardens.** Ship one
  garden well, then the next. Never two in parallel unless fully
  productized.
- **`L-020` — RSI heartbeat is non-negotiable.** No garden is approved
  without an RSI heartbeat definition.
- **`L-021` — Beauty is an economic moat.** MLPs over MVPs. Brand test:
  *Royal Botanic Gardens curator AND Stripe staff engineer both respect
  this?*
- **`L-022` — Gravity over promotion.** Every Public-lane tool must pass
  *"would users be upset if this vanished?"*
- **`L-023` — Commercial gardens fund meaning gardens.** Commercial
  first; meaning gardens are dessert.

### TKG sprint promotions

- **`L-024` — Demo-path-first design.** Write the 30-second pitch
  script before designing components.
- **`L-025` — Composition tokens, not hand-tuning.** No hand-tuned
  `p-N`/`gap-N` per component. Use the umbrella token set.
- **`L-026` — Italics sparingly, bold sans-serif as default.** Headlines,
  titles, CTAs, section labels — all bold sans-serif. Italic Cormorant
  is `.emphasis-italic`, opt-in only. **Note:** This corrects the Cycle
  001 v2 artifact, which over-used Cormorant italic. v3 fixes this.
- **`L-027` — Motion is the brand; do NOT honor `prefers-reduced-motion`.**
  Animations always play. The `@media (prefers-reduced-motion: reduce)`
  block is intentionally absent. **Note:** v2 artifact had this block.
  v3 removes it.
- **`L-028` — Theme-aware components, not blend-mode assumptions.** Any
  graphic across multiple surface types takes a `theme` prop
  (`light` | `dark` | `luminous`).
- **`L-029` — Next 16 + Turbopack: Suspense, not force-dynamic.** Pages
  using `useSearchParams()` wrap in `<Suspense>`.
- **`L-030` — Smart-quote sweep before claiming completion.**
  `grep -rn $'[''""]' src/` returns zero before merge.
- **`L-031` — Vercel: env vars + Root Directory BEFORE first deploy.**
  Mandatory two settings before clicking Deploy.
- **`L-032` — Promote-the-lesson ceremony at session close.** After
  every session, Promote Agent reviews local lessons and copies
  cross-garden ones to umbrella `09_LESSONS.md`.

---

## B. MKG-specific lessons

These were earned in this garden's work and have not (yet) been promoted
to the umbrella. Promote Agent reviews weekly.

### `L-MKG-001` — JSON-LD on every entity surface
**Rule.** Every entity page emits valid `application/ld+json` with
minimum: `@context`, `@type`, `name`, `url`, `description`, `sameAs`
(citations), `additionalProperty` (funding, pricing, buyer, confidence).
Validate at validator.schema.org before merge. **Trigger.** The MKG's
entire moat hinges on AI-citability. JSON-LD is what makes us machine-
readable. **Affected agents.** Build, Schema, Critic.
*Promotion candidate: this likely applies to every garden — flag for
weekly review.*

### `L-MKG-002` — Never invent funding figures
**Rule.** Funding amounts, valuations, round names ship only with a
primary citation URL (TC, AdExchanger, BusinessWire, EU-Startups,
Crunchbase, PR Newswire). Vendor marketing pages do not count. Unknown
= `null`. **Trigger.** Hallucinated funding numbers turn a citable
source into an uncitable one in one bad row. **Affected agents.**
Research, Verify, Critic.
*Promotion candidate: applies to every garden that captures companies.*

### `L-MKG-003` — Every claim ships with a citation row
**Rule.** Every fact written to `entities`, `relationships`, or any
content table also writes to `citations` with claim text, source URL,
retrieval date, confidence. Architect rejects handbacks where citation
rows are missing. **Trigger.** Without per-claim citations, the JSON-LD
`sameAs` can't be machine-built and the moat erodes. **Affected agents.**
Research, Verify, Critic.

### `L-MKG-004` — Read from Supabase, not embedded JSON (after API ships)
**Rule.** Static artifacts may embed JSON during prototyping. The moment
the MCP/REST API is live, every UI component reads from the API. PRs
introducing new embedded entity arrays are auto-rejected. **Trigger.**
Stale embedded data quietly poisons the citation health metric.
**Affected agents.** Build, Critic.

### `L-MKG-005` — Citation health test runs every cycle
**Rule.** Deploy Agent runs the canonical-question test against ChatGPT,
Claude, Perplexity, Gemini at the close of every cycle. Output goes to
`data/citation-baseline-cycle<NNN>.md` and `citation_results` table.
Three consecutive flat or declining cycles = Critic escalation.
**Trigger.** This is the north-star metric. Without it the moat is
unmeasurable. **Affected agents.** Deploy, Critic.

### `L-MKG-006` — Compass + Conveyor Belt are required UI ornaments
**Rule.** Every Species Experience surface includes (at minimum) the
Compass motif (orientation) and the Conveyor Belt motif (Garden-to-buyer
pipeline). Low-opacity acceptable. Missing either = reject. **Trigger.**
Architect prompt brand requirement; reinforces L-005 Victorian
engineering signature. **Affected agents.** Build, Critic.

### `L-MKG-007` — One brief, one job, one branch
**Rule.** Each dispatch produces exactly one brief in `dispatch/`.
Sub-agents work on a branch `agent/<role>/<job-id>`. Architect merges
only after verification criteria are met. No "while we're at it" scope
creep — a new need spawns a new brief. **Trigger.** Architect prompt
dispatch protocol; reinforces L-013 (one deliverable per session) but
extends to per-job branching for multi-agent cycles. **Affected
agents.** All.

### `L-MKG-008` — Lessons fetch before brief write
**Rule.** Before drafting any brief, Architect runs semantic search
against `lessons` (and at minimum greps this file) and prepends the
relevant lessons to the brief. **No agent ever makes a known mistake
twice.** **Trigger.** The compounding rate of improvement hinges on
this. **Affected agents.** Architect, all.

### `L-MKG-009` — The MKG tagline relationship
**Rule.** Umbrella canonical is *"The ground truth AI needs to survive."*
The MKG-specific framing is *"The ground truth marketing AI cites."*
Both are correct in their context. Do not invent a third. Do not
substitute. **Trigger.** The architect prompt and the masterdoc each
locked a tagline; reconciliation must preserve both. **Affected
agents.** Build, Architect, Critic.

### `L-MKG-010` — Products with server-side auth/payments override the static-export rule
**Rule.** Umbrella `L-006` says `output: "export"` is sacred — never
removed. That rule applies to **citation gardens** (OKG, BKG, HKG, TKG):
pure static, AI-crawlable, no writes. The Marketing Architect is a
**product** with auth, Stripe, server actions, and a Claude API research
panel. Server-side capability is required. Removing `output: "export"`
in this codebase specifically is correct; other gardens keep static
export. **Trigger.** Cycle 003.5 Google OAuth callback requires
server-side code exchange — physically impossible with static export.
**Affected agents.** Build, Deploy, Critic.

### `L-MKG-011` — Vercel body-size cap requires client-side direct upload to Storage
**Rule.** Vercel server actions cap at ~4.5 MB body on Hobby (and have
limits on Pro too). Any media upload (especially video) MUST use
client-side direct upload to Supabase Storage. The server action handles
only the resulting metadata (storage path, filename, mime type, size).
Pattern: form is a client component; on submit, browser uploads each
file using the Supabase JS client, then passes a JSON manifest to the
server action via FormData. **Trigger.** Cycle 003.5 — two MP4 logo
animations crashed the publish flow with "client-side exception"
because the multipart body exceeded the Vercel cap before the action
even ran. **Affected agents.** Build, Deploy.

### `L-MKG-012` — `auth.users → public.users` sync must be a Postgres trigger
**Rule.** When you mirror Supabase auth users into a `public.users`
table (for FK targeting and profile fields), do the sync via a
**Postgres trigger** on `auth.users`, NOT via the OAuth callback's
upsert from the client. The client-side upsert has a race condition
with RLS policy creation and silently fails when policies aren't in
place yet (or when the user signed in before a policy migration ran).
The trigger uses `security definer` and runs server-side, atomically,
on every insert/update. **Trigger.** Cycle 003.5 — categories dropdown
empty + posts crashing on FK violation because `public.users` had no
row for the signed-in user; the callback upsert had silently 403'd.
**Affected agents.** Schema, Build, Deploy.

### `L-MKG-013` — Whitelist sync: env-var + DB allowlist must apply together
**Rule.** When a workspace uses a two-layer allowlist (env-var read by
middleware + DB table read by RLS), the two MUST be synced via the same
migration. Drift between the two produces the worst class of bug:
middleware lets the user in, RLS gives them empty result sets, every
page looks broken in a different way. Always seed both sides from the
same source of truth. **Trigger.** Cycle 003.5 — John and Paulina were
in the Vercel env var but the original migration only seeded Chilly and
Michael in `workspace_allowed_emails`. Their hypothetical sign-in would
have produced confusing empty workspaces. **Affected agents.** Schema,
Deploy, Critic.

---

## C. Reconciliation map (for the audit trail)

For traceability, here is how the Cycle 001 provisional codes mapped
during reconciliation:

| Provisional | Resolution |
|---|---|
| L-P001 (parchment) | Inherited as `L-001` |
| L-P002 (Cormorant + Space Mono only) | **SUPERSEDED by `L-026`** — bold sans-serif is the default; Cormorant italic is opt-in via `.emphasis-italic` |
| L-P003 (tabs) | Inherited as `L-002` |
| L-P004 (JSON-LD) | Promoted to `L-MKG-001` |
| L-P005 (no invented funding) | Promoted to `L-MKG-002` |
| L-P006 (every claim cited) | Promoted to `L-MKG-003` |
| L-P007 (`output: "export"`) | Inherited as `L-006` |
| L-P008 (read from Supabase) | Promoted to `L-MKG-004` |
| L-P009 (one brief, one branch) | Combined with `L-013` and promoted as `L-MKG-007` |
| L-P010 (lessons fetch first) | Combined with `L-014` and promoted as `L-MKG-008` |
| L-P011 (Compass + Conveyor) | Reinforces `L-005`; specific form promoted as `L-MKG-006` |
| L-P012 (citation health every cycle) | Promoted to `L-MKG-005` |

---

## D. Open promotion review queue (Promote Agent will pick up)

These MKG-specific lessons may apply across all gardens. Promote Agent
runs this review weekly per `L-032`. Default action if unsure: promote
(false positives cost nothing; false negatives cost repeated mistakes).

- `L-MKG-001` (JSON-LD on every entity) — strong candidate; every garden
  needs this.
- `L-MKG-002` (no invented funding) — strong candidate; reframe as "no
  invented credentials" to cover non-funding fact classes.
- `L-MKG-008` (lessons fetch before brief write) — strong candidate;
  this is the meta-loop and applies universally.
- `L-MKG-011` (client-side direct upload to Storage) — strong candidate;
  any future garden with media uploads + a hosted Next.js stack will hit
  the same body-size wall.
- `L-MKG-012` (`auth.users → public.users` trigger) — strong candidate;
  every garden adding auth will need this exact pattern.
- `L-MKG-013` (whitelist sync) — moderate candidate; applies wherever a
  two-layer allowlist exists.

---

## E. How to add a lesson to this file

When something goes wrong:

1. Append below the appropriate section (B for new MKG-specific).
2. Format:
   ```
   ### L-MKG-NNN — [one-line pattern name]
   **Rule.** [Concrete enforceable rule.]
   **Trigger.** [What caused this lesson.]
   **Affected agents.** [List of role names.]
   ```
3. Insert a row into the `lessons` table with `lesson_code`, `title`,
   `rule`, `trigger_note`, `affected_agents`, `is_provisional=false`.
4. At weekly cycle close, Promote Agent reviews and may promote to
   umbrella.

If the same lesson appears twice, that is a process failure. Halt new
dispatches until Architect reviews.
