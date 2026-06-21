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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-5xl text-white tracking-tight">Financeiro</h1>
          <p className="text-[#c4c4c4] text-base mt-2 leading-relaxed">Gerencie receitas e despesas</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">Projeto:</span>
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none min-w-[180px]"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="all">Todos os Projetos</option>
              {(projects ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button onClick={() => { setModalProjectId(''); setModalOpen(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all flex items-center gap-2">
            <Plus size={16} /> Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: 'Receita', value: totalIncome, color: 'text-green-400' },
          { icon: TrendingDown, label: 'Despesas', value: totalExpense, color: 'text-red-400' },
          { icon: PiggyBank, label: 'Lucro', value: totalIncome - totalExpense, color: 'text-orange-500' },
          { icon: DollarSign, label: 'Pendente', value: pendingTotal, color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <s.icon size={16} className={s.color} />
              <span className="text-gray-400 text-xs">{s.label}</span>
            </div>
            <div className="font-display font-black text-2xl text-[#e8e8e8]">
              R$ {s.value.toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Distribuição Financeira */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold m-0 text-[#e8e8e8]">Distribuição de Fluxo de Caixa</h3>
          <span className="text-xs text-gray-400">
            Margem Operacional: <strong className={totalIncome - totalExpense >= 0 ? 'text-orange-500' : 'text-red-400'}>
              {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
            </strong>
          </span>
        </div>
        
        <div className="flex w-full h-5 rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-3">
          {totalIncome > 0 && (
            <div
              className="h-full transition-all duration-300 shadow-[0_0_10px_rgba(74,222,128,0.15)]"
              style={{
                width: `${incomePercentage}%`,
                background: 'linear-gradient(90deg, rgba(74,222,128,0.3), rgba(74,222,128,1))'
              }}
            />
          )}
          {totalExpense > 0 && (
            <div
              className="h-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
              style={{
                width: `${expensePercentage}%`,
                background: 'linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,1))'
              }}
            />
          )}
          {totalIncome === 0 && totalExpense === 0 && (
            <div className="w-full flex items-center justify-center text-gray-500 text-xs">
              Sem movimentações financeiras no escopo selecionado
            </div>
          )}
        </div>

        <div className="flex justify-between text-xs flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-gray-400">Receitas:</span>
            <strong className="text-green-400">R$ {totalIncome.toLocaleString('pt-BR')} ({incomePercentage}%)</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-gray-400">Despesas:</span>
            <strong className="text-red-400">R$ {totalExpense.toLocaleString('pt-BR')} ({expensePercentage}%)</strong>
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="p-4 text-left font-medium">Descrição</th>
                <th className="p-4 text-left font-medium">Tipo</th>
                <th className="p-4 text-left font-medium">Valor</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.id} className="border-b border-white/10">
                  <td className="p-4">
                    <div className="font-medium">{t.description}</div>
                    {t.projects?.title && (
                      <div className="text-xs text-orange-500 mt-0.5">
                        Projeto: {t.projects.title}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {t.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`p-4 ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${t.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{t.status ?? 'pending'}</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Tipo</label>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Receita (Faturamento)</option>
              <option value="expense">Despesa (Custo)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Valor</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" type="number" step="0.01" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Descrição</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="Descrição da transação" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Projeto Vinculado</label>
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full"
              value={modalProjectId}
              onChange={(e) => setModalProjectId(e.target.value)}
            >
              <option value="">Nenhum (Lançamento Geral)</option>
              {(projects ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all" disabled={createTx.isPending}>
            {createTx.isPending ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
