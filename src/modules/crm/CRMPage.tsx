// src/modules/crm/CRMPage.tsx
import { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const mockClients = [
  { id: '1', name: 'Studio Globo', status: 'active', email: 'contato@studioglobo.com', company: 'Globo' },
  { id: '2', name: 'Agência Criativa', status: 'prospect', email: 'oi@agencia.com', company: 'Agência Criativa' },
  { id: '3', name: 'Produtora Aurora', status: 'active', email: 'aurora@produtora.com', company: 'Aurora Filmes' },
  { id: '4', name: 'Mídia Digital', status: 'inactive', email: 'midia@digital.com', company: 'Mídia Digital Ltda' },
];

export const CRMPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = mockClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>CRM</h1>
          <p>Gerencie seus clientes</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-base"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Nome</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Empresa</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={14} color="var(--accent)" />
                  </div>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{c.company}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{c.email}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${c.status === 'active' ? 'badge-success' : c.status === 'prospect' ? 'badge-info' : 'badge-neutral'}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Cliente">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Nome</label>
            <input className="input-base" placeholder="Nome do cliente" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <input className="input-base" type="email" placeholder="email@cliente.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Empresa</label>
            <input className="input-base" placeholder="Nome da empresa" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
