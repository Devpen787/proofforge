# ProofForge Demo Script

## 5-Second Opening

ProofForge turns useful software work into accepted proof, so people and their
agents can be reviewed, credited, paid, and trusted without becoming a spammy
marketplace or custodial payout app.

## Core Story

Developers already work across GitHub issues, open-source projects, bounties,
backlogs, wallets, and agents. The problem is that useful work gets scattered:
agents generate output, maintainers receive noise, contributors lose credit, and
projects stall.

ProofForge is the missing coordination layer:

```text
source work
-> bounded mission
-> agent-assisted proof
-> evidence packet
-> maintainer acceptance
-> GitHub/wallet/onchain/0G references
-> credit and payout state
-> public proof
```

## 2-Minute Video Flow

### 0:00-0:15 — Problem And Product

Say:

> AI agents make it easy to generate work. ProofForge makes it possible to
> prove which work actually helped. It connects existing work sources, lets a
> bounded proof node produce evidence, and turns accepted proof into credit,
> payout state, and public history.

Show the hosted app:

```text
https://proofforgehub.vercel.app/#opportunity
```

### 0:15-0:35 — Source Work And Agent Setup

Show:

```text
Home -> Agent Setup -> Opportunities
```

Click:

```text
Set up proof node
-> Register proof node
-> Find source-backed work
```

Say:

> ProofForge does not invent fake work. It starts from source-backed work:
> GitHub issues, project backlogs, bounties, or marketplace tasks. The agent is
> bounded before it runs: local checks are allowed, PRs, comments, secrets, and
> funds are blocked.

### 0:35-1:00 — Run A Mission And Generate Evidence

Click:

```text
Start sourced proof
-> Run safest earning mission
-> Accept and run
-> Approve Packet
```

Say:

> The proof node runs a narrow mission. It captures logs, environment, verifier
> status, privacy review, and artifacts. The output is not raw agent chatter. It
> becomes a maintainer-ready case file.

Terminal proof to show briefly:

```bash
npm run demo:packet
npm run sync:web-proof
```

### 1:00-1:25 — Maintainer Review And GitHub Authority

Click:

```text
Submit Packet
-> Connect MetaMask
-> Record GitHub post
-> Sign acceptance
-> Accept & Mark Earned
```

Use this sample GitHub post URL if recording locally:

```text
https://github.com/Devpen787/proofforge/issues/1#issuecomment-proof
```

Say:

> GitHub remains the source authority. ProofForge prepares the maintainer
> comment and opens the source issue, but the maintainer posts from their own
> GitHub account. Acceptance can also be signed by wallet, so the review record
> is portable.

If MetaMask is ready, optionally show:

```text
Deploy proof registry
-> Anchor onchain
```

Say:

> Accepted proof can be anchored through the ProofRegistry contract. The
> contract stores the proof hash and references; private packet contents stay in
> the evidence record.

### 1:25-1:45 — 0G, Payout Rails, And Public Proof

Go to:

```text
Settings
```

Click:

```text
Prepare 0G upload
Record 0G receipt
Prepare payout handoff
Publish shared project
Pull shared project
```

Say:

> 0G is used as the durable evidence-record path without putting private keys in
> the browser. ProofForge exports the record and copies the runner command. For
> payouts, ProofForge prepares Safe, Splits, and Drips handoff metadata, but it
> does not custody or move funds.

If a live 0G upload is not recorded, show the prepared command and describe 0G
as credential-gated rather than claiming a live receipt.

### 1:45-2:05 — Close On Public Proof

Go to:

```text
Public Proof
```

Show:

- source issue
- maintainer GitHub post
- wallet/onchain state
- 0G receipt
- artifacts
- payout/credit state

Say:

> This is the final object: public-safe proof that useful work was sourced,
> bounded, verified, accepted, and linked to credit or payout state. ProofForge
> is not another marketplace. It is the proof and coordination layer for people,
> agents, and projects that need work to hold.

## Exact Browser Click Path

Use production for the video unless recording local-only flows:

```text
https://proofforgehub.vercel.app/#opportunity
```

Click path:

```text
Home
-> Set up proof node
-> Register proof node
-> Find source-backed work
-> Start sourced proof
-> Run safest earning mission
-> Accept and run
-> Approve Packet
-> Copy reviewer link
-> Copy GitHub comment
-> Open GitHub issue
-> Submit Packet
-> Connect MetaMask
-> Record GitHub post
-> Sign acceptance
-> optionally Deploy proof registry / Anchor onchain
-> Accept & Mark Earned
-> Home
-> Release payout
-> View public proof
-> Settings
-> Prepare 0G upload
-> Record 0G receipt
-> Prepare payout handoff
-> Publish shared project
-> Pull shared project
-> Public Proof
```

## Terminal Proof Commands

Run these before recording:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:web
npm run demo:packet
npm run sync:web-proof
```

Optional, if 0G credentials are configured:

```bash
npm run 0g:check
npm run 0g:upload-record -- --in <proof-network-record.json>
```

Optional payout handoff:

```bash
npm run payout:handoff -- --payout demo-output/docs-install/packet/payout.json --record <proof-network-record.json> --recipient <wallet>
```

Optional production smoke:

```bash
npm run smoke:web:prod
```

## Show These Generated Files

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/policy.json
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/project.json
demo-output/docs-install/packet/submission-evidence.json
demo-output/docs-install/packet/submission-evidence.md
```

## Prize-Relevant Proof Points

- 0G: evidence records can be uploaded through credential-gated runner tooling,
  and the app records the returned receipt.
- ENS: wallet/identity direction is visible through signer identity; only claim
  live ENS if the submitted build uses a verified ENS record.
- Agent tooling: ProofForge defines bounded proof nodes, allowed/blocked
  actions, skills, verifier checks, and evidence packets.
- GitHub/open-source work: source issue, maintainer post, and public proof are
  linked without holding GitHub credentials.
- Payout rails: Safe, Splits, and Drips handoff metadata exists without custody.

## Do Not Claim

- automatic payment settlement
- automatic PR creation
- automatic GitHub posting
- hosted multi-user backend
- private 0G key in the browser
- live ENS, AXL, KeeperHub, or Uniswap integrations unless separately verified
- payment receipt as proof unless linked to accepted proof
