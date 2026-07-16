import { Typography, Row, Col, Rate, Avatar } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { GlowCard } from '../components/GlowCard';

const { Title, Paragraph, Text } = Typography;

const testimonials = [
  { name: 'María García', role: 'Estudiante de Data Science', text: 'Grow AI transformó mi forma de aprender. Los videos generados por IA son increíbles, me explican conceptos complejos de manera simple y visual.', rating: 5 },
  { name: 'Carlos López', role: 'Desarrollador Senior', text: 'La plataforma más intuitiva que he usado. El contenido se adapta perfectamente a mis necesidades y el progreso en tiempo real me motiva.', rating: 5 },
  { name: 'Ana Martínez', role: 'Docente Universitaria', text: 'Como educadora, veo cómo mis estudiantes progresan más rápido con las rutas personalizadas. La generación de videos es revolucionaria.', rating: 5 },
  { name: 'Pedro Sánchez', role: 'Emprendedor', text: 'Necesitaba aprender rápido sobre marketing digital y Grow AI me creó una ruta perfecta. Los videos son claros y concisos.', rating: 4 },
  { name: 'Laura Rodríguez', role: 'Diseñadora UX', text: 'La estética de la plataforma me encanta. Aprender se siente como estar en un jardín. Las animaciones son suaves y la experiencia es placentera.', rating: 5 },
  { name: 'Diego Fernández', role: 'Estudiante de Ingeniería', text: 'Los cursos de IA y ML son de altísima calidad. La comunidad es muy activa y las certificaciones me ayudaron a conseguir empleo.', rating: 5 },
  { name: 'Sofía Torres', role: 'Product Manager', text: 'Uso Grow AI para mantenerme actualizada. La flexibilidad de aprender a mi ritmo y la calidad del contenido son incomparables.', rating: 4 },
  { name: 'Andrés Morales', role: 'Freelancer', text: 'La mejor inversión en mi educación. Los videos generados por IA son mi recurso favorito. Puedo aprender cualquier tema en minutos.', rating: 5 },
  { name: 'Valentina Ruiz', role: 'Investigadora', text: 'La personalización es impresionante. El sistema entiende exactamente qué necesito y me ofrece contenido relevante.', rating: 5 },
];

export default function TestimonialsPage() {
  const { tokens } = useTheme();
  const { colors } = tokens;

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: colors.text }}>
        <MessageOutlined style={{ color: colors.primary, marginRight: 12 }} />
        Testimonios
      </Title>
      <Paragraph style={{ marginBottom: 56, fontSize: 16, color: colors.textSecondary }}>
        Lo que nuestra comunidad dice sobre Grow AI
      </Paragraph>

      <Row gutter={[32, 32]}>
        {testimonials.map((t, i) => (
          <Col xs={24} md={12} lg={8} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlowCard style={{ height: '100%', padding: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: colors.primary,
                      color: '#fff',
                      fontSize: 28,
                      boxShadow: `4px 4px 8px ${colors.primary}33`,
                      border: `3px solid ${colors.bgSurface}`,
                    }}
                  />
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 17, color: colors.text }}>{t.name}</Text>
                    <Text style={{ fontSize: 14, color: colors.primary }}>{t.role}</Text>
                  </div>
                </div>
                <Rate disabled defaultValue={t.rating} allowHalf style={{ marginBottom: 24, fontSize: 16 }} />
                <Paragraph style={{ lineHeight: 1.8, marginBottom: 0, fontStyle: 'italic', fontSize: 15, color: colors.textSecondary }}>
                  "{t.text}"
                </Paragraph>
              </GlowCard>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
