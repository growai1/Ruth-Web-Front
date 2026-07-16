import { memo } from 'react';
import { useTheme } from '../context/ThemeContext';

function AnimatedBorderComponent({ children, active = false, style = {} }) {
  const { tokens } = useTheme();
  const { radii } = tokens;

  if (!active) {
    return (
      <div style={{ borderRadius: radii.xl, overflow: 'hidden', ...style }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      borderRadius: radii.xl,
      overflow: 'hidden',
      padding: 2,
      ...style,
    }}>
      <div style={{
        position: 'absolute',
        inset: '-50%',
        background: `conic-gradient(from 0deg, transparent 0deg, ${tokens.colors.primary} 60deg, ${tokens.colors.primaryHover} 120deg, transparent 180deg, transparent 360deg)`,
        animation: 'rotate-border 3s linear infinite',
        zIndex: 0,
      }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: tokens.colors.bgSurface,
        borderRadius: radii.xl - 2,
        margin: 2,
        padding: 24,
      }}>
        {children}
      </div>
      <style>{`@keyframes rotate-border { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

export const AnimatedBorder = memo(AnimatedBorderComponent);
