import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space } from 'antd';
import {
  VideoCameraOutlined,
  PlaySquareOutlined,
  BookOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/dashboard/generate', icon: <VideoCameraOutlined />, label: 'Generar Video' },
  { key: '/dashboard/videos', icon: <PlaySquareOutlined />, label: 'Mis Videos' },
  { key: '/dashboard/courses', icon: <BookOutlined />, label: 'Cursos' },
  { key: '/dashboard/features', icon: <ThunderboltOutlined />, label: 'Características' },
  { key: '/dashboard/testimonials', icon: <MessageOutlined />, label: 'Testimonios' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { mode, toggleTheme, tokens } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, shadows, radii } = tokens;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        style={{
          background: colors.bgSurface,
          boxShadow: `${shadows.claySm} 4px 0 16px ${colors.bgBase}22`,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          borderRight: 'none',
        }}
      >
        <div style={{
          padding: collapsed ? '24px 16px' : '24px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 16,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: radii.md,
            background: `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 20,
            boxShadow: `${shadows.clayButton}, ${shadows.glow}`,
            flexShrink: 0,
          }}>
            G
          </div>
          {!collapsed && (
            <Text strong style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>
              Grow AI
            </Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', background: 'transparent', marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Header
          style={{
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            height: 72,
            background: colors.bgSurface,
            boxShadow: `${shadows.claySm}`,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: colors.primary }}
          />

          <Space size={20} align="center">
            <Button
              type="text"
              icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{ fontSize: 16, color: colors.primary }}
            >
              {!collapsed && (
                <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>
                  {mode === 'dark' ? 'Modo Sol' : 'Modo Bosque'}
                </Text>
              )}
            </Button>
          </Space>
        </Header>

        <Content style={{
          margin: 32,
          minHeight: 'calc(100vh - 72px - 64px)',
        }}>
          <div className="page-transition">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
