import { Typography, Row, Col } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  AimOutlined,
  GlobalOutlined,
  TrophyOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { GlowCard } from '../components/GlowCard';

const { Title, Paragraph } = Typography;

const features = [
  { icon: <RobotOutlined style={{ fontSize: 56 }} />, title: 'IA Personalizada', desc: 'Nuestro motor de inteligencia artificial analiza tu estilo de aprendizaje y crea rutas personalizadas que se adaptan a tu ritmo, preferencias y objetivos.' },
  { icon: <ThunderboltOutlined style={{ fontSize: 56 }} />, title: 'Progreso en Tiempo Real', desc: 'Visualiza tu avance al instante con dashboards interactivos. Métricas de rendimiento, tiempo de estudio y logros desbloqueados.' },
  { icon: <AimOutlined style={{ fontSize: 56 }} />, title: 'Objetivos Inteligentes', desc: 'El sistema define metas alcanzables basadas en tu historial y las ajusta dinámicamente según tu rendimiento.' },
  { icon: <GlobalOutlined style={{ fontSize: 56 }} />, title: 'Comunidad Global', desc: 'Conecta con más de 15.000 estudiantes en 45 países. Comparte conocimientos y construye tu red profesional.' },
  { icon: <TrophyOutlined style={{ fontSize: 56 }} />, title: 'Certificaciones Reconocidas', desc: 'Obtén certificados digitales verificables al completar cursos. Reconocidos por empresas líderes en tecnología.' },
  { icon: <CustomerServiceOutlined style={{ fontSize: 56 }} />, title: 'Soporte 24/7', desc: 'Nuestro equipo y asistente de IA están disponibles las 24 horas para resolver cualquier duda.' },
  { icon: <SafetyOutlined style={{ fontSize: 56 }} />, title: 'Seguridad y Privacidad', desc: 'Tus datos están protegidos con encriptación de grado bancario. Cumplimos con GDPR.' },
  { icon: <MobileOutlined style={{ fontSize: 56 }} />, title: 'Multiplataforma', desc: 'Aprende desde cualquier dispositivo. Tu progreso se sincroniza automáticamente.' },
];

export default function FeaturesPage() {
  const { tokens } = useTheme();
  const { colors } = tokens;

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: colors.text }}>
        <ThunderboltOutlined style={{ color: colors.primary, marginRight: 12 }} />
        Características de la Plataforma
      </Title>
      <Paragraph style={{ marginBottom: 56, fontSize: 16, color: colors.textSecondary }}>
        Descubre todo lo que Grow AI tiene para ofrecerte
      </Paragraph>

      <Row gutter={[32, 32]}>
        {features.map((f, i) => (
          <Col xs={24} md={12} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlowCard style={{ height: '100%', padding: 48 }}>
                <div style={{ color: colors.primary, marginBottom: 24 }}>
                  {f.icon}
                </div>
                <Title level={3} style={{ marginBottom: 20, fontWeight: 600, color: colors.text }}>{f.title}</Title>
                <Paragraph style={{ lineHeight: 1.8, marginBottom: 0, fontSize: 15, color: colors.textSecondary }}>
                  {f.desc}
                </Paragraph>
              </GlowCard>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
