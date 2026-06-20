// src/modules/analytics/AnalyticsPage.tsx
import { BarChart3, TrendingUp, Users, DollarSign, Film } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Clientes Ativos', value: '12', change: '+2' },
  { icon: Film, label: 'Projetos no Mês', value: '8', change: '+3' },
  { icon: DollarSign, label: 'Receita Mensal', value: 'R$ 47.500', change: '+12%' },
  { icon: TrendingUp, label: 'Taxa de Conversão', value: '68%', change: '+5%' },
];

export const AnalyticsPage = () => {
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
            <div style={{ color: 'var(--success)', fontSize: 12, marginTop: 4 }}>{s.change} este mês</div>
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
