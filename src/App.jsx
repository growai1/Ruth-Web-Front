import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { VideoProvider } from './context/VideoContext';
import { getAntdTheme } from './theme/config';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import VideoGenerationPage from './pages/VideoGenerationPage';
import VideoLibraryPage from './pages/VideoLibraryPage';
import CoursesPage from './pages/CoursesPage';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';

function ThemedApp() {
  const { mode } = useTheme();

  return (
    <ConfigProvider theme={getAntdTheme(mode)}>
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<VideoGenerationPage />} />
              <Route path="generate" element={<VideoGenerationPage />} />
              <Route path="videos" element={<VideoLibraryPage />} />
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
