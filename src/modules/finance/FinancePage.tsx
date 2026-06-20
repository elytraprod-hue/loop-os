// src/modules/finance/FinancePage.tsx
import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const mockTx = [
  { id: '1', description: 'Pagamento Comercial Verão', type: 'income', amount: 15000, status: 'paid' },
  { id: '2', description: 'Equipamento Câmera', type: 'expense', amount: 3200, status: 'paid' },
  { id: '3', description: 'Antecipação Documentário', type: 'income', amount: 8000, status: 'pending' },
];

export const FinancePage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const totalIncome = mockTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const totalExpense = mockTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Financeiro</h1>
          <p>Gerencie receitas e despesas</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Nova Transação
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: TrendingUp, label: 'Receita', value: totalIncome, color: 'var(--success)' },
          { icon: TrendingDown, label: 'Despesas', value: totalExpense, color: 'var(--danger)' },
          { icon: PiggyBank, label: 'Lucro', value: totalIncome - totalExpense, color: 'var(--accent)' },
          { icon: DollarSign, label: 'Pendente', value: mockTx.filter(t => t.status === 'pending').reduce((a, t) => a + t.amount, 0), color: 'var(--warning)' },
        ].map((s) => (
          <div key={s.label} className="glass" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <s.icon size={16} color={s.color} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: s.color }}>
              R$ {s.value.toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Descrição</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Valor</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockTx.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 500 }}>{t.description}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${t.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
            <select className="input-base">
              <option>income</option>
              <option>expense</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Valor</label>
            <input className="input-base" type="number" placeholder="0,00" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Descrição</label>
            <input className="input-base" placeholder="Descrição da transação" />
          </div>
          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
