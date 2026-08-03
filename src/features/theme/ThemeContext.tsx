import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors, darkColors } from '../../theme/tokens';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = '@app_theme_preference';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: typeof lightColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => { if (saved === 'dark' || saved === 'light') setModeState(saved); })
      .finally(() => setIsReady(true));
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  const activeColors = mode === 'dark' ? darkColors : lightColors;

  // Block first paint until the stored preference is known — prevents the
  // light→dark flash that was causing the status bar / white-screen glitch.
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ mode, colors: activeColors, isDark: mode === 'dark', setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}