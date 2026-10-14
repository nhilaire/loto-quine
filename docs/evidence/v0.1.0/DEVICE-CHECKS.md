# Device checks: Loto Quine v0.1.0

Manual commands run on 2026-10-14 against the release APK of commit 04216d0
(`dist/loto-quine-0.1.0-universal.apk`, same build as REPORT.md) on emulator sdk_gphone64_x86_64, Android 16 (API 36).

## AC-28 permissions (release manifest)

`aapt2 dump permissions dist/loto-quine-0.1.0-universal.apk`:

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

`aapt2 dump xmltree ... AndroidManifest.xml` meta-data:

```
firebase_analytics_collection_enabled = false
firebase_crashlytics_collection_enabled = false
google_analytics_adid_collection_enabled = false
google_analytics_ssaid_collection_enabled = false
```

Fresh install (`clearState`), « Refuser », « Nouvelle partie », one ball drawn, with
`debug.firebase.analytics.app` set and `log.tag.FA VERBOSE`: `adb logcat -d -s FA FA-SVC | grep -c "Logging event"`
= **0**. (After « Accepter », REPORT.md step 12 shows game_start, stage_won, game_end.)

## AC-36 screen kept on during Game and Check only

`adb shell dumpsys window windows`, app window `io.github.nhilaire.lotoquine/.MainActivity`:

- Game screen: `fl=KEEP_SCREEN_ON LAYOUT_IN_SCREEN ...`
- Home screen (after Android back, `uiautomator dump` shows `home-screen`): `fl=LAYOUT_IN_SCREEN ...` (no KEEP_SCREEN_ON)
- Game screen again (« Reprendre la partie »): `fl=KEEP_SCREEN_ON ...`

Check uses the same `useKeepAwake()` hook (unit test AC-36 in `src/__tests__/screens.test.tsx`).
