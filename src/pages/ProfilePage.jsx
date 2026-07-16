import { useState, useCallback } from 'react';
import { Typography, Row, Col, Avatar, Statistic, Switch, Select, Tag, App, Modal, Input, List, Upload, Space } from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  BookOutlined,
  ClockCircleOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  LockOutlined,
  LogoutOutlined,
  CrownOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { GlowCard } from '../components/GlowCard';
import { NeonButton } from '../components/NeonButton';

const { Title, Paragraph, Text } = Typography;

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { mode, setMode, tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = useCallback(() => {
    updateUser({ name });
    setEditing(false);
    message.success('Perfil actualizado correctamente');
  }, [name, updateUser, message]);

  const handleAvatarChange = useCallback((info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateUser({ avatar: e.target.result });
        message.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(info.file.originFileObj || info.file);
    }
  }, [updateUser, message]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    message.success('Sesión cerrada');
  }, [logout, navigate, message]);

  const handleThemeChange = useCallback((checked) => {
    const newMode = checked ? 'dark' : 'light';
    setMode(newMode);
    updateUser({ theme: newMode });
  }, [setMode, updateUser]);

  const stats = user?.stats || { videosGenerated: 0, coursesCompleted: 0, learningHours: 0 };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 40, fontWeight: 700, color: colors.text }}>
        <UserOutlined style={{ color: colors.primary, marginRight: 12 }} />
        Mi Perfil
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <GlowCard style={{ textAlign: 'center', padding: 48 }}>
              <Upload showUploadList={false} customRequest={handleAvatarChange} accept="image/*">
                <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                  <Avatar
                    src={user?.avatar}
                    size={160}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: colors.primary,
                      color: '#fff',
                      fontSize: 56,
                      boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
                      border: `4px solid ${colors.bgSurface}`,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    border: `3px solid ${colors.bgSurface}`,
                    boxShadow: shadows.clayButton,
                  }}>
                    <CameraOutlined />
                  </div>
                </div>
              </Upload>

              {editing ? (
                <div style={{ marginTop: 24 }}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ textAlign: 'center', marginBottom: 16, borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
                  />
                  <Space>
                    <NeonButton icon={<SaveOutlined />} onClick={handleSave}>Guardar</NeonButton>
                    <NeonButton variant="ghost" onClick={() => { setEditing(false); setName(user.name); }}>Cancelar</NeonButton>
                  </Space>
                </div>
              ) : (
                <div style={{ marginTop: 24 }}>
                  <Title level={3} style={{ marginBottom: 8, fontWeight: 600, color: colors.text }}>{user?.name}</Title>
                  <Text style={{ fontSize: 15, color: colors.textSecondary }}>{user?.email}</Text>
                  <br />
                  <Tag color="success" style={{ marginTop: 16, fontSize: 14, padding: '6px 16px' }}>
                    <CrownOutlined /> Plan {user?.plan}
                  </Tag>
                  <br />
                  <NeonButton variant="ghost" icon={<EditOutlined />} onClick={() => setEditing(true)} style={{ marginTop: 16 }}>
                    Editar nombre
                  </NeonButton>
                </div>
              )}

              <div style={{ marginTop: 24, fontSize: 13 }}>
                <Text style={{ color: colors.textTertiary }}>
                  Miembro desde {new Date(user?.joinDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </Text>
              </div>
            </GlowCard>
          </motion.div>
        </Col>

        <Col xs={24} lg={16}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <GlowCard style={{ padding: 40 }}>
                  <Title level={4} style={{ marginBottom: 32, fontWeight: 600, color: colors.text }}>Estadísticas</Title>
                  <Row gutter={32}>
                    <Col xs={8}>
                      <Statistic
                        title="Videos Generados"
                        value={stats.videosGenerated}
                        prefix={<VideoCameraOutlined style={{ color: colors.primary }} />}
                        valueStyle={{ fontSize: 40, fontWeight: 700, color: colors.primary }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Statistic
                        title="Cursos Completados"
                        value={stats.coursesCompleted}
                        prefix={<BookOutlined style={{ color: colors.primary }} />}
                        valueStyle={{ fontSize: 40, fontWeight: 700, color: colors.primary }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Statistic
                        title="Horas de Aprendizaje"
                        value={stats.learningHours}
                        prefix={<ClockCircleOutlined style={{ color: colors.primary }} />}
                        valueStyle={{ fontSize: 40, fontWeight: 700, color: colors.primary }}
                      />
                    </Col>
                  </Row>
                </GlowCard>
              </Col>

              <Col xs={24}>
                <GlowCard style={{ padding: 40 }}>
                  <Title level={4} style={{ marginBottom: 32, fontWeight: 600, color: colors.text }}>Preferencias</Title>
                  <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} sm={12}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space size={12}>
                          {mode === 'dark' ? <MoonOutlined style={{ fontSize: 20, color: colors.primary }} /> : <SunOutlined style={{ fontSize: 20, color: colors.primary }} />}
                          <Text style={{ fontSize: 15, color: colors.text }}>Tema {mode === 'dark' ? 'Bosque Nocturno' : 'Sol'}</Text>
                        </Space>
                        <Switch checked={mode === 'dark'} onChange={handleThemeChange} checkedChildren="Oscuro" unCheckedChildren="Claro" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space size={12}>
                          <BellOutlined style={{ fontSize: 20, color: colors.primary }} />
                          <Text style={{ fontSize: 15, color: colors.text }}>Notificaciones</Text>
                        </Space>
                        <Switch
                          checked={user?.notifications}
                          onChange={(checked) => {
                            updateUser({ notifications: checked });
                            message.success(checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
                          }}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: colors.text }}>Idioma preferido</Text>
                        <Select
                          value={user?.language || 'es'}
                          onChange={(v) => { updateUser({ language: v }); message.success('Idioma actualizado'); }}
                          style={{ width: 160 }}
                          options={[
                            { value: 'es', label: 'Español' },
                            { value: 'en', label: 'English' },
                          ]}
                        />
                      </div>
                    </Col>
                  </Row>
                </GlowCard>
              </Col>

              <Col xs={24}>
                <GlowCard style={{ padding: 40 }}>
                  <Title level={4} style={{ marginBottom: 24, fontWeight: 600, color: colors.text }}>Plan Actual</Title>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                    <div>
                      <Tag color="success" style={{ fontSize: 15, padding: '8px 20px' }}>
                        <CrownOutlined /> {user?.plan}
                      </Tag>
                      <Paragraph style={{ marginTop: 16, marginBottom: 0, fontSize: 15, color: colors.textSecondary }}>
                        {user?.plan === 'Gratis' ? 'Acceso básico a la plataforma' : 'Acceso completo a todas las funcionalidades'}
                      </Paragraph>
                    </div>
                    <NeonButton icon={<CrownOutlined />} onClick={() => message.info('Funcionalidad de suscripción próximamente')}>
                      Mejorar plan
                    </NeonButton>
                  </div>
                </GlowCard>
              </Col>

              <Col xs={24}>
                <GlowCard style={{ padding: 40 }}>
                  <Title level={4} style={{ marginBottom: 24, fontWeight: 600, color: colors.text }}>Historial de Actividad</Title>
                  {user?.activity && user.activity.length > 0 ? (
                    <List
                      size="small"
                      dataSource={user.activity.slice(0, 10)}
                      renderItem={(item) => (
                        <List.Item style={{ padding: '16px 0', borderBottom: `1px solid ${colors.border}` }}>
                          <Text style={{ fontSize: 14, color: colors.text }}>{item.text}</Text>
                          <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                            {new Date(item.date).toLocaleDateString('es-ES')}
                          </Text>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text style={{ fontSize: 15, color: colors.textSecondary }}>No hay actividad reciente</Text>
                  )}
                </GlowCard>
              </Col>

              <Col xs={24}>
                <GlowCard style={{ padding: 32 }}>
                  <Space wrap size={16}>
                    <NeonButton variant="ghost" icon={<LockOutlined />} onClick={() => setShowPasswordModal(true)}>
                      Cambiar contraseña
                    </NeonButton>
                    <NeonButton variant="ghost" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                      Cerrar sesión
                    </NeonButton>
                  </Space>
                </GlowCard>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>

      <Modal
        title="Cambiar contraseña"
        open={showPasswordModal}
        onCancel={() => setShowPasswordModal(false)}
        onOk={() => { setShowPasswordModal(false); message.success('Contraseña actualizada (simulado)'); }}
        okText="Actualizar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input.Password
            placeholder="Contraseña actual"
            style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
          />
          <Input.Password
            placeholder="Nueva contraseña"
            style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
          />
          <Input.Password
            placeholder="Confirmar nueva contraseña"
            style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
          />
        </div>
      </Modal>
    </div>
  );
}
