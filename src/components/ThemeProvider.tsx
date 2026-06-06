'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Theme store using useSyncExternalStore pattern (no setState in effects)
let currentTheme: Theme = 'dark';
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getThemeServerSnapshot(): Theme {
  return 'dark';
}

function setThemeValue(theme: Theme) {
  currentTheme = theme;
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  notifyListeners();
}

// Initialize theme from localStorage (runs once on module load in client)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved === 'dark' || saved === 'light') {
    currentTheme = saved;
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    currentTheme = 'light';
  }
}

// SSR-safe mounted check
const subscribeMounted = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribeMounted, getMountedClient, getMountedServer);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setThemeValue(currentTheme === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>{children}</div>
    </ThemeContext.Provider>
  );
}
