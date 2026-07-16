import { useEffect, useRef, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

function FirefliesComponent({ count = 60 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { tokens } = useTheme();
  const color = tokens.colors.primary;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        const pulse = (Math.sin(p.phase) + 1) / 2;
        const currentOpacity = p.opacity * (0.5 + pulse * 0.5);
        const currentRadius = p.radius * (0.8 + pulse * 0.4);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 4);
        gradient.addColorStop(0, `${color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.4, `${color}${Math.floor(currentOpacity * 128).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
}

export const Fireflies = memo(FirefliesComponent);
