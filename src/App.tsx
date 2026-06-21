import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './modules/auth/AuthProvider';
import { AppShell } from './components/Layout/AppShell';
import { ProtectedRoute } from './components/system/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AuthCallback } from './modules/auth/AuthCallback';

const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./modules/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const CRMPage = lazy(() => import('./modules/crm/CRMPage').then(m => ({ default: m.CRMPage })));
const ClientDetailPage = lazy(() => import('./modules/crm/ClientDetailPage').then(m => ({ default: m.ClientDetailPage })));
const ProjectsPage = lazy(() => import('./modules/projects/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./modules/projects/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const DocumentsPage = lazy(() => import('./modules/documents/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const VideoReviewPage = lazy(() => import('./modules/video-review/VideoReviewPage').then(m => ({ default: m.VideoReviewPage })));
const VideoPlayerPage = lazy(() => import('./modules/video-review/VideoPlayerPage').then(m => ({ default: m.VideoPlayerPage })));
const PublicReviewPage = lazy(() => import('./modules/video-review/PublicReviewPage').then(m => ({ default: m.PublicReviewPage })));
const FinancePage = lazy(() => import('./modules/finance/FinancePage').then(m => ({ default: m.FinancePage })));
const AIToolsPage = lazy(() => import('./modules/ai-tools/AIToolsPage').then(m => ({ default: m.AIToolsPage })));
const AnalyticsPage = lazy(() => import('./modules/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AdminPage = lazy(() => import('./modules/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const NotificationCenter = lazy(() => import('./modules/notifications/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));

const queryClient = new QueryClient();

function SuspenseFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<LandingPage />} />
            <Route path="/register" element={<Suspense fallback={<SuspenseFallback />}><RegisterPage /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<SuspenseFallback />}><ForgotPasswordPage /></Suspense>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/review/:publicToken" element={<Suspense fallback={<SuspenseFallback />}><PublicReviewPage /></Suspense>} />
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Suspense fallback={<SuspenseFallback />}>
                      <Routes>
                        <Route path="dashboard" element={<CRMPage />} />
                        <Route path="crm" element={<CRMPage />} />
                        <Route path="crm/:clientId" element={<ClientDetailPage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                        <Route path="documents" element={<DocumentsPage />} />
                        <Route path="video-review" element={<VideoReviewPage />} />
                        <Route path="video-review/:deliverableId" element={<VideoPlayerPage />} />
                        <Route path="finance" element={<FinancePage />} />
                        <Route path="ai-tools" element={<AIToolsPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="admin" element={<AdminPage />} />
                      </Routes>
                      <NotificationCenter />
                      <CommandPalette />
                    </Suspense>
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
