# ProofForge 2-Minute Demo Script

Use this script for the hackathon video. It is written as a recording plan:
what to show, what to click, and what to say.

## Five-Second Pitch

ProofForge helps people and agents move useful projects forward, turn the work
into accepted proof, and track the credit, payout, reputation, or access that
follows.

## Core Thesis

ProofForge is not another marketplace. It is the contribution layer between
messy work and recognized value.

People already work across their own projects, open-source repos, protocol
backlogs, bounty boards, grant milestones, marketplaces, and chats. Agents make
it easier to help, but without a shared proof and acceptance layer the result is
still scattered effort, unclear credit, and too many unfinished projects.

ProofForge turns that work into a simple loop:

```text
source-backed project work
-> human or bounded agent help
-> evidence packet
-> maintainer or steward acceptance
-> credit, payout, reputation, access, and project history
```

The north star is a living contribution economy: useful projects get more help,
contributors and agent owners get recognized, and accepted work compounds back
into the project instead of disappearing in issues, chats, or one-off bounty
boards.

## Pre-Recording Setup

Do this before recording so the video stays tight.

```bash
cd /path/to/proofforge
npm test
npm run build
npm run ens:check -- --name <agent-name.eth> --address <agent-wallet-address>
npm run demo:packet
npm run sync:web-proof
npm run dev
```

Optional if showing payout release in the browser:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
npm run sync:web-proof
```

Optional if the browser is already in a completed state and you want a clean
first-run recording, run this in the browser console before recording:

```js
localStorage.removeItem("proofforge.v1.demo-state");
location.hash = "opportunity";
location.reload();
```

Open the app:

```text
http://localhost:5173/#opportunity
```

## Recording Script

Target length: about 2 minutes. Read this naturally. Do not explain every field;
let the screen carry the details.

### 0:00-0:10 - Home

Show `/#opportunity`.

Say:

> ProofForge helps people and agents move useful projects forward. It takes
> work from GitHub, project backlogs, bounties, marketplaces, or maintainer
> requests, turns it into accepted proof, and tracks the credit or payout that
> follows.
>
> We built this because the future of software work is more collective: people
> working on their own projects, other people's projects, protocols, grants, and
> open-source systems, with agents helping along the way. But today that work is
> scattered across issues, chats, bounty boards, and half-finished projects.
> ProofForge is not another marketplace. It is the coordination and proof layer
> that shows what helped, who helped, what was accepted, and how the value rolls
> back to the contributor and the project.

Click `Set up proof node`.

### 0:10-0:25 - Agent Setup

Show proof node identity, owner, skills, ENS, and blocked actions.

Say:

> First we register the proof node. This is the agent that can help with the
> work, but only inside clear boundaries. It can inspect public repos, run local
> checks, and package evidence. It cannot spend funds, open PRs, or post
> comments on its own.

Click `Register proof node`, then `Find source-backed work`.

### 0:25-0:40 - Opportunities

Show `/#work-queue`, the GitHub issue import, and the mission list.

Say:

> Work starts from a real source: a GitHub issue, project backlog, marketplace
> task, bounty, grant milestone, or maintainer request. ProofForge turns that
> messy source into a mission a person and bounded agent can actually assess and
> complete.

Click `Assess` on `Validate installation docs`.

### 0:40-0:55 - Mission Detail

Show source, reward, runtime, risk, acceptance owner, and agent assessment.

Say:

> Before anything runs, I can see what is worth proving, what the agent is
> allowed to do, who accepts the proof, and what value is attached. This keeps
> the work useful to the project instead of becoming random agent output.

Click `Authorize agent run`.

### 0:55-1:10 - Runner

Show the run summary and live output.

Say:

> The proof node helps execute the mission. It runs the local check, captures
> logs and environment details, blocks external actions, and writes artifacts.
> The agent helps, but the proof is what makes the contribution reviewable.

Click `Review evidence packet`.

### 1:10-1:25 - Case File

Show result, artifacts, privacy, security, and 0G storage reference.

Say:

> The output becomes a maintainer-ready case file: what was tested, what passed,
> what failed, what was hidden, and where the public-safe packet is stored. This
> is how useful work becomes evidence a project steward can trust.

Click `Submit to maintainer`.

### 1:25-1:40 - Maintainer Review

Show the decision screen.

Say:

> The maintainer sees the proof, not agent noise. They can accept, request a
> revision, or reject it. Acceptance is the moment the contribution becomes
> recognized value.

Click `Accept & Mark Earned`.

### 1:40-1:55 - Earned State

Show accepted Home state.

Say:

> Now the work is accepted. The developer gets credit, reputation, and a payout
> state the project can track today. Over time, this turns projects into living
> contribution economies.

Click `Release payout`, then `View public proof`.

### 1:55-2:10 - Public Proof And Close

Show `/#public-proof`: accepted proof, agent identity, 0G storage,
artifacts, and credit.

Say:

> This is the shareable proof: the agent identity resolves through ENS, the
> packet has a 0G storage reference, and the accepted work rolls up to the
> builder and project. ProofForge is how useful work becomes a contribution
> record: people bring projects, agents help safely, humans accept the evidence,
> and credit or payout can compound into the next round of work.

## Fast Version If You Need 90 Seconds

1. Home: say the five-second pitch and collective contribution economy framing.
2. Agent Setup: register proof node and name the permissions.
3. Opportunities: show sourced inventory and choose one mission.
4. Runner: show bounded execution and artifacts.
5. Case File: submit the evidence packet.
6. Maintainer: accept and mark earned.
7. My Work/Public Proof: show credit, payout state, and shareable proof.

## Proof Shots To Include

Use at least one terminal shot so judges see this is not only a clickable mock.

```bash
npm test
npm run build
npm run ens:check -- --name <agent-name.eth> --address <agent-wallet-address>
npm run demo:packet
npm run sync:web-proof
```

If 0G credentials are configured, show readiness first:

```bash
npm run 0g:check
```

Then show the `Storage provider`, `Storage URI`, and `0G tx` lines printed by:

```bash
npm run demo:packet
```

If showing a real 0G testnet payout settlement instead of only manual release:

```bash
npm run settle:payout -- --in demo-output/docs-install/packet/payout.json
```

If showing manual payout release only:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

## What To Say If Asked What Is Real Today

Real in V1:

- GitHub/source work can be imported into local Work Lead artifacts.
- Mission conversion can reject vague work and keep it in triage.
- A local proof node runs a bounded mission and writes artifacts.
- ENS identity can be resolved into an agent identity receipt and carried into
  the proof packet when configured.
- Verifier checks run against the generated artifacts.
- Evidence packet, case file, public packet, project credit, and payout records
  are generated.
- The web app demonstrates the full role flow from source-backed work to agent
  assistance, maintainer acceptance, public proof, and project credit.
- 0G integration is usable when credentials are configured and the command
  returns a real storage reference or transaction hash.

Honest limits:

- Payout is tracked/manual in V1, not automatic wallet settlement.
- Maintainer review is an in-product role flow, not a live GitHub PR/comment
  workflow unless the GitHub submit command is run and succeeds.
- The web app uses seeded/generated product data, not a hosted backend.
- Production sandboxing, live OAuth ingestion, peer agent messaging, reliable
  execution services, and automatic settlement are future tracks unless
  implemented and shown with real proof.

## Prize Positioning

Primary fit:

- `0G - Best Agent Framework, Tooling & Core Extensions`: ProofForge provides a
  reusable pattern for agent work intake, permissions, proof runs, evidence
  packets, and durable proof storage.
- `0G - Best Autonomous Agents, Swarms & iNFT Innovations`: the demo includes a
  working proof agent mission with persistent evidence and a clear path to more
  capable agent coordination.
- `ENS - Best ENS Integration for AI Agents`: ProofForge uses ENS as an agent
  identity layer when `npm run ens:check` resolves the proof node name and the
  packet/public proof carries that identity.

Do not present other sponsor tracks unless the video shows their technology
working inside the product.
