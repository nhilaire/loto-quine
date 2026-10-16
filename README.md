# Loto Quine

A small Android game made with React Native. The game is in French.

## Screenshots

<!-- factory:screenshots:start -->
<p>
  <img src="docs/screenshots/readme-1-home.png" width="240" alt="home">
  <img src="docs/screenshots/readme-2-draw.png" width="240" alt="draw">
  <img src="docs/screenshots/readme-3-check-win.png" width="240" alt="check win">
</p>
<!-- factory:screenshots:end -->

## Play

Download the APK attached to the latest release (if any) or build it yourself (below), then install it on an
Android phone (allow installation from unknown sources).

## Privacy

- No account, no ads, no advertising ID, no name or contact data.
- Anonymous usage statistics and crash reports (Firebase) are sent **only if you accept** on first launch.
  You can change your choice at any time in *Paramètres*. If you refuse, nothing is collected.
- What is sent after consent: the events `game_start`; `stage_won` (stage, number of balls drawn, choice to
  continue or start a new draw); `game_end` (result, stage reached, duration in minutes); Firebase's automatic
  `first_open` / `session_start`; crash reports. Firebase adds a random app-instance ID, the device model and the
  Android version.
- The voice uses the phone's own text-to-speech; no microphone access.

## Build from source

Requirements: Node.js 20+, JDK 17, Android SDK.

```bash
npm install
npm test
```

Firebase configuration is not part of this repository. To build with telemetry, create your own Firebase project
and place its `google-services.json` in `firebase/` (see [firebase/README.md](firebase/README.md)). Without it,
the game builds and runs with telemetry disabled.

Release signing reads `FACTORY_STORE_FILE`, `FACTORY_STORE_PASSWORD`, `FACTORY_KEY_ALIAS` and
`FACTORY_KEY_PASSWORD` from your user-level `~/.gradle/gradle.properties`; without them the release build is
signed with the debug key.

## Project docs

- [Product requirements](docs/PRD.md)
- [Architecture decisions](docs/adr/)
- [Verification evidence](docs/evidence/)
