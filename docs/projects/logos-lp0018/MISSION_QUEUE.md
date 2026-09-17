# Mission Queue — Logos LP-0018 Pilot

The queue is dependency-aware. Mission IDs are stable references for docs, evidence, commits, and later Palantir objects.

## Phase 0 — Learn the live Logos delivery path

### M00 — Dogfood Basecamp module creation and loading

**Status:** ready  
**Priority:** P0  
**Purpose:** validate the current Logos Basecamp/module-builder path before scaffolding LP-0018.

Source context:
- `logos-co/logos-tutorial` open dogfooding issue for Basecamp module creation/usage tutorials;
- current Basecamp + module-builder docs.

Tasks:
- install/build Basecamp using current upstream instructions;
- follow the current module creation/usage tutorial exactly before improvising;
- build/load a minimal module;
- record platform/tool versions and commands;
- capture failures/pain points;
- prepare upstream bug/tutorial feedback if warranted.

Evidence target:
- environment record;
- clean sequence of commands;
- build result;
- module load/discovery result;
- screenshots/logs only where they add information;
- exact blocker details for failures;
- proposed upstream feedback, human-gated before posting.

Exit condition:
we know the current bootstrap pattern for the LP-0018 Basecamp components, or we have a specific upstream blocker.

### M01 — Freeze LP-0018 into a traceable requirement matrix

**Status:** ready  
**Priority:** P0  
**Can run in parallel with:** M00

Tasks:
- refresh the live LP-0018 spec;
- assign stable IDs to Functionality, Usability, Reliability, Performance, Supportability, Adoption, Scope, and Submission requirements;
- record source section + source commit/date;
- define expected evidence type for each criterion;
- mark dependencies and external/adoption requirements.

Evidence target:
- machine-readable requirement matrix;
- human-readable acceptance map;
- source snapshot metadata;
- no paraphrase presented as authoritative text.

Exit condition:
every required criterion can be mapped to zero or more missions and evidence objects.

## Phase 1 — Bootstrap the real deliverable

### M02 — Create evaluator-clean implementation repository

**Depends on:** M00, M01  
**Status:** blocked by dependencies

Deliverables:
- public repo;
- required licenses;
- contributor/agent instructions;
- pinned bootstrap/toolchain where appropriate;
- minimal CI;
- source/evidence conventions;
- clean README skeleton.

Human checkpoint: create/publish the final public repo.

### M03 — Geofabrik region discovery + checksum spike

**Depends on:** M01, M02

Prove:
- fetch/parse current Geofabrik index;
- restrict to the LP-0018 predefined region model;
- download a small representative PBF;
- obtain/verify the canonical import-time checksum;
- represent country/subregion identity without parent/child double-counting.

### M04 — Logos Storage spike

**Depends on:** M00, M02

Prove:
- upload a representative PBF/file to Logos Storage using the current supported path;
- receive a durable content identifier;
- retrieve bytes and verify integrity;
- document retry/error behavior and configuration assumptions.

### M05 — Minimal LEZ OSM registry program

**Depends on:** M01, M02

Prove with SPEL:
- registry entry structure;
- register one region;
- query by region;
- IDL generation;
- local sequencer first, then testnet in a later mission;
- start cycle-count measurement path.

### M06 — First vertical host flow

**Depends on:** M03, M04, M05

Prove one path end-to-end:

```text
Geofabrik -> checksum -> Logos Storage -> CID -> LEZ registry -> query -> download -> integrity check
```

This is the first major architecture gate.

## Phase 2 — Required product surfaces

### M07 — CLI

**Depends on:** M06

Commands should track the live spec, currently expected to include host, batch-register, lookup, update check, download, and local import.

### M08 — OSM registry SDK / Logos module

**Depends on:** M06, M00

Prove a stable consumer API and a minimal embedding example that does not require the full distribution app.

### M09 — Basecamp distribution app

**Depends on:** M08, M03, M04

Build region discovery, host/download/local-import/update workflows and honest hosted/version/verification state.

### M10 — Bulk hosting + update + failure hardening

**Depends on:** M09

Cover:
- multiple non-overlapping regions;
- batch registration;
- retry/backoff;
- checksum failure UX;
- stale/update detection;
- graceful fallback paths;
- no mandatory centralized service beyond what the live spec permits.

## Phase 3 — Evaluation-grade proof

### M11 — Logos testnet 0.3 deployment

**Depends on:** M06; may begin before M09 is polished

Evidence:
- deployed program ID;
- real registry transactions;
- hosted/retrievable region CIDs;
- reproducible commands;
- truth labels upgraded only after real testnet verification.

### M12 — Cross-platform + clean-clone CI proof

**Depends on:** M07, M08, M09, M10

Prove:
- macOS Apple Silicon;
- Linux x86_64;
- clean clone;
- module build;
- integration test against a real standalone sequencer;
- green default-branch CI.

### M13 — Module catalog release path

**Depends on:** M08, M09

Publish through the current Logos module catalog/release mechanism required by the live spec and capture evaluator-installable references.

## Phase 4 — Adoption (starts early)

### M14 — Coverage program

**Can begin after:** M11

Track the live LP-0018 adoption thresholds separately from implementation progress.

Current observed target at setup time includes at least:
- 15 countries covered;
- 25 verified region entries.

Refresh before acting.

### M15 — Independent SDK consumer program

**Can begin after:** M08 + usable public release

Goal: genuine third-party reuse required by the live prize criteria.

Rules:
- independent contributors/organizations only;
- genuine code use, not placeholder imports;
- no controlled sockpuppet repos;
- preserve public commit histories and links as evidence.

### M16 — Community evidence / operator mirroring

**Can begin after:** stable hosted regions

Only pursue signals defined by the live prize specification. Treat discretionary signals as separate from mandatory adoption criteria.

## Phase 5 — Submission

### M17 — Evaluator proof pack

**Depends on:** all required technical and adoption missions

Create:
- FURPS self-assessment;
- requirement -> evidence index;
- program IDs/CIDs;
- independent integration links;
- clean-clone instructions;
- known limitations;
- source snapshot used for readiness decision.

### M18 — λPrize solution submission

**Human gated.**

Before opening:
- refresh prize status and source commit;
- confirm no earlier winning solution has already made the opportunity non-actionable under the current rules;
- reproduce evaluator path;
- verify licenses;
- verify all claims;
- human reviews and explicitly approves the external PR.

## Parallel Palantir track

Palantir work must not block M00-M06.

- P00: obtain Developer Tier / environment and document access.
- P01: ingest source/project snapshots.
- P02: build core project ontology.
- P03: implement governed project Actions.
- P04: build Workshop operations board.
- P05: add AIP requirement-gap reasoning + evals.
- P06: evaluate whether OSDK integration into ProofForge is actually useful.

See `PALANTIR_PILOT.md`.

## What we do next

Start **M00 and M01**. Do not skip ahead because later work looks more exciting.
