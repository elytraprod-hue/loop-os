import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/authService';
import { useWorkspaceQuery, useCreateWorkspaceMutation } from '../../hooks/useDbQuery';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { data: workspace, isLoading: wsLoading } = useWorkspaceQuery();
  const createWorkspace = useCreateWorkspaceMutation();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user && workspace === null && !wsLoading && !creating) {
      setCreating(true);
      const name = user.email ? `${user.email.split('@')[0]}'s Workspace` : 'Meu Workspace';
      createWorkspace.mutate(
        { name, userId: user.id },
        {
          onSuccess: () => {
            toast.success('Workspace configurado com sucesso!');
            setCreating(false);
          },
          onError: (err) => {
            toast.error(`Erro ao criar workspace: ${err.message}`);
            setCreating(false);
          }
        }
      );
    }
  }, [user, workspace, wsLoading, creating, createWorkspace]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (wsLoading || (workspace === null && creating)) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', gap: 16 }}>
        <LoadingSpinner size="lg" />
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Configurando seu workspace...</p>
      </div>
    );
  }

  if (workspace === null && !creating) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', padding: 24, gap: 16, textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Nenhum Workspace Encontrado</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', maxWidth: 400, fontSize: 14 }}>
          Não conseguimos encontrar ou criar automaticamente um workspace para você. Clique abaixo para tentar novamente.
        </p>
        <button
          onClick={() => {
            setCreating(true);
            const name = user.email ? `${user.email.split('@')[0]}'s Workspace` : 'Meu Workspace';
            createWorkspace.mutate(
              { name, userId: user.id },
              {
                onSuccess: () => {
                  toast.success('Workspace criado!');
                  setCreating(false);
                },
                onError: (err) => {
                  toast.error(err.message);
                  setCreating(false);
                }
              }
            );
          }}
          className="btn btn--primary"
        >
          Criar Workspace
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
