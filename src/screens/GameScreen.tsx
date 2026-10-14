import { useKeepAwake } from 'expo-keep-awake';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { announcement } from '../game/announce';
import { allOut, lastBalls } from '../game/draw';
import { GameState, WinChoice, canDraw, lastBall } from '../game/game';
import { fr } from '../i18n/fr';
import { Ball } from '../ui/Ball';
import { Board } from '../ui/Board';
import { Button } from '../ui/Button';
import { Confetti } from '../ui/Confetti';
import { Dialog } from '../ui/Dialog';
import { LastBalls } from '../ui/LastBalls';
import { Screen } from '../ui/Screen';
import { colors, font, radius, spacing } from '../ui/theme';

export const ROLL_MS = 1000;

type Props = {
  game: GameState;
  nicknames: boolean;
  onDraw: () => void;
  onRevealed: () => void;
  onCheck: () => void;
  onHome: () => void;
  onEnd: () => void;
  onChoose: (choice: WinChoice) => void;
};

export function GameScreen({ game, nicknames, onDraw, onRevealed, onCheck, onHome, onEnd, onChoose }: Props) {
  useKeepAwake();
  const { width, height } = useWindowDimensions();
  const ball = lastBall(game);
  const drawn = useMemo(() => new Set(game.draw), [game.draw]);
  const rolling = game.animating;
  const nickname = ball !== null && !rolling ? announcement(ball, nicknames).nickname : null;
  const ballSize = Math.min(width * 0.56, height * 0.27);
  const boardWidth = width - 2 * spacing.md;

  // The ball rolls for ROLL_MS, then it is revealed (the parent announces it).
  useEffect(() => {
    if (!rolling) return;
    const id = setTimeout(onRevealed, ROLL_MS);
    return () => clearTimeout(id);
  }, [rolling, game.draw.length, onRevealed]);

  const drawEnabled = canDraw(game);

  return (
    <Screen testID="game-screen" gap={spacing.sm}>
      <View style={styles.header}>
        <Button label={fr.common.home} onPress={onHome} variant="ghost" testID="game-home" />
        <View style={styles.stage}>
          <Text style={styles.stageText} testID="game-stage">
            {fr.stage[game.stage]}
          </Text>
        </View>
        <Button label={fr.game.end} onPress={onEnd} variant="ghost" testID="game-end" />
      </View>

      <Pressable
        style={styles.ballArea}
        onPress={drawEnabled ? onDraw : undefined}
        accessibilityRole="button"
        accessibilityLabel={fr.game.draw}
        testID="game-ball-zone"
      >
        <Ball
          number={ball}
          rolling={rolling}
          size={ballSize}
          testID="game-ball"
          accessibilityLabel={ball !== null && !rolling ? fr.game.ballLabel(ball) : fr.game.draw}
        />
        <Text style={styles.nickname} numberOfLines={1} testID="game-nickname">
          {nickname ?? ' '}
        </Text>
        <Text style={styles.counter} testID="game-counter">
          {ball === null ? fr.game.noBall : rolling ? ' ' : fr.game.counter(game.draw.length)}
        </Text>
      </Pressable>

      <LastBalls balls={rolling ? lastBalls(game.draw.slice(0, -1)) : lastBalls(game.draw)} />
      <Board drawn={rolling ? new Set(game.draw.slice(0, -1)) : drawn} last={rolling ? null : ball} width={boardWidth} />

      {allOut(game.draw) && !rolling ? (
        <Text style={styles.allOut} testID="game-all-out">
          {fr.game.allOut}
        </Text>
      ) : null}
      <Button label={fr.game.draw} onPress={onDraw} disabled={!drawEnabled} large testID="game-draw" />
      <Button label={fr.game.check} onPress={onCheck} variant="secondary" disabled={rolling} testID="game-check" />

      <Dialog visible={game.pendingWin} title={fr.win.title} onRequestClose={() => {}} testID="win-dialog" decoration={<Confetti />}>
        <Button label={fr.win.continue} onPress={() => onChoose('continue')} testID="win-continue" />
        <Button label={fr.win.newDraw} onPress={() => onChoose('new_draw')} variant="secondary" testID="win-new-draw" />
      </Dialog>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stage: { backgroundColor: colors.accent, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 6, boxShadow: '0px 3px 0px #B8860B' },
  stageText: { color: colors.accentText, fontSize: 19, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  ballArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  nickname: { color: colors.accent, fontSize: font.body + 2, fontWeight: '700', fontStyle: 'italic', minHeight: 26 },
  counter: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  allOut: { color: colors.accent, fontSize: font.body, fontWeight: '800', textAlign: 'center' },
});
