# Verification report: Loto Quine v0.1.0

Overall: PASS
Commit: d122c5c
Date: 2026-10-14 15:20 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.0-universal.apk (80.7 MB)
SHA-256: 84270ffcb56ba9532f7e3ed0b512489e42f4f4f6505ac1d24b5a4b874c606bba

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit d122c5c |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       110 passed, 110 total |
| 4 | expo-doctor | PASS | all checks passed |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.0-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 664 ms of 757 / 664 / 662 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 11/11 flows passed, 18 screenshots in screens/ |
| 12 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 13 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
