// src/modules/projects/ProjectDetailPage.tsx
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useProjectQuery } from '../../hooks/useDbQuery';

const statusColors: Record<string, string> = {
  briefing: 'badge-info',
  pre_production: 'badge-warning',
  production: 'badge-info',
  post_production: 'badge-warning',
  review: 'badge-warning',
  delivered: 'badge-success',
  archived: 'badge-neutral',
};

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProjectQuery(projectId);

  if (isLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <Link to="/app/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>
      <div className="page-hero">
        <h1>{project?.title ?? 'Projeto'}</h1>
        <p>Detalhes do projeto</p>
      </div>
      <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Status</span>
            <span className={`badge ${statusColors[project?.status] || 'badge-neutral'}`}>
              {project?.status?.replace('_', ' ') ?? '-'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Cliente</span>
            <span style={{ fontSize: 15 }}>{project?.clients?.name ?? '-'}</span>
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Tipo</span>
            <span style={{ fontSize: 15 }}>{project?.type ?? '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
