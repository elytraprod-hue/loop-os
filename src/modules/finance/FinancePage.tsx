// src/modules/finance/FinancePage.tsx
import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useTransactionsQuery, useCreateTransactionMutation, useDeleteTransactionMutation } from '../../hooks/useDbQuery';

export const FinancePage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: transactions, isLoading, error, refetch } = useTransactionsQuery(workspaceId);
  const createTx = useCreateTransactionMutation();
  const deleteTx = useDeleteTransactionMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const txns = transactions ?? [];

  const totalIncome = txns.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = txns.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0);
  const pendingTotal = txns.filter(t => t.status === 'pending').reduce((a, t) => a + Number(t.amount), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;
    createTx.mutate(
      {
        workspace_id: workspaceId,
        type,
        amount: parseFloat(amount),
        description: description || 'Sem descrição',
      },
      {
        onSuccess: () => {
          toast.success('Transação criada');
          setModalOpen(false);
          setType('income');
          setAmount('');
          setDescription('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir esta transação?')) return;
    deleteTx.mutate(id, {
      onSuccess: () => toast.success('Transação excluída'),
      onError: (err) => toast.error(err.message),
    });
  };

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
        <ErrorState description="Erro ao carregar transações" onRetry={() => refetch()} />
      </div>
    );
  }

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
          { icon: DollarSign, label: 'Pendente', value: pendingTotal, color: 'var(--warning)' },
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

      {txns.length === 0 ? (
        <EmptyState
          title="Nenhuma transação"
          description="Adicione receitas e despesas para acompanhar seu financeiro"
          action={{ label: 'Nova Transação', onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Descrição</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Valor</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}></th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>{t.description}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${t.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{t.status ?? 'pending'}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => handleDelete(t.id)} className="btn-icon btn-ghost" title="Excluir">
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
            <select className="input-base" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Valor</label>
            <input className="input-base" type="number" step="0.01" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Descrição</label>
            <input className="input-base" placeholder="Descrição da transação" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={createTx.isPending}>Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
