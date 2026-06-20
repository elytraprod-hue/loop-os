import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { useClientQuery, useWorkspaceQuery, useProjectsQuery } from '../../hooks/useDbQuery';

export const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const { data: client, isLoading: clientLoading, error: clientError, refetch: refetchClient } = useClientQuery(clientId);
  const { data: workspace } = useWorkspaceQuery();
  const { data: projects, isLoading: projectsLoading } = useProjectsQuery(workspace?.id);

  const clientProjects = (projects ?? []).filter(p => p.client_id === clientId);

  if (clientLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="animate-fadeUp">
        <Link to="/app/crm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <ErrorState description="Não foi possível carregar os dados do cliente." onRetry={() => refetchClient()} />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <Link to="/app/crm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="page-hero">
        <h1>{client.name}</h1>
        <p>Detalhes do cliente</p>
      </div>

      <div className="glass" style={{ padding: 32, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
            <p style={{ fontSize: 14 }}>{client.email || '—'}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empresa</p>
            <p style={{ fontSize: 14 }}>{client.company || '—'}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
            <span className={`badge ${client.status === 'active' ? 'badge-success' : client.status === 'prospect' ? 'badge-info' : 'badge-neutral'}`}>
              {client.status}
            </span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Projetos</h2>

      {projectsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <LoadingSpinner />
        </div>
      ) : clientProjects.length === 0 ? (
        <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
            <Briefcase size={24} />
            <p>Nenhum projeto para este cliente.</p>
          </div>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Título</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clientProjects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{p.type}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${p.status === 'active' || p.status === 'in_progress' ? 'badge-success' : p.status === 'completed' ? 'badge-info' : 'badge-neutral'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
