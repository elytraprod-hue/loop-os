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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-5xl text-white tracking-tight">Projetos</h1>
          <p className="text-[#c4c4c4] text-base mt-2 leading-relaxed">Acompanhe e gerencie a linha de produção audiovisual</p>
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
            <Plus size={16} /> Novo Projeto
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full"
            placeholder="Buscar projetos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="p-4 text-left font-medium">Título</th>
                <th className="p-4 text-left font-medium">Cliente</th>
                <th className="p-4 text-left font-medium">Tipo</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="p-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <FolderOpen size={14} className="text-orange-500" />
                    </div>
                    <Link to={`/app/projects/${p.id}`} className="font-semibold text-inherit hover:text-orange-400 transition-colors no-underline">{p.title}</Link>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{p.clients?.name ?? '—'}</td>
                  <td className="p-4 text-sm">
                    {projectTypeOptions.find(o => o.value === p.type)?.label || p.type}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[p.status] === 'badge-success' ? 'bg-green-500/10 text-green-400' : statusColors[p.status] === 'badge-info' ? 'bg-blue-500/10 text-blue-400' : statusColors[p.status] === 'badge-warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {statusLabels[p.status] || p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all" title="Excluir">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Projeto' : 'Novo Projeto'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
