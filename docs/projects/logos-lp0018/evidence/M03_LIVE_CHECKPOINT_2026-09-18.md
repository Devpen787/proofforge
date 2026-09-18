# M03 live checkpoint — 2026-09-18

The first real macOS Apple Silicon M03 run produced a **partial pass**.

Verified:
- local Rust workspace tests passed;
- live Geofabrik index downloaded;
- Ethiopia resolved from the live index;
- the real Ethiopia PBF downloaded;
- Geofabrik published MD5 `426bd510159627dc139d4d0ad3bc6acd` matched the observed MD5 exactly;
- byte length `139733363` recorded;
- HTTP `Last-Modified` / ETag captured;
- PBF replication timestamp `1789676465`, sequence `4905`, update base URL, and writing program decoded.

Gap discovered:
- the 72-region live audit stopped at Ireland because the implementation used source id `ireland`;
- current Geofabrik uses `ireland-and-northern-ireland` under parent `europe`;
- implementation branch patched to the actual Geofabrik path and regression test added.

Implementation evidence:
`Devpen787/logos-osm-distribution/docs/evidence/M03_LIVE_MACOS_2026-09-18.md`

Truth:
- R-02 checksum behavior: `locally-verified`
- F-01 full frozen-set live resolution: `in_progress` until the patched 72/72 audit reruns.
