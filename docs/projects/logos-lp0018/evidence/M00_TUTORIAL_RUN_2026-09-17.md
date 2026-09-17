# M00 Tutorial Run Evidence — 2026-09-17

Mission: **M00 — Dogfood current Logos Basecamp module creation/loading path**

Evidence status: `basecamp-path-passed-logoscore-triage-pending`

## Frozen upstream source

- Repository: `logos-co/logos-tutorial`
- Commit: `c58b7c9ea71269ca9383dcbd6eaba78f7ec66cc8`

## Execution

Command:

```bash
nix run github:logos-co/logos-doctest -- run \
  tests/tutorial-qml-ui-app.test.yaml \
  --output-dir ./m00-output \
  --report ./m00-qml-report.html \
  --continue-on-fail \
  2>&1 | tee ./m00-qml-terminal.log
```

Observed summary:

```text
Results: 50 passed, 7 failed, 0 skipped (of 57 run)
```

## Important passes

The following LP-0018-relevant path passed:

- QML UI-only preview;
- local dependency override/flake lock;
- UI tests;
- core module build verification;
- core + UI full-functionality UI tests;
- dev + portable LGX packaging;
- logos-basecamp build;
- `lgpm` CLI build;
- isolated Basecamp data directory creation;
- core module install via `lgpm`;
- UI plugin install via `lgpm`;
- Basecamp launch and calculator interaction;
- portable Basecamp build;
- UI integration tests.

This is strong local evidence that the current macOS Apple Silicon environment can build, package, install, discover, and exercise a Logos core + QML module through Basecamp.

This is **not** yet LP-0018 macOS support evidence for our future implementation.

## Failures

Seven reported failures:

```text
./logos/bin/logoscore load-module calc_module
Inspect methods and events
Call methods
./logos/bin/logoscore call calc_module factorial 5
./logos/bin/logoscore call calc_module fibonacci 10
./logos/bin/logoscore call calc_module libVersion
./logos/bin/logoscore stop
```

Interpretation: treat these as one failure chain until proven otherwise. `load-module` is the first critical failure; the subsequent `module-info` / `call` / `stop` steps depend on the daemon/module state created earlier.

The same generated module later passed the Basecamp and UI integration path, so there is not currently evidence that the module build itself is broken.

## Evidence paths on test machine

- `~/Developer/logos-m00/logos-tutorial/m00-qml-report.html`
- `~/Developer/logos-m00/logos-tutorial/m00-qml-terminal.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/`

## Next triage target

Extract the first `logoscore` failure's exact stdout/stderr and daemon-start context from the report/log. Do not patch the tutorial yet.

Determine whether the failure is:

1. upstream tutorial drift;
2. `logoscore` runtime/macOS-specific behavior;
3. stale/missing daemon state or persistence path;
4. module discovery/path mismatch;
5. local environment-specific.

No upstream issue should be filed until the exact failure is reproduced/minimized and compared against current upstream docs/issues.
