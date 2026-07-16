import { memo } from 'react';
import { Typography } from 'antd';
import { NeonButton } from './NeonButton';
import { useTheme } from '../context/ThemeContext';

const { Title, Paragraph } = Typography;

function PlantEmptyComponent({ title = 'Sin contenido aún', description = 'Comienza a crear tu primer elemento', actionLabel = 'Crear ahora', onAction }) {
  const { tokens } = useTheme();
  const { colors } = tokens;

  return (
    <div style={{
      padding: '80px 40px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
    }}>
      <div style={{
        width: 160,
        height: 160,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          width: 200,
          height: 200,
          top: -20,
          left: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M60 100V60" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
          <path d="M60 60C60 60 45 55 40 40C35 25 50 20 60 35C70 20 85 25 80 40C75 55 60 60 60 60Z" fill={colors.primary} fillOpacity="0.2" stroke={colors.primary} strokeWidth="2" strokeLinejoin="round" />
          <path d="M60 75C55 72 48 70 45 75C42 80 48 85 55 82" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
          <path d="M60 80C65 77 72 75 75 80C78 85 72 90 65 87" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="60" cy="105" rx="25" ry="4" fill={colors.primary} fillOpacity="0.1" />
        </svg>
      </div>

      <div style={{ maxWidth: 400 }}>
        <Title level={3} style={{ marginBottom: 12, fontWeight: 600, color: colors.text }}>{title}</Title>
        <Paragraph style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 0, color: colors.textSecondary }}>{description}</Paragraph>
      </div>

      {onAction && (
        <NeonButton onClick={onAction} size="large" style={{ marginTop: 8 }}>
          {actionLabel}
        </NeonButton>
      )}
    </div>
  );
}

export const PlantEmpty = memo(PlantEmptyComponent);
