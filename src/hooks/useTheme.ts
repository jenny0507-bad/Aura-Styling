import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'blush' | 'system';
export type ResolvedTheme = 'light' | 'dark' | 'blush';

const THEME_STORAGE_KEY = 'aura_theme_mode_v1';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function useTheme() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'blush', 'system'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to read theme preference:', e);
    }
    return 'light';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system' ? systemTheme : themeMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'blush');
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else if (resolvedTheme === 'blush') {
      root.classList.add('blush');
    }
  }, [resolvedTheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, []);

  return {
    themeMode,
    resolvedTheme,
    setThemeMode,
  };
}
