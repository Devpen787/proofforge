# ProofForge Demo Script

## One-Line Pitch

ProofForge turns existing software work into safe missions, verified evidence packets, contributor credit, and earned payout records.

## Demo Goal

Show that the system does not invent a new work economy. It imports existing work, scopes it, runs a safe proof workflow, and produces reviewable artifacts.

## 2-4 Minute Flow

### 1. Open With The Problem

Developers now have agents, spare machines, and AI tools, but the output is noisy. Maintainers do not need more raw AI work. They need proof they can trust.

### 2. Import Existing Work

Run:

```bash
npm run import:github -- --url https://github.com/microsoft/vscode/issues/1
```

Point out:

- ProofForge reads public issue data.
- It creates a Work Lead.
- It does not post comments, open PRs, or trigger payment.
- Vague work stays in triage instead of becoming agent spam.

### 3. Generate The Proof Packet

If the imported Work Lead is mission-ready, convert it:

```bash
npm run convert:lead -- --in demo-output/imports/example.work-lead.json
```

For the deterministic demo mission, run:

```bash
npm run demo:packet
```

Point out the generated artifacts:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/policy.json
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/project.json
```

Then show payout release as a separate action:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

### 4. Explain The Artifact Chain

The demo proves this loop:

```text
Project
-> Work Lead
-> Mission
-> Local Runner
-> Independent Verifier
-> Evidence Packet
-> Public-Safe Packet
-> Earned Payout
-> Released Payout
-> Project Credit
```

Important details:

- The runner captures logs and environment.
- The policy gate keeps the mission local and evidence-only before execution.
- The verifier checks the runner artifacts independently.
- The public packet strips local paths and private storage refs.
- The payout is earned first, then released by a separate manual action.
- Project credit records who contributed useful accepted proof.

### 5. Show The Web Prototype

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Screens to show:

- Opportunity: useful work is visible and the proof loop is clear.
- First Run: the user gets a guided safe mission instead of configuring a platform.
- Projects: accepted proof grows a shared project through a proof ledger and agent delegations.
- Work Queue: raw work is imported from existing sources, diagnosed, and held back until mission-ready.
- Runner: no external action happens without approval, and packet outputs are previewed.
- Case Files: evidence is reviewed before submission with private/public artifact boundaries.
- Maintainer: clean proof, not agent noise; decision support shows confidence, risk, artifacts, privacy, and payout.
- Scoreboard: next action, earned/released payout state, reputation unlock, and activity.
- Public Proof: accepted proof is shareable without exposing raw logs, local paths, or payout internals.

Direct routes:

```text
/#opportunity
/#first-run
/#projects
/#work-queue
/#run
/#case-file
/#maintainer
/#scoreboard
/#public-proof
```

Suggested click path in the browser:

```text
Opportunity
-> First Run
-> Work Queue
-> Runner
-> Case File
-> Maintainer
-> Scoreboard
-> Public Proof
```

Narration:

- The economy already exists; ProofForge imports work from it.
- Raw work becomes a Work Lead first, not a mission.
- Work Leads must be proofable before agents run.
- Agents produce evidence locally.
- Human approval gates public action.
- Maintainers receive a decision-ready packet.
- Accepted packets create earned payout and project credit.
- Public Proof makes contribution history portable.

## Closing Line

ProofForge is a coordination layer for builders who already have agents and tools. The point is not more generated code. The point is useful work that holds.

## Recording Checklist

Show these terminal commands:

```bash
npm test
npm run build
npm run demo:packet
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

Show these generated files:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/policy.json
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/released-payout.json
demo-output/docs-install/packet/project.json
```

Show these browser routes:

```text
/#opportunity
/#first-run
/#work-queue
/#run
/#case-file
/#maintainer
/#scoreboard
/#public-proof
```

Do not claim:

- automatic payments
- automatic pull requests
- automatic maintainer outreach
- live production sandboxing
- live 0G upload unless credentials are configured and the command returns a `0g://` URI
