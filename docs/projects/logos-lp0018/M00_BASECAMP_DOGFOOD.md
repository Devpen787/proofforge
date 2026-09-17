# M00 Runbook — Dogfood the Logos Basecamp Module Path

Mission: **M00**  
Status: **ready to execute**

## Why this comes first

LP-0018 requires both a reusable Basecamp SDK/module and a Basecamp distribution app. Before designing either, prove the current official module creation, packaging, installation, and Basecamp-loading path exactly as Logos documents it.

This mission is also a real contribution opportunity: `logos-co/logos-tutorial` has an open dogfooding request asking builders to follow the Basecamp module tutorials, report pain points, and file Basecamp bugs where appropriate.

## Frozen upstream context

Observed during pilot setup on 2026-09-17:

- Logos tutorial repository: https://github.com/logos-co/logos-tutorial
- Developer guide: `logos-developer-guide.md`
- QML UI tutorial: `outputs/tutorial-qml-ui-app.md`
- Tutorial commit observed while preparing this runbook: `c58b7c9ea71269ca9383dcbd6eaba78f7ec66cc8`
- Dogfood issue: https://github.com/logos-co/logos-tutorial/issues/23

Refresh the current upstream HEAD before execution and record the actual commit used.

## Authority

Allowed without further approval:
- clone/read public Logos repos;
- run builds/tests locally;
- generate local reports/artifacts;
- draft bug reports/tutorial feedback.

Human approval required before:
- posting an issue/comment to Logos GitHub;
- opening any external PR.

## Target evidence directory

Use a dedicated local folder outside production project repos so tutorial artifacts do not contaminate ProofForge or the later LP-0018 repo.

Suggested:

```bash
mkdir -p ~/Developer/logos-m00
cd ~/Developer/logos-m00
```

If that location is inconvenient, use any clean directory and record it in the handoff.

## Step 0 — Preflight

Capture the machine and toolchain before installing/building anything:

```bash
uname -a
uname -m
sw_vers 2>/dev/null || true
nix --version
git --version
nix show-config 2>/dev/null | grep -E 'experimental-features|system' || true
```

Expected prerequisite from the current Logos developer guide:
- Nix installed;
- flakes / `nix-command` enabled.

If `uname -m` is `arm64` on macOS, preserve this run carefully: it may later become useful supporting evidence for LP-0018's macOS Apple Silicon support requirement. M00 alone does **not** prove our eventual LP-0018 implementation supports macOS.

## Step 1 — Freeze the tutorial source used

```bash
git clone https://github.com/logos-co/logos-tutorial.git
cd logos-tutorial
git rev-parse HEAD
git status --short
```

Record the HEAD SHA. Do not silently switch refs mid-run.

## Step 2 — Execute the official QML tutorial chain with a report

The upstream tutorial provides executable YAML specs through `logos-doctest`. The QML tutorial builds on the core-module tutorial, so use an output directory that preserves the chain.

From `logos-tutorial`:

```bash
nix run github:logos-co/logos-doctest -- run \
  tests/tutorial-qml-ui-app.test.yaml \
  --output-dir ./m00-output \
  --report ./m00-qml-report.html \
  --continue-on-fail
```

Preserve:
- terminal output;
- `m00-qml-report.html`;
- `m00-output/`;
- exact failing step(s), if any.

Do not fix the tutorial while the first run is in progress. We want the first-pass user experience as evidence.

## Step 3 — Inspect what the tutorial produced

Expected chain shape from current docs:

```text
m00-output/
├── logos-calc-module/
└── logos-calc-ui/
```

Record:

```bash
find m00-output -maxdepth 2 -type f -name 'metadata.json' -o -name 'flake.nix'
```

For each generated module, inspect:
- `metadata.json`;
- `flake.nix`;
- module type/interface;
- dependency declaration;
- whether inputs are pinned or floating.

## Step 4 — Build LGX packages

Follow the current upstream tutorial rather than inventing packaging commands.

From the generated core module:

```bash
cd m00-output/logos-calc-module
nix build '.#lgx' --out-link result-lgx
nix build '.#lgx-portable' --out-link result-lgx-portable
```

Then from the generated UI module:

```bash
cd ../logos-calc-ui
nix build '.#lgx' --out-link result-lgx
nix build '.#lgx-portable' --out-link result-lgx-portable
```

If the tutorial requires re-locking a local `path:` input, do exactly what the current upstream guide says and record it.

Capture:

```bash
find result-lgx result-lgx-portable -maxdepth 2 -type f -print
```

Evidence:
- dev LGX artifact(s);
- portable LGX artifact(s);
- build logs/result;
- any variant mismatch or path-input friction.

## Step 5 — Build Basecamp and package manager

From a convenient working directory:

```bash
nix build 'github:logos-co/logos-basecamp' -o basecamp-result
nix build 'github:logos-co/logos-package-manager#cli' --out-link ./pm
```

Create an isolated Basecamp data directory:

```bash
rm -rf basecamp-data
mkdir -p basecamp-data/modules basecamp-data/plugins
```

## Step 6 — Install the tutorial core + UI modules

Adjust paths only if your output directory differs.

```bash
./pm/bin/lgpm --modules-dir basecamp-data/modules \
  install --file m00-output/logos-calc-module/result-lgx/*.lgx

./pm/bin/lgpm --ui-plugins-dir basecamp-data/plugins \
  install --file m00-output/logos-calc-ui/result-lgx/*.lgx
```

Capture package-manager output and the resulting installed directory tree.

## Step 7 — Launch Basecamp

```bash
./basecamp-result/bin/LogosBasecamp --user-dir "$PWD/basecamp-data"
```

Manual checks:

- [ ] Basecamp starts without an unexplained crash.
- [ ] tutorial UI module appears in the sidebar.
- [ ] UI renders.
- [ ] QML -> core module call works.
- [ ] Module Inspector sees the core module.
- [ ] Interface metadata/methods are visible.
- [ ] restart Basecamp and confirm the install still works.

Capture only useful screenshots; logs and reproducible commands are primary evidence.

## Step 8 — Record the developer experience, not just pass/fail

For every friction point, record:

```text
Title:
Upstream ref:
Platform:
Exact step:
Expected:
Actual:
Command:
Relevant output:
Workaround attempted:
Is workaround documented upstream?: yes/no/unclear
Severity: blocker | high-friction | minor | docs-only
Suggested fix/clarification:
```

Potentially important categories for LP-0018:
- Nix installation/flake setup;
- module-builder scaffolding drift;
- `universal` interface expectations;
- local `path:` input locking;
- dev vs portable LGX variants;
- `lgpm` module vs UI-plugin install directories;
- Basecamp discovery/user-dir behavior;
- macOS arm64 behavior;
- time-to-first-build / huge dependency builds;
- error messages when a dependency is missing.

## Step 9 — Optional second pass: minimal fresh scaffold

Only after the official tutorial path is understood, scaffold a minimal module without copying tutorial-generated code:

```bash
mkdir -p ../m00-minimal-module
cd ../m00-minimal-module
nix flake init -t github:logos-co/logos-module-builder
```

Goal: prove we understand the bootstrap primitives well enough to create M02 cleanly.

Do not start LP-0018 implementation here.

## M00 exit criteria

M00 can be marked `packet_ready` when we have:

- [ ] upstream tutorial commit recorded;
- [ ] machine/toolchain record;
- [ ] executable tutorial report;
- [ ] core module build result;
- [ ] UI module build result;
- [ ] dev + portable LGX packaging result;
- [ ] `lgpm` install result;
- [ ] Basecamp load/discovery/call result;
- [ ] restart result;
- [ ] clear list of pain points/blockers;
- [ ] draft upstream feedback for any real issue.

M00 becomes `verified` only after a verifier reviews/re-runs the critical proof path or independently inspects enough of the generated evidence to confirm the conclusion.

## Handoff back to the pilot

Use the standard agent handoff:

```text
Mission: M00
Status:
Upstream tutorial SHA:
Platform/arch:
Nix version:
What passed:
What failed:
LGX artifacts:
Basecamp result:
Evidence paths:
Pain points:
Upstream feedback drafted:
Recommended M02 bootstrap:
Human decision needed:
```
