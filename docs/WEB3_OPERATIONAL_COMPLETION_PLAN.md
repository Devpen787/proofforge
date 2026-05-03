# Web3 Operational Completion Plan

ProofForge should not become a marketplace, GitHub clone, escrow service, or
centralized project database. The operational path is to compose the systems the
open-source and Ethereum ecosystems already use.

## Target Model

```text
GitHub issue / repo / bounty URL
-> ProofForge mission
-> human or bounded agent evidence packet
-> 0G immutable storage
-> maintainer wallet or GitHub approval
-> signed acceptance / optional EAS attestation
-> external payout reference through wallet, Safe, Splits, or Drips
-> shared project state through Ceramic, GUN, or OrbitDB
```

## Authority Boundaries

| System     | Owns                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| GitHub     | repo permissions, comments, issues, pull requests, maintainer accounts  |
| Wallet     | signer identity, payout address, transaction consent                    |
| Maintainer | acceptance, revision, rejection, and project value rules                |
| 0G         | durable immutable proof records and packet roots                        |
| EAS        | optional public acceptance attestations                                 |
| Safe       | project treasury approval                                               |
| Splits     | onchain revenue split configuration                                     |
| Drips      | open-source dependency and GitHub repository funding                    |
| ProofForge | mission qualification, proof packaging, acceptance record, value ledger |

## Gap Closure

### GitHub OAuth Or GitHub App Install

V1 should not require OAuth. It should support public-source import and
user-owned submission handoff:

```text
ProofForge prepares the comment or PR body.
The user's GitHub CLI, browser session, or future GitHub App performs the write.
```

Implementation path:

- Public issue URL import for read-only source data.
- `gh issue comment <issue-url> --body-file proof-comment.md` handoff.
- Later optional GitHub App for teams that want install-based automation.

### Live GitHub Comments / PR Submission

Use local GitHub CLI handoff first. This avoids browser-held GitHub tokens and
preserves GitHub's permission model.

Implemented direction:

- Generate a maintainer-ready `proof-comment.md`.
- Generate a `github-handoff.json` with the exact `gh` command.
- Keep automatic posting optional and user-controlled.

### Realtime Multi-User Workspace

Use immutable record sync now and mutable decentralized state later.

V1/V1.5:

- Export ProofForge network records.
- Export ProofForge project records with source, mission, proof, payout, and
  ledger references.
- Upload records to 0G.
- Publish sync manifests.
- Pull records by 0G root and verify content hash/signature.

V2:

- Ceramic / ComposeDB for wallet-owned project, mission, review, and ledger
  streams.
- GUN for lightweight local-first realtime sync if speed matters more than
  queryability.
- OrbitDB if the app needs IPFS-native CRDT logs.

### Automatic Payout Settlement

ProofForge should not invent payment infrastructure.

V1:

- Track earned value after acceptance.
- Track released payout by receipt URL, tx hash, Safe tx, Splits config, Drips
  project, or marketplace receipt.

V2:

- Generate Safe transaction metadata for treasury payments.
- Generate Splits recipient config for recurring shared revenue.
- Generate Drips project/list references for open-source dependency funding.

### Maintainer Identity

Acceptance should be wallet-verifiable.

V1:

- Sign acceptance using EIP-712 typed data when a browser wallet supports it.
- Fall back to explicit demo signing only when no browser wallet is available.
- Verify typed acceptance with runner tooling.

V2:

- Optional EAS schema and attestation payload for public accepted proof.
- Later onchain EAS submission after user wallet confirmation.

### 0G Upload From App Flow

Do not put private upload keys in the browser.

V1:

- Browser exports network record.
- Runner tooling uploads to 0G.
- Sync manifest makes the record pullable and verifiable.

V2:

- Local desktop/helper upload flow.
- Optional wallet-funded browser upload only if the SDK and key model are safe.

## Build Priority

1. EIP-712 acceptance signing and verification.
2. GitHub CLI handoff package from proof records.
3. EAS attestation payload from accepted proof records.
4. Safe/Splits/Drips payout handoff payloads.
5. Ceramic/GUN workspace adapter spike.
6. Optional GitHub App installer only after the handoff path works.

## Product Standard

Operational V1 is done when a judge or real user can:

```text
import source work
-> create a mission
-> run or document agent-assisted proof
-> produce a packet
-> send a GitHub/reviewer handoff
-> accept with a wallet-verifiable signature
-> export/upload/sync the record
-> track earned/released value with external receipts
```

V2 is done when multiple users can coordinate over shared project state without
ProofForge owning GitHub permissions, funds, or private keys.
