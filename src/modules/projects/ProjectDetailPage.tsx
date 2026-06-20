// src/modules/projects/ProjectDetailPage.tsx
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  return (
    <div className="animate-fadeUp">
      <Link to="/app/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>
      <div className="page-hero">
        <h1>Projeto</h1>
        <p>Detalhes do projeto {projectId}</p>
      </div>
      <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Detalhes do projeto em breve.</p>
      </div>
    </div>
  );
};
