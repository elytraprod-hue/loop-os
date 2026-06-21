// src/modules/analytics/AnalyticsPage.tsx
import { TrendingUp, Users, DollarSign, Film } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useWorkspaceQuery, useClientsQuery, useProjectsQuery, useTransactionsQuery } from '../../hooks/useDbQuery';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // Prepare data for charts
  const projectStatusData = [
    { name: 'Briefing', value: projects?.filter(p => p.status === 'briefing').length || 0 },
    { name: 'Pré-Produção', value: projects?.filter(p => p.status === 'pre_production').length || 0 },
    { name: 'Produção', value: projects?.filter(p => p.status === 'production').length || 0 },
    { name: 'Pós-Produção', value: projects?.filter(p => p.status === 'post_production').length || 0 },
    { name: 'Revisão', value: projects?.filter(p => p.status === 'review').length || 0 },
    { name: 'Entregue', value: projects?.filter(p => p.status === 'delivered').length || 0 },
  ];

  const clientStatusData = [
    { name: 'Ativos', value: clients?.filter(c => c.status === 'active').length || 0 },
    { name: 'Inativos', value: clients?.filter(c => c.status === 'inactive').length || 0 },
    { name: 'Prospects', value: clients?.filter(c => c.status === 'prospect').length || 0 },
  ];

  // Monthly revenue/expense data
  const monthlyData = transactions?.reduce((acc: any[], t) => {
    const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short' });
    const existing = acc.find(d => d.month === month);
    if (existing) {
      if (t.type === 'income') existing.income += Number(t.amount);
      if (t.type === 'expense') existing.expense += Number(t.amount);
    } else {
      acc.push({
        month,
        income: t.type === 'income' ? Number(t.amount) : 0,
        expense: t.type === 'expense' ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#f97316', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl text-[#e8e8e8]">Análises</h1>
        <p className="text-[#aaaaaa] text-sm mt-1">Métricas e indicadores de produção</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <s.icon size={16} className="text-orange-500" />
              <span className="text-gray-400 text-xs">{s.label}</span>
            </div>
            <div className="font-display font-black text-2xl text-[#e8e8e8]">{s.value}</div>
            <div className="text-green-400 text-xs mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Project Status Pie Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-5 text-[#e8e8e8]">Status dos Projetos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                itemStyle={{ color: '#e8e8e8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Client Status Pie Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-5 text-[#e8e8e8]">Status dos Clientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clientStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                itemStyle={{ color: '#e8e8e8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue/Expense Line Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-5 text-[#e8e8e8]">Fluxo Financeiro Mensal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#aaaaaa" />
            <YAxis stroke="#aaaaaa" />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              itemStyle={{ color: '#e8e8e8' }}
            />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Receita" />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Despesas" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
