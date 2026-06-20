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
      <div className="page-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1>CRM</h1>
          <p>Gerencie seus leads, contatos e clientes</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="glass" style={{ display: 'flex', padding: 4, borderRadius: 10 }}>
            <button
              onClick={() => setViewMode('pipeline')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: viewMode === 'pipeline' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'pipeline' ? '#000' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <LayoutGrid size={14} /> Funil
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'list' ? '#000' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <List size={14} /> Lista
            </button>
          </div>
          <button onClick={openCreate} className="btn btn--primary">
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-base"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar clientes por nome ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoadingData ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
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
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Nome</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Empresa</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Telefone</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500, width: 100 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <Link to={`/app/crm/${c.id}`} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, color: 'inherit' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={14} color="var(--accent)" />
                      </div>
                      <span>{c.name}</span>
                    </Link>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{c.company ?? '—'}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{c.email ?? '—'}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{c.phone ?? '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${c.status === 'active' ? 'badge-success' : c.status === 'prospect' ? 'badge-info' : 'badge-neutral'}`}>
                      {c.status === 'active' ? 'Ativo' : c.status === 'prospect' ? 'Prospect' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => openEdit(c)} className="btn-icon btn-ghost" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="btn-icon btn-ghost" title="Excluir">
                        <Trash2 size={14} color="var(--danger)" />
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Nome completo *</label>
            <input className="input-base" placeholder="Nome do cliente" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <input className="input-base" type="email" placeholder="email@cliente.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Telefone</label>
            <input className="input-base" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Empresa</label>
            <input className="input-base" placeholder="Nome da empresa" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Status</label>
            <select className="input-base" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="prospect">Lead / Prospect</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
