# LP-0018 Opportunity Refresh — 2026-09-17

Purpose: refresh opportunity status, source drift, competition, and eligibility before M02 creates a public implementation repository.

## Canonical source

- Repository: `logos-co/lambda-prize`
- Branch: `master`
- Observed master SHA: `43c72fd59ef9b1ef148e1629a8e7981bee401de5`
- Previous frozen source SHA used by this pilot: `f303e56871d30bf172afdc0415ac22ce55b6dd10`
- Current prize: `LP-0018: OpenStreetMap Integration — Decentralized Map Data Distribution [OPEN]`
- Current status: `Open`
- Prize: `$1500`
- Effort: `Medium`

## Source drift since the pilot snapshot

`master` is two commits ahead of the prior frozen snapshot.

The relevant 2026-09-17 change is a legal/spec-header and Terms & Conditions rollout. The LP-0018 functional, usability, reliability, performance, supportability, adoption, scope, prize amount, and submission criteria remain substantively the same as the M01 extraction.

LP-0018 itself received only the shared legal/disclaimer language update at the bottom of the specification. The program-level README/Terms also changed.

## New material eligibility condition

The current program policy now states that Logos service providers, including their contractors and subcontractors (defined as “Logos CCs”), are not permitted to participate in λPrize. Submissions from Logos CCs are rejected, and Logos CCs do not count toward adoption criteria.

The Terms also require the participant to represent and warrant that they are not an individual or entity engaged by a service provider of Logos or by a subcontractor of such a service provider.

**M02 gate:** before creating or publicly positioning a prize implementation repository, the human participant should confirm they are eligible under this rule. Do not infer eligibility from repository activity or relationships.

## Competition check

Searches of `logos-co/lambda-prize` on 2026-09-17 found:

- the LP-0018 specification PR (#71), merged on 2026-09-05;
- no open solution PR matching `LP-0018`, `OpenStreetMap`, `OSM`, or the OSM distribution description;
- no `solutions/LP-0018.md` surfaced on the current default branch.

The repository still contains historical branches whose names include `lp-0018`, including the branch used to develop the prize specification. Their existence is not evidence of an active competing solution.

This is **not proof that no external team is privately building**. The prize is first-solution-PR-wins, so competition must be refreshed before any material submission/public-priority decision.

## Decision implication

The opportunity remains technically live and, based on public solution-PR evidence, is not currently claimed.

The largest strategic risk remains adoption rather than implementation:

- 15 countries;
- 25 verified region entries;
- 5 independent consuming modules;
- at least 3 independent Logos Basecamp UI modules;
- genuine independent histories and code-inspectable SDK use.

Therefore M02 should create an evaluator-clean implementation repository only after the human eligibility gate is satisfied, while adoption planning begins from day one rather than after the software is complete.

Truth label: `source-confirmed` as observed on 2026-09-17.
