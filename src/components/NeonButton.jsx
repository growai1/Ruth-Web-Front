import { memo } from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

function NeonButtonComponent({ children, variant = 'primary', className = '', style = {}, ...props }) {
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;

  const primaryStyle = {
    background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
    color: '#fff',
    borderRadius: radii.md,
    border: 'none',
    boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const ghostStyle = {
    background: `linear-gradient(145deg, ${colors.bgElevated}, ${colors.bgSurface})`,
    color: colors.primary,
    borderRadius: radii.md,
    border: 'none',
    boxShadow: shadows.clayButton,
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const btnStyle = variant === 'primary' ? primaryStyle : ghostStyle;

  return (
    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
      <Button
        className={className}
        type={variant === 'primary' ? 'primary' : 'default'}
        style={{ ...btnStyle, ...style }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

export const NeonButton = memo(NeonButtonComponent);
