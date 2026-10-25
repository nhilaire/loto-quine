import { useKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CardEntry, CellError, CheckResult, Cursor, checkCard, emptyCard, erase, nextCell, typeDigit } from '../game/card';
import { GameState } from '../game/game';
import type { Strings } from '../i18n';
import { useI18n } from '../i18n/I18nProvider';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { colors, font, radius, spacing } from '../ui/theme';
import { TieBreakView } from './TieBreakView';

type Props = {
  game: GameState;
  onBack: () => void;
  onValidate: () => void;
  onTieReveal: (n: number) => void;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'erase', '0', 'next'] as const;
type Key = (typeof KEYS)[number];

function keyLabel(key: Key, t: Strings): string {
  return key === 'erase' ? t.check.erase : key === 'next' ? t.check.next : key;
}

function errorMessages(result: CheckResult | null, t: Strings): string[] {
  if (!result) return [];
  if (result.kind === 'empty') return [t.check.errorEmpty];
  if (result.kind !== 'errors') return [];
  const messages: string[] = [];
  const kinds = new Set(result.cellErrors.flat().filter((e): e is CellError => e !== null));
  if (kinds.has('range')) messages.push(t.check.errorRange);
  if (kinds.has('duplicate')) messages.push(t.check.errorDuplicate);
  if (result.incompleteRows.length > 0) messages.push(t.check.errorIncomplete);
  return messages;
}

export function CheckScreen({ game, onBack, onValidate, onTieReveal }: Props) {
  const { t } = useI18n();
  useKeepAwake();
  const [card, setCard] = useState<CardEntry>(emptyCard);
  const [cursor, setCursor] = useState<Cursor>({ row: 0, col: 0 });
  const [result, setResult] = useState<CheckResult | null>(null);
  const [tie, setTie] = useState(false);

  // Android back closes the tie-break first (registered after the app handler, so it runs first).
  useEffect(() => {
    if (!tie) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setTie(false);
      return true;
    });
    return () => sub.remove();
  }, [tie]);

  if (tie) return <TieBreakView game={game} onBack={() => setTie(false)} onValidate={onValidate} onReveal={onTieReveal} />;

  const update = (next: { card: CardEntry; cursor: Cursor }) => {
    setCard(next.card);
    setCursor(next.cursor);
    setResult(null);
  };

  const press = (key: Key) => {
    if (key === 'erase') update(erase(card, cursor));
    else if (key === 'next') update({ card, cursor: nextCell(cursor) });
    else update(typeDigit(card, cursor, Number(key)));
  };

  const verdict = result?.kind === 'verdict' ? result : null;
  const errors = result?.kind === 'errors' ? result : null;
  const messages = errorMessages(result, t);

  return (
    <Screen testID="check-screen" gap={spacing.sm}>
      <Text style={styles.title} accessibilityRole="header" testID="check-title">
        {t.check.title[game.stage]}
      </Text>
      <Text style={styles.need} testID="check-need">
        {t.check.need[game.stage]}
      </Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {card.map((row, r) => {
          const rowResult = verdict?.rows[r];
          const rowIncomplete = errors?.incompleteRows.includes(r) ?? false;
          return (
            <View key={r} style={styles.rowBlock}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t.check.rowLabel(r + 1)}</Text>
                {row.map((value, c) => {
                  const selected = cursor.row === r && cursor.col === c;
                  const cellError = errors?.cellErrors[r][c] ?? null;
                  const cell = value === '' ? undefined : rowResult?.cells.find((x) => x.value === parseInt(value, 10));
                  const status = cell ? (cell.drawn ? t.check.drawn : t.check.missingNumber) : '';
                  return (
                    <Pressable
                      key={c}
                      testID={`check-cell-${r}-${c}`}
                      accessibilityLabel={`${value} ${status}`.trim() || t.check.rowLabel(r + 1)}
                      onPress={() => setCursor({ row: r, col: c })}
                      style={[
                        styles.cell,
                        selected && !verdict && styles.selected,
                        (cellError !== null || (rowIncomplete && value === '')) && styles.errorCell,
                        cell && (cell.drawn ? styles.drawnCell : styles.missingCell),
                      ]}
                    >
                      <Text style={[styles.cellText, cell && styles.cellTextResult]}>{value}</Text>
                      {cell ? <Text style={styles.mark}>{cell.drawn ? '✓' : '✗'}</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
              {rowResult && rowResult.filled && !rowResult.complete ? (
                <Text style={styles.rowMissing} testID={`check-row-missing-${r}`}>
                  {t.check.missing(rowResult.missing)}
                </Text>
              ) : null}
            </View>
          );
        })}
        {messages.map((m) => (
          <Text key={m} style={styles.error}>
            {m}
          </Text>
        ))}
        {verdict ? (
          <Text style={[styles.verdict, verdict.win ? styles.win : styles.notYet]} testID="check-verdict">
            {verdict.win ? t.check.win : t.check.notYet}
          </Text>
        ) : null}
      </ScrollView>

      {verdict?.win ? (
        <>
          <Button label={t.check.validate} onPress={onValidate} large testID="check-validate" />
          <Button label={t.tie.open} onPress={() => setTie(true)} variant="secondary" testID="check-tie" />
        </>
      ) : (
        <View style={styles.keypad}>
          {KEYS.map((key) => (
            <Pressable
              key={key}
              testID={`key-${key}`}
              accessibilityRole="button"
              accessibilityLabel={keyLabel(key, t)}
              onPress={() => press(key)}
              style={({ pressed }) => [styles.key, key.length > 1 && styles.keyAction, pressed && styles.keyPressed]}
            >
              <Text style={[styles.keyText, key.length > 1 && styles.keyActionText]}>{keyLabel(key, t)}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={styles.actions}>
        <View style={styles.half}>
          <Button label={t.common.back} onPress={onBack} variant="secondary" testID="check-back" />
        </View>
        {!verdict?.win ? (
          <View style={styles.half}>
            <Button label={t.check.verify} onPress={() => setResult(checkCard(card, game.draw, game.stage))} testID="check-verify" />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  need: { color: colors.accent, fontSize: font.body, fontWeight: '700' },
  scroll: { gap: spacing.sm },
  rowBlock: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowLabel: { color: colors.muted, fontSize: font.small, width: 52 },
  cell: {
    flex: 1,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: colors.accent },
  errorCell: { borderColor: colors.danger, borderStyle: 'dashed' },
  drawnCell: { backgroundColor: colors.drawn },
  missingCell: { backgroundColor: colors.missing },
  cellText: { color: colors.text, fontSize: 22, fontWeight: '800' },
  cellTextResult: { fontSize: 18 },
  mark: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: -2 },
  rowMissing: { color: colors.muted, fontSize: font.small, marginLeft: 58 },
  error: { color: colors.danger, fontSize: font.body, fontWeight: '700' },
  verdict: { fontSize: 30, fontWeight: '900', textAlign: 'center', marginTop: spacing.sm },
  win: { color: colors.accent },
  notYet: { color: colors.text },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' },
  key: { width: '32%', height: 50, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  keyAction: { backgroundColor: colors.surfaceStrong },
  keyPressed: { backgroundColor: colors.accent },
  keyText: { color: colors.text, fontSize: 24, fontWeight: '800' },
  keyActionText: { fontSize: font.body },
  actions: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
