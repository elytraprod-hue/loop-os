// src/modules/video-review/PublicReviewPage.tsx
import { useParams } from 'react-router-dom';

export const PublicReviewPage = () => {
  const { publicToken } = useParams();

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="glass" style={{ maxWidth: 800, width: '100%', borderRadius: 24, padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
          Revisão de Vídeo
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Token: {publicToken}
        </p>
        <div className="glass" style={{ aspectRatio: '16/9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Player público em breve.</p>
        </div>
      </div>
    </div>
  );
};
