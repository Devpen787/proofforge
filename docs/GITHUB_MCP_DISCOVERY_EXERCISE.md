# ProofForge GitHub And MCP Discovery Exercise

Run this before the next implementation pass.

Purpose:

```text
Use existing GitHub projects, ETHGlobal project history, bounty/prize data, and Ethereum MCP servers to learn what has already been built, what ProofForge should reuse as inspiration, and which adapters are worth modeling in V1/V2/V3.
```

This is a discovery exercise, not a commitment to integrate every source.

## Why We Are Doing This

ProofForge should not be built only from internal assumptions.

We need to learn:

- which projects already tried similar proof, bounty, agent, contribution, wallet, or reputation ideas
- what UX patterns helped users understand the value
- what parts were overbuilt or too crypto-heavy
- which GitHub and Web3 data sources are real enough to support our V1 story
- which MCP servers could later verify receipts, inspect contracts, or support agent-assisted proof

The output should sharpen the V1 redesign and give credible V2/V3 extension paths.

## Inputs

| Source                         | What it is useful for                                                                                  | Use now? |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ | -------- |
| ETHGlobal Skills repo          | local project corpus, API docs, sponsor bounties, prize winner search patterns                         | yes      |
| ETHGlobal project GitHub links | prior art, UX patterns, agent/Web3/contribution tools, proof/bounty systems                            | yes      |
| GitHub search                  | similar open-source products beyond ETHGlobal                                                          | yes      |
| MCP Market Ethereum category   | adapter candidates for read-only chain data, contract analysis, wallet inspection, and future payments | yes      |
| Existing ProofForge docs/code  | decide what changes V1 now versus V2/V3 later                                                          | yes      |

## Confirmed Source Facts

### ETHGlobal Skills

The ETHGlobal Skills repo claims access to:

- 17,180 hackathon projects from the past 6 years
- sponsor docs and bounties for upcoming hacks
- finalist and bounty winner data

The repo contains local scraper data such as:

```text
scraper/data/projects_full.json
scraper/data/projects_raw.json
scraper/data/events.json
scraper/data/upcoming_events.json
```

Its API docs expose:

```text
GET /api/projects
GET /api/prizes
GET /api/sponsors
```

The API has 10 free requests per minute, then x402 payment at `$0.05 USDC on Base mainnet` per request. For our demo and discovery, prefer local data or limited manual queries. Do not make the product depend on paid API calls.

### MCP Market Ethereum

MCP Market lists Ethereum MCP servers and describes 34 MCPs built for Ethereum. The visible page includes candidates such as:

- Aderyn: Solidity static analysis
- EVM: multi-network EVM interaction
- Foundry: Solidity development and blockchain analysis
- Web3: RPC endpoints across multiple chains
- UCAI: generate MCP servers from smart contract ABIs
- Ethereum Wallet Toolkit: wallet generation, derivation, signing, transaction building
- Ethereum Tools: chain analysis, smart contract audit, wallet profitability
- Ethereum RPC / Eth / Geth / Geth Proxy: JSON-RPC blockchain data
- Wallet Inspector: balances and onchain activity
- Payment: onchain payment actions

Discovery rule:

```text
Read-only MCPs can inform V2.
Wallet write/payment MCPs are V3 only and must stay behind human approval.
```

## Discovery Tracks

### Track A: Similar Product Prior Art

Find projects that overlap with ProofForge.

Search terms:

```text
proof
evidence
attestation
reputation
contribution
developer reputation
builder passport
bounty
grant
treasury
public goods
agent
workflow
GitHub
wallet
credential
receipt
```

For each candidate, record:

| Field             | Question                                            |
| ----------------- | --------------------------------------------------- |
| Project           | What is it called?                                  |
| URL               | ETHGlobal/GitHub/live demo link                     |
| Category          | proof, bounty, agent, reputation, wallet, grant     |
| What it solves    | What user problem is it attacking?                  |
| UX pattern        | How does it explain the product?                    |
| Web3 hook         | Wallet, tx, attestation, badge, grant, payout, none |
| Agent hook        | Human-only, agent-assisted, agent-native            |
| What worked       | What should ProofForge learn?                       |
| What was missing  | What did it not solve?                              |
| ProofForge impact | V1 adopt, V2 roadmap, V3 roadmap, ignore            |

### Track B: Bounty And Prize Mechanics

Find how sponsor bounties describe work.

Questions:

1. What are the common prize/bounty qualification patterns?
2. Do bounties ask for code, deployed apps, usage, integrations, proofs, tests, or demos?
3. How often is GitHub required or useful?
4. Who accepts the work: sponsor, judge, maintainer, buyer, DAO, foundation?
5. What value language is used: prize, grant, bounty, pool, credits, access?
6. How could ProofForge convert this into Source Record -> Mission terms?

Output:

```text
Common Bounty Requirement Patterns
-> ProofForge Source Record fields
-> Mission Detail fields
-> Proof Pack fields
```

### Track C: GitHub Contribution Tracking

Look for projects that link GitHub identity to contribution, reputation, payout, or public proof.

Questions:

1. How do they import GitHub data?
2. Do they track PRs, commits, issues, reviews, releases, stars, forks, or dependency impact?
3. Do they distinguish observed contribution from accepted credit?
4. Do they link GitHub to wallet identity?
5. Do they show project growth after a contribution?

ProofForge rule:

```text
Observed GitHub activity is not accepted ProofForge credit until linked to accepted proof or an external acceptance signal.
```

### Track D: MCP Adapter Candidates

Classify Ethereum MCPs by safety and usefulness.

| Class                    | V1/V2/V3 fit | Examples                                        | Product use                                              |
| ------------------------ | ------------ | ----------------------------------------------- | -------------------------------------------------------- |
| Read-only chain data     | V2           | Ethereum RPC, Eth, Geth, Wallet Inspector       | verify tx/receipt references, inspect wallet activity    |
| Developer proof tools    | V2           | Foundry, Aderyn, Analyze Solidity               | smart contract proof missions, audit evidence, test runs |
| Contract interface tools | V2/V3        | UCAI, SparkMango                                | turn contract ABIs into agent-usable proof interfaces    |
| Wallet/payment tools     | V3 only      | Ethers Wallet, Ethereum Wallet Toolkit, Payment | guarded settlement or signing after human approval       |
| Risky token launch tools | exclude V1   | Vibecoins                                       | not part of proof-before-payout MVP                      |

For each candidate, record:

| Field             | Question                                         |
| ----------------- | ------------------------------------------------ |
| MCP name          | What is it?                                      |
| URL               | Source link                                      |
| Type              | read-only, dev proof, contract interface, wallet |
| Risk level        | low, medium, high                                |
| Requires secrets? | yes/no                                           |
| Agent-safe?       | yes/no/only with approval                        |
| ProofForge use    | receipt verification, contract proof, payout     |
| Version fit       | V1, V2, V3, avoid                                |

### Track E: ProofForge Product Impact

After reviewing candidates, decide:

| Decision type | Meaning                                        |
| ------------- | ---------------------------------------------- |
| Adopt now     | affects V1 UI/data/demo immediately            |
| Model lightly | visible as V2/V3-light without live dependency |
| Roadmap       | useful later but not in current build          |
| Reject        | distracts from proof-before-payout             |

## Scoring Rubric

Score each candidate 1-5.

| Score | Meaning                                           |
| ----- | ------------------------------------------------- |
| 1     | unrelated or distracting                          |
| 2     | interesting but not relevant to V1                |
| 3     | useful inspiration for V2/V3                      |
| 4     | should influence V1 UX or data model              |
| 5     | should become a V1 source/demo fixture or adapter |

Scoring factors:

- overlaps with source-backed work
- helps users understand credit/payout/proof
- improves agent safety or verification
- supports GitHub + wallet/project contribution graph
- can be demoed without fragile live dependencies
- does not overclaim settlement, ownership, or automatic payment

## Required Outputs

### 1. Prior Art Table

File target:

```text
docs/reference/GITHUB_MCP_DISCOVERY_RESULTS.md
```

Current result:

[`reference/GITHUB_MCP_DISCOVERY_RESULTS.md`](./reference/GITHUB_MCP_DISCOVERY_RESULTS.md)

Minimum:

- 10 ETHGlobal/GitHub prior-art projects
- 5 bounty/prize mechanics patterns
- 8 Ethereum MCP candidates
- 3 lessons that affect V1
- 5 roadmap ideas for V2/V3

### 2. Product Decision Summary

Update:

```text
docs/PRODUCT_BLUEPRINT.md
docs/STORYBOARD_ALIGNMENT_MAP.md
docs/ETHEREUM_WEB3_BOUNTY_INTEGRATION.md
```

Only update these if discovery changes actual decisions.

### 3. Implementation Candidate List

Produce a small list:

```text
Must add to V1
Could add as V2/V3-light
Roadmap only
Do not add
```

## Discovery Commands And Queries

### Local ETHGlobal Corpus

Use local clone or temporary clone:

```bash
git clone --depth 1 https://github.com/ethglobal-skills/repo.git /tmp/ethglobal-skills
```

Inspect:

```bash
jq '.[0]' /tmp/ethglobal-skills/scraper/data/projects_full.json
jq '.[] | select((.title + " " + .tagline + " " + (.description // "") + " " + (.how_its_made // "")) | test("proof|attestation|reputation|bounty|agent|github|wallet"; "i")) | {title, url, github, hackathon, tagline}' /tmp/ethglobal-skills/scraper/data/projects_full.json
```

If `jq` is unavailable, use Node or Python.

### ETHGlobal API

Use sparingly:

```text
GET https://ethglobalskills.vercel.app/api/projects?keyword=attestation&include=description,how_its_made&limit=20
GET https://ethglobalskills.vercel.app/api/projects?keyword=reputation&include=description,how_its_made&limit=20
GET https://ethglobalskills.vercel.app/api/projects?keyword=agent&include=description,how_its_made&limit=20
GET https://ethglobalskills.vercel.app/api/prizes?event=Open+Agents
GET https://ethglobalskills.vercel.app/api/sponsors?keyword=uniswap
```

Do not exceed free rate limits during normal discovery.

### GitHub Search

Search examples:

```text
"developer reputation" github wallet open source
"github contribution" "wallet" "reputation"
"bounty" "attestation" "github"
"agent" "bounty" "ethereum" github
"proof of contribution" github ethereum
```

### MCP Market Review

Start from:

```text
https://mcpmarket.com/businesses/ethereum
```

Categorize candidates into:

```text
read-only receipt verification
developer proof tools
contract interface generation
wallet/payment tools
avoid for V1
```

## Decision Gates Before Implementation

Do not move to UI implementation until this is answered:

1. Which prior-art projects most overlap ProofForge?
2. What did they solve better than our current plan?
3. What should V1 adopt immediately?
4. What should only be shown as V2/V3-light?
5. Which MCPs are safe read-only candidates?
6. Which MCPs require secrets or transaction signing?
7. Which bounty/source patterns should be reflected in Mission Detail?
8. What should stay out of the demo?

## Current Hypothesis

Expected output:

```text
V1 should adopt source/bounty metadata, wallet/receipt reference fields, and cleaner mission terms.
V2 should explore read-only receipt verification and GitHub contribution history.
V3 should explore guarded settlement, credentials, agent identity, and external adapters.
```

Expected anti-patterns:

```text
do not turn V1 into a payment app
do not depend on live paid API calls
do not let agents sign or spend
do not copy a full agent workspace product
do not flood the UI with crypto details
```

## Done Definition

Discovery is done when we can say:

```text
We reviewed similar GitHub/ETHGlobal products.
We categorized Ethereum MCP adapter candidates.
We know what to adopt in V1.
We know what to model lightly for V2/V3.
We know what to avoid.
The implementation plan reflects those decisions.
```
