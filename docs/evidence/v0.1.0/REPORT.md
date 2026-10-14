# Verification report: Loto Quine v0.1.0

Overall: PASS
Commit: 85ddab8
Date: 2026-10-14 14:37 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.0-universal.apk (80.7 MB)
SHA-256: dc2a2ba56a62f0677f5cae12a516891026be85526148b638316db7bef90b1cef

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit 85ddab8 |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       109 passed, 109 total |
| 4 | expo-doctor | PASS | all checks passed |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.0-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 953 ms of 998 / 637 / 953 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 11/11 flows passed, 18 screenshots in screens/ |
| 12 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 13 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
