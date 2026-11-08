# Verification report: Loto Quine v0.2.1

Overall: PASS
Commit: d265e3b
Date: 2026-11-08 15:58 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.2.1-universal.apk (80.8 MB)
SHA-256: e18471831bbd1e50335d0f938412e3b998781714226d65bad9795205df15df65

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit d265e3b |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | lint | WARN | no "lint" script in package.json (app scaffolded before ESLint was part of the overlay) |
| 4 | unit tests (Jest) | PASS | Tests:       143 passed, 143 total |
| 5 | expo-doctor | WARN | issues reported (see raw/expo-doctor.txt) |
| 6 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 7 | release build | PASS | loto-quine-0.2.1-universal.apk, 80.8 MB, Firebase on |
| 8 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 9 | install (adb) | PASS | Performing Streamed Install Success |
| 10 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 11 | cold start time | PASS | median 434 ms of 656 / 412 / 434 ms after a warm-up launch (target < 3000 ms) |
| 12 | Maestro E2E flows | PASS | 13/13 flows passed, 25 screenshots in screens/ |
| 13 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 14 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
