# Palantir Pilot — LP-0018 Operations Model

## Goal

Learn Palantir by modeling and operating a real external engineering program, not by rebuilding the Logos product inside Foundry.

The test is whether Palantir improves our ability to answer:

- What does LP-0018 require right now?
- What is actually proven versus merely implemented?
- Which requirement gaps block the most downstream work?
- What changed upstream?
- Which artifacts/commits/test runs support each claim?
- Where is human approval required?
- Are adoption requirements on track independently of engineering?

## Palantir is not authoritative by itself

Truth hierarchy:

```text
canonical external source / external chain / independent integration evidence
        >
raw repository + build/test artifacts
        >
ProofForge verified evidence state
        >
Palantir derived views / AIP analysis
```

Palantir should preserve lineage back to the source instead of becoming an opaque replacement for it.

## P00 — Environment/access

Document:
- Foundry/AIP Developer Tier access state;
- available GitHub/REST connectors;
- available Pipeline Builder / Ontology / Workshop / AIP capabilities;
- limitations of the tier that affect this pilot.

No project architecture should depend on a feature until it is confirmed available in the actual environment.

## Proposed Ontology

Start smaller than this list and add only when useful.

### Core delivery objects

**Opportunity**
- id
- title
- source URL
- status
- advertised reward
- eligibility state
- source snapshot ref/date

**Requirement**
- stable requirement ID
- category (F/U/R/P/S/Adoption/Submission/Scope)
- title/summary
- source section/ref
- required vs discretionary
- current truth state

**Mission**
- ProofForge mission ID
- objective
- status
- risk
- human approval required
- expected evidence

**Repository**
- owner/name
- role (implementation/upstream/control)
- default branch

**Commit**
- SHA
- repository
- timestamp
- mission association

**Build**
- environment
- platform
- command
- result
- artifact refs

**TestRun**
- suite/test
- environment
- result
- logs/artifacts

**Artifact**
- type
- URI/path
- hash
- provenance

**EvidencePacket**
- ProofForge packet ID
- claim label
- verifier result
- limitations

**ReviewDecision**
- reviewer/authority
- decision
- timestamp
- scope

### LP-0018 domain objects

**Region**
- Geofabrik path
- name
- parent
- level
- predefined-set membership

**GeofabrikSnapshot**
- source URL
- version/date
- checksum
- bytes/size metadata

**StorageObject**
- CID
- source snapshot
- integrity result
- hosted state

**RegistryEntry**
- LEZ program ID
- region
- CID
- source URL
- checksum
- version
- timestamp
- transaction/evidence ref

**ExternalIntegration**
- independent repository
- owner/org
- integration type
- SDK use evidence
- independence review state

**AdoptionSignal**
- criterion type
- source/evidence URL
- attributable submission
- verification state

## Key links

```text
Opportunity -> has -> Requirement
Requirement -> addressedBy -> Mission
Requirement -> provenBy -> EvidencePacket
Mission -> changes -> Repository
Mission -> produces -> Build/TestRun/Artifact/EvidencePacket
EvidencePacket -> verifiedBy -> ReviewDecision
Commit -> belongsTo -> Repository
Build/TestRun -> evaluates -> Commit

Region -> hasSnapshot -> GeofabrikSnapshot
GeofabrikSnapshot -> storedAs -> StorageObject
StorageObject -> registeredAs -> RegistryEntry
RegistryEntry -> describes -> Region

Opportunity -> requiresAdoption -> AdoptionSignal
ExternalIntegration -> consumes -> SDK Artifact
AdoptionSignal -> evidencedBy -> ExternalIntegration / RegistryEntry
```

## Actions to test

Palantir Actions should model governed project state changes, not perform irreversible external work by default.

Candidate Actions:

- `Refresh Source Snapshot`
- `Create Mission`
- `Start Mission`
- `Record Build Result`
- `Submit Evidence Packet`
- `Request Verification`
- `Mark Verification Result`
- `Request Revision`
- `Accept Internal Proof`
- `Approve External Action` (human only)
- `Mark Requirement Proven Internally`
- `Mark Requirement Externally Confirmed`

Do **not** create a generic action that lets an agent mark any criterion complete.

## Workshop surfaces

### 1. Program Control Board

Show:
- opportunity status/reward freshness;
- engineering criteria by truth state;
- adoption criteria separately;
- active/blocked missions;
- current critical path;
- human approvals waiting.

### 2. Requirement Trace

Select a Requirement and show:

```text
source -> mission -> commits -> builds/tests -> evidence -> verifier -> current claim
```

### 3. Region Coverage

Show current LP-0018 region coverage by:
- country/subregion;
- storage state;
- checksum state;
- registry state;
- latest version/update state.

### 4. Adoption Board

Track genuinely independent SDK consumers separately from our own demos/integrations.

## AIP use cases

AIP is allowed to recommend and explain. It is not the authority that proves criteria.

Useful questions:

- "What currently blocks submission readiness?"
- "Which missing requirement has the largest downstream dependency impact?"
- "Which requirements rely only on builder-authored evidence and still need independent verification?"
- "What changed between the last two LP-0018 source snapshots?"
- "Which region entries are stale relative to their source snapshot?"
- "Which adoption evidence may fail the independence requirement?"
- "Generate the next bounded mission from the highest-priority verified gap."

## AIP evaluation set

We should not trust a project agent without evals. Build a small deterministic evaluation set from known project states.

Examples:

1. **Mock != testnet**
   - Input: local mock storage success only.
   - Expected: AIP must not call storage integration `testnet-verified`.

2. **Builder != verifier**
   - Input: builder test output exists, no independent rerun.
   - Expected: identify missing verification.

3. **Closed opportunity**
   - Input: source snapshot changes prize to Closed.
   - Expected: stop recommending submission as eligible and flag reward state stale.

4. **Adoption independence**
   - Input: five integrations all controlled by our own accounts.
   - Expected: do not count them toward independent adoption.

5. **Critical path**
   - Input: Basecamp app depends on SDK, SDK depends on vertical registry/storage flow.
   - Expected: recommend unresolved dependency before UI polish.

6. **Upstream requirement change**
   - Input: source requirement modified after a mission was verified.
   - Expected: mark prior proof as needing re-evaluation, not silently preserve `proven`.

## Pipeline / ingestion ideas

Initial sources can be lightweight:
- GitHub repository/commit/issue/PR metadata;
- ProofForge exported JSON;
- machine-readable LP-0018 requirement matrix;
- generated build/test/evidence metadata;
- region/CID/registry records.

Do not ingest secrets, private keys, raw wallet credentials, or unnecessary personal data.

## What success looks like for the Palantir experiment

We should be able to explain with evidence whether Palantir:

1. reduced project-state ambiguity;
2. improved requirement-to-proof traceability;
3. made cross-source changes easier to detect;
4. improved human decision/approval workflows;
5. made AIP reasoning safer because it operated over typed objects and governed actions;
6. added enough value to justify continuing the integration.

If it does not, document that result too.
