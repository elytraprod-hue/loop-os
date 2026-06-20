// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './modules/auth/AuthProvider';
import { AppShell } from './components/Layout/AppShell';
import { ProtectedRoute } from './components/system/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './modules/auth/SignUpPage';
import { ForgotPasswordPage } from './modules/auth/ForgotPasswordPage';
import { CRMPage } from './modules/crm/CRMPage';
import { ClientDetailPage } from './modules/crm/ClientDetailPage';
import { ProjectsPage } from './modules/projects/ProjectsPage';
import { ProjectDetailPage } from './modules/projects/ProjectDetailPage';
import { DocumentsPage } from './modules/documents/DocumentsPage';
import { VideoReviewPage } from './modules/video-review/VideoReviewPage';
import { VideoPlayerPage } from './modules/video-review/VideoPlayerPage';
import { PublicReviewPage } from './modules/video-review/PublicReviewPage';
import { FinancePage } from './modules/finance/FinancePage';
import { AIToolsPage } from './modules/ai-tools/AIToolsPage';
import { AnalyticsPage } from './modules/analytics/AnalyticsPage';
import { AdminPage } from './modules/admin/AdminPage';
import { NotificationCenter } from './modules/notifications/NotificationCenter';
import { CommandPalette } from './components/CommandPalette';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/review/:publicToken" element={<PublicReviewPage />} />
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppShell>
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
