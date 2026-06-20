import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Mail, Phone, Building, Shield, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { useClientQuery, useWorkspaceQuery, useProjectsQuery, useTransactionsQuery } from '../../hooks/useDbQuery';

export const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const { data: client, isLoading: clientLoading, error: clientError, refetch: refetchClient } = useClientQuery(clientId);
  const { data: workspace } = useWorkspaceQuery();
  const { data: projects, isLoading: projectsLoading } = useProjectsQuery(workspace?.id);
  const { data: transactions } = useTransactionsQuery(workspace?.id);

  const clientProjects = (projects ?? []).filter(p => p.client_id === clientId);
  const activeProjectsCount = clientProjects.filter(p => p.status !== 'delivered' && p.status !== 'archived').length;
  
  const clientProjectIds = clientProjects.map(p => p.id);
  const clientTransactions = (transactions ?? []).filter(t => t.project_id && clientProjectIds.includes(t.project_id));
  const totalInvoiced = clientTransactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

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

  const clientInitials = client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="animate-fadeUp">
      <Link to="/app/crm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar ao CRM
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--accent)',
          fontFamily: "'Syne', sans-serif"
        }}>
          {clientInitials}
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>{client.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {client.company ? `Empresa: ${client.company}` : 'Pessoa Física'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', marginBottom: 8, fontSize: 13 }}>
            <Briefcase size={16} color="var(--accent)" />
            <span>Projetos Totais / Ativos</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24 }}>
            {clientProjects.length} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>/ {activeProjectsCount} ativos</span>
          </div>
        </div>
        <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', marginBottom: 8, fontSize: 13 }}>
            <TrendingUp size={16} color="var(--success)" />
            <span>Faturamento Confirmado</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--success)' }}>
            R$ {totalInvoiced.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Info Sidebar */}
        <div className="glass" style={{ padding: 24, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", borderBottom: '1px solid var(--glass-border)', paddingBottom: 10, marginBottom: 4 }}>
            Dados de Contato
          </h3>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>
              <Mail size={12} /> Email
            </div>
            <p style={{ fontSize: 14, wordBreak: 'break-all' }}>{client.email || '—'}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>
              <Phone size={12} /> Telefone
            </div>
            <p style={{ fontSize: 14 }}>{client.phone || '—'}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>
              <Building size={12} /> Empresa
            </div>
            <p style={{ fontSize: 14 }}>{client.company || '—'}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>
              <Shield size={12} /> Status Comercial
            </div>
            <span className={`badge ${client.status === 'active' ? 'badge-success' : client.status === 'prospect' ? 'badge-info' : 'badge-neutral'}`}>
              {client.status === 'active' ? 'Ativo' : client.status === 'prospect' ? 'Prospect' : 'Inativo'}
            </span>
          </div>
        </div>

        {/* Projects List */}
        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", borderBottom: '1px solid var(--glass-border)', paddingBottom: 10, marginBottom: 16 }}>
            Projetos Associados
          </h3>

          {projectsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <LoadingSpinner />
            </div>
          ) : clientProjects.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-secondary)', padding: '24px 0' }}>
              <Briefcase size={24} />
              <p style={{ fontSize: 14 }}>Nenhum projeto encontrado para este cliente.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 12, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Título</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientProjects.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <Link to={`/app/projects/${p.id}`} style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>
                        {p.type.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${
                          p.status === 'delivered' ? 'badge-success' : 
                          p.status === 'archived' ? 'badge-neutral' : 
                          p.status === 'briefing' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
