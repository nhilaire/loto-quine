# Brief: loto-quine

Date: 2026-10-14
Project slug: loto-quine
Final app name: Loto Quine

## Original brief

> je veux faire un jeu de loto quine. J'avais déjà fait un truc comme ça, mais je l'ai supprimé, je pense que tu dois
> pouvoir retrouver la conversation dans l'historique des conversations claude. Il s'agit donc d'une application
> android pour faire comme l'animateur d'un loto quine.
> Le public, plutôt famille
> Dis moi si t'arrives à retrouver l'historique qui décrit les règles. Je veux que l'application finale soit un peu
> plus léchée que l'ancienne

### Prior version (recovered)

The earlier conversation transcript was deleted; its session index (2026-01-25) keeps the first prompt: "a C# console
program that reproduces a loto draw. Draw a random number between 1 and 99 (inclusive), display it, pause, draw
another...". The surviving code (`C:/dev/loto/Program.cs`, console app "LOTO QUINE") implements:

1. Numbers 1-90 drawn without replacement (the code settled on 90, not 99).
2. Each draw shows its order and value ("Boule n°12 : 47"); a key press draws the next.
3. Escape pauses: shows every drawn number, sorted.
4. Card check: the player types their card numbers; the app lists found / missing numbers, or "QUINE !" when all are out.
5. Then: continue the draw, restart a new draw, or quit.

The new app must cover this and be noticeably more polished.

## Clarifying questions

Answers are summarised in English. Format: `- **Q:** question` then `  **A:** answer`.
Mark assumptions the user accepted as `(default accepted)`.

### Concept and players

- **Q:** Who is it for?
  **A:** Families (from the brief).
- **Q:** How is the app used during a game?
  **A:** The phone is the host (caller) for the whole family; players use real paper cards or tokens. Faithful to the prior version.
- **Q:** Typical session length?
  **A:** Open-ended: a family evening game; one game runs until a full card (carton plein), and a draw can last as long as the 90 balls.

### Gameplay and controls

- **Q:** How is each ball drawn?
  **A:** Tap only: the host taps to draw the next ball (no automatic mode).
- **Q:** Numbers range?
  **A:** 1-90 without replacement, as in the prior version's final code.
- **Q:** How is a claimed win checked?
  **A:** Number entry: the host types the numbers of the player's card on a numeric keypad; the app shows which are drawn and which are missing.
- **Q:** Card format for entry and checking?
  **A:** Classic French card, 3 rows of 5 numbers, entered row by row. Quine = 1 complete row, double quine = 2 complete rows, carton plein = all 3 rows.
- **Q:** Orientation?
  **A:** Portrait: ball on top, 1-90 board below.

### Progression, scoring, difficulty

- **Q:** Which game stages does the app handle?
  **A:** The three classic stages: quine, double quine, carton plein. The current stage is shown and the card check adapts to it.
- **Q:** What happens to the draw when a win is validated?
  **A:** The host chooses each time: continue the same draw into the next stage, or restart a new draw with all 90 balls.

### Look, sound and feel

- **Q:** Should balls be announced aloud?
  **A:** Yes: French text-to-speech (Android's built-in voice, offline), can be turned off, with optional traditional loto nicknames.
- **Q:** How are the nicknames enabled?
  **A:** Separate setting from the voice (voice on/off, nicknames on/off). The nickname is also displayed under the ball. Traditional French nicknames only, no protected content.
- **Q:** Visual style for a "more polished" app?
  **A:** Warm village-hall style: big coloured animated ball in the centre, bright warm colours, 1-90 board readable from a distance, very large number.
- **Q:** Draw animation?
  **A:** Ball rolls and reveals: a short shuffle (about 1 s), then the ball appears with its number, with a light vibration and a sound.
- **Q:** Sound effects and haptics besides the voice?
  **A:** A rolling-ball sound and a light vibration on each draw, plus a festive sound when a win is validated; both can be turned off.

### Screens and settings

- **Q:** What if the app is closed or the phone sleeps mid-game?
  **A:** Exact resume: the ongoing draw is saved and restored as is; the screen stays on during a game.
- **Q:** Tone: tu or vous?
  **A:** Tu (family mood).

### Telemetry and success metrics

- **Q:** What does success look like for you? (anonymous, opt-in statistics)
  **A:** Games played through to the end (games started and share reaching carton plein), and zero crashes during long games.

### Constraints

- **Q:** What stays out of v0.1?
  **A:** In-app cards (generation or printing), network multiplayer, prizes/stakes/money, and undoing the last ball.
- **Q:** Must it work offline?
  **A:** Yes: no network needed for the game itself (default accepted; text-to-speech uses the on-device voice).

## Decisions taken during discovery

- The app is a **caller (host) app**, not a card game: players keep paper cards; the phone draws, announces and checks.
- Rules recovered from the prior C# console version (`C:/dev/loto/Program.cs`): 1-90 without replacement, ball order
  number shown, sorted list of drawn numbers, card check listing found/missing numbers.
- Improvements over the prior version: polished warm visual style, rolling-ball animation, 1-90 board, French voice with
  optional nicknames, three game stages, card check by row on a 3 x 5 card, exact resume, screen kept on.
- Draw is triggered by tap only; no auto mode.
- After a validated win the host chooses: continue to the next stage or restart a new draw.
- Undo of the last ball is explicitly out of scope for v0.1 (accepted risk: an accidental tap draws a ball).
- Settings: voice, nicknames, sound effects, vibrations (each on/off), plus telemetry consent.
- Telemetry opt-in only, no identifiers; KPIs: games completed to carton plein, crash-free sessions.
- Open points for the PRD to settle (no user preference expressed): whether a short help screen exists, exact wording of
  the traditional nickname list, behaviour of the check for a card with numbers not yet drawn vs invalid entries.
