// src/modules/crm/CRMPage.tsx
import { useState } from 'react';
import { Search, Plus, Users, Mail, Phone, Building2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClientsQuery, useCreateClientMutation, useUpdateClientMutation, useDeleteClientMutation } from '../../hooks/useDbQuery';
import { useAuth } from '../auth/authService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { ClientForm, type ClientFormData } from './components/ClientForm';

export const CRMPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<{ id: string; data: ClientFormData } | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const { user } = useAuth();
  const { data: clients, isLoading, error, refetch } = useClientsQuery(user?.id);
  const createMutation = useCreateClientMutation();
  const updateMutation = useUpdateClientMutation();
  const deleteMutation = useDeleteClientMutation();

  const filtered = (clients ?? []).filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients?.length ?? 0,
    active: clients?.filter((c) => c.status === 'active').length ?? 0,
    prospects: clients?.filter((c) => c.status === 'prospect').length ?? 0,
  };

  const handleCreate = async (data: ClientFormData) => {
    await createMutation.mutateAsync({ ...data, workspace_id: user?.id ?? '' });
    setShowAddModal(false);
  };

  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient) return;
    await updateMutation.mutateAsync({ id: editingClient.id, ...data });
    setEditingClient(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-text-muted">Gerencie seus clientes</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
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
            <CardTitle className="text-sm font-medium text-text-muted">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.prospects}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['active', 'inactive', 'prospect'].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            >
              {s === 'active' ? 'Ativos' : s === 'inactive' ? 'Inativos' : 'Prospects'}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description={search ? 'Tente alterar os filtros de busca' : 'Adicione seu primeiro cliente para começar'}
          action={!search ? { label: 'Adicionar Cliente', onClick: () => setShowAddModal(true) } : undefined}
          icon={<Users className="h-12 w-12" />}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Nome</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden md:table-cell">Contato</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted hidden lg:table-cell">Empresa</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">Status</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50">
                  <td className="px-4 py-3">
                    <Link to={`/crm/${client.id}`} className="font-medium text-text-primary hover:text-accent">
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                      )}
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">
                    {client.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {client.company}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={client.status} variant="client" />
                  </td>
                  <td className="px-4 py-3 relative">
                    <Button variant="ghost" size="sm" onClick={() => setMenuOpen(menuOpen === client.id ? null : client.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {menuOpen === client.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 z-10 rounded-md border border-border bg-surface shadow-lg">
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                          onClick={() => {
                            setEditingClient({ id: client.id, data: { name: client.name, email: client.email ?? '', phone: client.phone ?? '', company: client.company ?? '' } });
                            setMenuOpen(null);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-surface-hover"
                          onClick={() => { handleDelete(client.id); setMenuOpen(null); }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Novo Cliente</h2>
            <ClientForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddModal(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingClient(null)}>
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Editar Cliente</h2>
            <ClientForm
              defaultValues={editingClient.data}
              onSubmit={handleUpdate}
              onCancel={() => setEditingClient(null)}
              isLoading={updateMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};
