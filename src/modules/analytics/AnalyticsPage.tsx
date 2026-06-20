// src/modules/analytics/AnalyticsPage.tsx
import { BarChart3, TrendingUp, Users, DollarSign, Film } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useWorkspaceQuery, useClientsQuery, useProjectsQuery, useTransactionsQuery } from '../../hooks/useDbQuery';

export const AnalyticsPage = () => {
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: clients, isLoading: loadingClients } = useClientsQuery(workspaceId);
  const { data: projects, isLoading: loadingProjects } = useProjectsQuery(workspaceId);
  const { data: transactions, isLoading: loadingTx } = useTransactionsQuery(workspaceId);

  const isLoading = loadingClients || loadingProjects || loadingTx;

  const activeClients = (clients ?? []).filter(c => c.status !== 'inactive').length;
  const totalProjects = (projects ?? []).length;
  const monthlyRevenue = (transactions ?? [])
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + Number(t.amount), 0);
  const conversionRate = activeClients > 0 ? Math.round((totalProjects / activeClients) * 100) : 0;

  if (isLoading || !workspaceId) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const stats = [
    { icon: Users, label: 'Clientes Ativos', value: String(activeClients), change: `Total: ${(clients ?? []).length}` },
    { icon: Film, label: 'Projetos no Mês', value: String(totalProjects), change: `${totalProjects} registrados` },
    { icon: DollarSign, label: 'Receita Total', value: `R$ ${monthlyRevenue.toLocaleString('pt-BR')}`, change: 'Receitas' },
    { icon: TrendingUp, label: 'Conversão', value: `${conversionRate}%`, change: 'cliente → projeto' },
  ];

  return (
    <div className="animate-fadeUp">
      <div className="page-hero">
        <h1>Análises</h1>
        <p>Métricas e indicadores de produção</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="glass" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <s.icon size={16} color="var(--accent)" />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22 }}>{s.value}</div>
            <div style={{ color: 'var(--success)', fontSize: 12, marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
        <BarChart3 size={40} color="var(--text-muted)" style={{ marginBottom: 16 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Gráficos detalhados em breve.</p>
      </div>
    </div>
  );
};
