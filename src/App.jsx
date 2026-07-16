import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { VideoProvider } from './context/VideoContext';
import { getAntdTheme } from './theme/config';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import VideoGenerationPage from './pages/VideoGenerationPage';
import VideoLibraryPage from './pages/VideoLibraryPage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function ThemedApp() {
  const { mode } = useTheme();

  return (
    <ConfigProvider theme={getAntdTheme(mode)}>
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<VideoGenerationPage />} />
              <Route path="generate" element={<VideoGenerationPage />} />
              <Route path="videos" element={<VideoLibraryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="features" element={<FeaturesPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VideoProvider>
          <ThemedApp />
        </VideoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
