# Pre-Submission Integration Plan

> Reference only. The current source of truth is
> [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md).

This plan decides which sponsor/bounty technologies we should make real before submission and which ones should stay as planned roadmap. The goal is not to mention every sponsor. The goal is to show a working product with defensible integrations.

## Integration Rule

An integration counts only if we can show all five:

- source file path
- command or UI path
- generated artifact or external receipt
- screenshot or demo moment
- honest limitation

If we cannot show those, the integration stays out of the primary demo.

## Submission Strategy

Lead with the working proof loop:

```text
GitHub issue
-> Work Lead
-> Mission
-> agent / node identity
-> local runner
-> agent coordination trace
-> verifier
-> evidence packet
-> human acceptance
-> earned payout record
-> project credit
```

Then show sponsor tech where it strengthens that loop.

Do not lead with payments or protocols as buzzwords. But do lead with useful accepted proof produced by identifiable, constrained agents or nodes.

## Priority 0: Must Work

These are required for a defensible submission.

### GitHub Work Import

Status today: implemented in code, not visible enough in UI.

Before submission:

- expose GitHub import in `Opportunities`
- show imported issue as a Work Lead
- show proofability, missing info, owner, and recommendation
- convert a ready lead into a mission

Proof command:

```bash
npm run import:github -- --url https://github.com/<owner>/<repo>/issues/<number>
```

Demo claim:

```text
ProofForge can ingest real existing work from GitHub without posting, opening PRs, or contacting maintainers.
```

### Local Runner + Verifier

Status today: implemented.

Before submission:

- keep deterministic runner demo working
- show runner output in the web product
- show verifier as separate from runner
- make the UI clear that this is local and evidence-only

Proof command:

```bash
npm run demo:packet
```

Demo claim:

```text
ProofForge produces artifacts and an independent verification result before asking a human to submit anything.
```

### Agent / Node Identity

Status today: partially modeled in project agent delegation, not explicit enough in onboarding or packet data.

Why this is P0:

```text
If everyone has agents, ProofForge must answer who the agent is, who owns it, what it can do, what is blocked, and who receives credit when proof is accepted.
```

Before submission:

- add a simple Agent / Node Setup surface
- create a local proof node identity for the demo user
- show agent or node owner
- show allowed and blocked actions
- show attached project
- write identity reference into generated proof artifacts
- show identity in Mission Detail, Runner, Case File, and Public Proof

MVP identity can be local if live ENS is not ready:

```text
agentId: docs-runner-01
owner: alex
identityRef: local:docs-runner-01
status: verified locally
```

Bounty-grade identity should use ENS if implemented:

```text
identityRef: docs-runner-01.eth
```

Demo claim:

```text
ProofForge does not treat agents as anonymous automation. Every run is tied to an owner, permissions, and a proof identity.
```

### Agent Communication / Coordination Trace

Status today: runner and verifier are separate roles locally; no live AXL adapter.

Why this is P0:

```text
If multiple agents help produce proof, the packet must show who did what and how the handoff happened.
```

Before submission:

- record a local coordination trace for runner -> verifier -> packager -> human approval
- write `messageTraceId` or equivalent trace ref into the evidence packet
- show the trace collapsed in Case File
- keep the UI focused on the outcome, not chat logs

MVP coordination can be local if live AXL is not ready:

```text
traceId: local-trace-run-docs-install-demo
Runner: captured artifacts
Verifier: checked output
Packager: built packet
Human: approved submission
```

Bounty-grade coordination should use AXL if implemented:

```text
messageTraceId: axl:<trace id>
```

Demo claim:

```text
ProofForge separates runner, verifier, packager, and human approval so builders do not grade their own work.
```

### Evidence Packet + Case File

Status today: implemented.

Before submission:

- make Case File the cleanest product screen
- show maintainer summary, artifacts, privacy/security review, and submit decision
- show public-safe packet after acceptance

Proof artifacts:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/public-packet.json
```

Demo claim:

```text
The packet is the unit of value. Maintainers review evidence, not agent noise.
```

### Earned / Released Payout Accounting

Status today: implemented as manual accounting.

Before submission:

- show earned payout only after maintainer acceptance
- show release as a separate manual step
- remove any copy implying automatic money movement

Proof artifacts:

```text
demo-output/docs-install/packet/payout.json
```

Demo claim:

```text
Accepted proof creates an earned payout record. Payment release is explicit and separate.
```

## Priority 1: Strong Bounty Integration

These should be attempted because they can materially improve the submission.

### 0G Evidence Storage

Status today: adapter implemented, credential-gated.

Before submission:

- run a real credentialed upload if credentials are available
- surface `storageProvider` and `storageUri` in the web Case File or Public Proof
- label local fallback honestly when credentials are absent

Required environment:

```text
ZERO_G_EVM_RPC
ZERO_G_INDEXER_RPC
ZERO_G_PRIVATE_KEY
```

Proof command:

```bash
npm run demo:packet
```

Success evidence:

```text
Storage provider: 0g
Storage URI: 0g://...
0G tx: ...
```

Demo claim if successful:

```text
ProofForge stores accepted evidence through a 0G adapter and records the proof reference in the packet.
```

Demo claim if credentials are unavailable:

```text
ProofForge has a 0G storage adapter implemented, but this recording uses the local adapter because live credentials are not configured.
```

### ENS Identity Upgrade

Status today: schema has `identityRef`, no live resolver.

Why this is P1:

```text
Agent discovery and readable identity are central to a network of people and agents. ENS is the cleanest sponsor-aligned path if we can make it real.
```

Before submission if feasible:

- resolve or validate an ENS name for the demo proof node or project
- write ENS identity ref into the evidence packet
- show identity in Public Proof
- keep local identity fallback if resolution fails

Success evidence:

```text
identityRef: <name>.eth
```

Demo claim if live:

```text
ProofForge uses ENS-readable identities so agents, nodes, maintainers, and projects can be discovered and credited.
```

Demo claim if not live:

```text
ProofForge models agent identity locally today and is designed to upgrade that identity layer to ENS.
```

### AXL Communication Upgrade

Status today: roles are modeled; no live adapter.

Why this is P1:

```text
If agents are distributed, they need a communication layer. AXL is the sponsor-aligned path for runner, verifier, and packager coordination.
```

Before submission if feasible:

- create an AXL message adapter
- send or record runner/verifier/packager handoffs through AXL
- write AXL trace ref into the evidence packet
- show the trace in Case File details

Success evidence:

```text
messageTraceId: axl:<trace id>
```

Demo claim if live:

```text
ProofForge uses AXL to coordinate separate proof agents and records the trace in the evidence packet.
```

Demo claim if not live:

```text
ProofForge models the runner/verifier/packager handoff locally today and is designed to upgrade the transport layer to AXL.
```

## Priority 2: Stretch Integrations

These should only be attempted after Priority 0 and Priority 1 are stable.

### Payment Rails / Settlement

Status today: manual accounting only.

Before submission:

- do not attempt unless a real integration can be completed safely
- keep payout language manual
- show external payout compatibility as metadata only

Claim:

```text
ProofForge does not move money in the MVP. It creates accepted proof and earned payout records that existing funding rails can settle.
```

## Product UI Placement

Integrations should appear where they help the user, not as sponsor badges everywhere.

### Home

Show:

- recommended work
- `My Work`
- earning state

Do not show:

- protocol badges
- planned integrations

### Opportunities

Show:

- GitHub import
- source categories
- Work Lead diagnosis

### Mission Detail

Show:

- local runner/node selected
- allowed/blocked actions

### Runner

Show:

- runner and verifier separation
- local evidence-only state

### Case File / Public Proof

Show:

- storage provider
- storage URI when non-local
- public-safe proof references

### Project Command Room

Show:

- attached agents/nodes
- proof ledger
- accepted proof and benefits

## Final Decision Gate

Before final submission, each integration gets one of these labels:

```text
Live in demo
Implemented but credential-gated
Modeled locally
Planned roadmap
Removed from submission story
```

No other labels.

## Recommended Final Stack Story

If no extra credentials are available:

```text
GitHub import + local agent identity + local runner + verifier + local coordination trace + evidence packet + manual payout accounting + project credit.
0G adapter implemented but shown as credential-gated.
AXL, ENS, and payment rails are roadmap.
```

If 0G credentials are available and upload succeeds:

```text
GitHub import + local agent identity + local runner + verifier + local coordination trace + 0G evidence storage + evidence packet + manual payout accounting + project credit.
AXL, ENS, and payment rails are roadmap.
```

This is enough to defend because the product works around a real proof object instead of a fake marketplace.
