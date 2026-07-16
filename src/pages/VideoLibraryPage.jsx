import { useState, useMemo, useCallback } from 'react';
import { Typography, Row, Col, Tag, Input, Select, Space, Modal, Popconfirm, App, Pagination } from 'antd';
import {
  PlaySquareOutlined,
  SearchOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideos } from '../context/VideoContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';
import { PlantEmpty } from '../components/PlantEmpty';

const { Title, Paragraph, Text } = Typography;

export default function VideoLibraryPage() {
  const { videos, deleteVideo, updateVideo } = useVideos();
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState(null);
  const [durationFilter, setDurationFilter] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...videos];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q) || v.topic?.toLowerCase().includes(q));
    }
    if (styleFilter) result = result.filter((v) => v.style === styleFilter);
    if (durationFilter) result = result.filter((v) => v.duration === durationFilter);
    if (sortBy === 'date') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [videos, search, styleFilter, durationFilter, sortBy]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = useCallback((id) => {
    deleteVideo(id);
    message.success('Video eliminado');
    if (selectedVideo?.id === id) setSelectedVideo(null);
  }, [deleteVideo, message, selectedVideo]);

  const handleEditSave = useCallback(() => {
    if (editingTitle.trim()) {
      updateVideo(selectedVideo.id, { title: editingTitle.trim() });
      setSelectedVideo({ ...selectedVideo, title: editingTitle.trim() });
      message.success('Título actualizado');
    }
  }, [editingTitle, selectedVideo, updateVideo, message]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
        <div>
          <Title level={2} style={{ marginBottom: 4, fontWeight: 700, color: colors.text }}>
            <PlaySquareOutlined style={{ color: colors.primary, marginRight: 12 }} />
            Mis Videos
          </Title>
          <Paragraph style={{ fontSize: 16, marginBottom: 0, color: colors.textSecondary }}>
            Gestiona tu biblioteca de videos generados
          </Paragraph>
        </div>
        <NeonButton icon={<PlusOutlined />} size="large" onClick={() => navigate('/dashboard/generate')}>
          Nuevo video
        </NeonButton>
      </div>

      <GlowCard style={{ marginBottom: 32, padding: 28 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={10}>
            <Input
              prefix={<SearchOutlined style={{ color: colors.primary }} />}
              placeholder="Buscar por título o tema..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              allowClear
              style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
            />
          </Col>
          <Col xs={12} sm={5}>
            <Select
              placeholder="Estilo"
              value={styleFilter}
              onChange={(v) => { setStyleFilter(v); setPage(1); }}
              allowClear
              style={{ width: '100%' }}
              options={[
                { value: 'Formal', label: 'Formal' },
                { value: 'Divulgativo', label: 'Divulgativo' },
                { value: 'Animado', label: 'Animado' },
              ]}
            />
          </Col>
          <Col xs={12} sm={5}>
            <Select
              placeholder="Duración"
              value={durationFilter}
              onChange={(v) => { setDurationFilter(v); setPage(1); }}
              allowClear
              style={{ width: '100%' }}
              options={[
                { value: 'Corto', label: 'Corto' },
                { value: 'Medio', label: 'Medio' },
                { value: 'Largo', label: 'Largo' },
              ]}
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              options={[
                { value: 'date', label: 'Más reciente' },
                { value: 'name', label: 'Nombre' },
              ]}
            />
          </Col>
        </Row>
      </GlowCard>

      {filtered.length === 0 ? (
        <GlowCard>
          <PlantEmpty
            title={videos.length === 0 ? 'Aún no has generado videos' : 'No se encontraron resultados'}
            description={videos.length === 0 ? 'Comienza creando tu primer video con IA' : 'Intenta ajustar los filtros de búsqueda'}
            actionLabel={videos.length === 0 ? 'Crear mi primer video' : undefined}
            onAction={videos.length === 0 ? () => navigate('/dashboard/generate') : undefined}
          />
        </GlowCard>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <AnimatePresence>
              {paginated.map((v, i) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={v.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <GlowCard
                      onClick={() => setSelectedVideo(v)}
                      style={{ cursor: 'pointer', height: '100%' }}
                      hoverable
                    >
                      <div style={{
                        height: 180,
                        background: `linear-gradient(135deg, ${colors.primary}0D, ${colors.primary}1A)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <PlayCircleOutlined style={{ fontSize: 64, color: colors.primary, opacity: 0.7 }} />
                        <Tag style={{ position: 'absolute', top: 12, right: 12 }} color="success">{v.style}</Tag>
                      </div>
                      <div style={{ padding: 24 }}>
                        <Title level={5} style={{ marginBottom: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: colors.text }}>
                          {v.title}
                        </Title>
                        <Text style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: colors.textSecondary }}>
                          <CalendarOutlined /> {new Date(v.createdAt).toLocaleDateString('es-ES')}
                        </Text>
                        <div style={{ marginTop: 16 }}>
                          <Space size={8} wrap>
                            <Tag style={{ fontSize: 12 }}>{v.duration}</Tag>
                            <Tag style={{ fontSize: 12 }}>{v.language === 'es' ? 'ES' : 'EN'}</Tag>
                          </Space>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>

          {filtered.length > perPage && (
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Pagination
                current={page}
                total={filtered.length}
                pageSize={perPage}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      <Modal
        open={!!selectedVideo}
        onCancel={() => setSelectedVideo(null)}
        footer={null}
        width={720}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PlayCircleOutlined style={{ color: colors.primary }} />
            <span style={{ fontWeight: 600, color: colors.text }}>Detalle del Video</span>
          </div>
        }
      >
        {selectedVideo && (
          <div>
            {selectedVideo.slug ? (
              <video
                src={`/api/ruth/session/${selectedVideo.slug}/video`}
                controls
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: radii.lg, marginBottom: 24 }}
              />
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: `linear-gradient(135deg, ${colors.primary}0D, ${colors.primary}1A)`,
                borderRadius: radii.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: shadows.clayInset,
              }}>
                <PlayCircleOutlined style={{ fontSize: 80, color: colors.primary }} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                style={{ fontWeight: 600, borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
              />
              <NeonButton variant="ghost" icon={<EditOutlined />} onClick={handleEditSave}>Guardar</NeonButton>
            </div>

            <Space style={{ marginBottom: 24 }} wrap>
              <Tag color="success">{selectedVideo.style}</Tag>
              <Tag>{selectedVideo.duration}</Tag>
              <Tag>{selectedVideo.language === 'es' ? 'Español' : 'English'}</Tag>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                <CalendarOutlined /> {new Date(selectedVideo.createdAt).toLocaleDateString('es-ES')}
              </Text>
            </Space>

            <Paragraph style={{ fontSize: 15, lineHeight: 1.7, color: colors.textSecondary }}>{selectedVideo.topic}</Paragraph>

            <Space style={{ marginTop: 24 }}>
              {selectedVideo.slug && (
                <NeonButton variant="ghost" icon={<DownloadOutlined />} onClick={() => window.open(`/api/ruth/session/${selectedVideo.slug}/video`, '_blank')}>
                  Descargar
                </NeonButton>
              )}
              <Popconfirm
                title="¿Eliminar este video?"
                description="Esta acción no se puede deshacer"
                onConfirm={() => handleDelete(selectedVideo.id)}
                okText="Eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <NeonButton variant="ghost" danger icon={<DeleteOutlined />}>Eliminar</NeonButton>
              </Popconfirm>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
}
