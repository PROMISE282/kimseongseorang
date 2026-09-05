import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { palettes, radii, shadow, spacing, type Theme, type ThemeMode } from './tokens';

const STORAGE_KEY = 'juchamowa.theme.mode';
type Preference = ThemeMode | 'system';

type ThemeContextValue = Theme & {
  preference: Preference;
  setPreference: (next: Preference) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<Preference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') setPreferenceState(stored);
      })
      .catch(() => undefined);
  }, []);

  const setPreference = useCallback((next: Preference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const mode: ThemeMode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const toggle = useCallback(() => {
    setPreference(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: palettes[mode],
      radii,
      spacing,
      shadow: shadow(mode),
      preference,
      setPreference,
      toggle,
    }),
    [mode, preference, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
