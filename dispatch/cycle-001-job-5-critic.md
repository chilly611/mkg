---
cycle_id: cycle-001
job_id: cycle-001-job-5
agent_role: critic
agent_name: critic-1
state: handed_back
spawned_at: 2026-05-09
brief_owner: Architect
---

# Seed MKG_LESSONS.md and audit Cycle 001 outputs

## Goal
A working `MKG_LESSONS.md` file, plus an audit pass over every other
Cycle 001 handback to surface the patterns that should become lessons.

## Why
Every cycle compounds because the Critic Agent forces the Architect to
encode what was learned. Without Cycle 001 lessons, Cycle 002 inherits
nothing. The masterdoc lessons L-001..L-033 are not yet shared with this
session, so seed lessons must be derived from the architect prompt and
flagged PROVISIONAL.

## Inputs
- The architect prompt itself.
- All other Cycle 001 dispatch briefs and handbacks.
- Brand rules in `.claude/CLAUDE.md`.

## Expected outputs
- `MKG_LESSONS.md` with the format documented in the file's header.
- All entries tagged [P] PROVISIONAL until masterdoc reconciliation.
- A reconciliation queue at the bottom of the file describing what to do
  when the masterdoc arrives.
- An audit summary noting any Cycle 001 work that does not match the
  seed lessons (none found at hand-back).

## Verification criteria
- [x] `MKG_LESSONS.md` exists and includes brand, research, code,
      workflow, and citation-health rules.
- [x] Every lesson has: ID, title, rule, trigger, affected agents.
- [x] All lessons flagged [P] until masterdoc reconciles.
- [x] At least 10 lessons (we have 12).
- [x] Reconciliation queue documented.

## Anti-criteria
- Treating any provisional lesson as final.
- Inventing masterdoc lesson IDs (we don't know L-001's actual content).

## Lessons that apply
L-P010 (lessons-fetch before brief — meta-applies here).

## Dependencies
- Blocked by: none.
- Blocks: every future cycle's brief drafting (Architect must consult).

## Notes for the agent
- The reconciliation queue is the exit-strategy for this provisional
  state. Every [P] lesson must be either re-IDed or promoted when the
  masterdoc arrives.

## Handback summary
12 PROVISIONAL lessons committed at `MKG_LESSONS.md`. Reconciliation
queue documented. No Cycle 001 handback violated a seed lesson.
