# Device checks: Loto Quine v0.2.0

Commands run on 2026-10-25 against the release APK of commit e645567, the same build as REPORT.md
(`dist/loto-quine-0.2.0-universal.apk`, SHA-256 4e56e86d4356c2cd...), on emulator sdk_gphone64_x86_64, Android 16
(API 36), phone language en-US. Raw outputs are in `raw/` (local, git-ignored): `device-permissions.txt`,
`device-manifest.txt`, `device-label.txt`, `device-refuse-logcat.txt`, `device-keep-awake.txt`.

## AC-28 permissions (release manifest)

`aapt2 dump permissions dist/loto-quine-0.2.0-universal.apk`:

```
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.VIBRATE'
uses-permission: name='android.permission.ACCESS_NETWORK_STATE'
uses-permission: name='android.permission.WAKE_LOCK'
uses-permission: name='android.permission.MODIFY_AUDIO_SETTINGS'
uses-permission: name='io.github.nhilaire.lotoquine.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
```

No RECORD_AUDIO, no AD_ID (same list as v0.1.1: expo-localization adds no permission). The arm64 APK size
(< 40 MB) is measured by the release build (`/release-apk`).

## AC-45 launcher name per language

`aapt2 dump resources` (raw/device-label.txt):

```
resource 0x7f12001f string/app_name
  () "Loto Quine"
  (en) "Loto Quine"
  (fr) "Loto Quine"
```

`aapt2 dump badging`: `application-label:'Loto Quine'`, and « Loto Quine » for every locale listed.

## AC-35 Firebase collection off by default, nothing after « Refuser »

`aapt2 dump xmltree ... AndroidManifest.xml` meta-data (raw/device-manifest.txt):

```
firebase_analytics_collection_enabled = false
firebase_crashlytics_collection_enabled = false
google_analytics_adid_collection_enabled = false
google_analytics_ssaid_collection_enabled = false
```

`logcat -c`, then a fresh install state (Maestro `clearState`), « Decline » (English phone), « New game », one ball
drawn, « Check » opened, then a 20 s wait, with `debug.firebase.analytics.app` set and `log.tag.FA` / `log.tag.FA-SVC`
VERBOSE; `adb logcat -d -s FA FA-SVC FirebaseCrashlytics` (raw/device-refuse-logcat.txt, 52 lines):
`I FA : App measurement disabled via the manifest`, `Setting storage consent(FE): source=MANIFEST,ad_storage=denied,
analytics_storage=denied`, `D FA : Event not sent since app measurement is disabled`; lines containing « Logging
event »: **0**; lines containing « upload » (any case): **0**.

After « Accepter », REPORT.md shows game_start, stage_won, game_end in logcat.

## AC-36 screen kept on during Game and Check only

`adb shell dumpsys window windows`, window `io.github.nhilaire.lotoquine/io.github.nhilaire.lotoquine.MainActivity`;
current screen read with `adb shell uiautomator dump` (raw/device-keep-awake.txt):

- `check-screen` (opened from a game): `fl=KEEP_SCREEN_ON LAYOUT_IN_SCREEN ...`
- Android back, `game-screen`: `fl=KEEP_SCREEN_ON LAYOUT_IN_SCREEN ...`
- Android back, `home-screen`: `fl=LAYOUT_IN_SCREEN ...` (no KEEP_SCREEN_ON)

## AC-01 consent in French at first launch on a French-language setting

The emulator system language is en-US (the Maestro run of REPORT.md shows the English consent, `screens/01-consent.png`).
To prove the French first launch on the same build, the app's language was set to French with Android's per-app
language (Android 13+), the system staying en-US (raw/device-fr-first-launch.txt, flow raw/device-fr-first-launch.yaml):

```
$ adb shell pm clear io.github.nhilaire.lotoquine            -> Success
$ adb shell cmd locale set-app-locales io.github.nhilaire.lotoquine --locales fr-FR
$ adb shell cmd locale get-app-locales io.github.nhilaire.lotoquine   -> [fr-FR]
$ maestro test fr-first-launch.yaml
  consent-screen visible; "Statistiques anonymes", "Accepter", "Refuser" visible; tap consent-refuse;
  "Nouvelle partie" visible -> all steps COMPLETED
```

Screenshots: `screens/device-fr-consent.png`, `screens/device-fr-home.png`. The app's language was reset afterwards
(`set-app-locales ... --locales ""` -> `[]`).
