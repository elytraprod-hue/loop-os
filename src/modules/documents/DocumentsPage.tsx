// src/modules/documents/DocumentsPage.tsx
import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const types = ['briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico'] as const;
const mockDocs = [
  { id: '1', title: 'Briefing Comercial', type: 'briefing', status: 'approved' },
  { id: '2', title: 'Roteiro Documentário', type: 'roteiro', status: 'draft' },
  { id: '3', title: 'Proposta Studio Globo', type: 'proposta', status: 'review' },
  { id: '4', title: 'Contrato Aurora', type: 'contrato', status: 'approved' },
];

export const DocumentsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('');

  const filtered = filterType ? mockDocs.filter(d => d.type === filterType) : mockDocs;

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Documentos</h1>
          <p>Gerencie briefings, roteiros e contratos</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Documento
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setFilterType('')} className={`btn btn-${!filterType ? 'primary' : 'secondary'}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          Todos
        </button>
        {types.map((t) => (
          <button key={t} onClick={() => setFilterType(t)} className={`btn btn-${filterType === t ? 'primary' : 'secondary'}`} style={{ fontSize: 13, padding: '6px 14px' }}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((doc) => (
          <div key={doc.id} className="glass" style={{ padding: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={16} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{doc.type}</div>
              </div>
            </div>
            <span className={`badge ${doc.status === 'approved' ? 'badge-success' : doc.status === 'review' ? 'badge-warning' : 'badge-neutral'}`}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Documento">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do documento" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
            <select className="input-base">
              {types.map((t) => <option key={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Conteúdo</label>
            <textarea className="input-base" rows={6} placeholder="Escreva o conteúdo..." style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
