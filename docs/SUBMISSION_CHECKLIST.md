# ProofForge Submission Checklist

Use this before final hackathon submission.

## Required Links

- Public GitHub repository: `<public repository URL>`
- Local demo URL: `http://localhost:5173/#opportunity`
- Deployed product URL: `https://proofforgehub.vercel.app`
- Demo video URL: add after recording
- AI tool attribution: [`AI_ATTRIBUTION.md`](AI_ATTRIBUTION.md)

## Demo Video Requirements

- Length: 2-4 minutes
- Resolution: at least 720p
- Audio: clear spoken narration, not music-only
- Show the repository and the working product
- Show at least one terminal proof command
- Show the browser proof loop from work to payout state

## Recommended Video Flow

1. State the problem: useful project work is scattered, agents create more
   output, and maintainers need trusted proof before credit or payout.
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
   - My Work (`#my-work`)
   - Public Proof (`#public-proof`)
   - Reproducible terminal proof commands from this checklist
9. Close with: ProofForge turns existing work into safe missions, evidence
   packets, accepted proof, and credit or payout state.

The exact terminal files and routes to show are listed in [DEMO_SCRIPT.md](DEMO_SCRIPT.md#recording-checklist).

## Judge Run Commands

```bash
npm install
npm test
npm run build
npm run ens:check -- --name <your-agent.eth> --address <agent-wallet>
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
My Work: http://localhost:5173/#my-work
Builder Passport: http://localhost:5173/#builder-passport
Public Proof: http://localhost:5173/#public-proof
```

## What Works Now

- Project steward can create/edit a local project workspace.
- Project steward can create a work request with reward, acceptance owner, and
  contributor invite.
- Contributor can open that request from Opportunities and run it through the
  mission/proof flow.
- GitHub issue import creates a local Work Lead from public issue data.
- Mission conversion blocks vague or incomplete work.
- Local runner creates deterministic proof artifacts.
- Independent verifier checks runner artifacts.
- Evidence Packet, Case File, Public Packet, Policy, Payout, and Project artifacts are generated.
- Submission evidence artifact lists GitHub, 0G, agent identity/skills, and
  payout/receipt claims with proof commands.
- Earned payout and released payout are separate accounting states.
- Web prototype demonstrates the user journey and review surfaces.
- Route registration has automated test coverage.
- AI tool usage is documented in [`AI_ATTRIBUTION.md`](AI_ATTRIBUTION.md).

## Known Limits

- V1 is local single-user state, not hosted multi-user SaaS yet.
- The current runner is deterministic and local; Docker-backed sandboxing is a later step.
- The web app is a product prototype using seeded data, not a hosted backend.
- Payments are manual accounting artifacts only; no automatic transfer or escrow happens.
- 0G storage is adapter-gated and uses local storage unless credentials are configured.
- ENS is live only when `npm run ens:check` resolves an ENS name and the
  resulting identity receipt is carried into the packet.
- AXL is not live unless completed and verified before submission.
- Agent identity falls back to the local proof node when ENS is not configured.
  Do not claim AXL unless that integration is completed and verified.
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
