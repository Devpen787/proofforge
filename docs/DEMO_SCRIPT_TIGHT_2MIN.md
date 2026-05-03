# Tight 2-minute demo — author script + app map

**Do not edit the author script** below when improving the product—only update **App map** so we never mix “what we say” with “what to click.”

- Longer recording plan (different voice): [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)

---

## Before recording

1. Open **`https://proofforgehub.vercel.app/#opportunity`** (or local dev at `#opportunity`).
2. **`Settings`** → **`Reset demo state`** on **`https://proofforgehub.vercel.app`** (clears local demo state and returns to `#opportunity`). Older local builds may only show **`Reset workspace`**—same intent.
3. Optional terminal flash (after the browser path):

```bash
npm run demo:packet
npm run sync:web-proof
```

---

## Author script (verbatim)

### 0:00-0:15

“ProofForge turns useful software work into accepted proof. Developers and agents can work on GitHub issues, project backlogs, bounties, or marketplace tasks, but maintainers need evidence, not noise. ProofForge is the layer between messy work and recognized value.”

Show: `https://proofforgehub.vercel.app/#opportunity`

### 0:15-0:30

“First, I register a bounded proof node. It has an owner, skills, and limits. It can run local checks and capture evidence, but it cannot post PRs, comments, access secrets, or move funds without approval.”

Click:

`Set up proof node → Register proof node → Find source-backed work`

### 0:30-0:55

“Now I pick sourced work. This mission comes from an existing project issue: validate the install docs. ProofForge turns that into a narrow mission with success criteria, risk, value, and acceptance owner.”

Click:

`Start sourced proof → Run safest earning mission → Accept and run`

### 0:55-1:15

“The proof node runs the check in evidence mode. It captures logs, environment, verifier status, and artifacts. The result is not agent chatter. It is a maintainer-ready packet.”

Click:

`Approve Packet`

Optional terminal flash:

```bash
npm run demo:packet
npm run sync:web-proof
```

### 1:15-1:40

“Now the maintainer reviews the packet. GitHub stays the source authority: ProofForge prepares the comment and records the posted source URL. The reviewer can also sign acceptance with a wallet. Only after that does accepted proof create earned credit and payout state.”

Click:

`Submit Packet → Connect MetaMask or demo signer → Record GitHub post → Sign acceptance → Accept & Mark Earned`

Use:

```text
https://github.com/Devpen787/proofforge/issues/1#issuecomment-proof
```

### 1:40-2:00

“This is the public proof: source, bounded agent run, verifier result, artifacts, maintainer acceptance, wallet/onchain-ready state, 0G-ready evidence storage, and payout tracking. ProofForge is not another marketplace. It is the contribution proof layer for people, agents, and projects to coordinate useful work and keep credit attached.”

Click:

`View public proof`

If time:

`Settings → Prepare 0G upload → Prepare payout handoff → Publish shared project`

---

## App map (production — `proofforgehub.vercel.app`)

**Say the author script verbatim; click these labels.** Verified by **full click-through** on the deployed app (2026-05-03). Local `apps/web` can lag Vercel—**rehearse on production** before recording.

| Author script                              | Production control                                                                                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Set up proof node`                        | **`Set up proof node`**                                                                                                                                    |
| `Register proof node`                      | **`Register proof node`**                                                                                                                                  |
| `Find source-backed work`                  | **`Find source-backed work`** _(after register; before that you may see **`Browse work first`**)_                                                          |
| `Start sourced proof`                      | Say while **Opportunities** is in focus, or tap **`Start sourced proof`** from **Home** when it appears; skip if you remain on the queue after **`Find`**. |
| `Run safest earning mission`               | **Opportunities** (`#work-queue`): optional **`Safe`** filter → **`Run this mission`** on _Validate installation docs_.                                    |
| `Accept and run`                           | **`Accept and run`** (`#mission-detail`).                                                                                                                  |
| `Approve Packet`                           | **`Approve Packet`** (`#run`).                                                                                                                             |
| `Submit Packet`                            | **`Submit Packet`** (`#case-file`).                                                                                                                        |
| `Connect MetaMask or demo signer`          | **`Connect MetaMask`** on maintainer _(embedded tool run still surfaced **`Sign acceptance`** for the demo path)_.                                         |
| `Record GitHub post`                       | Paste into **`GitHub acceptance URL`** → **`Record GitHub post`** → **`GitHub source verified`**.                                                          |
| `Sign acceptance` → `Accept & Mark Earned` | **`Sign acceptance`** then **`Accept & Mark Earned`** _(order as verified this session)_.                                                                  |
| `View public proof`                        | **Home**: **`View public proof`** ( **`Release payout`** also available).                                                                                  |
| Settings “if time”                         | **`Prepare 0G upload`**, **`Prepare payout handoff`**, **`Publish shared project`**, **`Reset demo state`**.                                               |

---

## Verified click order (production Path A)

After **`Settings`** → **`Reset demo state`**:

1. **`Set up proof node`** → **`Register proof node`** → **`Find source-backed work`**
2. **`Run this mission`** (optional **`Safe`** first)
3. **`Accept and run`**
4. **`Approve Packet`**
5. **`Submit Packet`**
6. **`Connect MetaMask`** · **`Sign acceptance`** when shown · **`GitHub acceptance URL`** · **`Record GitHub post`**
7. **`Accept & Mark Earned`**
8. **`View public proof`** on Home
