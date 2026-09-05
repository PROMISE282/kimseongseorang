export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  ink: string;
  muted: string;
  subtle: string;
  line: string;
  surface: string;
  surfaceAlt: string;
  background: string;
  blue: string;
  blueDark: string;
  blueSoft: string;
  sky: string;
  green: string;
  greenSoft: string;
  amber: string;
  amberSoft: string;
  danger: string;
  dangerSoft: string;
  charcoal: string;
  onAccent: string;
  overlay: string;
  mapBase: string;
  mapBlock: string;
  mapRoad: string;
};

const light: ThemeColors = {
  ink: '#111827',
  muted: '#536074',
  subtle: '#6B7280',
  line: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F5',
  background: '#F5F7FA',
  blue: '#1769F6',
  blueDark: '#0C4DD8',
  blueSoft: '#EAF2FF',
  sky: '#DCEAFF',
  green: '#16A66A',
  greenSoft: '#E8F8F1',
  amber: '#F59E0B',
  amberSoft: '#FFF5DA',
  danger: '#E5484D',
  dangerSoft: '#FFF0F0',
  charcoal: '#252A32',
  onAccent: '#FFFFFF',
  overlay: 'rgba(16,24,40,0.46)',
  mapBase: '#EEF1F4',
  mapBlock: '#E1E5E9',
  mapRoad: '#FFFFFF',
};

const dark: ThemeColors = {
  ink: '#F2F5F9',
  muted: '#A2AEBF',
  subtle: '#76828F',
  line: '#28303B',
  surface: '#161B22',
  surfaceAlt: '#1C232C',
  background: '#0D1117',
  blue: '#4C8DFF',
  blueDark: '#7DAEFF',
  blueSoft: '#17273F',
  sky: '#1C2C46',
  green: '#39CB90',
  greenSoft: '#12291F',
  amber: '#F5B441',
  amberSoft: '#2C2411',
  danger: '#F26A6E',
  dangerSoft: '#2C1618',
  charcoal: '#05070A',
  onAccent: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.62)',
  mapBase: '#151B23',
  mapBlock: '#212A35',
  mapRoad: '#2C3742',
};

export const palettes: Record<ThemeMode, ThemeColors> = { light, dark };

export const radii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const shadow = (mode: ThemeMode) =>
  mode === 'light'
    ? {
        shadowColor: '#101828',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 3,
      }
    : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 6,
      };

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
  radii: typeof radii;
  spacing: typeof spacing;
  shadow: ReturnType<typeof shadow>;
};
