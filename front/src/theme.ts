// Design tokens taken from the validated Figma mock-up.
export const colors = {
  background: '#FAFAF7',
  surface: '#FFFFFF',
  amber: '#F5A623',
  amberLight: '#FEF3DC',
  amberText: '#92400E',
  green: '#1F7A4D',
  greenLight: '#D4EDE2',
  slate: '#5B6470',
  dark: '#1A1A1A',
  red: '#DC2626',
  redLight: '#FEE2E2',
  border: 'rgba(0,0,0,0.08)',
  muted: '#E5E7EB',
  segment: '#F0F0ED',
};

export const radius = { card: 16, button: 12, input: 10, chip: 8, pill: 99 };

/** Horizontal page margin from the mock-up. */
export const MARGIN = 20;

export const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.07,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
