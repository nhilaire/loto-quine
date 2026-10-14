# Verification report: Loto Quine v0.1.0

Overall: PASS
Commit: 04216d0
Date: 2026-10-14 12:26 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.0-universal.apk (80.7 MB)
SHA-256: de3a9c4264c6193c1870e71965b68b1a1c3eda98b1c8d7dbdb4a027b32b792a6

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit 04216d0 |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       103 passed, 103 total |
| 4 | expo-doctor | PASS | all checks passed |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.0-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 1584 ms of 1898 / 1447 / 1584 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 11/11 flows passed, 17 screenshots in screens/ |
| 12 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
