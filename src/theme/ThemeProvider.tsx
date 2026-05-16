import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';
import { themeFor } from './themes';
import type { Theme } from './types';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedMode: Theme['mode'];
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = PropsWithChildren<{
  initialPreference?: ThemePreference;
}>;

export function ThemeProvider({ initialPreference = 'system', children }: Props) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(initialPreference);

  const resolvedMode: Theme['mode'] = useMemo(() => {
    if (preference === 'light' || preference === 'dark') {
      return preference;
    }
    return systemScheme === 'dark' ? 'dark' : 'light';
  }, [preference, systemScheme]);

  const theme = useMemo(() => themeFor(resolvedMode), [resolvedMode]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
  }, []);

  const value = useMemo(
    (): ThemeContextValue => ({
      theme,
      resolvedMode,
      preference,
      setPreference,
    }),
    [preference, resolvedMode, setPreference, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return ctx;
}
