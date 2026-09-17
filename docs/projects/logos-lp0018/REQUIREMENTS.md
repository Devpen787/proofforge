# LP-0018 Requirement Matrix

Frozen source for this extraction: `logos-co/lambda-prize@f303e56871d30bf172afdc0415ac22ce55b6dd10`, file `prizes/LP-0018.md`.

**Important:** `requirements.json` is our traceability representation. The canonical Logos specification remains authoritative and must be refreshed before submission or when upstream changes are suspected.

## Snapshot

- Observed status: **Open**
- Observed prize: **$1,500**
- Observed effort label: **Medium**
- Closed non-overlapping region set: **72 leaf entries representing 52 countries**
- Required adoption observed at setup:
  - **15 countries** covered;
  - **25 verified region entries**;
  - **5 independent consuming modules**;
  - of those, **3+ independent Basecamp UI modules**.

## Stable IDs

| Category | IDs | Primary missions |
|---|---|---|
| Functionality | F-01 … F-09 | M03-M11, M13 |
| Usability | U-01 … U-04 | M00, M07-M09, M12-M13 |
| Reliability | R-01 … R-04 | M03-M06, M10, M17 |
| Performance | P-01 | M05, M11, M17 |
| Supportability | S-01 … S-08 | M00, M05, M08-M13, M17 |
| Required adoption | A-01 … A-02 | M14-M15 |
| Discretionary adoption | AD-01 … AD-02 | M16 |
| Submission | SUB-01 … SUB-07 | M02, M11, M13-M18 |
| Scope constraints | SC-IN-01 … 06; SC-OUT-01 … 04 | all missions |
| Eligibility | EL-01 … EL-02 | M02, M18 |

## Requirement-to-mission map

### Functionality

- **F-01 Region discovery** → M03, M09
- **F-02 Host workflow** → M06, M09
- **F-03 Download/fallback/integrity** → M06, M09
- **F-04 Bulk host** → M10
- **F-05 Local import + Geofabrik MD5** → M03, M07, M09, M10
- **F-06 Update checks per region path** → M07, M09, M10
- **F-07 LEZ OSM registry schema/query/batch** → M05, M06, M10
- **F-08 Testnet 0.3 end-to-end registry** → M11
- **F-09 Standalone Basecamp SDK/module** → M08, M13

### Usability

- **U-01 Basecamp GUI/build/load path** → M00, M09, M12, M13
- **U-02 SDK docs + embedding example** → M08
- **U-03 Required CLI surface** → M07
- **U-04 Honest hosted/version/verification UX** → M09

### Reliability

- **R-01 Exponential retry/backoff** → M04, M10
- **R-02 Graceful checksum failure** → M03, M10
- **R-03 Timestamp ordering** → M05, M10
- **R-04 No mandatory disallowed central services** → M06, M10, M17

### Performance

- **P-01 Cycle-count documentation** → M05, M11, M17

### Supportability

- **S-01 Canonical testnet 0.3 deployment** → M11
- **S-02 macOS Apple Silicon + Linux x86_64** → M12
- **S-03 `logos-module-builder` / `mkLogosModule`** → M00, M08, M09
- **S-04 Module catalog + release action + `logos-repo.json`** → M13
- **S-05 SPEL-generated registry IDL** → M05, M17
- **S-06 Real-sequencer E2E in green CI** → M12
- **S-07 Evaluator-ready README** → M17
- **S-08 SDK worked example resolving region -> CID/metadata** → M08, M17

### Adoption

- **A-01 Coverage:** 15 countries + 25 verified region entries → M14
- **A-02 Ecosystem reuse:** 5 independent modules, 3+ Basecamp UI modules → M15
- **AD-01 Redundant mirroring:** >5 distinct operators for a covered region → M16 (discretionary)
- **AD-02 Real community vouching** → M16 (discretionary)

### Submission

- **SUB-01 Public dual-licensed repo with all required components** → M02, M17, M18
- **SUB-02 IDL + deployed program ID** → M11, M17, M18
- **SUB-03 Module catalog evidence** → M13, M17, M18
- **SUB-04 Required adoption evidence** → M14, M15, M17, M18
- **SUB-05 FURPS self-assessment** → M17, M18
- **SUB-06 Solution PR required; first qualifying PR wins under observed rules** → M18
- **SUB-07 Submission cadence/attempt limits** → M18

## Region model

The observed closed set contains 48 country-level leaves plus 24 subregion leaves for four decomposed countries.

Decomposed countries:

- US → 8 state extracts
- India → 6 zones
- China → 6 province extracts
- Russia → 4 federal-district extracts

Their whole-country files are not part of the closed set.

The exact machine-readable list is in `requirements.json`. If Logos patches a Geofabrik leaf name, M01 must be refreshed before we treat the matrix as current.

## Critical-path interpretation

The earliest architecture gate is not the UI. It is:

```text
M00 module path
+
M03 source/checksum
+
M04 Logos Storage
+
M05 LEZ registry
        ↓
M06 first real vertical host flow
```

Once M06 is proven, CLI, SDK, Basecamp, testnet hardening, and adoption can proceed with much lower architectural uncertainty.

## Evidence rule

Every `required` item in `requirements.json` needs a trace to evidence before submission readiness. A source requirement with an implementation commit but no independent verification remains **implemented**, not automatically **verified**.
