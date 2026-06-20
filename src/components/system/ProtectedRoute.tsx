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
  const { user, isLoading, signOut } = useAuth();
  const location = useLocation();
  const { data: workspace, isLoading: wsLoading, error: wsError } = useWorkspaceQuery();
  const createWorkspace = useCreateWorkspaceMutation();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user && workspace === null && !wsLoading && !creating && !wsError) {
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
  }, [user, workspace, wsLoading, creating, createWorkspace, wsError]);

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

  if (wsError) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', padding: 24, gap: 16, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: '#ef4444' }}>Erro de Conexão com o Banco</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', maxWidth: 440, fontSize: 14, lineHeight: 1.6 }}>
          Ocorreu um erro ao carregar as informações do seu workspace. Isso geralmente acontece devido a políticas de segurança (RLS) ou credenciais pendentes. <br/>
          <strong style={{ color: '#fff', marginTop: 8, display: 'block', fontSize: 13 }}>
            Erro: {wsError instanceof Error 
              ? wsError.message 
              : (wsError && typeof wsError === 'object' && 'message' in wsError)
                ? String((wsError as any).message)
                : JSON.stringify(wsError)}
          </strong>
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button onClick={() => window.location.reload()} className="btn btn--primary" style={{ padding: '10px 20px', fontSize: 12 }}>
            Tentar Novamente
          </button>
          <button onClick={() => signOut()} className="btn btn--secondary" style={{ padding: '10px 20px', fontSize: 12 }}>
            Sair da Conta
          </button>
        </div>
      </div>
    );
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
