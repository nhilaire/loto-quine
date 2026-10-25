# Nickname review sheet (AC-31)

Traditional loto nicknames announced when « Surnoms » is on. Numbers not listed are announced plainly (« 46 ! »).
The app data is `src/game/nicknames.ts`; a test checks that this sheet lists every nickname.

Decision (user, 2026-10-14): keep the nicknames confirmed by at least two independent sources, family-friendly
(no « le pastis », « les culs blancs » or bawdy calls), plus 1 « le petit » and 67 « six-seven » chosen by the user.
There is no official national list: calls vary by region and caller; most sources come from southern France.

Sources:
- **A**: Association Modèle, « Quelques commentaires pour le nommeur de loto provençal »,
  https://association-modele.fr/wp-content/uploads/2019/01/expressions-au-loto.doc (1-90)
- **L**: Lotopassion, « Liste des numéros de l'univers du loto »,
  https://www.lotopassion.com/info-pratique/910-liste-des-numeros-de-l-univers-du-loto (1-90)
- **B**: Bingofr, « Les expressions au loto bingo », https://www.bingofr.com/loto-bingo/les-expressions-au-loto-bingo/
- **P**: Je parle provençal, « Les expressions du loto en provençal »,
  https://jeparleprovencal.fr/les-expressions-du-loto-en-provencal/ (French glosses)
- **F**: forum threads (projetbabel.org, forum.tomshardware.fr) for 22 « les deux petits canards »

| Ball | Nickname | Sources | Approved |
|---|---|---|---|
| 1 | le petit | A, L, B; added by the user | yes |
| 2 | ils font la paire | A, L | yes |
| 4 | la chaise | A, L, P | yes |
| 5 | la pleine main | A, L, B, P | yes |
| 6 | le facteur part en tournée | A, B | yes |
| 7 | la semaine | A, P | yes |
| 8 | la cacahuète | A, L | yes |
| 9 | le facteur revient de tournée | A, B | yes |
| 10 | disputez-vous | A, L | yes |
| 11 | les jambes de ma grand-mère | A, L, P | yes |
| 12 | lève la blouse | A, B | yes |
| 14 | l'homme fort | A, L | yes |
| 18 | la majorité | A, L | yes |
| 20 | sans eau | A, L, B, P | yes |
| 21 | l'ancienne majorité | A, L | yes |
| 22 | les deux petits canards | L, F | yes |
| 25 | Noël | A, L, P | yes |
| 29 | les chapeaux ronds | A, B | yes |
| 31 | les violettes | A, L | yes |
| 33 | l'âge du Christ | A, L | yes |
| 36 | les chandelles | A, L | yes |
| 37 | la bonne température | A, L | yes |
| 45 | la moitié du jeu | A, L | yes |
| 47 | les pruneaux | A, L | yes |
| 65 | les miracles | A, L | yes |
| 67 | six-seven | chosen by the user (sources: les saucisses); spoken « sixe sévène » | yes |
| 80 | dans un coin | A, L | yes |
| 87 | la porcelaine | A, L | yes |
| 88 | les deux cacahuètes | A (L, P: les deux courges) | yes |
| 89 | la mamé | A, L, P | yes |
| 90 | le papé | A, L, P | yes |


## English: British bingo calls (v0.2.0)

Calls used when the game is in English and « Bingo calls » is on; the voice says « {call}, {n}! » (British order).
The app data is `NICKNAMES.en` in `src/game/nicknames.ts`. Decision (user, 2026-10-25): traditional British bingo calls.
Kept: calls given by both sources below, family-friendly. Left out: bawdy or body-shaming calls (30 « Dirty Gertie »,
33 « dirty knee », 44 « droopy drawers », 8 / 88 « fat lady » calls, 69, 56, 40), calls naming people or brands (10, 42, 52, 57),
and calls on which the sources disagree (77, 84, 87). Those numbers are announced plainly (« 88! »).

Sources:
- **W**: Wikipedia, « List of British bingo nicknames », https://en.wikipedia.org/wiki/List_of_British_bingo_nicknames
- **C**: Bingo Card Creator, « Bingo calls: Fun, traditional & unusual », https://www.bingocardcreator.com/blog/bingo-calls/

| Ball | Call | Sources | Approved |
|---|---|---|---|
| 1 | Kelly's eye | W, C | yes |
| 2 | one little duck | W, C | yes |
| 3 | cup of tea | W, C | yes |
| 4 | knock at the door | W, C | yes |
| 5 | man alive | W, C | yes |
| 6 | half a dozen | W, C | yes |
| 7 | lucky seven | W, C | yes |
| 8 | garden gate | W, C | yes |
| 9 | doctor's orders | W, C | yes |
| 11 | legs eleven | W, C | yes |
| 12 | one dozen | W, C | yes |
| 13 | unlucky for some | W, C | yes |
| 14 | Valentine's Day | W, C | yes |
| 15 | young and keen | W, C | yes |
| 16 | sweet sixteen | W, C | yes |
| 17 | dancing queen | W, C | yes |
| 18 | coming of age | W, C | yes |
| 19 | goodbye teens | W, C | yes |
| 20 | one score | W, C | yes |
| 21 | key of the door | W, C | yes |
| 22 | two little ducks | W, C | yes |
| 23 | thee and me | W, C | yes |
| 24 | two dozen | W, C | yes |
| 25 | duck and dive | W, C | yes |
| 26 | pick and mix | W, C | yes |
| 27 | gateway to heaven | W, C | yes |
| 29 | rise and shine | W, C | yes |
| 31 | get up and run | W, C | yes |
| 32 | buckle my shoe | W, C | yes |
| 34 | ask for more | W, C | yes |
| 35 | jump and jive | W, C | yes |
| 36 | three dozen | W, C | yes |
| 37 | more than eleven | W, C | yes |
| 38 | Christmas cake | W, C | yes |
| 39 | all the steps | W, C | yes |
| 41 | time for fun | W, C | yes |
| 43 | down on your knees | W, C | yes |
| 44 | all the fours | W, C | yes |
| 45 | halfway there | W, C | yes |
| 46 | up to tricks | W, C | yes |
| 47 | four and seven | W, C | yes |
| 48 | four dozen | W, C | yes |
| 50 | half a century | W, C | yes |
| 51 | tweak of the thumb | W, C | yes |
| 53 | stuck in the tree | W, C | yes |
| 54 | clean the floor | W, C | yes |
| 55 | snakes alive | W, C | yes |
| 58 | make them wait | W, C | yes |
| 59 | Brighton line | W, C | yes |
| 60 | five dozen | W, C | yes |
| 61 | baker's bun | W, C | yes |
| 62 | turn the screw | W, C | yes |
| 63 | tickle me | W, C | yes |
| 64 | red raw | W, C | yes |
| 65 | old age pension | W, C | yes |
| 66 | clickety click | W, C | yes |
| 67 | made in heaven | W, C | yes |
| 68 | saving grace | W, C | yes |
| 70 | three score and ten | W, C | yes |
| 71 | bang on the drum | W, C | yes |
| 72 | six dozen | W, C | yes |
| 73 | queen bee | W, C | yes |
| 74 | candy store | W, C | yes |
| 75 | strive and strive | W, C | yes |
| 76 | trombones | W, C | yes |
| 78 | heaven's gate | W, C | yes |
| 79 | one more time | W, C | yes |
| 80 | eight and blank | W, C | yes |
| 81 | stop and run | W, C | yes |
| 82 | straight on through | W, C | yes |
| 83 | time for tea | W, C | yes |
| 85 | staying alive | W, C | yes |
| 86 | between the sticks | W, C | yes |
| 89 | nearly there | W, C | yes |
| 90 | top of the shop | W, C | yes |
