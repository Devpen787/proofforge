# ProofForge Submission Checklist

Use this before final hackathon submission.

## Required Links

- Public GitHub repository: `https://github.com/Devpen787/proofforge`
- Local demo URL: `http://localhost:5173/#opportunity`
- Deployed demo URL: add after deployment
- Demo video URL: add after recording

## Demo Video Requirements

- Length: 2-4 minutes
- Resolution: at least 720p
- Audio: clear spoken narration, not music-only
- Show the repository and the working product
- Show at least one terminal proof command
- Show the browser proof loop from work to payout state

## Recommended Video Flow

1. State the problem: agents create more output, but maintainers need trusted proof.
2. Show the agent/node identity and allowed/blocked actions.
3. Run `npm run demo:packet`.
4. Run `npm run sync:web-proof` to sync sanitized generated proof data into the browser demo.
5. Show generated artifacts under `demo-output/docs-install/packet/`.
6. Run `npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json`.
7. Open the web app at `http://localhost:5173/#opportunity`.
8. Click through:
   - Home (`#opportunity`)
   - Guided proof flow (`#first-run`)
   - Opportunities (`#work-queue`)
   - Runner (`#run`)
   - Case File (`#case-file`)
   - Maintainer Review (`#maintainer`)
   - Proof ledger / outcome state (`#scoreboard`)
   - Public Proof (`#public-proof`)
   - Reproducible terminal proof commands from this checklist
9. Close with: ProofForge turns existing work into safe missions, evidence packets, accepted proof, and credit.

The exact terminal files and routes to show are listed in [DEMO_SCRIPT.md](DEMO_SCRIPT.md#recording-checklist).

## Judge Run Commands

```bash
npm install
npm test
npm run build
npm run 0g:check
npm run demo:packet
npm run sync:web-proof
npm run dev
```

Optional payout release command:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

Optional public work import command:

```bash
npm run import:github -- --url https://github.com/microsoft/vscode/issues/1
```

## Browser Routes

```text
Home: http://localhost:5173/#opportunity
Guided proof flow: http://localhost:5173/#first-run
Projects: http://localhost:5173/#projects
Opportunities: http://localhost:5173/#work-queue
Mission detail: http://localhost:5173/#mission-detail
Runner: http://localhost:5173/#run
Case File: http://localhost:5173/#case-file
Maintainer Review: http://localhost:5173/#maintainer
Proof ledger / outcome state: http://localhost:5173/#scoreboard
Public Proof: http://localhost:5173/#public-proof
```

## What Works Now

- GitHub issue import creates a local Work Lead from public issue data.
- Mission conversion blocks vague or incomplete work.
- Local runner creates deterministic proof artifacts.
- Independent verifier checks runner artifacts.
- Evidence Packet, Case File, Public Packet, Policy, Payout, and Project artifacts are generated.
- Submission evidence artifact lists GitHub, ETHGlobal, 0G, agent identity/skills, and payout/receipt claims with proof commands.
- Earned payout and released payout are separate accounting states.
- Web prototype demonstrates the user journey and review surfaces.
- Route registration has automated test coverage.

## Known Limits

- The current runner is deterministic and local; Docker-backed sandboxing is a later step.
- The web app is a product prototype using seeded data, not a hosted backend.
- Payments are manual accounting artifacts only; no automatic transfer or escrow happens.
- 0G storage is adapter-gated and uses local storage unless credentials are configured.
- ENS and AXL are not live unless completed and verified before submission.
- Agent identity and coordination trace are modeled locally. Do not claim ENS or AXL unless those integrations are completed and verified.
- ProofForge does not post GitHub comments, open pull requests, or contact maintainers automatically.
- Current dependency audit status is documented in [DEPENDENCY_AUDIT.md](DEPENDENCY_AUDIT.md).

## Final Pre-Submit Gate

Run:

```bash
npm test
npm run build
npm run demo:packet
npm run sync:web-proof
```

Then verify the browser routes above and confirm the submission form has the repository, deployed demo URL, and demo video URL.
