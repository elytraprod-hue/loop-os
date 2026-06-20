// src/modules/projects/ProjectsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useWorkspaceQuery, useProjectsQuery, useClientsQuery, useCreateProjectMutation } from '../../hooks/useDbQuery';
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

const projectTypeOptions = [
  { value: 'film', label: 'Film' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'web_series', label: 'Web Series' },
  { value: 'other', label: 'Other' },
];

export const ProjectsPage = () => {
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = workspace?.id;

  const { data: projects, isLoading, error, refetch } = useProjectsQuery(workspaceId);
  const { data: clients } = useClientsQuery(workspaceId);
  const createProject = useCreateProjectMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('');

  const filtered = (projects ?? []).filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase())
  );

  const clientOptions = (clients ?? []).map(c => ({ value: c.id, label: c.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) return;
    createProject.mutate(
      { workspace_id: workspaceId!, title, client_id: clientId || undefined, type },
      {
        onSuccess: () => {
          toast.success('Projeto criado com sucesso');
          setModalOpen(false);
          setTitle('');
          setClientId('');
          setType('');
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Erro ao criar projeto');
        },
      }
    );
  };

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
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Projetos</h1>
          <p>Gerencie seus projetos audiovisuais</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Projeto
        </button>
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
          action={{ label: 'Novo Projeto', onClick: () => setModalOpen(true) }}
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={14} color="var(--accent)" />
                    </div>
                    <Link to={`/app/projects/${p.id}`} style={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>{p.title}</Link>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{p.clients?.name ?? '-'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14 }}>{p.type}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${statusColors[p.status] || 'badge-neutral'}`}>{p.status.replace('_', ' ')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Projeto">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Título"
            placeholder="Título do projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Cliente"
            value={clientId}
            onChange={setClientId}
            options={clientOptions}
            placeholder="Selecionar cliente..."
          />
          <Select
            label="Tipo"
            value={type}
            onChange={setType}
            options={projectTypeOptions}
            placeholder="Selecionar tipo..."
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={createProject.isPending}>
            {createProject.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
