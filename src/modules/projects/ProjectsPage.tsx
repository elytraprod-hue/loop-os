import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, FolderOpen, Pencil, Trash2, LayoutGrid, List } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { KanbanBoard } from '../../components/ui/KanbanBoard';
import { useWorkspaceQuery, useProjectsQuery, useClientsQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from '../../hooks/useDbQuery';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  briefing: 'badge-info',
  pre_production: 'badge-warning',
  production: 'badge-info',
  post_production: 'badge-warning',
  review: 'badge-warning',
  delivered: 'badge-success',
  archived: 'badge-neutral',
};

const statusLabels: Record<string, string> = {
  briefing: 'Briefing',
  pre_production: 'Pré-Produção',
  production: 'Produção',
  post_production: 'Pós-Produção',
  review: 'Revisão',
  delivered: 'Entregue',
  archived: 'Arquivado',
};

const projectTypeOptions = [
  { value: 'film', label: 'Filme / Curta' },
  { value: 'commercial', label: 'Comercial / Publicidade' },
  { value: 'documentary', label: 'Documentário' },
  { value: 'web_series', label: 'Web Série / Conteúdo' },
  { value: 'other', label: 'Outro' },
];

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = workspace?.id;

  const { data: projects, isLoading, error, refetch } = useProjectsQuery(workspaceId);
  const { data: clients } = useClientsQuery(workspaceId);
  const createProject = useCreateProjectMutation();
  const updateProject = useUpdateProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{ id: string; title: string; client_id?: string; type: string; status?: string } | null>(null);
  const [filter, setFilter] = useState('');
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('briefing');

  const isEditing = !!editingProject;

  const filtered = (projects ?? []).filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    (p.clients?.name && p.clients.name.toLowerCase().includes(filter.toLowerCase()))
  );

  const clientOptions = (clients ?? []).map(c => ({ value: c.id, label: c.name }));

  const openCreate = () => {
    setEditingProject(null);
    setTitle('');
    setClientId('');
    setType('');
    setStatus('briefing');
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingProject(p);
    setTitle(p.title);
    setClientId(p.client_id ?? '');
    setType(p.type);
    setStatus(p.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type || !workspaceId) return;

    if (isEditing) {
      updateProject.mutate(
        { id: editingProject!.id, title, client_id: clientId || undefined, type, status },
        {
          onSuccess: () => { toast.success('Projeto atualizado'); setModalOpen(false); },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createProject.mutate(
        { workspace_id: workspaceId, title, client_id: clientId || undefined, type },
        {
          onSuccess: () => { toast.success('Projeto criado'); setModalOpen(false); setTitle(''); setClientId(''); setType(''); },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Excluir projeto "${title}"? Todos os entregáveis e documentos deste projeto serão perdidos.`)) return;
    deleteProject.mutate(id, {
      onSuccess: () => toast.success('Projeto excluído'),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleItemMove = (itemId: string, newColumnId: string) => {
    updateProject.mutate(
      { id: itemId, status: newColumnId },
      {
        onSuccess: () => {
          toast.success('Fase do projeto atualizada');
        },
        onError: (err) => {
          toast.error(`Erro ao atualizar fase: ${err.message}`);
        }
      }
    );
  };

  const handleItemClick = (item: any) => {
    navigate(`/app/projects/${item.id}`);
  };

  const pipelineColumns = [
    { id: 'briefing', title: 'Briefing', color: 'var(--info)' },
    { id: 'pre_production', title: 'Pré-Produção', color: 'var(--warning)' },
    { id: 'production', title: 'Produção', color: 'var(--accent)' },
    { id: 'post_production', title: 'Pós-Produção', color: 'var(--warning)' },
    { id: 'review', title: 'Revisão', color: 'var(--warning)' },
    { id: 'delivered', title: 'Entregue', color: 'var(--success)' },
  ];

  const kanbanItems = filtered.map(p => ({
    id: p.id,
    columnId: p.status,
    title: p.title,
    subtitle: p.clients?.name || 'Cliente Direto',
    metadata: {
      tipo: projectTypeOptions.find(o => o.value === p.type)?.label || p.type,
    }
  }));

  const isPending = createProject.isPending || updateProject.isPending;

  if (isLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeUp" style={{ paddingTop: 40 }}>
        <ErrorState description="Não foi possível carregar os projetos." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1>Projetos</h1>
          <p>Acompanhe e gerencie a linha de produção audiovisual</p>
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
            <Plus size={16} /> Novo Projeto
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-base" style={{ paddingLeft: 40 }} placeholder="Buscar projetos..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum projeto encontrado"
          description="Crie um novo projeto para começar."
          icon={<FolderOpen size={32} />}
          action={{ label: 'Novo Projeto', onClick: openCreate }}
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
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Título</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Cliente</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500, width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={14} color="var(--accent)" />
                    </div>
                    <Link to={`/app/projects/${p.id}`} style={{ fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>{p.title}</Link>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{p.clients?.name ?? '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14 }}>
                    {projectTypeOptions.find(o => o.value === p.type)?.label || p.type}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${statusColors[p.status] || 'badge-neutral'}`}>{statusLabels[p.status] || p.status}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => openEdit(p)} className="btn-icon btn-ghost" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.title)} className="btn-icon btn-ghost" title="Excluir">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Projeto' : 'Novo Projeto'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Título *"
            placeholder="Título do projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Select
            label="Cliente"
            value={clientId}
            onChange={setClientId}
            options={clientOptions}
            placeholder="Selecionar cliente..."
          />
          <Select
            label="Tipo *"
            value={type}
            onChange={setType}
            options={projectTypeOptions}
            placeholder="Selecionar tipo..."
          />
          {isEditing && (
            <Select
              label="Status *"
              value={status}
              onChange={setStatus}
              options={Object.entries(statusLabels).map(([val, label]) => ({ value: val, label }))}
              placeholder="Selecionar status..."
            />
          )}
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
