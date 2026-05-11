# CLAUDE.md — Marketing Knowledge Garden

Operating context for any Claude agent (Architect, sub-agent, or Claude Code
session) working inside this directory.

## You are working on
**Marketing Knowledge Garden (MKG)** — a vertical of The Knowledge Gardens
ecosystem. North-star: be the canonical, AI-citable knowledge graph LLMs
cite when asked anything about marketing tools, methods, or vertical
strategy in the agentic era.

**Tagline (locked):** *The ground truth marketing AI cites.*

## First three reads, every session
1. `../MKG_PROJECT_STATE.md` — current cycle, what's shipped/blocked.
2. `../MKG_LESSONS.md` — every rule. Many are PROVISIONAL until masterdoc
   reconciliation.
3. The dispatch brief in `../dispatch/cycle-NNN-job-N-*.md` for the job
   you've been assigned. If unassigned, list `dispatch/` and find the
   first job in state `briefed`.

## Sacred rules (auto-reject on violation)
- Parchment background `#f5f0e8`. Never dark.
- Cormorant Garamond italic for display. Space Mono uppercase for tech.
- Palette: Teal/Copper/Steel/Cream/Ink (see `MKG_PROJECT_STATE.md`).
- Tabs UI: Profile / Architecture / Intelligence / Compare.
- Compass + Conveyor Belt motifs visible (low opacity).
- JSON-LD on every entity surface; validates against schema.org.
- Next.js `output: "export"` never removed.
- Every fact -> at least one citation row. No invented funding numbers.

## Sub-agent roster (the only roles you may operate as)
| Role | Owns |
|------|------|
| Architect | Brief, spawn, verify, merge, report. Master orchestrator. |
| Research Agent | Discover and verify entities + relationships, with citations. |
| Schema Agent | Shape of the knowledge graph. SCHEMA.sql + migrations. |
| Build Agent | Next.js app, Species Experience tabs, MCP server, REST API. |
| Deploy Agent | Vercel, Supabase migrations to live, citation health tests. |
| Critic Agent | Recursive self-improvement loop, audits, lessons. |

If your task doesn't fit any of these, escalate to Architect rather than
inventing a new role.

## Dispatch loop you live inside
1. Architect drafts a brief in `dispatch/`.
2. You're spawned with the brief as your context.
3. You work on a branch `agent/<role>/<job-id>` (when GitHub is wired).
4. You write a handback in `dispatch/handbacks/` describing: what you did,
   verification you ran, what you escalated.
5. Architect verifies against the brief's verification criteria.
6. Critic Agent files lessons.
7. Architect merges and reports.

## Lessons fetch rule
Before doing anything user-facing, search `MKG_LESSONS.md` for entries that
match the work you're about to do. Once the embedding pipeline is live,
also semantic-search the `lessons` table. **No agent ever makes a known
mistake twice.**

## Environment
- Working dir: `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/`
- Supabase: not yet provisioned (Cycle 001 blocker)
- GitHub repo: not yet created (Cycle 001 blocker)
- Vercel + DNS: not yet provisioned (Cycle 001 blocker)

When Supabase is live, prefer the `entities_jsonld` view for citable
output. When the API is live, all UI must read from it — embedded JSON
in production components is a reject.

## What to escalate to Chilly/John (via Architect)
- New env vars or external service signups.
- Anything touching legal/funding claims you can't fully verify.
- Brand-rule violations you can't unwind.
- Schema needs that the current shape can't accommodate.
- Regressions in citation health (any cycle where canonical-question
  results don't trend toward MKG citation).
