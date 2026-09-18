# Logos LP-0018 × ProofForge × Palantir Pilot

Status: **active setup**  
Started: **2026-09-17**  
Working branch: `feat/logos-lp0018-palantir-pilot`

## Purpose

Use a real, currently open Logos λPrize as the proving ground for two things at once:

1. **Ship useful Logos open-source work** toward LP-0018: OpenStreetMap Integration — Decentralized Map Data Distribution.
2. **Dogfood ProofForge on serious external work** while learning Palantir as the operational/data layer around that work.

The project is deliberately split into three layers:

```text
LOGOS LP-0018
real external specification + implementation target
        |
        v
PROOFFORGE
opportunity -> missions -> agent runs -> evidence -> verification -> human approval
        |
        v
PALANTIR
source ingestion -> ontology -> operational views -> governed actions -> AIP reasoning
```

## Boundary rule

**ProofForge is not the LP-0018 implementation repository.**

This branch contains the operating context, mission definitions, evidence rules, decisions, and Palantir pilot design. The Logos implementation will receive its own public repository after Mission M00 confirms the current Basecamp/module-builder development path.

Palantir is also **not** a runtime dependency of the Logos deliverable. It is our project/control-plane experiment.

## Source of truth

Canonical external sources always outrank our summaries.

- λPrize index: https://github.com/logos-co/lambda-prize
- LP-0018 canonical spec: https://github.com/logos-co/lambda-prize/blob/master/prizes/LP-0018.md
- LP-0018 source snapshot observed during setup: `logos-co/lambda-prize@f303e56871d30bf172afdc0415ac22ce55b6dd10`
- Logos Basecamp: https://github.com/logos-co/logos-basecamp
- Logos tutorial: https://github.com/logos-co/logos-tutorial
- Logos module builder: https://github.com/logos-co/logos-module-builder
- Logos module release base: https://github.com/logos-co/logos-modules-release-base
- Logos Storage docs/source links: use those referenced by the live LP-0018 spec
- Logos Execution Zone: https://github.com/logos-blockchain/logos-execution-zone
- SPEL: https://github.com/logos-co/spel
- Geofabrik index: https://download.geofabrik.de/index-v1-nogeom.json

At setup time LP-0018 is **Open**, advertises a **$1,500** prize, and is marked **Medium** effort. Prize status and criteria must be refreshed from the canonical source before any submission or public claim.

## What LP-0018 broadly requires

The exact spec is authoritative. Our current working decomposition is:

- region discovery from Geofabrik;
- verified PBF import/download behavior;
- Logos Storage hosting;
- an on-chain LEZ OSM registry built with SPEL;
- query by region / parent / CID;
- bulk host / batch registration;
- update detection;
- standalone OSM registry SDK/module;
- CLI;
- Basecamp distribution app;
- module catalog publishing;
- real testnet 0.3 evidence;
- macOS Apple Silicon + Linux x86_64 support;
- end-to-end integration tests and green CI;
- adoption evidence, including real coverage and independent SDK consumers.

The adoption gate is part of the product requirement, not a marketing afterthought.

## Success has three tracks

### A. Logos delivery

Produce a credible, reproducible LP-0018 implementation and evidence trail without overclaiming unsupported criteria.

### B. ProofForge dogfood

Prove that ProofForge can manage a real external opportunity with:

- external source intake;
- evolving acceptance criteria;
- dependency-aware missions;
- bounded agents;
- independent verification;
- human-gated external actions;
- evidence packets tied back to requirements;
- reward/eligibility state that stays honest as the external source changes;
- adoption evidence, not just code-completion evidence.

### C. Palantir learning

Use the project to learn and test:

- Foundry data ingestion / transforms;
- Ontology object and link modeling;
- Actions and governed state transitions;
- Workshop operational surfaces;
- AIP Logic over real project state;
- optional OSDK integration once the model is useful.

## Hydration order for any new agent/session

Read in this order:

1. `README.md` — this file.
2. `DECISIONS.md` — what is already locked.
3. `AGENTS.md` — authority and agent roles.
4. `OPERATING_MODEL.md` — loops, workspace boundaries, evidence discipline.
5. `MISSION_QUEUE.md` — current dependency graph and next work.
6. `PALANTIR_PILOT.md` — ontology/actions/AIP plan.
7. Refresh the live LP-0018 spec before making claims about current prize status or criteria.

## Immediate next milestone

Do **M00 and M01 first**:

- **M00 — Basecamp module dogfood:** validate the current local development, module build/load, packaging, and reporting path against Logos' own tutorials.
- **M01 — Requirement freeze:** convert the live LP-0018 specification into a traceable requirement/evidence matrix with stable IDs.

Do not begin a large implementation before those two are understood.
