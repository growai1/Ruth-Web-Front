import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { buildDesignTokens, injectCssVars } from '../theme/tokens';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('growai_theme') || 'light';
  });

  const tokens = useMemo(() => buildDesignTokens(mode), [mode]);

  useEffect(() => {
    localStorage.setItem('growai_theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    injectCssVars(tokens);
  }, [mode, tokens]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
