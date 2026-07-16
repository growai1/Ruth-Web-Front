function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function rgba(hex, alpha) {
  return `rgba(${hexToRgb(hex)}, ${alpha})`;
}

export const neonTokens = {
  dark: {
    colorPrimary: '#8BC34A',
    colorPrimaryHover: '#9CCC65',
    colorPrimaryActive: '#7CB342',
    colorBgBase: '#1b201c',
    colorBgSurface: '#232a25',
    colorBgElevated: '#2c352e',
    colorText: '#E8F0E8',
    colorTextSecondary: '#A8BBA8',
    colorTextTertiary: '#6E806E',
    colorBorder: rgba('#8BC34A', 0.15),
    colorBorderStrong: rgba('#8BC34A', 0.35),
    colorSuccess: '#8BC34A',
    colorWarning: '#FFB74D',
    colorError: '#EF5350',
    colorInfo: '#42A5F5',
  },
  light: {
    colorPrimary: '#689F38',
    colorPrimaryHover: '#7CB342',
    colorPrimaryActive: '#558B2F',
    colorBgBase: '#e4ddd5',
    colorBgSurface: '#ece5dd',
    colorBgElevated: '#f4ede5',
    colorText: '#2D332D',
    colorTextSecondary: '#5A6B5A',
    colorTextTertiary: '#8A9B8A',
    colorBorder: rgba('#689F38', 0.2),
    colorBorderStrong: rgba('#689F38', 0.4),
    colorSuccess: '#689F38',
    colorWarning: '#F5A623',
    colorError: '#D32F2F',
    colorInfo: '#2080D9',
  },
};

export function buildDesignTokens(mode) {
  const c = neonTokens[mode];

  const shadowDark = mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(160,148,132,0.5)';
  const shadowLight = mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)';
  const shadowDarkStrong = mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(140,128,112,0.65)';

  return {
    colors: {
      primary: c.colorPrimary,
      primaryHover: c.colorPrimaryHover,
      primaryActive: c.colorPrimaryActive,
      bgBase: c.colorBgBase,
      bgSurface: c.colorBgSurface,
      bgElevated: c.colorBgElevated,
      text: c.colorText,
      textSecondary: c.colorTextSecondary,
      textTertiary: c.colorTextTertiary,
      border: c.colorBorder,
      borderStrong: c.colorBorderStrong,
      success: c.colorSuccess,
      warning: c.colorWarning,
      error: c.colorError,
      info: c.colorInfo,
    },
    shadows: {
      clay: `${8}px ${8}px ${16}px ${shadowDark}, ${-8}px ${-8}px ${16}px ${shadowLight}`,
      clayHover: `${10}px ${10}px ${20}px ${shadowDark}, ${-10}px ${-10}px ${20}px ${shadowLight}`,
      claySm: `${4}px ${4}px ${8}px ${shadowDark}, ${-4}px ${-4}px ${8}px ${shadowLight}`,
      clayLg: `${12}px ${12}px ${24}px ${shadowDark}, ${-12}px ${-12}px ${24}px ${shadowLight}`,
      clayInset: `inset ${4}px ${4}px ${8}px ${shadowDark}, inset ${-4}px ${-4}px ${8}px ${shadowLight}`,
      clayInsetSm: `inset ${3}px ${3}px ${6}px ${shadowDark}, inset ${-3}px ${-3}px ${6}px ${shadowLight}`,
      clayButton: `${5}px ${5}px ${10}px ${shadowDark}, ${-5}px ${-5}px ${10}px ${shadowLight}`,
      clayButtonActive: `inset ${3}px ${3}px ${6}px ${shadowDarkStrong}, inset ${-3}px ${-3}px ${6}px ${shadowLight}`,
      glow: `0 0 20px ${rgba(c.colorPrimary, 0.2)}`,
      glowStrong: `0 0 30px ${rgba(c.colorPrimary, 0.3)}`,
    },
    radii: {
      sm: 12,
      md: 16,
      lg: 24,
      xl: 28,
      xxl: 32,
      round: 999,
    },
    font: {
      main: "'Nunito', 'Space Grotesk', system-ui, sans-serif",
    },
  };
}

export function injectCssVars(tokens) {
  const { colors, shadows } = tokens;
  const el = document.documentElement;
  el.style.setProperty('--clay', colors.primary);
  el.style.setProperty('--clay-bright', colors.primaryHover);
  el.style.setProperty('--bg-base', colors.bgBase);
  el.style.setProperty('--bg-surface', colors.bgSurface);
  el.style.setProperty('--bg-elevated', colors.bgElevated);
  el.style.setProperty('--text-main', colors.text);
  el.style.setProperty('--text-secondary', colors.textSecondary);
  el.style.setProperty('--shadow-dark', shadows.clay);
  el.style.setProperty('--shadow-light', shadows.clay);
}
