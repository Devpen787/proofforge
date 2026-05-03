# ProofForge 2-Minute Demo Script

Use this script for the hackathon video. It is written as a recording plan:
what to show, what to click, and what to say.

## Five-Second Pitch

ProofForge turns real GitHub and open-source work into bounded agent missions,
verified evidence packets, maintainer acceptance, and tracked credit or payout.

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

> ProofForge turns sourced software work into safe agent missions, evidence
> packets, maintainer acceptance, and tracked credit. The goal is simple: prove
> what an agent did, who owns it, and why it should count.

Click `Set up proof node`.

### 0:10-0:25 - Agent Setup

Show proof node identity, owner, skills, ENS, and blocked actions.

Say:

> First we register the proof node. This is the agent that can inspect public
> repos, run local checks, and package evidence. It cannot spend funds, open PRs,
> or post comments on its own. The work stays bounded.

Click `Register proof node`, then `Find source-backed work`.

### 0:25-0:40 - Opportunities

Show `/#work-queue`, the GitHub issue import, and the mission list.

Say:

> Work starts from a real source: a GitHub issue, project backlog, marketplace
> task, or maintainer request. ProofForge turns that into missions the agent can
> assess instead of letting it freestyle.

Click `Assess` on `Validate installation docs`.

### 0:40-0:55 - Mission Detail

Show source, reward, runtime, risk, acceptance owner, and agent assessment.

Say:

> Before anything runs, I can see what will be proven, what the agent is allowed
> to do, who accepts the proof, and what value is attached. This is the contract
> for the run.

Click `Authorize agent run`.

### 0:55-1:10 - Runner

Show the run summary and live output.

Say:

> The proof node runs the local check, captures logs and environment details,
> blocks external actions, and writes artifacts. No secrets, no funds, no public
> posting.

Click `Review evidence packet`.

### 1:10-1:25 - Case File

Show result, artifacts, privacy, security, and 0G storage reference.

Say:

> The output becomes a maintainer-ready case file: what was tested, what passed,
> what failed, what was hidden, and where the public-safe packet is stored. Here
> the proof is anchored with a 0G Storage reference.

Click `Submit to maintainer`.

### 1:25-1:40 - Maintainer Review

Show the decision screen.

Say:

> The maintainer sees the proof, not agent noise. They can accept, request a
> revision, or reject it. Acceptance creates the earned record, project credit,
> and payout state.

Click `Accept & Mark Earned`.

### 1:40-1:55 - Earned State

Show accepted Home state.

Say:

> Now the work is accepted. V1 tracks payout manually, so we are not pretending
> settlement is automatic. But the user has accepted proof, credit, reputation,
> and a clear payout state they can use today.

Click `Release payout`, then `View public proof`.

### 1:55-2:10 - Public Proof And Close

Show `/#public-proof`: accepted proof, agent identity, 0G storage,
artifacts, and credit.

Say:

> This is the shareable proof: the agent identity resolves through ENS, the
> packet has a 0G storage reference, and the accepted work rolls up to the
> builder. ProofForge is the coordination layer between sourced work, bounded
> agents, maintainer trust, and portable proof of value.

## Fast Version If You Need 90 Seconds

1. Home: say the five-second pitch.
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
- The web app demonstrates the full role flow from contributor to maintainer to
  public proof.
- 0G integration is usable when credentials are configured and the command
  returns a real storage reference or transaction hash.

Honest limits:

- Payout is tracked/manual in V1, not automatic wallet settlement.
- Maintainer review is an in-product role flow, not a live GitHub PR/comment
  workflow unless the GitHub submit command is run and succeeds.
- The web app uses seeded/generated product data, not a hosted backend.
- Production sandboxing, live OAuth ingestion, AXL agent messaging, KeeperHub
  execution, and Uniswap settlement are future tracks unless implemented and
  shown with real proof.

## Prize Positioning

Primary fit:

- `0G - Best Agent Framework, Tooling & Core Extensions`: ProofForge provides a
  reusable pattern for agent work intake, permissions, proof runs, evidence
  packets, and durable proof storage.
- `0G - Best Autonomous Agents, Swarms & iNFT Innovations`: the demo includes a
  working proof agent mission with persistent evidence and a clear path to more
  capable agent coordination.

Secondary/future fit:

- ENS: now credible if the video shows `npm run ens:check` resolving an agent
  name and the packet/public proof carrying that identity.
- Gensyn AXL: peer-to-peer agent coordination.
- KeeperHub: reliable execution and payment release.
- Uniswap: agentic settlement only if a real API integration is added.

Do not present secondary tracks as completed unless the video shows them working.
