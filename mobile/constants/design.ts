export const Palette = {
  background: '#F4F8F5',
  backgroundWarm: '#FBF8F1',
  black: '#0D1F18',
  blue: '#2D6AA3',
  blueSoft: '#E8F2FB',
  border: '#DDE9E2',
  card: '#FFFFFF',
  danger: '#C64646',
  dangerSoft: '#FCECEC',
  gold: '#C98A26',
  goldSoft: '#FFF4DC',
  green: '#0D7653',
  greenBright: '#12A36D',
  greenDark: '#073C2D',
  greenDeep: '#082E24',
  greenSoft: '#E3F6EC',
  muted: '#66786F',
  mutedLight: '#91A098',
  purple: '#7657A6',
  purpleSoft: '#F0EAF8',
  white: '#FFFFFF',
} as const;

export const Radius = {
  button: 18,
  card: 24,
  input: 16,
  pill: 999,
} as const;

export const Shadow = {
  card: {
    elevation: 3,
    shadowColor: '#0A3829',
    shadowOffset: { height: 7, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  floating: {
    elevation: 8,
    shadowColor: '#082E24',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
  },
} as const;

export function formatCurrency(value: unknown, currency = 'NGN') {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-NG', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function titleCase(value?: string | null) {
  if (!value) return '';
  return value
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
