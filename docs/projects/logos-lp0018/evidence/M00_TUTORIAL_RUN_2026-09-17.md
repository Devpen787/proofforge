# M00 Tutorial Run Evidence — 2026-09-17

Mission: **M00 — Dogfood current Logos Basecamp module creation/loading path**

Evidence status: `basecamp-and-manual-logoscore-passed-doctest-triage-pending`

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

## Doctest failure chain

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

The first causal error was identical across the chain:

```json
{"code":"NO_DAEMON","message":"No client config at .../.logoscore/client/config.json. Start a daemon in this session (it writes one on boot), or install a dial spec with `logosctl client config set FILE` alongside the matching token file.","status":"error"}
```

The tutorial's daemon step is:

```bash
./logos/bin/logoscore -D -m ./modules &
sleep 3
```

The background shell launch was marked PASS even though the daemon had not produced the local client config required by the next command.

## Manual isolated logoscore reproduction

To separate module/runtime health from doctest orchestration, the same generated module was tested manually with an explicit isolated config directory:

```bash
./logos/bin/logoscore \
  --config-dir "$PWD/m00-logoscore-repro" \
  -D \
  -m ./modules \
  > ./m00-logoscore-daemon.log 2>&1 &
```

Observed daemon result:

- process remained alive;
- `daemon/state.json` created;
- `daemon/tokens.json` created;
- `daemon/tokens/auto.json` created;
- `client/config.json` created;
- `client/auto.json` created;
- `status` reported daemon running;
- `capability_module` loaded;
- `modules_state` loaded;
- `calc_module` discovered as `not_loaded`.

The following manual client path then passed end-to-end against the same config directory:

```text
load-module calc_module          -> Loaded module: calc_module (v1.0.0)
module-info calc_module          -> methods/events correctly visible
call calc_module factorial 5     -> 120
call calc_module fibonacci 10    -> 55
call calc_module libVersion      -> 1.0.0
stop                             -> clean shutdown initiated
```

This is strong counter-evidence against a module-build failure or a general macOS/aarch64 logoscore runtime failure.

## Upstream behavior relevant to triage

Current `logoscore` documentation states that successful daemon startup emits local client configuration under the selected config directory. It also documents config-directory resolution as:

```text
--config-dir -> LOGOSCORE_CONFIG_DIR -> ~/.logoscore
```

Current `logos-doctest` intentionally sets `LOGOSCORE_CONFIG_DIR` to `<workdir>/.logoscore` per spec so daemon state is isolated. Its source comments explicitly note that commands backgrounded with `&` can fail silently while the launch step itself appears successful.

Therefore the remaining defect is narrowed to one of:

1. `logos-doctest` background-process orchestration / readiness detection;
2. environment-only `LOGOSCORE_CONFIG_DIR` behavior in this exact invocation path;
3. another doctest-specific interaction with the per-spec config directory.

It is no longer classified as:

- Nix installation failure;
- module build failure;
- LGX failure;
- Basecamp failure;
- general logoscore/macOS runtime failure.

## Evidence paths on test machine

- `~/Developer/logos-m00/logos-tutorial/m00-qml-report.html`
- `~/Developer/logos-m00/logos-tutorial/m00-qml-terminal.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-daemon.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-repro/`

## Final triage target

Run one final fresh daemon using **only** `LOGOSCORE_CONFIG_DIR` and no `--config-dir` flag, matching the mechanism `logos-doctest` uses.

If that succeeds, classify the defect as doctest/background orchestration or readiness detection.

If that fails, classify it as environment-variable config-dir handling in logoscore and narrow further before upstreaming.

Do not post upstream until this final distinction is established.
