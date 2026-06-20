// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './modules/auth/AuthProvider';
import { AppShell } from './components/Layout/AppShell';
import { ProtectedRoute } from './components/system/ProtectedRoute';
import { LoginPage } from './modules/auth/LoginPage';
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
      <AuthProvider>
        <AppShell>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/review/:publicToken" element={<PublicReviewPage />} />

            <Route path="/" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
            <Route path="/crm/:clientId" element={<ProtectedRoute><ClientDetailPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
            <Route path="/video-review" element={<ProtectedRoute><VideoReviewPage /></ProtectedRoute>} />
            <Route path="/video-review/:deliverableId" element={<ProtectedRoute><VideoPlayerPage /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
            <Route path="/ai-tools" element={<ProtectedRoute><AIToolsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>

          <NotificationCenter />
          <CommandPalette />
          <Toaster position="top-right" richColors />
        </AppShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
