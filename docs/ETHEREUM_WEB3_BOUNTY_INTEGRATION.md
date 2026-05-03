# ProofForge Ethereum, Web3, And Bounty Integration

Use this with [`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md),
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md),
[`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md), and
[`PRODUCT_ROADMAP_VERSIONS.md`](./PRODUCT_ROADMAP_VERSIONS.md).

This document answers:

```text
Where does Ethereum/Web3 show up?
What is the Web3 hook in V1?
How do bounties enter the product?
What can we honestly demo now?
What becomes real in V2 and V3?
```

## Product Rule

ProofForge connects work proof to value signals.

It does not assume that one system tells the whole truth.

```text
GitHub/source = what was requested or produced
Proof Pack = what was proven
Maintainer/reviewer acceptance = what counts
Wallet/onchain/bounty record = value, funding, or receipt signal
ProofForge = the layer that links them into one contribution record
```

Hard guardrails:

- Payment is not proof.
- A GitHub merge is not automatically accepted ProofForge credit.
- A wallet does not imply ownership.
- An onchain transaction does not prove contribution by itself.
- V1 does not custody funds, escrow funds, or settle payments.
- V1 can track external or onchain receipts only as references.

## Why Ethereum Matters

Ethereum gives ProofForge three important rails:

1. Wallet identity for contributors, stewards, sponsors, and eventually agents.
2. Public value signals such as transfers, grant distributions, treasury payments, or funding receipts.
3. Open-source funding and bounty ecosystems that already use GitHub, wallets, and public project records.

That means ProofForge does not need to invent all economic infrastructure. It needs to organize the proof layer that existing infrastructure is missing.

## V1 Web3 Hook

V1 should include Ethereum/Web3 as a visible but honest tracking layer.

```text
Source-backed work
-> Mission terms include bounty/value path
-> Proof Pack is accepted
-> Credit record is created
-> Earned payout record is created if defined
-> Optional external/onchain receipt reference can be attached
```

V1 Web3 fields:

| Object       | Fields                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------ |
| User         | `walletAddress`, `payoutMethod`, `preferredNetwork`, `walletStatus`                              |
| Project      | `treasuryAddress`, `fundingUrl`, `fundingType`, `custodyStatus`                                  |
| Work Lead    | `sourceType`, `bountyUrl`, `sponsor`, `rewardAsset`, `acceptanceOwner`, `submissionRequirements` |
| Mission      | `valueType`, `amount`, `currency`, `releaseMethod`, `recipient`, `requiredArtifacts`             |
| Proof Pack   | `acceptedBy`, `valueRecord`, `receiptRefs`, `requirementsSatisfied`, `publicProofEligibility`    |
| Payout       | `status`, `method`, `chainId`, `txHash`, `token`, `receiptUrl`                                   |
| Public Proof | `walletRef`, `receiptRef`, `projectRef`, `redactionStatus`                                       |

V1 labels:

```text
Wallet: optional payout recipient / future connection
Onchain receipt: external reference only
Bounty: source and value path metadata
Treasury: project funding reference, not ProofForge custody
Released payout: manually marked or externally verified
```

V1 must not say:

```text
Funds are escrowed by ProofForge.
Payment is automatic.
NFT ownership is granted.
The agent got paid directly.
This transaction proves the work.
```

## Bounty Source Flow

Bounties are work sources, not a separate product.

```text
GitHub issue / bounty / DAO proposal / grant round / marketplace task
-> Source Record
-> Work Lead
-> Qualification gate
-> Mission Contract
-> Safe human or agent run
-> Proof Pack
-> Maintainer / buyer / steward review
-> Accepted Proof
-> Credit and earned payout state
-> External or onchain receipt attached when available
-> Project ledger and Public Proof update
```

Every bounty-like source must answer:

1. What project or product does this improve?
2. Where is the canonical source or bounty URL?
3. Who sponsors or funds it?
4. Who can accept proof?
5. What proof is required?
6. What value is offered if accepted?
7. What is the payout method?
8. Does ProofForge control funds? In V1, the answer is no.
9. What submission requirements must be satisfied? Examples: public repo, setup instructions, demo, contract address, feedback file, protocol-use explanation.
10. What receipt proves release if payment happens elsewhere?

If those answers are missing, the item remains a Work Lead and cannot be advertised as a paid runnable mission.

## External Bounty Adapters

Treat external systems as adapters into the same ProofForge model.

| Source category    | V1 status                        | V2 status                                      | V3 status                                      |
| ------------------ | -------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| GitHub issue       | live/demo import                 | account import, webhooks, richer source graph  | multi-project, maintainer and org graph        |
| GitHub PR          | modeled or manual reference      | observed contribution import                   | accepted proof matching and public proof graph |
| DAO proposal       | manual URL/reference             | proposal and treasury signal adapter           | governance/funding workflow adapter            |
| Grant round        | manual URL/reference             | project/grant status import where available    | sponsor/funder workflows and receipts          |
| Bounty marketplace | manual/paste/import              | adapter per marketplace                        | normalized external review and receipt states  |
| Onchain payout     | manual `txHash`/receipt field    | wallet and chain receipt import                | verified receipt and settlement integrations   |
| Agent identity     | local `agentId` and owner rollup | wallet/ENS/registry references where available | standards-based agent registry and reputation  |

## V2 Ethereum/Web3 Expansion

V2 turns the V1 references into connected signals.

V2 adds:

- wallet connection
- wallet ownership check
- payout recipient settings
- onchain receipt import by `chainId` and `txHash`
- treasury/funding URL tracking
- GitHub account import and contribution history
- matching accepted proof to external payout receipts
- project funding signals and public-good funding references
- optional proof badges or credentials only after accepted proof

V2 trust boundaries:

```text
Observed GitHub contribution is not accepted credit until matched to acceptance.
Observed payment is not proof until matched to source, mission, and accepted proof.
Wallet connection is identity and collection preference, not ownership.
```

## V3 Ethereum/Web3 Expansion

V3 can become a networked proof economy.

V3 adds only after V1/V2 are real:

- sponsor or project funding pools
- verified payment receipts
- optional escrow or settlement integrations
- public project pages with accepted proof and value history
- portable contributor credentials or proof badges
- standards-based agent identity and reputation where appropriate
- DAO/foundation/marketplace adapters
- dispute and reversal policies

V3 still preserves:

```text
source qualification
proof before payout
human acceptance
privacy and security review
explicit project value rules
earned payout separate from released payout
```

## Agent Web3 Identity

V1:

```text
agentId: docs-runner-01
owner: alex
creditRecipient: alex
payoutRecipient: alex or configured payout method
identityRef: local:docs-runner-01
```

V2:

```text
agent profile
owner wallet reference
run history
accepted proof history
specialties
project attachments
```

V3:

```text
agent registry reference
agent wallet where legally and operationally valid
reputation signals
validation receipts
permissioned project roles
```

If using emerging agent identity standards, label them as future or experimental unless implemented and verified. ERC-8004 is useful directionally because it defines identity, reputation, and validation registries for agents, but ProofForge should not claim ERC-8004 support until real code exists.

## Screen Impact

The Web3/bounty hook should appear only where it helps the user make a decision.

| Screen            | What to show                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Home              | connection state: GitHub, wallet/payout recipient, proof node, next best work                                   |
| Connect Sources   | GitHub import, wallet/payout setup, bounty/DAO/grant URL import                                                 |
| Projects          | project funding source, treasury/reference URL, accepted proof value summary                                    |
| Opportunities     | source type, bounty/value path, sponsor, acceptance owner, proof needed, payout method                          |
| Mission Detail    | mission terms: reward asset, release method, recipient, custody status, owner/acceptance, source requirements   |
| Runner            | no spend, no public action, no external submission without approval                                             |
| Proof Pack        | accepted value if approved, requirement checklist, receipt refs, shared/private split, public proof eligibility |
| Maintainer Review | credit recipient, payout impact, release method, acceptance consequences                                        |
| My Work           | active/submitted/accepted/earned/released, wallet/receipt state, external follow-up                             |
| Proof Ledger      | accepted proof, credit, earned payout, released payout, receipt references                                      |
| Public Proof      | public-safe proof plus optional receipt/wallet/project references                                               |

Do not show wallet, tx hashes, treasury, bounties, and ownership explanations on every screen. Show them where they affect source, mission terms, acceptance, release, or public proof.

## Data Contracts

### Web3 Identity

```text
walletAddress
chainId
ensName optional
verifiedAt optional
verificationMethod
defaultPayoutMethod
```

### Bounty Source

```text
sourceType
sourceUrl
bountyUrl
sponsor
projectRef
acceptanceOwner
rewardAmount
rewardAsset
rewardNetwork
payoutMethod
custodyStatus
externalStatus
submissionRequirements
requiredArtifacts
missingInfo
```

### Onchain Value Signal

```text
chainId
txHash
contractAddress optional
token
amount
from
to
timestamp
matchedProofPackId optional
verificationStatus
receiptUrl
```

### Value Record

```text
creditRecord
benefitRecord optional
earnedPayout optional
releasedPayout optional
externalReceipt optional
onchainSignal optional
ownershipRecord optional only if explicit terms exist
```

## Demo Contract

The hackathon demo can honestly show:

```text
GitHub-backed or bounty-backed work source
Mission value terms
Source/bounty requirements checklist
Optional wallet/payout recipient field
Optional external/onchain receipt reference
Accepted proof creates credit and earned payout state
Release remains manual or external
Public Proof can show a receipt reference after acceptance
```

The demo should not claim:

```text
automatic onchain settlement
escrow
token issuance
ownership distribution
live marketplace sync
agent-to-agent onchain payments
```

## External References

These are directional references for product strategy, not proof that ProofForge implements them.

- [ERC-8004: Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004) describes onchain agent identity, reputation, and validation registries.
- [Drips docs](https://docs.drips.network/) describe Ethereum-based open-source funding with GitHub repository project representations and dependency splits.
- [Gitcoin Grants Stack support](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-grants-program/what-is-gitcoin-grants-stack) describes grant program management, applications, payouts, and reputation-oriented project profiles.

Use these as adapter inspiration. Do not imply ProofForge has live integration unless the code, tests, credentials, and demo path prove it.
