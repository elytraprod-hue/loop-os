// src/modules/admin/AdminPage.tsx
import { Users as UsersIcon, Settings } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { useWorkspaceQuery, useWorkspaceMembersQuery } from '../../hooks/useDbQuery';

export const AdminPage = () => {
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: members, isLoading, error, refetch } = useWorkspaceMembersQuery(workspaceId);

  if (isLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeUp">
        <ErrorState description="Erro ao carregar membros" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <div className="page-hero">
        <h1>Admin</h1>
        <p>Configurações e gestão do workspace</p>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <UsersIcon size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>Membros</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(members ?? []).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Nenhum membro encontrado.</p>
          ) : (
            (members ?? []).map((m) => (
              <div key={m.id ?? m.user_id} className="glass-soft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{m.users?.email ?? 'Sem nome'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.users?.email}</div>
                </div>
                <span className={`badge ${m.role === 'owner' ? 'badge-success' : m.role === 'admin' ? 'badge-info' : 'badge-neutral'}`}>
                  {m.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Settings size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>Configurações</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Configurações do workspace em breve.</p>
      </div>
    </div>
  );
};
