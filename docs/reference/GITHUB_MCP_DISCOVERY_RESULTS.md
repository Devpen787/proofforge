# GitHub And MCP Discovery Results

Date: 2026-05-02

Use with:

- [`../GITHUB_MCP_DISCOVERY_EXERCISE.md`](../GITHUB_MCP_DISCOVERY_EXERCISE.md)
- [`../PRODUCT_BLUEPRINT.md`](../PRODUCT_BLUEPRINT.md)
- [`../STORYBOARD_ALIGNMENT_MAP.md`](../STORYBOARD_ALIGNMENT_MAP.md)
- [`../ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](../ETHEREUM_WEB3_BOUNTY_INTEGRATION.md)

## Executive Finding

The discovery supports the current ProofForge direction.

There are many adjacent ETHGlobal projects around:

- GitHub-to-payout
- contribution reputation
- proof or attestation
- bounty automation
- agent-assisted code evaluation
- wallet/onchain identity

But they mostly optimize for one of these:

```text
pay contributors
score PRs
verify identity
run agents
create bounties
issue attestations
```

ProofForge should not copy any one of them. The differentiated lane is:

```text
source-backed work
-> safe agent-assisted proof
-> maintainer-ready Proof Pack
-> human acceptance
-> credit / payout / receipt / project history
```

The discovery does change V1 in one important way:

```text
Mission Detail and Proof Pack should show bounty/source qualification requirements, not just reward amount.
```

For example:

- public GitHub repo
- setup instructions
- demo video or live demo
- protocol features or SDKs used
- contract deployment addresses when relevant
- feedback or evidence file if required by the sponsor
- who accepts the submission

## Sources Used

### ETHGlobal Skills Repo

Local clone verified:

```text
https://github.com/ethglobal-skills/repo
HEAD: 0884f1905e75928140ea0b2521e251dab77554b0
```

Useful files:

```text
scraper/data/projects_full.json
scraper/data/projects_raw.json
scraper/data/events.json
skills/ethglobal-skills/SKILL.md
```

Local corpus structure:

```text
projects_full.json -> { "projects": [...] }
project count: 17180
projects with GitHub URL: 16847
projects with prize data: 7778
```

Project fields:

```text
title
tagline
description
how_its_made
github
live_demo
event
prizes
url
```

API docs confirmed:

```text
GET /api/projects
GET /api/prizes
GET /api/sponsors
```

Rate-limit note:

```text
10 free requests per minute, then x402 payment at $0.05 USDC on Base per request.
```

Product decision:

```text
Use local ETHGlobal corpus for discovery and demo seeding.
Do not make the V1 demo depend on paid x402 API calls.
```

### ETHGlobal API Sample

Queried:

```text
GET https://ethglobalskills.vercel.app/api/prizes?event=Open+Agents
```

Returned skill version:

```text
X-Skill-Version: 1.0.0
```

Useful prize requirement patterns found:

- public GitHub repo
- README and setup instructions
- demo video and live demo link
- contract deployment addresses where applicable
- explain which protocol features or SDKs were used
- team/contact info
- working example agent for framework/tooling prizes
- architecture diagram strongly recommended for agent/framework work
- `FEEDBACK.md` required for the Uniswap API integration prize

Product decision:

```text
ProofForge Source Record and Mission Detail need a "submission requirements" section.
Proof Pack should show which source/bounty requirements were satisfied.
```

## ETHGlobal Prior Art

These projects overlap ProofForge enough to learn from. Data came from the local ETHGlobal corpus and project showcase metadata.

| Project                                                                                                                                         | Event                 | Category                            | What it does                                                                                                                                         | Web3 / GitHub hook                                                            | What ProofForge should learn                                                                                                                       | Impact          |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| [ProofOf Contribution](https://ethglobal.com/showcase/proofof-contribution-6ew4y) / [GitHub](https://github.com/seetadev/Proof-of-Contribution) | ETHGlobal New Delhi   | proof, contribution, payout         | Toolkit for maintainers to verify contributors, track progress, validate invoices, produce attestations, and automate compliant payouts.             | GitHub artifacts, KYC/liveness, zk attestations, invoices, payout automation. | Strong overlap with contribution proof. ProofForge should keep the Proof Pack as the central artifact and not jump directly to payment automation. | V1/V2 influence |
| [SecGit](https://ethglobal.com/showcase/secgit-ehgmv) / [GitHub](https://github.com/Rishikpulhani/SecGit)                                       | ETHGlobal New Delhi   | bounty, AI review, GitHub           | Blockchain-backed Gitcoin-like platform with staking and AI-assisted code analysis.                                                                  | GitHub issues, repo owners, issue solvers, reputation-backed AI, 0G.          | Confirms GitHub issue-to-work is a real lane. ProofForge should keep human acceptance and evidence packaging stronger than autonomous scoring.     | V1/V2 influence |
| [MergeFi](https://ethglobal.com/showcase/mergefi-6keuc) / [GitHub](https://github.com/Animesh-Parashar/MergeFi)                                 | ETHOnline 2025        | GitHub payout, OSS incentives       | AI-powered "Commit-to-Earn" connecting GitHub contributions to onchain value transfer.                                                               | GitHub commits/PRs, cross-chain payouts, transaction transparency.            | Good proof that GitHub-to-value is a common idea. ProofForge must differentiate by requiring accepted Proof Packs, not raw commit counts.          | V1/V2 influence |
| [DevQuest](https://ethglobal.com/showcase/devquest-z6fde) / [GitHub](https://github.com/Tarif-dev/DevQuest)                                     | ETHOnline 2025        | bounty platform, escrow, AI scoring | Decentralized bounty platform using AI-powered code quality assessment, escrow, and privacy controls.                                                | PR scoring, smart contracts, escrow, PYUSD.                                   | Validates demand for automated contribution compensation. For V1, avoid escrow and instant payout claims.                                          | V2/V3 roadmap   |
| [PullQuestAI](https://ethglobal.com/showcase/pullquestai-6pncc) / [GitHub](https://github.com/Shashwat-Trivedi/Pull-Quest)                      | ETHGlobal New Delhi   | open-source rewards, reputation     | Incentivizes open-source contributions with blockchain rewards, XP, and bounties.                                                                    | GitHub PRs/issues, identity, XP, HBAR bounties.                               | XP/reputation is useful, but ProofForge should keep "credit" tied to accepted proof rather than generic gamification.                              | V2 influence    |
| [ZkDev](https://ethglobal.com/showcase/zkdev-mhsuv) / [GitHub](https://github.com/OwnerOfJK/zkDev)                                              | ETHGlobal Prague      | private developer proof             | Lets developers prove code contributions across projects using zero-knowledge without revealing identity.                                            | GitHub contribution proof, ZK identity.                                       | Strong future Builder Passport idea. V1 should not attempt privacy-preserving identity; V2/V3 can explore credentials.                             | V2/V3 roadmap   |
| [GITHUB PAYROLL / Foss It](https://ethglobal.com/showcase/github-payroll-8pcnq) / [GitHub](https://github.com/lakshayroop5/AI-PAYROLL)          | ETHGlobal New Delhi   | open-source payroll                 | Blockchain payroll platform compensating contributors based on GitHub contribution data.                                                             | GitHub activity, decentralized payroll, credentials.                          | Reinforces need to distinguish observed contribution from accepted credit.                                                                         | V2 influence    |
| [OPENWAVE](https://ethglobal.com/showcase/openwave-a8rs5) / [GitHub](https://github.com/03-lovepreetSingh/eth-online)                           | ETHOnline 2025        | open-source bounties                | Web3 bounty platform connecting maintainers and contributors around GitHub issues.                                                                   | GitHub issues, crypto bounties, maintainers, contributors.                    | Confirms "GitHub issue as work source" is expected. ProofForge should be the proof layer, not another bounty marketplace.                          | V1 influence    |
| [vGrant](https://ethglobal.com/showcase/vgrant-xuoxs) / [GitHub](https://github.com/b3ww/vGrant)                                                | ETHGlobal Prague      | grant automation                    | Automates crypto payouts based on merged open-source issues/PRs with zk-proof.                                                                       | GitHub merge, grants, smart contracts, payout automation.                     | Useful later, but V1 should not treat merge as enough. ProofForge needs reviewer acceptance and proof quality.                                     | V2/V3 roadmap   |
| [BountyNet](https://ethglobal.com/showcase/bountynet-1mvz7) / [GitHub](https://github.com/maceip/BountyNet)                                     | ETHGlobal Cannes 2026 | agent bounties, CI repair           | Autonomous bounty marketplace where agents fix failing CI builds and get paid.                                                                       | GitHub App webhooks, CI failures, token budget, onchain bounty lifecycle.     | Very close to agent work. ProofForge should learn from CI-failure source detection, but keep agents constrained and human-approved.                | V2/V3 roadmap   |
| [DevDrops](https://ethglobal.com/showcase/devdrops-frgpv) / [GitHub](https://github.com/lishuweb/devdrop)                                       | Agentic Ethereum      | AI evaluation, rewards              | AI evaluates GitHub contributions and distributes token rewards via smart contracts/Merkle trees.                                                    | GitHub contribution evaluation, Ethereum distribution.                        | AI scoring alone is not enough. ProofForge should use verifier evidence and maintainer decision, not opaque AI grading.                            | V2 influence    |
| [Proof of Claw](https://ethglobal.com/showcase/proof-of-claw-9006a) / [GitHub](https://github.com/Proof-of-Claw/ProofOfClaw)                    | ETHGlobal Cannes 2026 | provable agents                     | Framework for cryptographically provable autonomous AI agent actions with encrypted communication and hardware approval for high-value transactions. | agent proofs, RISC Zero, hardware approval, private agent communication.      | Strong V3 agent-trust inspiration. Not V1. ProofForge V1 can show local runner/verifier trace.                                                     | V3 roadmap      |

## Similarity Takeaways

### What Others Are Doing

Common patterns:

```text
GitHub contribution -> score -> payout
GitHub issue -> bounty -> PR/merge -> payment
developer identity -> reputation or credential
agent or AI review -> contribution evaluation
onchain transaction -> payout transparency
```

### What ProofForge Should Do Differently

ProofForge should not compete as another bounty board or payout app.

Differentiator:

```text
make the work reviewable before payout
package evidence for maintainers
separate runner, verifier, reviewer, and value state
track credit even when payout is external or absent
connect project growth and contributor history
```

## Bounty And Prize Mechanics Patterns

Discovered from ETHGlobal Skills API and project corpus.

| Pattern                | Common requirement                                                         | ProofForge field / UI impact                                                                       |
| ---------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Repository proof       | public GitHub repo, README, setup instructions                             | Source Record needs source URL; Proof Pack needs artifact list and setup evidence                  |
| Demo proof             | demo video, live demo link, working example                                | Proof Pack should support demo URL / public artifact refs                                          |
| Protocol-use proof     | explain which SDK, API, protocol features, or contracts were used          | Mission Detail needs required integrations and Proof Pack needs "requirements satisfied" checklist |
| Deployment proof       | contract deployment addresses, chain/network, transaction references       | Web3 fields need chain, contract address, tx hash, receipt URL                                     |
| Feedback/evidence file | e.g. `FEEDBACK.md` required for Uniswap API eligibility                    | Mission terms should show required files; Proof Pack should verify presence                        |
| Agent framework proof  | working example agent, architecture diagram, framework/tooling description | Agent Setup and Proof Pack should show runner/verifier/packager trace and architecture refs        |
| Sponsor acceptance     | sponsor/judge validates prize criteria                                     | Work Lead needs acceptance owner; Maintainer Review can model sponsor/reviewer acceptance          |

## GitHub Contribution Tracking Lessons

1. Many projects use GitHub activity as the raw signal, but that is not enough for ProofForge.
2. A PR, commit, or merge should be an observed contribution, not final accepted credit by itself.
3. The differentiating event is accepted proof:

```text
Observed GitHub contribution
+ source/project context
+ evidence packet
+ human acceptance
= ProofForge credit record
```

4. Project growth should be shown as context, not proof:

```text
stars, forks, releases, treasury movement, bounty payout, project activity
```

5. Wallet identity and GitHub identity should be linked only when the user opts in.

## Ethereum MCP Candidate Review

MCP Market was rate-limited for direct scripted fetching during this run, so these classifications use the visible MCP Market Ethereum page information plus search result pages for individual MCPs.

| MCP candidate                           | Type                                        | Risk        | Requires secrets?            | Agent-safe?                 | ProofForge use                                                        | Version fit   |
| --------------------------------------- | ------------------------------------------- | ----------- | ---------------------------- | --------------------------- | --------------------------------------------------------------------- | ------------- |
| Ethereum Toolkit                        | read-only chain data                        | low         | API key may be needed        | yes                         | verify balances, gas, transaction details, receipt refs               | V2            |
| Ethereum RPC / Eth / Geth               | read-only / RPC gateway with optional write | medium      | RPC endpoint                 | read-only only              | verify tx hashes, block data, contract code, events                   | V2            |
| Wallet Inspector                        | read-only wallet activity                   | low/medium  | wallet address, maybe API    | yes if read-only            | inspect payout recipient activity and receipt references              | V2            |
| Ethereum Tools                          | analysis / audit / wallet analytics         | medium      | likely API/config            | yes if read-only/audit only | smart contract audit evidence, wallet analysis, profitability context | V2            |
| Foundry                                 | developer proof tool                        | low/medium  | no private key unless deploy | yes for local test/analyze  | smart contract mission runs, tests, coverage, reproducible proof      | V2            |
| Aderyn                                  | developer proof/security tool               | low         | no                           | yes                         | Solidity static analysis as verifier artifact                         | V2            |
| UCAI / ABI interface tools              | contract interface generation               | medium      | contract ABI/RPC             | with approval               | turn contract requirements into agent-usable mission tools            | V2/V3         |
| Zerion                                  | portfolio/wallet data                       | medium      | API key                      | read-only only              | wallet value context, not core proof                                  | V2/V3         |
| Payment MCPs                            | payment/write tool                          | high        | yes                          | no, approval required       | future guarded release/settlement only                                | V3            |
| Ethereum Wallet Toolkit / Ethers Wallet | wallet/signing                              | high        | private key or signer        | no, approval required       | future settlement/signing workflow, never V1                          | V3            |
| Printr / token creation tools           | token lifecycle/write                       | high        | signer/API maybe             | no                          | not relevant to V1; avoid token launch distractions                   | avoid/V3 only |
| AgentData / trading data tools          | market data/x402                            | medium/high | payment/API                  | not relevant to proof loop  | not core; avoid for V1                                                | avoid/V3 only |

## MCP Takeaways

Safe for V2:

```text
read-only tx hash verification
wallet balance/activity inspection
contract code/event lookup
Foundry/Aderyn proof artifacts
```

Not safe for V1:

```text
wallet signing
transaction broadcasting
autonomous payment
token creation
trading
auto-pay x402 tools
```

Product rule:

```text
MCPs can verify or inspect evidence.
MCPs should not spend, sign, post, or settle without explicit human approval.
```

## Product Decisions

### Adopt In V1

1. Source/bounty requirements section in Mission Detail.
2. Proof Pack checklist that shows whether source/bounty requirements are satisfied.
3. Optional `bountyUrl`, `sponsor`, `rewardAsset`, `releaseMethod`, `custodyStatus`, `txHash`, and `receiptUrl` fields.
4. "Observed contribution is not accepted credit" copy in My Work/Ledger where relevant.
5. ETHGlobal-style source fixture or example source in Connect Sources/Opportunities.

### Model Lightly For V2/V3

1. Wallet connection and onchain receipt import.
2. GitHub account import and observed contribution history.
3. Read-only MCP receipt verification.
4. Foundry/Aderyn smart contract proof missions.
5. Builder Passport / contribution graph based on accepted proof.

### Roadmap Only

1. Escrow and settlement integrations.
2. Agent identity standards and agent-owned value splits.
3. External marketplace live adapters.
4. ZK/private contribution proof.
5. Sponsor funding pools.

### Do Not Add To V1

1. Automatic payout.
2. Wallet signing.
3. Token creation or NFT issuance.
4. Prediction markets.
5. Raw API-key pooling.
6. Full agent marketplace/workroom.
7. Live ETHGlobal x402 dependency.

## Impact On Current Storyboard

The storyboard remains valid.

Required update before implementation:

```text
Mission Detail needs a source/bounty requirements block.
Proof Pack needs a requirements-satisfied checklist.
My Work/Ledger needs observed vs accepted distinction.
Connect Sources should include "ETHGlobal/GitHub bounty source" as a modeled source.
Web3/receipt details should appear only in Mission Detail, Proof Pack, Review, My Work, Ledger, and Public Proof.
```

## Impact On Implementation Plan

Add one implementation slice before final QA:

```text
Slice: Source/Bounty Intelligence
- local ETHGlobal-style source fixture
- source/bounty requirement fields
- Mission Detail requirement block
- Proof Pack requirement checklist
- My Work/Ledger observed vs accepted labels
```

This slice makes V1 feel more connected to real Web3/hackathon work without pretending to run live settlement.

## Open Questions

These do not block V1:

1. Which specific ETHGlobal source fixture should appear in the demo?
2. Should we show Open Agents bounty requirements directly or use a neutral "ETHGlobal-style sponsor requirement" fixture?
3. Which read-only MCP should be first to prototype for V2 receipt verification?
4. Should Foundry/Aderyn become a smart-contract proof mission type in V2?

## Done Against Exercise

| Required output                        | Status |
| -------------------------------------- | ------ |
| 10 ETHGlobal/GitHub prior-art projects | done   |
| 5 bounty/prize mechanics patterns      | done   |
| 8 Ethereum MCP candidates              | done   |
| 3 lessons that affect V1               | done   |
| 5 roadmap ideas for V2/V3              | done   |
| Implementation candidate list          | done   |

## References

- [ETHGlobal Skills repo](https://github.com/ethglobal-skills/repo)
- [ETHGlobal Skills API docs](https://github.com/ethglobal-skills/repo/blob/main/skills/ethglobal-skills/SKILL.md)
- [MCP Market Ethereum category](https://mcpmarket.com/businesses/ethereum)
- [Ethereum Tools MCP](https://mcpmarket.com/server/ethereum-tools-1)
- [Geth MCP](https://mcpmarket.com/server/geth)
- [Ethereum Toolkit MCP](https://mcpmarket.com/server/ethereum-toolkit)
- [Wallet Inspector MCP](https://market-mcp.com/mcp/wallet-inspector)
