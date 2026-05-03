# Credential-Light Operational V1

ProofForge V1 should not collect platform credentials when an existing authority
can execute the action directly.

## Operating Pattern

```text
ProofForge prepares the proof/action.
The user, wallet, GitHub, maintainer, bounty platform, or storage network
executes the authoritative step.
ProofForge records the proof, signature, link, hash, or receipt.
```

This keeps ProofForge as the contribution-proof layer instead of a centralized
account, custody, or permission system.

## V1 Capability Map

| Production-network gap                   | V1 solution                                                                                    | Credential posture                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- |
| Multi-user backend or decentralized sync | Shareable encoded review/public links plus workspace/proof-record export                       | No backend credential                 |
| GitHub OAuth or GitHub App               | Public GitHub issue import and source handoff                                                  | No app credential required            |
| Live GitHub PR/comment submission        | Generated GitHub comment body plus source issue link; optional CLI token path remains separate | User posts through GitHub             |
| Reviewer links                           | Hosted app links with embedded ProofForge state in the URL hash                                | No server session                     |
| Wallet/ENS identity                      | MetaMask connection and wallet-signed proof events                                             | User signs locally                    |
| 0G upload from app flow                  | 0G-ready proof-record JSON export; CLI/adapter handles live upload when configured             | No browser-held private key           |
| Payout tracking                          | External wallet/platform payment first, then receipt or tx hash recorded in ProofForge         | No custody                            |
| Maintainer/reviewer workflow             | In-product reviewer decision plus optional wallet-signed acceptance event                      | Reviewer signs locally when available |

## What Judges Can Use Today

1. Open the hosted app.
2. Import a public GitHub issue.
3. Run a bounded proof mission.
4. Generate a maintainer-ready packet.
5. Copy a reviewer link that carries the packet state.
6. Copy a GitHub-ready maintainer comment and open the source issue.
7. Accept, revise, or reject in the review flow.
8. Sign the accepted event with a wallet when connected.
9. Export the 0G-ready proof record.
10. Record an external payout receipt after payment happens elsewhere.

## Boundaries

ProofForge still does not:

- hold GitHub tokens by default
- install itself into a repository
- custody funds
- auto-settle payouts
- replace GitHub permissions
- prove an external bounty paid unless a receipt is recorded
- make an external maintainer accept work outside the source platform

These are deliberate V1 boundaries. They preserve the authority model while
still making the product usable today.
