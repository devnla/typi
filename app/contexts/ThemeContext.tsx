import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system'); // Default to system
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  const getSystemTheme = (): ResolvedTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  useEffect(() => {
    try {
      // Check for saved theme preference or default to system
      const savedTheme = localStorage.getItem('typi-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme);
        const resolved = resolveTheme(savedTheme);
        setResolvedTheme(resolved);
        // Apply theme immediately
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
      } else {
        // Default to system theme
        setThemeState('system');
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
        localStorage.setItem('typi-theme', 'system');
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      // Fallback to system preference
      const fallbackTheme = getSystemTheme();
      setThemeState('system');
      setResolvedTheme(fallbackTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(fallbackTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    // Apply resolved theme to document
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    try {
      localStorage.setItem('typi-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}