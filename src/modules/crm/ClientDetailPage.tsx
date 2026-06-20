// src/modules/crm/ClientDetailPage.tsx
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientDetailPage = () => {
  const { clientId } = useParams();

  return (
    <div className="animate-fadeUp">
      <Link to="/app/crm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>
      <div className="page-hero">
        <h1>Cliente</h1>
        <p>Detalhes do cliente {clientId}</p>
      </div>
      <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Detalhes do cliente em breve.</p>
      </div>
    </div>
  );
};
