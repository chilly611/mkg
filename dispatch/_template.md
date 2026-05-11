---
cycle_id: cycle-NNN
job_id: cycle-NNN-job-N
agent_role: research | schema | build | deploy | critic
agent_name: research-1   # or specific instance, e.g. build-ui-1
state: briefed           # briefed | in_progress | handed_back | verified | merged | rejected | blocked
spawned_at: YYYY-MM-DD
brief_owner: Architect
---

# <Job title>

## Goal
One sentence. What success looks like in user-visible terms.

## Why
Why this job, why now, what blocks if it doesn't ship.

## Inputs
- Files to read (`MKG_PROJECT_STATE.md`, prior handbacks, etc.)
- Data sources (Supabase tables, web sources, prior research)
- Lessons that apply (cite by ID — `L-P004`, `L-P005`, etc.)

## Expected outputs
- Concrete files / rows / endpoints / artifacts.
- Where they land (path, table, URL).
- Format if non-obvious (e.g. JSON shape, JSON-LD validity, etc.).

## Verification criteria
The Architect runs each of these before merging. Spell them out so the
agent can self-check first.
- [ ] Criterion 1 (e.g. "every entity has a citation_url")
- [ ] Criterion 2 (e.g. "JSON-LD validates against schema.org")
- [ ] Criterion 3 (e.g. "schema migration applies cleanly to a fresh DB")

## Anti-criteria (auto-reject)
Things that trigger an immediate reject regardless of other quality.
- e.g. dark backgrounds in any UI surface
- e.g. funding numbers without a primary citation

## Lessons that apply
List by code: L-P001, L-P004, ...

## Dependencies
- Blocked by: <other job-id, or "none">
- Blocks: <other job-id, or "none">

## Notes for the agent
Anything tactical that will save them time. Edge cases. Known traps.
