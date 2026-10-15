# Device checks: Loto Quine v0.1.1

Manual commands run on 2026-10-15 against the release APK of commit e4dbf39, the same build as REPORT.md
(`dist/loto-quine-0.1.1-universal.apk`, SHA-256 944d2a383888a831...), on emulator sdk_gphone64_x86_64, Android 16
(API 36). Raw outputs are in `raw/` (local, git-ignored): `device-permissions.txt`, `device-manifest.txt`,
`device-refuse-logcat.txt`, `device-keep-awake.txt`.

## AC-28 permissions (release manifest)

`aapt2 dump permissions dist/loto-quine-0.1.1-universal.apk`:

```
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.VIBRATE'
uses-permission: name='android.permission.ACCESS_NETWORK_STATE'
uses-permission: name='android.permission.WAKE_LOCK'
uses-permission: name='android.permission.MODIFY_AUDIO_SETTINGS'
uses-permission: name='io.github.nhilaire.lotoquine.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
```

No RECORD_AUDIO, no AD_ID. The arm64 APK size (< 40 MB) is measured by the release build (`/release-apk`).

## AC-35 Firebase collection off by default, nothing after « Refuser »

`aapt2 dump xmltree ... AndroidManifest.xml` meta-data (raw/device-manifest.txt):

```
firebase_analytics_collection_enabled = false
firebase_crashlytics_collection_enabled = false
google_analytics_adid_collection_enabled = false
google_analytics_ssaid_collection_enabled = false
```

Fresh install (`clearState`), « Refuser », « Nouvelle partie », one ball drawn, « Vérifier un carton », back twice,
then 20 s wait, with `debug.firebase.analytics.app` set and `log.tag.FA` / `log.tag.FA-SVC` VERBOSE;
`adb logcat -d -s FA FA-SVC FirebaseCrashlytics` (52 lines, raw/device-refuse-logcat.txt):

- `I FA : App measurement disabled via the manifest`
- `V FA : Setting storage consent(FE): source=MANIFEST,ad_storage=denied,analytics_storage=denied`
- lines containing « Logging event »: **0**; lines containing « upload » (any case): **0**

After « Accepter », REPORT.md shows game_start, stage_won, game_end in logcat.

## AC-36 screen kept on during Game and Check only

`adb shell dumpsys window windows`, app window `io.github.nhilaire.lotoquine/.MainActivity`; current screen read with
`adb shell uiautomator dump` (raw/device-keep-awake.txt):

- Check screen (`check-screen`, opened from a game): `fl=KEEP_SCREEN_ON LAYOUT_IN_SCREEN ...`
- Android back, Game screen (`game-screen`): `fl=KEEP_SCREEN_ON LAYOUT_IN_SCREEN ...`
- Android back, Home screen (`home-screen`): `fl=LAYOUT_IN_SCREEN ...` (no KEEP_SCREEN_ON)
