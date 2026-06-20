// src/modules/documents/DocumentsPage.tsx
import { useState } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/authService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { DocumentForm, type DocumentFormData } from './components/DocumentForm';

const docTypeLabels: Record<string, string> = {
  briefing: 'Briefing',
  roteiro: 'Roteiro',
  proposta: 'Proposta',
  contrato: 'Contrato',
  ordem_servico: 'Ordem de Serviço',
};

export const DocumentsPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*, projects(title)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { workspace_id: string; project_id: string; title: string; type: string }) => {
      const { data, error } = await supabase.from('documents').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const filtered = (documents ?? []).filter((d) => {
    const q = search.toLowerCase();
    return (!search || d.title.toLowerCase().includes(q)) && (!typeFilter || d.type === typeFilter);
  });

  const stats = {
    total: documents?.length ?? 0,
    briefings: documents?.filter((d) => d.type === 'briefing').length ?? 0,
    roteiros: documents?.filter((d) => d.type === 'roteiro').length ?? 0,
  };

  const handleCreate = async (data: DocumentFormData) => {
    await createMutation.mutateAsync({
      workspace_id: user?.id ?? '',
      project_id: '',
      ...data,
    });
    setShowAddModal(false);
  };

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-text-muted">Gerencie briefings, roteiros, contratos e propostas</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Documento
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
            <CardTitle className="text-sm font-medium text-text-muted">Briefings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.briefings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roteiros}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(docTypeLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={typeFilter === key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(typeFilter === key ? null : key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum documento encontrado"
          description={search ? 'Tente alterar os filtros' : 'Crie seu primeiro documento'}
          action={!search ? { label: 'Novo Documento', onClick: () => setShowAddModal(true) } : undefined}
          icon={<FileText className="h-12 w-12" />}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Título</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden lg:table-cell">Projeto</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{doc.title}</td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell">
                    {docTypeLabels[doc.type] ?? doc.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">
                    {(doc.projects as any)?.title ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} variant="deliverable" />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">
                    {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Novo Documento</h2>
            <DocumentForm
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
