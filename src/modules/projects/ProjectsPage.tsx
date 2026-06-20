// src/modules/projects/ProjectsPage.tsx
import { useState } from 'react';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const mockProjects = [
  { id: '1', title: 'Comercial Verão 2026', status: 'pre_production', client: 'Studio Globo', type: 'commercial' },
  { id: '2', title: 'Documentário Amazônia', status: 'post_production', client: 'Produtora Aurora', type: 'documentary' },
  { id: '3', title: 'Curta-metragem "Onda"', status: 'review', client: 'Agência Criativa', type: 'film' },
  { id: '4', title: 'Série Web Tech', status: 'delivered', client: 'Mídia Digital', type: 'web_series' },
];

const statusColors: Record<string, string> = {
  briefing: 'badge-info',
  pre_production: 'badge-warning',
  production: 'badge-info',
  post_production: 'badge-warning',
  review: 'badge-warning',
  delivered: 'badge-success',
  archived: 'badge-neutral',
};

export const ProjectsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filtered = mockProjects.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Projetos</h1>
          <p>Gerencie seus projetos audiovisuais</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-base" style={{ paddingLeft: 40 }} placeholder="Buscar projetos..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Título</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Cliente</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderOpen size={14} color="var(--accent)" />
                  </div>
                  <span style={{ fontWeight: 500 }}>{p.title}</span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{p.client}</td>
                <td style={{ padding: '14px 20px', fontSize: 14 }}>{p.type}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${statusColors[p.status] || 'badge-neutral'}`}>{p.status.replace('_', ' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Projeto">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do projeto" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Cliente</label>
            <select className="input-base">
              <option>Studio Globo</option>
              <option>Produtora Aurora</option>
              <option>Agência Criativa</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
            <select className="input-base">
              <option>film</option>
              <option>commercial</option>
              <option>documentary</option>
              <option>web_series</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
