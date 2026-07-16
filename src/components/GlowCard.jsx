import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

function GlowCardComponent({ children, className = '', style = {}, onClick, hoverable = true, ...props }) {
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;

  return (
    <motion.div
      style={{
        background: colors.bgSurface,
        borderRadius: radii.xl,
        boxShadow: shadows.clay,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      whileHover={hoverable ? { y: -4, boxShadow: shadows.clayHover, transition: { duration: 0.3 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const GlowCard = memo(GlowCardComponent);
