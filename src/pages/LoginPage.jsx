import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Typography, Checkbox, App } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Fireflies } from '../components/Fireflies';
import { NeonButton } from '../components/NeonButton';

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = useCallback(async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success({ content: 'Bienvenido de vuelta', key: 'login' });
      navigate('/dashboard');
    } catch (err) {
      message.error({ content: err.message, key: 'login-error' });
    } finally {
      setLoading(false);
    }
  }, [login, message, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Fireflies count={40} />

      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        top: '20%', left: '10%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
        filter: 'blur(60px)',
        pointerEvents: 'none',
        opacity: 0.4,
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 2 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: radii.md,
                background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 24,
                boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
              }}>
                G
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700, color: colors.text }}>Grow AI</Title>
            </div>
          </Link>
        </div>

        <div style={{
          background: colors.bgSurface,
          borderRadius: radii.xxl,
          boxShadow: shadows.clay,
          padding: 56,
        }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 12, fontWeight: 700, color: colors.text }}>
            Bienvenido de vuelta
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 48, color: colors.textSecondary }}>
            Ingresa a tu jardín de conocimiento
          </Paragraph>

          <Form form={form} layout="vertical" onFinish={onFinish} size="large" autoComplete="off" validateTrigger="onChange">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Ingresa tu email' },
                { type: 'email', message: 'Email no válido' },
              ]}
              hasFeedback
            >
              <Input
                prefix={<MailOutlined style={{ color: colors.primary }} />}
                placeholder="Email"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
                suffix={form.getFieldValue('email') && form.isFieldTouched('email') && !form.getFieldError('email').length ? <CheckCircleFilled style={{ color: colors.primary }} /> : null}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Ingresa tu contraseña' }]} hasFeedback>
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.primary }} />}
                placeholder="Contraseña"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Checkbox style={{ color: colors.textSecondary }}>Recordarme</Checkbox>
                <a href="#" style={{ fontSize: 14, color: colors.primary }}>¿Olvidaste tu contraseña?</a>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <NeonButton htmlType="submit" loading={loading} block style={{ height: 52, fontSize: 16 }}>
                Acceder
              </NeonButton>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Text style={{ color: colors.textSecondary }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ fontWeight: 600, color: colors.primary }}>Regístrate</Link>
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
