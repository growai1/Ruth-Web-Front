import { useState, useCallback, useRef } from 'react';
import { Form, Input, Select, Typography, Space, Tag, App, Row, Col, List, Upload } from 'antd';
import { VideoCameraOutlined, ClearOutlined, DownloadOutlined, ShareAltOutlined, PlayCircleOutlined, InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { AnimatedBorder } from '../components/AnimatedBorder';
import { createSession, uploadFile, startGeneration, pollProgress, getVideoUrl } from '../utils/ruthApi';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const STAGE_LABELS = {
  analysis: 'Analizando contenido',
  design: 'Diseñando estructura',
  script: 'Generando guión',
  coding: 'Programando elementos',
  assembling: 'Ensamblando video',
  done: 'Completado',
};

export default function VideoGenerationPage() {
  const [form] = Form.useForm();
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const { addVideo, getRecentVideos } = useVideos();
  const { user: _user } = useAuth();
  const { message } = App.useApp();
  const pollRef = useRef(null);

  const [session, setSession] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(null);

  const recentVideos = getRecentVideos(3);

  const handleCreateSession = useCallback(async (topic) => {
    try {
      const data = await createSession(topic);
      setSession(data);
      setStatus('created');
      return data.slug;
    } catch {
      message.error('Error al crear sesión');
      return null;
    }
  }, [message]);

  const handleUploadFiles = useCallback(async (slug) => {
    for (const f of files) {
      try {
        await uploadFile(slug, f);
      } catch {
        message.error(`Error al subir ${f.name}`);
        return false;
      }
    }
    return true;
  }, [files, message]);

  const handleStart = useCallback(async (slug) => {
    try {
      await startGeneration(slug);
      setStatus('processing');
      setProgress({ progress_percent: 0, current_stage: 'analysis' });

      pollRef.current = pollProgress(slug, (data) => {
        setProgress(data);
        if (data.status === 'done') {
          setStatus('done');
          addVideo({
            title: form.getFieldValue('topic').substring(0, 50),
            topic: form.getFieldValue('topic'),
            style: form.getFieldValue('style'),
            duration: form.getFieldValue('duration'),
            language: form.getFieldValue('language'),
            slug: data.slug,
          });
          message.success('Video generado exitosamente');
        } else if (data.status === 'failed' || data.status === 'needs_human_review') {
          setStatus('failed');
          message.error('La generación falló');
        }
      });
    } catch {
      setStatus('failed');
      message.error('Error al iniciar generación');
    }
  }, [addVideo, form, message]);

  const handleGenerate = useCallback(async (values) => {
    setStatus('starting');
    setProgress(null);

    const slug = await handleCreateSession(values.topic);
    if (!slug) {
      setStatus('idle');
      return;
    }

    const uploaded = await handleUploadFiles(slug);
    if (!uploaded) {
      setStatus('idle');
      return;
    }

    await handleStart(slug);
  }, [handleCreateSession, handleUploadFiles, handleStart]);

  const handleFileChange = useCallback(({ fileList }) => {
    setFiles(fileList.map((f) => f.originFileObj || f).filter(Boolean));
  }, []);

  const handleDownload = useCallback(() => {
    if (!session?.slug) return;
    window.open(getVideoUrl(session.slug), '_blank');
  }, [session]);

  const handleShare = useCallback(() => {
    if (session?.slug) {
      navigator.clipboard?.writeText(`${window.location.origin}/api/ruth/session/${session.slug}/video`);
      message.success('Enlace copiado al portapapeles');
    }
  }, [session, message]);

  const isProcessing = status === 'starting' || status === 'processing';
  const isDone = status === 'done';

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: colors.text }}>
        <VideoCameraOutlined style={{ color: colors.primary, marginRight: 12 }} />
        Generar Video con IA
      </Title>
      <Paragraph style={{ marginBottom: 48, fontSize: 16, color: colors.textSecondary }}>
        Sube un archivo o describe tu tema y deja que la IA cree un video educativo
      </Paragraph>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <GlowCard style={{ padding: 40 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerate}
              initialValues={{ style: 'Divulgativo', duration: 'Medio', language: 'es' }}
              disabled={isProcessing}
            >
              <Form.Item label={<Text strong style={{ color: colors.text }}>Subir archivos (opcional)</Text>}>
                <Dragger
                  name="file"
                  multiple
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  accept=".txt,.pdf,.ppt,.pptx,.doc,.docx,.mp4,.mp3,.png,.jpg"
                  showUploadList
                  style={{
                    padding: 40,
                    borderRadius: radii.lg,
                    background: colors.bgBase,
                    boxShadow: shadows.clayInset,
                    border: 'none',
                  }}
                >
                  <p style={{ marginBottom: 16 }}>
                    <InboxOutlined style={{ fontSize: 48, color: colors.primary }} />
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>
                    Haz clic o arrastra archivos aquí
                  </p>
                  <p style={{ fontSize: 14, color: colors.textSecondary }}>
                    PDF, DOC, PPT, TXT, imágenes o vídeo
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item
                name="topic"
                label={<Text strong style={{ color: colors.text }}>Tema o guión del video</Text>}
                rules={[{ required: true, message: 'Ingresa un tema para el video' }]}
              >
                <TextArea
                  rows={5}
                  maxLength={2000}
                  showCount
                  placeholder="Ej: ¿Qué es una derivada? Explicación visual con ejemplos..."
                  style={{
                    borderRadius: radii.md,
                    background: colors.bgBase,
                    boxShadow: shadows.clayInsetSm,
                    border: 'none',
                  }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item name="style" label={<Text strong style={{ color: colors.text }}>Estilo</Text>} rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'Formal', label: 'Formal' },
                      { value: 'Divulgativo', label: 'Divulgativo' },
                      { value: 'Animado', label: 'Animado' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="duration" label={<Text strong style={{ color: colors.text }}>Duración</Text>} rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'Corto', label: 'Corto (~2 min)' },
                      { value: 'Medio', label: 'Medio (~5 min)' },
                      { value: 'Largo', label: 'Largo (~10 min)' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="language" label={<Text strong style={{ color: colors.text }}>Idioma</Text>} rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'Inglés' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>

              <Space size={16}>
                <NeonButton
                  htmlType="submit"
                  loading={isProcessing}
                  icon={<VideoCameraOutlined />}
                  size="large"
                >
                  Generar video
                </NeonButton>
                <NeonButton
                  variant="ghost"
                  icon={<ClearOutlined />}
                  size="large"
                  disabled={isProcessing}
                  onClick={() => {
                    form.resetFields();
                    setFiles([]);
                    setSession(null);
                    setStatus('idle');
                    setProgress(null);
                  }}
                >
                  Limpiar
                </NeonButton>
              </Space>
            </Form>
          </GlowCard>
        </Col>

        <Col xs={24} lg={12}>
          <AnimatedBorder active={isProcessing}>
            <div style={{
              minHeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              background: colors.bgSurface,
              borderRadius: radii.xl,
            }}>
              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    <div style={{
                      width: 80, height: 80, margin: '0 auto 32px',
                      borderRadius: '50%',
                      background: colors.bgBase,
                      boxShadow: shadows.clayInset,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LoadingOutlined style={{ fontSize: 36, color: colors.primary }} spin />
                    </div>
                    <Title level={3} style={{ marginBottom: 8, fontWeight: 700, color: colors.primary }}>
                      Tu video está brotando...
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 32 }}>
                      {progress ? STAGE_LABELS[progress.current_stage] || 'Procesando...' : 'Preparando...'}
                    </Paragraph>

                    {progress && (
                      <div style={{ maxWidth: 400, margin: '0 auto' }}>
                        <div style={{
                          background: colors.bgBase,
                          borderRadius: radii.sm,
                          boxShadow: shadows.clayInsetSm,
                          overflow: 'hidden',
                          height: 12,
                        }}>
                          <div style={{
                            width: `${progress.progress_percent || 0}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryHover})`,
                            borderRadius: radii.sm,
                            boxShadow: `0 0 10px ${colors.primary}33`,
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <Text style={{ fontSize: 14, color: colors.textTertiary, marginTop: 8, display: 'block' }}>
                          {progress.progress_percent || 0}% — {STAGE_LABELS[progress.current_stage] || progress.current_stage}
                        </Text>
                      </div>
                    )}
                  </motion.div>
                )}

                {isDone && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    <div style={{
                      width: 100, height: 100, margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
                      boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircleOutlined style={{ fontSize: 56, color: '#fff' }} />
                    </div>
                    <Title level={3} style={{ marginBottom: 8, fontWeight: 700, color: colors.text }}>
                      ¡Video listo!
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 32 }}>
                      Tu video ha sido generado exitosamente
                    </Paragraph>
                    <div style={{
                      width: '100%', aspectRatio: '16/9',
                      background: colors.bgBase,
                      borderRadius: radii.lg,
                      boxShadow: shadows.clayInset,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 24,
                    }}>
                      <video
                        src={getVideoUrl(session.slug)}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: radii.lg }}
                      />
                    </div>
                    <Space wrap>
                      <NeonButton variant="ghost" icon={<DownloadOutlined />} onClick={handleDownload}>Descargar</NeonButton>
                      <NeonButton variant="ghost" icon={<ShareAltOutlined />} onClick={handleShare}>Compartir</NeonButton>
                    </Space>
                  </motion.div>
                )}

                {status === 'failed' && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{
                      width: 80, height: 80, margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: colors.bgBase,
                      boxShadow: shadows.clayInset,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CloseCircleOutlined style={{ fontSize: 40, color: colors.error }} />
                    </div>
                    <Title level={3} style={{ marginBottom: 8, fontWeight: 700, color: colors.error }}>
                      Generación fallida
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: colors.textSecondary }}>
                      Ocurrió un error. Intenta de nuevo.
                    </Paragraph>
                  </motion.div>
                )}

                {!isProcessing && !isDone && status !== 'failed' && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center' }}
                  >
                    <VideoCameraOutlined style={{ fontSize: 80, opacity: 0.3, color: colors.primary }} />
                    <Title level={3} style={{ marginTop: 24, opacity: 0.5, fontWeight: 600, color: colors.textTertiary }}>
                      Vista previa del video
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: colors.textTertiary }}>
                      Completa el formulario y genera tu primer video
                    </Paragraph>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedBorder>
        </Col>
      </Row>

      {recentVideos.length > 0 && (
        <GlowCard style={{ marginTop: 40, padding: 40 }}>
          <Title level={4} style={{ marginBottom: 24, fontWeight: 600, color: colors.text }}>
            Últimos videos generados
          </Title>
          <List
            dataSource={recentVideos}
            renderItem={(v) => (
              <List.Item
                style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}
              >
                <List.Item.Meta
                  avatar={<PlayCircleOutlined style={{ fontSize: 36, color: colors.primary }} />}
                  title={<Text strong style={{ color: colors.text }}>{v.title}</Text>}
                  description={
                    <Space>
                      <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                        {new Date(v.createdAt).toLocaleDateString('es-ES')}
                      </Text>
                      {v.slug && (
                        <Tag color="success">{v.slug}</Tag>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </GlowCard>
      )}
    </div>
  );
}
