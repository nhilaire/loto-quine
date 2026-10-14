# Verification report: Loto Quine v0.1.0

Overall: PASS
Commit: cad2b5f
Date: 2026-10-14 15:56 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.0-universal.apk (80.7 MB)
SHA-256: 8c2dbefcbf1db8f2f1f2bcb9ad0779d7d5fb667e9b99aa8862240513ecc8ae63

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit cad2b5f |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       111 passed, 111 total |
| 4 | expo-doctor | PASS | all checks passed |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.0-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 805 ms of 827 / 631 / 805 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 11/11 flows passed, 18 screenshots in screens/ |
| 12 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 13 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
