# Verification report: Loto Quine v0.2.0

Overall: PASS
Commit: 4eb0e52
Date: 2026-10-26 08:11 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.2.0-universal.apk (80.8 MB)
SHA-256: 35876bdc9d1fbbe66111b10630babda0223b1363863077004225c262ced80a63

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit 4eb0e52 |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       134 passed, 134 total |
| 4 | expo-doctor | WARN | issues reported (see raw/expo-doctor.txt) |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.2.0-universal.apk, 80.8 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 800 ms of 1813 / 800 / 780 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 13/13 flows passed, 28 screenshots in screens/ |
| 12 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 13 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
