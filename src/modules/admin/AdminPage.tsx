// src/modules/admin/AdminPage.tsx
import { Users as UsersIcon, Settings } from 'lucide-react';

const members = [
  { name: 'Admin', email: 'admin@loop.com', role: 'owner' },
  { name: 'Produtor', email: 'produtor@loop.com', role: 'admin' },
  { name: 'Editor', email: 'editor@loop.com', role: 'member' },
];

export const AdminPage = () => {
  return (
    <div className="animate-fadeUp">
      <div className="page-hero">
        <h1>Admin</h1>
        <p>Configurações e gestão do workspace</p>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <UsersIcon size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>Membros</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.map((m) => (
            <div key={m.email} className="glass-soft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.email}</div>
              </div>
              <span className={`badge ${m.role === 'owner' ? 'badge-success' : m.role === 'admin' ? 'badge-info' : 'badge-neutral'}`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Settings size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>Configurações</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Configurações do workspace em breve.</p>
      </div>
    </div>
  );
};
