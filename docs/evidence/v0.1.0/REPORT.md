# Verification report: Loto Quine v0.1.0

Overall: FAIL
Commit: f3b7d05
Date: 2026-10-14 11:48 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.0-universal.apk (80.7 MB)
SHA-256: 603b42e5c7b04e8228b8d350d374eecfd49dcbf6b2704d4c1c0b5d6b5c1b27fe

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit f3b7d05 |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       100 passed, 100 total |
| 4 | expo-doctor | PASS | all checks passed |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.0-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 1207 ms of 1307 / 1207 / 1092 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | FAIL | 0/0 flows passed, 13 screenshots in screens/ |
| 12 | telemetry events after consent | FAIL | missing: game_start, stage_won, game_end (seen: none) |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
