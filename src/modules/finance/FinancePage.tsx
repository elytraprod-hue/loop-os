// src/modules/finance/FinancePage.tsx
import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useTransactionsQuery, useProjectsQuery, useCreateTransactionMutation, useDeleteTransactionMutation } from '../../hooks/useDbQuery';

export const FinancePage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  
  const { data: transactions, isLoading, error, refetch } = useTransactionsQuery(workspaceId);
  const { data: projects } = useProjectsQuery(workspaceId);
  const createTx = useCreateTransactionMutation();
  const deleteTx = useDeleteTransactionMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [modalProjectId, setModalProjectId] = useState<string>('');

  const txns = transactions ?? [];

  // Filtered transactions for calculation and listing
  const filteredTxns = txns.filter(t => {
    if (selectedProjectId === 'all') return true;
    return t.project_id === selectedProjectId;
  });

  const totalIncome = filteredTxns.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = filteredTxns.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0);
  const pendingTotal = filteredTxns.filter(t => t.status === 'pending').reduce((a, t) => a + Number(t.amount), 0);

  const totalVolume = totalIncome + totalExpense;
  const incomePercentage = totalVolume > 0 ? Math.round((totalIncome / totalVolume) * 100) : 0;
  const expensePercentage = totalVolume > 0 ? Math.round((totalExpense / totalVolume) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;
    createTx.mutate(
      {
        workspace_id: workspaceId,
        type,
        amount: parseFloat(amount),
        description: description || 'Sem descrição',
        project_id: modalProjectId || null,
      },
      {
        onSuccess: () => {
          toast.success('Transação criada');
          setModalOpen(false);
          setType('income');
          setAmount('');
          setDescription('');
          setModalProjectId('');
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
      <div className="page-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1>Financeiro</h1>
          <p>Gerencie receitas e despesas</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Projeto:</span>
            <select
              className="input-base"
              style={{ padding: '8px 12px', fontSize: 13, minWidth: 180, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: 8 }}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="all">Todos os Projetos</option>
              {(projects ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button onClick={() => { setModalProjectId(''); setModalOpen(true); }} className="btn btn--primary">
            <Plus size={16} /> Nova Transação
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
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

      {/* Gráfico de Distribuição Financeira */}
      <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Distribuição de Fluxo de Caixa</h3>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Margem Operacional: <strong style={{ color: totalIncome - totalExpense >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
            </strong>
          </span>
        </div>
        
        <div style={{ display: 'flex', width: '100%', height: 20, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', marginBottom: 12 }}>
          {totalIncome > 0 && (
            <div style={{
              width: `${incomePercentage}%`,
              background: 'linear-gradient(90deg, var(--success-dim), var(--success))',
              height: '100%',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.15)'
            }} />
          )}
          {totalExpense > 0 && (
            <div style={{
              width: `${expensePercentage}%`,
              background: 'linear-gradient(90deg, var(--danger-dim), var(--danger))',
              height: '100%',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.15)'
            }} />
          )}
          {totalIncome === 0 && totalExpense === 0 && (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
              Sem movimentações financeiras no escopo selecionado
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Receitas:</span>
            <strong style={{ color: 'var(--success)' }}>R$ {totalIncome.toLocaleString('pt-BR')} ({incomePercentage}%)</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--danger)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Despesas:</span>
            <strong style={{ color: 'var(--danger)' }}>R$ {totalExpense.toLocaleString('pt-BR')} ({expensePercentage}%)</strong>
          </div>
        </div>
      </div>

      {filteredTxns.length === 0 ? (
        <EmptyState
          title="Nenhuma transação encontrada"
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
              {filteredTxns.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 500 }}>{t.description}</div>
                    {t.projects?.title && (
                      <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
                        Projeto: {t.projects.title}
                      </div>
                    )}
                  </td>
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
              <option value="income">Receita (Faturamento)</option>
              <option value="expense">Despesa (Custo)</option>
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
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Projeto Vinculado</label>
            <select
              className="input-base"
              value={modalProjectId}
              onChange={(e) => setModalProjectId(e.target.value)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: 8 }}
            >
              <option value="">Nenhum (Lançamento Geral)</option>
              {(projects ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn--primary" disabled={createTx.isPending}>
            {createTx.isPending ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
