// Which telemetry events a game transition produces (docs/PRD.md "Telemetry events"). Pure, so it is unit-tested.
import type { EventName, TelemetryEvents } from '../telemetry/events';
import { GameAction, GameState, durationMinutes } from './game';

export type TrackCall = { [N in EventName]: { name: N; params: TelemetryEvents[N] } }[EventName];

export function transitionEvents(prev: GameState, action: GameAction, next: GameState, now: number): TrackCall[] {
  if (next === prev) return [];
  const calls: TrackCall[] = [];
  if (action.type === 'choose' && prev.pendingWin && !next.pendingWin) {
    calls.push({ name: 'stage_won', params: { stage: prev.stage, balls: prev.draw.length, choice: action.choice } });
  }
  if (action.type === 'validateWin' && next.result === 'completed') {
    calls.push({ name: 'stage_won', params: { stage: prev.stage, balls: prev.draw.length, choice: 'end' } });
  }
  if (prev.status === 'playing' && next.status === 'finished' && next.result) {
    calls.push({ name: 'game_end', params: { result: next.result, stage: next.stage, duration_min: durationMinutes(next, now) } });
  }
  return calls;
}

// A new game replaces any game still in progress.
export function startEvents(previous: GameState | null, now: number): TrackCall[] {
  const calls: TrackCall[] = [];
  if (previous && previous.status === 'playing') {
    calls.push({ name: 'game_end', params: { result: 'replaced', stage: previous.stage, duration_min: durationMinutes(previous, now) } });
  }
  calls.push({ name: 'game_start', params: {} });
  return calls;
}
