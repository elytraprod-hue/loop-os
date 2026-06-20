// src/modules/video-review/VideoReviewPage.tsx
import { useState } from 'react';
import { Plus, Video, Copy, Check } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const mockDeliverables = [
  { id: '1', title: 'Comercial Verão - Final', status: 'ready', token: 'abc123' },
  { id: '2', title: 'Documentário - Rough Cut', status: 'processing', token: 'def456' },
  { id: '3', title: 'Curta - Color Grading', status: 'delivered', token: 'ghi789' },
];

export const VideoReviewPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/review/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Video Review</h1>
          <p>Compartilhe vídeos e colete feedback com timestamp</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Upload
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {mockDeliverables.map((d) => (
          <div key={d.id} className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ aspectRatio: '16/9', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={32} color="var(--text-muted)" />
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{d.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${d.status === 'delivered' ? 'badge-success' : d.status === 'ready' ? 'badge-info' : 'badge-warning'}`}>
                  {d.status}
                </span>
                <button onClick={() => copyToken(d.token)} className="btn-icon btn-ghost" title="Copiar link público">
                  {copied === d.token ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Vídeo">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do vídeo" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>URL do Vídeo</label>
            <input className="input-base" placeholder="https://..." />
          </div>
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      </Modal>
    </div>
  );
};
