# Verification report: Loto Quine v0.1.1

Overall: PASS
Commit: e4dbf39
Date: 2026-10-15 13:20 UTC
Stack: expo
Target: emulator sdk_gphone64_x86_64, Android 16 (API 36, x86_64)
APK: loto-quine-0.1.1-universal.apk (80.7 MB)
SHA-256: 944d2a383888a83106b1de9fdd2fc8d54ae53975ecabca0b2a19fd2cedf135fa

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | clean working tree | PASS | commit e4dbf39 |
| 2 | typecheck | PASS | `tsc --noEmit` exit 0 |
| 3 | unit tests (Jest) | PASS | Tests:       112 passed, 112 total |
| 4 | expo-doctor | WARN | issues reported (see raw/expo-doctor.txt) |
| 5 | secrets & personal data scan | PASS | secret-scan (worktree): clean |
| 6 | release build | PASS | loto-quine-0.1.1-universal.apk, 80.7 MB, Firebase on |
| 7 | release signature | PASS | release signature valid; cert SHA-256 54da35e17c99b321... |
| 8 | install (adb) | PASS | Performing Streamed Install Success |
| 9 | launch, alive after 8 s, no fatal error | PASS | process alive, 0 fatal log lines |
| 10 | cold start time | PASS | median 1174 ms of 2001 / 1174 / 1128 ms after a warm-up launch (target < 3000 ms) |
| 11 | Maestro E2E flows | PASS | 12/12 flows passed, 19 screenshots in screens/ |
| 12 | no crash during e2e flows | PASS | 0 fatal log lines (crash buffer + errors, raw/logcat-e2e.txt) |
| 13 | telemetry events after consent | PASS | seen in logcat: game_start, stage_won, game_end |

Screenshots: `screens/` (emulator only, no personal data). Raw logs: `raw/` (local, git-ignored).
