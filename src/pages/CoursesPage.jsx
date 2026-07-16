import { Typography, Row, Col, Tag, Rate, Space, App } from 'antd';
import { BookOutlined, ClockCircleOutlined, ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';

const { Title, Paragraph, Text } = Typography;

const courses = [
  { id: 1, title: 'Introducción a Python', desc: 'Aprende los fundamentos de Python desde cero.', level: 'Principiante', duration: '4h', rating: 4.8, students: 2340, topics: ['Variables', 'Funciones', 'Estructuras de datos'] },
  { id: 2, title: 'Machine Learning Básico', desc: 'Comprende los conceptos clave del ML.', level: 'Intermedio', duration: '8h', rating: 4.9, students: 1850, topics: ['Regresión', 'Clasificación', 'Clustering'] },
  { id: 3, title: 'Diseño UX/UI', desc: 'Diseña interfaces centradas en el usuario.', level: 'Principiante', duration: '6h', rating: 4.7, students: 1620, topics: ['Wireframes', 'Prototipos', 'User Research'] },
  { id: 4, title: 'Desarrollo Web Full Stack', desc: 'Construye aplicaciones web completas.', level: 'Avanzado', duration: '12h', rating: 4.9, students: 3100, topics: ['HTML/CSS', 'React', 'Node.js'] },
  { id: 5, title: 'Data Science con R', desc: 'Análisis de datos y visualización.', level: 'Intermedio', duration: '7h', rating: 4.6, students: 980, topics: ['dplyr', 'ggplot2', 'Shiny'] },
  { id: 6, title: 'Inteligencia Artificial', desc: 'Explora el mundo de la IA moderna.', level: 'Avanzado', duration: '10h', rating: 4.8, students: 2200, topics: ['Redes Neuronales', 'NLP', 'Computer Vision'] },
];

const levelColors = { Principiante: 'success', Intermedio: 'info', Avanzado: 'warning' };

export default function CoursesPage() {
  const { message } = App.useApp();
  const { tokens } = useTheme();
  const { colors, shadows } = tokens;

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: colors.text }}>
        <BookOutlined style={{ color: colors.primary, marginRight: 12 }} />
        Cursos Disponibles
      </Title>
      <Paragraph style={{ marginBottom: 48, fontSize: 16, color: colors.textSecondary }}>
        Explora nuestro catálogo de cursos potenciados por IA
      </Paragraph>

      <Row gutter={[32, 32]}>
        {courses.map((c, i) => (
          <Col xs={24} sm={12} lg={8} key={c.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlowCard style={{ height: '100%', overflow: 'hidden' }}>
                <div style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${colors.primary}1A, ${colors.primary}33)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <PlayCircleOutlined style={{ fontSize: 72, color: colors.primary, opacity: 0.7 }} />
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0, fontWeight: 600, color: colors.text }}>{c.title}</Title>
                    <Tag color={levelColors[c.level]}>{c.level}</Tag>
                  </div>
                  <Paragraph style={{ fontSize: 14, marginBottom: 20, lineHeight: 1.7, color: colors.textSecondary }}>
                    {c.desc}
                  </Paragraph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {c.topics.map((t) => (
                      <Tag key={t} style={{ fontSize: 12, background: colors.bgElevated, boxShadow: `${shadows.claySm.split(',')[0]}`, color: colors.text }}>{t}</Tag>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Space size={8}>
                      <Rate disabled defaultValue={c.rating} allowHalf style={{ fontSize: 14 }} />
                      <Text style={{ fontSize: 13, color: colors.primary }}>{c.rating}</Text>
                    </Space>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                      <ClockCircleOutlined /> {c.duration}
                    </Text>
                  </div>
                  <NeonButton block icon={<ArrowRightOutlined />} onClick={() => message.info('Inscripción simulada exitosa')}>
                    Inscribirse
                  </NeonButton>
                </div>
              </GlowCard>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
