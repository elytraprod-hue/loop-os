// src/modules/video-review/VideoPlayerPage.tsx
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoPlayerPage = () => {
  const { deliverableId } = useParams();

  return (
    <div className="animate-fadeUp">
      <Link to="/app/video-review" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>
      <div className="page-hero">
        <h1>Player</h1>
        <p>Revisão de vídeo {deliverableId}</p>
      </div>
      <div className="glass" style={{ aspectRatio: '16/9', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Player de vídeo em breve.</p>
      </div>
    </div>
  );
};
