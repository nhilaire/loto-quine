// Warm village-hall (« salle des fêtes ») palette: deep red background, cream text, gold accent.
export const colors = {
  background: '#9E2A1B',
  backgroundDeep: '#6E1A10',
  surface: '#7E2014',
  surfaceStrong: '#5C150C',
  text: '#FFF6E5',
  muted: '#F3CDB4',
  accent: '#FFC83D',
  accentText: '#3B1A08',
  drawn: '#2E9E5B',
  missing: '#D7263D',
  danger: '#FFB4A8',
  boardCell: 'rgba(255, 246, 229, 0.10)',
  boardText: 'rgba(255, 246, 229, 0.55)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const;

export const radius = { sm: 8, md: 14, lg: 24 } as const;

export const font = { title: 34, heading: 24, body: 17, small: 14 } as const;

// Ball colours by tens (1-9, 10-19, ..., 80-90), always shown with the printed number.
const BALL_COLORS = ['#E63946', '#F77F00', '#E9B500', '#2A9D8F', '#3A86FF', '#8338EC', '#FF006E', '#06A77D', '#8D5524'] as const;

export function ballColor(n: number): string {
  return BALL_COLORS[Math.min(8, Math.floor(n / 10))];
}
