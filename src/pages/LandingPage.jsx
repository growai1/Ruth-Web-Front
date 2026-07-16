import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Row, Col } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  AimOutlined,
  GlobalOutlined,
  TrophyOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Fireflies } from '../components/Fireflies';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';

const { Title, Paragraph, Text } = Typography;

const features = [
  { icon: <RobotOutlined />, title: 'IA Personalizada', desc: 'Rutas de aprendizaje adaptadas a tu ritmo y estilo.' },
  { icon: <ThunderboltOutlined />, title: 'Progreso en Tiempo Real', desc: 'Seguimiento instantáneo de tu avance.' },
  { icon: <AimOutlined />, title: 'Objetivos Inteligentes', desc: 'Metas que se ajustan según tu rendimiento.' },
  { icon: <GlobalOutlined />, title: 'Comunidad Global', desc: 'Conecta con estudiantes de todo el mundo.' },
  { icon: <TrophyOutlined />, title: 'Certificaciones', desc: 'Obtén certificados reconocidos al completar cursos.' },
  { icon: <CustomerServiceOutlined />, title: 'Soporte 24/7', desc: 'Asistencia disponible cuando la necesites.' },
];

const courses = [
  { title: 'Introducción a Python', level: 'Principiante', duration: '4h', rating: 4.8 },
  { title: 'Machine Learning Básico', level: 'Intermedio', duration: '8h', rating: 4.9 },
  { title: 'Diseño UX/UI', level: 'Principiante', duration: '6h', rating: 4.7 },
  { title: 'Desarrollo Web Full Stack', level: 'Avanzado', duration: '12h', rating: 4.9 },
];

const testimonials = [
  { name: 'María García', role: 'Estudiante', text: 'Grow AI transformó mi forma de aprender. Los videos generados por IA son increíbles.' },
  { name: 'Carlos López', role: 'Profesional', text: 'La plataforma más intuitiva que he usado. El contenido se adapta perfectamente.' },
  { name: 'Ana Martínez', role: 'Docente', text: 'Como educadora, veo cómo mis estudiantes progresan más rápido con las rutas personalizadas.' },
];

const stats = [
  { label: 'Estudiantes', value: 15000, suffix: '+' },
  { label: 'Cursos', value: 250, suffix: '+' },
  { label: 'Instructores', value: 80, suffix: '+' },
  { label: 'Países', value: 45, suffix: '+' },
];

function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration, start]);

  return [count, ref];
}

function StatCounter({ value, suffix, label, colors }) {
  const [count, ref] = useCountUp(value);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <Title level={1} className="shimmer-text" style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
        {count.toLocaleString()}{suffix}
      </Title>
      <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 8, display: 'block' }}>{label}</Text>
    </div>
  );
}

export default function LandingPage() {
  const { mode, toggleTheme, tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((hash) => {
    setMenuOpen(false);
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryHover})`, zIndex: 9999, width: `${readProgress}%`, transition: 'width 0.1s ease-out' }} />

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '12px 24px' : '20px 24px',
          background: colors.bgSurface,
          boxShadow: shadows.claySm,
          borderBottom: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: radii.md,
              background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 20,
              boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
            }}>
              G
            </div>
            <Title level={4} style={{ margin: 0, fontWeight: 700, color: colors.text }}>
              Grow AI
            </Title>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('features'); }} style={{ color: colors.textSecondary, fontWeight: 500 }}>Características</a>
            <a href="#courses" onClick={(e) => { e.preventDefault(); handleNavClick('courses'); }} style={{ color: colors.textSecondary, fontWeight: 500 }}>Cursos</a>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('testimonials'); }} style={{ color: colors.textSecondary, fontWeight: 500 }}>Testimonios</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} style={{ color: colors.textSecondary, fontWeight: 500 }}>Contacto</a>
            <button
              onClick={toggleTheme}
              style={{
                background: colors.bgElevated,
                borderRadius: radii.sm,
                padding: '8px 12px',
                color: colors.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: shadows.claySm,
              }}
            >
              {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </button>
            {user ? (
              <NeonButton onClick={() => navigate('/dashboard')}>Dashboard</NeonButton>
            ) : (
              <Row gutter={12}>
                <Col><NeonButton variant="ghost" onClick={() => navigate('/login')}>Acceder</NeonButton></Col>
                <Col><NeonButton onClick={() => navigate('/register')}>Registrarse</NeonButton></Col>
              </Row>
            )}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', color: colors.primary, fontSize: 24 }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999,
              padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
              background: colors.bgSurface,
              boxShadow: shadows.clay,
            }}
          >
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}>Características</a>
            <a href="#courses" onClick={(e) => { e.preventDefault(); handleNavClick('courses'); }}>Cursos</a>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('testimonials'); }}>Testimonios</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contacto</a>
            <button onClick={toggleTheme} style={{ color: colors.primary, textAlign: 'left', padding: '8px 0' }}>
              {mode === 'dark' ? 'Modo Sol' : 'Modo Bosque'}
            </button>
            {user ? (
              <NeonButton onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>Dashboard</NeonButton>
            ) : (
              <Row gutter={12}>
                <Col><NeonButton variant="ghost" onClick={() => { setMenuOpen(false); navigate('/login'); }}>Acceder</NeonButton></Col>
                <Col><NeonButton onClick={() => { setMenuOpen(false); navigate('/register'); }}>Registrarse</NeonButton></Col>
              </Row>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section id="hero" style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <Fireflies count={80} />

        <div style={{
          position: 'absolute', width: 600, height: 600,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
          filter: 'blur(60px)', pointerEvents: 'none', opacity: 0.4,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 900, position: 'relative', zIndex: 2 }}
        >
          <Title
            level={1}
            className="shimmer-text"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: 32, lineHeight: 1.1 }}
          >
            Aprende con Inteligencia Artificial
          </Title>

          <Paragraph style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            maxWidth: 700, margin: '0 auto 56px', lineHeight: 1.7,
            color: colors.textSecondary,
          }}>
            Rutas personalizadas, videos generados por IA y un ecosistema colaborativo que crece contigo. Tu jardín de conocimiento comienza aquí.
          </Paragraph>

          <Row gutter={24} justify="center" style={{ flexWrap: 'wrap' }}>
            <Col>
              <NeonButton size="large" icon={<PlayCircleOutlined />}
                onClick={() => navigate(user ? '/dashboard/generate' : '/register')}
                style={{ height: 60, paddingInline: 40, fontSize: 18 }}
              >
                Comenzar ahora
              </NeonButton>
            </Col>
            <Col>
              <NeonButton variant="ghost" size="large" onClick={() => handleNavClick('features')}
                style={{ height: 60, paddingInline: 40, fontSize: 18 }}
              >
                Explorar <ArrowRightOutlined />
              </NeonButton>
            </Col>
          </Row>
        </motion.div>
      </section>

      <section id="features" style={{ padding: '140px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 100 }}>
          <Title level={2} style={{ marginBottom: 20, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            <span className="neon-text">¿Por qué Grow AI?</span>
          </Title>
          <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto', color: colors.textSecondary }}>
            Herramientas inteligentes diseñadas para potenciar tu aprendizaje
          </Paragraph>
        </motion.div>

        <Row gutter={[32, 32]}>
          {features.map((f, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <GlowCard style={{ height: '100%', padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 56, color: colors.primary, marginBottom: 24 }}>{f.icon}</div>
                  <Title level={3} style={{ marginBottom: 16, fontWeight: 600, color: colors.text }}>{f.title}</Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 0, color: colors.textSecondary }}>{f.desc}</Paragraph>
                </GlowCard>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      <section id="courses" style={{ padding: '140px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 100 }}>
            <Title level={2} style={{ marginBottom: 20, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              <span className="neon-text">Cursos Destacados</span>
            </Title>
            <Paragraph style={{ fontSize: 18, color: colors.textSecondary }}>
              Explora nuestros cursos más populares
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {courses.map((c, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <GlowCard style={{ overflow: 'hidden', height: '100%' }}>
                    <div style={{
                      height: 180,
                      background: `linear-gradient(135deg, ${colors.primary}0D, ${colors.primary}1A)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PlayCircleOutlined style={{ fontSize: 72, color: colors.primary, opacity: 0.7 }} />
                    </div>
                    <div style={{ padding: 28 }}>
                      <Title level={4} style={{ marginBottom: 16, fontWeight: 600, color: colors.text }}>{c.title}</Title>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{c.level}</Text>
                        <Text style={{ fontSize: 13, color: colors.textTertiary }}>•</Text>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{c.duration}</Text>
                        <Text style={{ fontSize: 13, color: colors.textTertiary }}>•</Text>
                        <Text style={{ fontSize: 13, color: colors.primary }}>{c.rating} ★</Text>
                      </div>
                      <NeonButton variant="ghost" block onClick={() => navigate(user ? '/dashboard/courses' : '/register')} style={{ fontSize: 14 }}>
                        Ver curso <ArrowRightOutlined />
                      </NeonButton>
                    </div>
                  </GlowCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section id="testimonials" style={{ padding: '140px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 100 }}>
          <Title level={2} style={{ marginBottom: 20, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            <span className="neon-text">Testimonios</span>
          </Title>
          <Paragraph style={{ fontSize: 18, color: colors.textSecondary }}>
            Lo que dicen nuestros estudiantes
          </Paragraph>
        </motion.div>

        <Row gutter={[32, 32]}>
          {testimonials.map((t, i) => (
            <Col xs={24} md={8} key={i}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                <GlowCard style={{ height: '100%', padding: 40 }}>
                  <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic', color: colors.textSecondary }}>
                    "{t.text}"
                  </Paragraph>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 16, color: colors.text }}>{t.name}</Text>
                    <Text style={{ fontSize: 14, color: colors.primary }}>{t.role}</Text>
                  </div>
                </GlowCard>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      <section id="garden" style={{ padding: '140px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 100 }}>
            <Title level={2} style={{ marginBottom: 20, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              <span className="neon-text">Nuestro Jardín</span>
            </Title>
            <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto', color: colors.textSecondary }}>
              Una comunidad que crece cada día, cultivando conocimiento con pasión
            </Paragraph>
          </motion.div>

          <GlowCard style={{ padding: 80 }}>
            <Row gutter={[60, 60]} justify="center">
              {stats.map((s, i) => (
                <Col xs={12} sm={6} key={i}>
                  <StatCounter value={s.value} suffix={s.suffix} label={s.label} colors={colors} />
                </Col>
              ))}
            </Row>
          </GlowCard>
        </div>
      </section>

      <footer id="contact" style={{
        padding: '100px 24px 40px', marginTop: 100,
        background: colors.bgSurface,
        boxShadow: `0 -4px 16px ${colors.bgBase}22`,
        borderTop: `1px solid ${colors.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[60, 60]}>
            <Col xs={24} md={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: radii.md,
                  background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 20,
                  boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
                }}>
                  G
                </div>
                <Title level={4} style={{ margin: 0, fontWeight: 700, color: colors.text }}>Grow AI</Title>
              </div>
              <Paragraph style={{ maxWidth: 300, marginBottom: 0, color: colors.textSecondary, lineHeight: 1.7 }}>
                Plataforma educativa potenciada por IA. Cultivando conocimiento, cosechando futuro.
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ marginBottom: 24, fontWeight: 600, color: colors.primary }}>Enlaces</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <a href="#features" style={{ color: colors.textSecondary }}>Características</a>
                <a href="#courses" style={{ color: colors.textSecondary }}>Cursos</a>
                <a href="#testimonials" style={{ color: colors.textSecondary }}>Testimonios</a>
                <Link to="/login" style={{ color: colors.textSecondary }}>Acceder</Link>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ marginBottom: 24, fontWeight: 600, color: colors.primary }}>Contacto</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Text style={{ color: colors.textSecondary }}>hola@growai.com</Text>
                <Text style={{ color: colors.textSecondary }}>Ciudad del Conocimiento</Text>
              </div>
            </Col>
          </Row>
          <div style={{ height: 2, background: colors.bgBase, borderRadius: 2, marginTop: 80, marginBottom: 40 }} />
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textTertiary }}>
              © 2026 Grow AI. Todos los derechos reservados.
            </Text>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
