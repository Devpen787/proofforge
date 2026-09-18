# Operating Model — Logos LP-0018 Pilot

## Workspace map

### 1. ProofForge operating workspace

Repository: `Devpen787/proofforge`  
Branch: `feat/logos-lp0018-palantir-pilot`

Owns:
- opportunity record;
- requirement map;
- mission definitions;
- agent/authority rules;
- Proof Packs and verifier state;
- dogfood findings for ProofForge;
- Palantir pilot design;
- decision log.

Does not own:
- the final LP-0018 implementation code;
- Logos upstream source;
- prize acceptance authority.

### 2. Logos implementation workspace

Repository: **TBD after M00**.

Owns:
- SPEL registry program;
- OSM registry SDK/module;
- CLI;
- Basecamp distribution app;
- tests/CI;
- deployment/release artifacts;
- evaluator-facing README and submission evidence.

### 3. Palantir workspace

Environment: **TBD / Developer Tier**.

Owns experimental operational representations of the project:
- ingested source/project data;
- Ontology;
- Actions;
- Workshop surfaces;
- AIP Logic/evaluations;
- optional OSDK integration.

Palantir must not become necessary to build, test, deploy, or evaluate LP-0018.

### 4. External sources

Treat as read-only unless a human explicitly approves an external contribution:
- `logos-co/lambda-prize`;
- Logos Basecamp/module tooling repos;
- Logos Storage / LEZ / SPEL repos;
- Geofabrik.

## The six loops

### Loop A — Source freshness

```text
canonical source
-> fetch current state
-> compare with last frozen source ref
-> record material changes
-> update affected requirements/missions
```

Run whenever:
- starting a new major mission;
- the upstream toolchain changes;
- before public/submission claims;
- before a prize submission.

Output: source snapshot metadata + change note.

### Loop B — Opportunity qualification

```text
external opportunity
-> confirm open/eligible
-> extract requirements
-> identify reward + constraints
-> identify adoption gates
-> decide go / hold / stop
```

Output: qualified Work Lead / Opportunity record.

For LP-0018, prize engineering and prize adoption are tracked as separate workstreams that converge at submission readiness.

### Loop C — Mission execution

```text
requirement gap
-> Work Lead / mission definition
-> dependency check
-> builder execution
-> raw evidence capture
-> independent verification
-> Proof Pack
-> human accept / revise / reject
```

State model:

```text
ready
-> running
-> approval_required (when applicable)
-> packet_ready
-> verified | revision_requested | rejected | blocked
```

A mission may be technically verified without the external prize criterion being accepted by Logos.

### Loop D — Evidence traceability

Every criterion should eventually answer:

```text
What does the external source require?
Which mission addresses it?
Which implementation commit/artifact claims to satisfy it?
What evidence exists?
Who/what independently verified it?
What truth label can we safely apply?
What remains unproven?
```

Minimum evidence identity:
- requirement ID;
- mission ID;
- source ref;
- repository + commit;
- environment/platform;
- command/test procedure;
- artifact/hash/URL when applicable;
- observed result;
- verifier result;
- limitation/negative evidence.

### Loop E — Adoption

```text
usable release
-> publish/share with human approval
-> independent user/module adoption
-> collect attributable evidence
-> verify independence/genuineness
-> map evidence to adoption criterion
```

No sockpuppets, duplicate controlled repos, purchased engagement, or synthetic testimonials.

Adoption tasks begin before engineering is "finished" whenever the external criterion requires time, independent users, or sustained activity.

### Loop F — Product learning

This pilot is also a ProofForge test.

```text
friction in real project
-> identify missing ProofForge capability
-> record product insight
-> decide product change vs project workaround
-> implement separately when justified
-> verify it improves the mission flow
```

Examples we expect to test:
- external-spec change detection;
- structured requirement IDs;
- dependency-aware mission graphs;
- evidence truth labels;
- adoption as a first-class evidence type;
- source eligibility/reward freshness;
- Palantir sync semantics.

## Branching discipline

### ProofForge pilot branch

Use the current pilot branch for operating docs and small ProofForge changes directly attributable to the pilot.

Large ProofForge product changes should preferably receive their own feature branch/PR once the need is concrete.

### Logos implementation repo

When created:
- `main` stays evaluator-clean;
- one bounded feature branch per mission or closely related mission set;
- mission ID in branch/commit/PR metadata when practical;
- no giant agent dumps;
- preserve upstream-compatible build/release conventions.

Suggested branch pattern:

```text
m03/geofabrik-discovery
m04/logos-storage-spike
m05/lez-registry-core
```

## Claim discipline

Use the narrowest defensible claim.

Examples:

- A unit test passes -> `locally-verified`, not `testnet-verified`.
- A mock Logos Storage adapter works -> `implemented`, not `storage-integrated`.
- A program deploys to a local sequencer -> not automatically `testnet-verified`.
- Five repositories import an SDK -> not automatically `adoption-confirmed`; independence and real use still need evidence.
- A λPrize solution PR is opened -> `submitted`, not `accepted` or `won`.

## Human checkpoints

Explicit human decisions are required at these gates:

1. create the final public Logos implementation repo;
2. open external Logos issues/PRs;
3. publish a release or public adoption request under the user's identity;
4. submit LP-0018 solution PR;
5. sign/spend funds;
6. claim any prize payment.

## Definition of project readiness

### Build-ready

- M00 complete enough to know the current Basecamp/module toolchain;
- M01 live requirement matrix exists;
- implementation repo shape decided;
- first technical dependency chain identified.

### Submission-ready

Not merely "code complete." At minimum:
- all live required functionality/supportability evidence mapped;
- testnet and platform evidence present;
- CI green;
- evaluator clean-clone path reproduced;
- required adoption evidence present and checked for independence;
- solution materials match the current λPrize submission template;
- source/prize status refreshed immediately before submission.
