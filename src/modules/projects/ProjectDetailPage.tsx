// src/modules/projects/ProjectDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

const projectTypes: Record<string, string> = {
  film: 'Filme',
  commercial: 'Comercial',
  documentary: 'Documentário',
  web_series: 'Web Série',
  other: 'Outro',
};

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(*)')
        .eq('id', projectId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: deliverables } = useQuery({
    queryKey: ['project-deliverables', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: documents } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} />;
  if (!project) return <ErrorState description="Projeto não encontrado" />;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-text-muted mt-1">{projectTypes[project.type] ?? project.type}</p>
        </div>
        <StatusBadge status={project.status} variant="project" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-text-muted" />
              <span>{(project.clients as any)?.name ?? 'Sem cliente'}</span>
            </div>
            {project.start_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span>Início: {new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {project.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span>Término: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{deliverables?.length ?? 0}</div>
                <p className="text-sm text-text-muted">Entregas</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{documents?.length ?? 0}</div>
                <p className="text-sm text-text-muted">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          {!deliverables || deliverables.length === 0 ? (
            <EmptyState title="Nenhuma entrega" description="Este projeto ainda não possui entregas" />
          ) : (
            <div className="divide-y divide-border">
              {deliverables.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-text-primary">{d.title}</p>
                    <p className="text-sm text-text-muted">Token: {d.public_token.slice(0, 12)}...</p>
                  </div>
                  <StatusBadge status={d.status} variant="deliverable" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {!documents || documents.length === 0 ? (
            <EmptyState title="Nenhum documento" description="Este projeto ainda não possui documentos" />
          ) : (
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-text-primary">{doc.title}</p>
                    <p className="text-sm text-text-muted">{doc.type}</p>
                  </div>
                  <StatusBadge status={doc.status} variant="deliverable" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
