// src/modules/projects/ProjectsPage.tsx
import { useState } from 'react';
import { Search, Plus, FolderOpen, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectsQuery, useCreateProjectMutation } from '../../hooks/useDbQuery';
import { useAuth } from '../auth/authService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProjectForm, type ProjectFormData } from './components/ProjectForm';

const statusColumns = [
  { key: 'briefing', label: 'Briefing' },
  { key: 'pre_production', label: 'Pré-produção' },
  { key: 'production', label: 'Produção' },
  { key: 'post_production', label: 'Pós-produção' },
  { key: 'review', label: 'Revisão' },
  { key: 'delivered', label: 'Entregue' },
];

const projectTypes: Record<string, string> = {
  film: 'Filme',
  commercial: 'Comercial',
  documentary: 'Documentário',
  web_series: 'Web Série',
  other: 'Outro',
};

export const ProjectsPage = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'board'>('list');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { user } = useAuth();
  const { data: projects, isLoading, error, refetch } = useProjectsQuery(user?.id);
  const createMutation = useCreateProjectMutation();

  const filtered = (projects ?? []).filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || p.title.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects?.length ?? 0,
    active: projects?.filter((p) => !['delivered', 'archived'].includes(p.status)).length ?? 0,
    delivered: projects?.filter((p) => p.status === 'delivered').length ?? 0,
  };

  const handleCreate = async (data: ProjectFormData) => {
    await createMutation.mutateAsync({
      workspace_id: user?.id ?? '',
      title: data.title,
      type: data.type,
      client_id: data.client_id || undefined,
    });
    setShowAddModal(false);
  };

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-text-muted">Gerencie seus projetos audiovisuais</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar projetos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'board' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('board')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          {['briefing', 'pre_production', 'production', 'post_production', 'review', 'delivered'].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            >
              {statusColumns.find((c) => c.key === s)?.label}
            </Button>
          ))}
        </div>
      </div>

      {view === 'board' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statusColumns.map((col) => {
            const colProjects = filtered.filter((p) => p.status === col.key);
            return (
              <div key={col.key} className="rounded-lg border border-border bg-surface/50 p-3">
                <h3 className="text-sm font-medium text-text-muted mb-3 px-1">
                  {col.label}
                  <span className="ml-2 text-xs">({colProjects.length})</span>
                </h3>
                <div className="space-y-2">
                  {colProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block rounded-md border border-border bg-surface p-3 hover:border-accent/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-text-primary truncate">{project.title}</p>
                      <p className="text-xs text-text-muted mt-1">{projectTypes[project.type] ?? project.type}</p>
                      {project.clients && (
                        <p className="text-xs text-text-muted mt-0.5">{(project.clients as any)?.name}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhum projeto encontrado"
              description={search ? 'Tente alterar os filtros' : 'Crie seu primeiro projeto'}
              action={!search ? { label: 'Novo Projeto', onClick: () => setShowAddModal(true) } : undefined}
              icon={<FolderOpen className="h-12 w-12" />}
            />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Projeto</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden md:table-cell">Tipo</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden lg:table-cell">Cliente</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden lg:table-cell">Datas</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr key={project.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50">
                      <td className="px-4 py-3">
                        <Link to={`/projects/${project.id}`} className="font-medium text-text-primary hover:text-accent">
                          {project.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell">
                        {projectTypes[project.type] ?? project.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">
                        {(project.clients as any)?.name ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={project.status} variant="project" />
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Novo Projeto</h2>
            <ProjectForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddModal(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};
