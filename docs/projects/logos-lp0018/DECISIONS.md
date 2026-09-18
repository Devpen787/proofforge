# Decisions — Logos LP-0018 Pilot

This log records decisions that should not be silently re-litigated by agents or future sessions. Change a decision only by adding a new decision that explicitly supersedes it.

## D-001 — Target LP-0018 as the live external opportunity

**Date:** 2026-09-17  
**Status:** locked

We will use Logos λPrize **LP-0018: OpenStreetMap Integration — Decentralized Map Data Distribution** as the primary live opportunity for this pilot.

Reason: it is currently open, has explicit external acceptance criteria and a cash prize, and strongly overlaps with existing geospatial experience without requiring us to reuse TrailPassport code.

## D-002 — Keep the three systems separate

**Status:** locked

- **Logos implementation repo:** the actual prize deliverable.
- **ProofForge:** opportunity/mission/evidence/approval system.
- **Palantir:** project/data/ontology/control-plane experiment.

Neither ProofForge nor Palantir should become mandatory runtime dependencies of the LP-0018 deliverable.

## D-003 — ProofForge branch is the operating workspace

**Status:** locked

Branch: `feat/logos-lp0018-palantir-pilot`

This branch is for project context, mission definitions, structured evidence, dogfood findings, Palantir design, and ProofForge changes learned from the pilot.

## D-004 — New Logos implementation repo only after M00

**Status:** locked

We will not create a large new implementation repo until Mission M00 validates the current Basecamp/module-builder development path and identifies the exact bootstrap pattern we should use.

When created, the implementation repo must satisfy the live LP-0018 licensing/submission requirements, including the required dual-license posture if the spec still requires it.

## D-005 — Canonical external sources outrank local context

**Status:** locked

The live `logos-co/lambda-prize` specification is the authority for prize status, criteria, adoption gates, and submission rules.

Our local summaries are working context only. Before submission, payout claims, public claims, or material scope changes, refresh the canonical source and record the source commit/date.

## D-006 — Start with Basecamp dogfooding

**Status:** locked

Mission M00 is to follow Logos' current Basecamp module creation/usage path as a user/contributor and capture evidence, blockers, and pain points.

This is intentionally smaller than LP-0018 and gives us an early ProofForge mission with a genuine external acceptance surface.

## D-007 — TrailPassport is reference knowledge, not a code donor

**Status:** locked

TrailPassport may inform our understanding of OSM, geospatial ingestion, map data, integrity, and product UX. No code is copied by default. Any reuse must be explicit, license-compatible, and justified in the target repository.

## D-008 — No proof, no done

**Status:** locked

A mission is not complete because an agent says it is complete. Completion requires the evidence defined by the mission plus an independent verification step when the evidence is technically meaningful.

A builder must not be the sole verifier of its own work.

## D-009 — Humans gate consequential external actions

**Status:** locked

Agents may prepare changes and evidence, but the following require explicit human approval unless later narrowed by a documented policy:

- opening or updating an external Logos pull request;
- submitting a λPrize solution;
- posting claims to Logos Discord/X/forum;
- spending funds or signing wallet transactions;
- claiming a payout;
- publishing statements that assert a criterion is satisfied when the evidence is not already independently checkable.

## D-010 — Adoption is a first-class dependency

**Status:** locked

LP-0018 cannot be managed as "build code, then think about users." Required ecosystem reuse/coverage must be represented in the mission graph early and tracked separately from engineering completion.

## D-011 — Palantir must earn its place

**Status:** locked

We are testing Palantir, not forcing the project into it. If a workflow is simpler and more reliable in GitHub/ProofForge, we keep it there. Palantir should be used where its ontology, lineage, operational views, permissions, actions, or AIP reasoning materially improve the project.

## D-012 — Truth labels are required

**Status:** locked

Project claims should distinguish at least:

- `source-confirmed`
- `implemented`
- `locally-verified`
- `testnet-verified`
- `externally-verified`
- `adoption-confirmed`
- `planned`
- `blocked`

Do not collapse these into a generic "done" state.
