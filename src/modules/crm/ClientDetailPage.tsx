// src/modules/crm/ClientDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const { data: projects } = useQuery({
    queryKey: ['client-projects', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} />;
  if (!client) return <ErrorState description="Cliente não encontrado" />;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-text-muted mt-1">Detalhes do cliente</p>
        </div>
        <StatusBadge status={client.status} variant="client" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-text-muted" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-text-muted" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-text-muted" />
                <span>{client.company}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span>Cliente desde {new Date(client.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects?.length ?? 0}</div>
            <p className="text-sm text-text-muted">Projetos associados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {!projects || projects.length === 0 ? (
            <EmptyState
              title="Nenhum projeto"
              description="Este cliente ainda não possui projetos"
            />
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between py-3 hover:bg-surface-hover/50 -mx-6 px-6"
                >
                  <div>
                    <p className="font-medium text-text-primary">{project.title}</p>
                    <p className="text-sm text-text-muted">{project.type}</p>
                  </div>
                  <StatusBadge status={project.status} variant="project" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
