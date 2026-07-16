import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Typography, Checkbox, App, Progress } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Fireflies } from '../components/Fireflies';
import { NeonButton } from '../components/NeonButton';

const { Title, Paragraph, Text } = Typography;

function PasswordStrength({ password }) {
  const { tokens } = useTheme();
  const { colors } = tokens;

  const checks = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }), [password]);

  const score = Object.values(checks).filter(Boolean).length;
  const percent = (score / 4) * 100;

  const getColor = () => {
    if (score <= 1) return colors.error;
    if (score <= 2) return colors.warning;
    if (score <= 3) return colors.info;
    return colors.primary;
  };

  if (!password) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <Progress percent={percent} showInfo={false} strokeColor={getColor()} trailColor={colors.bgElevated} size={['100%', 6]} style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { ok: checks.length, label: 'Mínimo 8 caracteres' },
          { ok: checks.upper, label: 'Una letra mayúscula' },
          { ok: checks.number, label: 'Un número' },
          { ok: checks.special, label: 'Un carácter especial (!@#$%^&*)' },
        ].map((c) => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {c.ok ? <CheckCircleFilled style={{ color: colors.primary }} /> : <CloseCircleFilled style={{ color: colors.textTertiary }} />}
            <Text style={{ fontSize: 12, color: c.ok ? colors.primary : colors.textTertiary }}>{c.label}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const { register } = useAuth();
  const { tokens } = useTheme();
  const { colors, shadows, radii } = tokens;
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = useCallback(async (values) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      message.success({ content: 'Cuenta creada exitosamente', key: 'register' });
      navigate('/dashboard');
    } catch (err) {
      message.error({ content: err.message, key: 'register-error' });
    } finally {
      setLoading(false);
    }
  }, [register, message, navigate]);

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
        top: '20%', right: '10%',
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
            Crear cuenta
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 48, color: colors.textSecondary }}>
            Comienza a cultivar tu conocimiento
          </Paragraph>

          <Form form={form} layout="vertical" onFinish={onFinish} size="large" autoComplete="off" validateTrigger="onChange">
            <Form.Item name="name" rules={[{ required: true, message: 'Ingresa tu nombre completo' }]} hasFeedback>
              <Input
                prefix={<UserOutlined style={{ color: colors.primary }} />}
                placeholder="Nombre completo"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
              />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, message: 'Ingresa tu email' }, { type: 'email', message: 'Email no válido' }]} hasFeedback>
              <Input
                prefix={<MailOutlined style={{ color: colors.primary }} />}
                placeholder="Email"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Ingresa una contraseña' },
                { min: 8, message: 'Mínimo 8 caracteres' },
                { pattern: /^(?=.*[A-Z])/, message: 'Debe contener una mayúscula' },
                { pattern: /^(?=.*\d)/, message: 'Debe contener un número' },
                { pattern: /^(?=.*[!@#$%^&*])/, message: 'Debe contener un carácter especial' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.primary }} />}
                placeholder="Contraseña"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <PasswordStrength password={password} />

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              style={{ marginTop: 24 }}
              rules={[
                { required: true, message: 'Confirma tu contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.primary }} />}
                placeholder="Confirmar contraseña"
                style={{ borderRadius: radii.md, background: colors.bgBase, boxShadow: shadows.clayInsetSm, border: 'none' }}
              />
            </Form.Item>

            <Form.Item name="terms" valuePropName="checked" rules={[{ required: true, message: 'Debes aceptar los términos' }]}>
              <Checkbox>
                <Text style={{ color: colors.textSecondary }}>
                  Acepto los <a href="#" style={{ color: colors.primary }}>términos y condiciones</a>
                </Text>
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <NeonButton htmlType="submit" loading={loading} block style={{ height: 52, fontSize: 16 }}>
                Crear cuenta
              </NeonButton>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Text style={{ color: colors.textSecondary }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: colors.primary }}>Acceder</Link>
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
