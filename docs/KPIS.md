# KPIs and monitoring: Loto Quine

Firebase project: loto-quine (exact project id: Firebase console > Project settings > General; free Spark plan,
never upgraded to Blaze)
Android app: io.github.nhilaire.lotoquine
Data collection: opt-in only (consent screen). Analytics data retention: 2 months. Google signals: off.

Events come from docs/PRD.md "Telemetry events" and are typed in `src/telemetry/events.ts`:
`game_start {}`, `stage_won {stage, balls, choice}`, `game_end {result, stage, duration_min}`.

## Business KPIs

| KPI | Definition | Where to read it | Target |
|---|---|---|---|
| Game completion rate | `game_end` with result=completed / `game_start` | Analytics > Events > game_end (dimension `result`) and game_start | >= 50 % |
| Stage funnel | count of `stage_won` per `stage` (quine, double_quine, carton_plein) | Analytics > Events > stage_won (dimension `stage`) | followed |
| Balls per stage | average `balls` of `stage_won` per `stage` | custom metric `balls` by dimension `stage` | followed (sanity check of the draw) |
| Draw choice after a win | `stage_won` by `choice` (continue / new_draw / end) | Analytics > Events > stage_won (dimension `choice`) | followed |
| Game duration | `duration_min` of `game_end` | custom metric `duration_min` | followed |
| Games per session | `game_start` count / `session_start` count | Analytics > Events | followed |
| D7 retention | % of new users back on day 7 | Analytics > Reports > Retention | followed (occasional evening app) |
| Daily active users | users with an engagement per day | Analytics > Reports > Engagement overview | followed |

## Technical KPIs

| KPI | Definition | Where to read it | Target |
|---|---|---|---|
| Crash-free users | % users without a fatal crash | Crashlytics > Dashboard | >= 99 % |
| ANR rate | app not responding events | Crashlytics > Dashboard (filter ANR) | < 0.5 % |
| Non-fatal errors | `reportError()` calls (e.g. text-to-speech failure) | Crashlytics > Non-fatals | low and stable |
| APK size | arm64 release APK size | docs/evidence/v*/REPORT.md | < 40 MB |
| Cold start | launch to first screen | evidence report (device check) | < 3 s |

## Custom definitions to register in Analytics

Analytics > Admin > Custom definitions (free, up to 50 dimensions / 50 metrics):

| Name | Scope | Param | Type |
|---|---|---|---|
| stage | Event | stage | dimension |
| result | Event | result | dimension |
| choice | Event | choice | dimension |
| balls | Event | balls | metric (standard) |
| duration_min | Event | duration_min | metric (standard) |

## Console settings checklist

- Analytics > Admin > Data settings > Data retention: 2 months; Google signals: off.
- Project settings > General > Android app: SHA-1 fingerprint of the release key added (public value from
  `~/.android-game-factory/release-cert.txt`).
- Google Cloud console > APIs & Services > Credentials > "Android key (auto created by Firebase)": restricted to
  Android apps (package + SHA-1) and to Firebase APIs only.
- Crashlytics: open the page once; it activates on the first report from a consented install.

## How to check that events arrive

1. Build with `firebase/google-services.json` present, accept the consent screen.
2. `adb shell setprop debug.firebase.analytics.app io.github.nhilaire.lotoquine` then open Analytics > DebugView.
3. The factory's `verify.mjs --telemetry` captures the `Logging event` lines from logcat as evidence.
Standard reports update within ~24 h; DebugView is real time.
