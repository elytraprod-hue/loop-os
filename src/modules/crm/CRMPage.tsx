import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Users, Pencil, Trash2, LayoutGrid, List } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { KanbanBoard } from '../../components/ui/KanbanBoard';
import { useWorkspaceQuery, useClientsQuery, useCreateClientMutation, useUpdateClientMutation, useDeleteClientMutation } from '../../hooks/useDbQuery';
import { toast } from 'sonner';

export const CRMPage = () => {
  const navigate = useNavigate();
  const { data: workspace, isLoading: wsLoading } = useWorkspaceQuery();
  const workspaceId = workspace?.id;

  const { data: clients, isLoading, error, refetch } = useClientsQuery(workspaceId);
  const createClient = useCreateClientMutation();
  const updateClient = useUpdateClientMutation();
  const deleteClient = useDeleteClientMutation();

  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<{ id: string; name: string; email?: string; phone?: string; company?: string; status: string } | null>(null);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('prospect');

  const isEditing = !!editingClient;

  const filtered = (clients ?? []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setStatus('prospect');
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingClient(c);
    setName(c.name);
    setEmail(c.email ?? '');
    setPhone(c.phone ?? '');
    setCompany(c.company ?? '');
    setStatus(c.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    if (isEditing) {
      updateClient.mutate(
        { id: editingClient!.id, name, email, phone, company, status },
        {
          onSuccess: () => {
            toast.success('Cliente atualizado');
            setModalOpen(false);
          },
          onError: (err) => toast.error(err.message)
        }
      );
    } else {
      createClient.mutate(
        { workspace_id: workspaceId, name, email, phone, company, status },
        {
          onSuccess: () => {
            toast.success('Cliente criado');
            setModalOpen(false);
            setName('');
            setEmail('');
            setPhone('');
            setCompany('');
            setStatus('prospect');
          },
          onError: (err) => toast.error(err.message)
        }
      );
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Excluir cliente "${name}"? Todos os projetos dele podem ficar sem vínculo.`)) return;
    deleteClient.mutate(id, {
      onSuccess: () => toast.success('Cliente excluído'),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleItemMove = (itemId: string, newColumnId: string) => {
    updateClient.mutate(
      { id: itemId, status: newColumnId },
      {
        onSuccess: () => {
          toast.success('Status do cliente atualizado');
        },
        onError: (err) => {
          toast.error(`Erro ao mover cliente: ${err.message}`);
        }
      }
    );
  };

  const handleItemClick = (item: any) => {
    navigate(`/app/crm/${item.id}`);
  };

  const pipelineColumns = [
    { id: 'prospect', title: 'Leads / Prospects', color: 'var(--info)' },
    { id: 'active', title: 'Ativos', color: 'var(--success)' },
    { id: 'inactive', title: 'Inativos', color: 'var(--text-muted)' },
  ];

  const kanbanItems = filtered.map(c => ({
    id: c.id,
    columnId: c.status,
    title: c.name,
    subtitle: c.company || 'Pessoa Física',
    metadata: {
      ...(c.email ? { email: c.email } : {}),
      ...(c.phone ? { telefone: c.phone } : {}),
    }
  }));

  const isPending = createClient.isPending || updateClient.isPending;
  const isLoadingData = wsLoading || isLoading;

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl text-[#e8e8e8]">CRM</h1>
          <p className="text-[#aaaaaa] text-sm mt-1">Gerencie seus leads, contatos e clientes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'pipeline' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <LayoutGrid size={14} /> Funil
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <List size={14} /> Lista
            </button>
          </div>
          <button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all flex items-center gap-2">
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full"
            placeholder="Buscar clientes por nome ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center p-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorState description="Não foi possível carregar os clientes." onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cliente"
          description="Crie seu primeiro cliente para começar"
          action={{ label: 'Novo Cliente', onClick: openCreate }}
          icon={<Users size={24} />}
        />
      ) : viewMode === 'pipeline' ? (
        <KanbanBoard
          columns={pipelineColumns}
          items={kanbanItems}
          onItemMove={handleItemMove}
          onItemClick={handleItemClick}
        />
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="p-4 text-left font-medium">Nome</th>
                <th className="p-4 text-left font-medium">Empresa</th>
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Telefone</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/10">
                  <td className="p-4">
                    <Link to={`/app/crm/${c.id}`} className="font-medium flex items-center gap-2.5 text-inherit hover:text-orange-400 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Users size={14} className="text-orange-500" />
                      </div>
                      <span>{c.name}</span>
                    </Link>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{c.company ?? '—'}</td>
                  <td className="p-4 text-gray-400 text-sm">{c.email ?? '—'}</td>
                  <td className="p-4 text-gray-400 text-sm">{c.phone ?? '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : c.status === 'prospect' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {c.status === 'active' ? 'Ativo' : c.status === 'prospect' ? 'Prospect' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all" title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nome completo *</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="Nome do cliente" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" type="email" placeholder="email@cliente.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Telefone</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Empresa</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="Nome da empresa" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Status</label>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="prospect">Lead / Prospect</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
