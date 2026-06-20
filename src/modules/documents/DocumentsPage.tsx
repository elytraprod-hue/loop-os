// src/modules/documents/DocumentsPage.tsx
import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useDocumentsQuery, useCreateDocumentMutation } from '../../hooks/useDbQuery';

const types = ['briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico'] as const;

export const DocumentsPage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: documents, isLoading, error, refetch } = useDocumentsQuery(workspaceId);
  const createDoc = useCreateDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<string>('briefing');
  const [content, setContent] = useState('');

  const docs = documents ?? [];
  const filtered = filterType ? docs.filter(d => d.type === filterType) : docs;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;
    createDoc.mutate(
      {
        workspace_id: workspaceId,
        project_id: '',
        title,
        type: docType,
        content: content ? { body: content } : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Documento criado');
          setModalOpen(false);
          setTitle('');
          setContent('');
          setDocType('briefing');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeUp">
        <ErrorState description="Erro ao carregar documentos" onRetry={() => refetch()} />
      </div>
    );
  }

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

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum documento encontrado"
          description={filterType ? `Nenhum documento do tipo ${filterType.replace('_', ' ')}` : 'Crie seu primeiro documento'}
          action={{ label: 'Novo Documento', onClick: () => setModalOpen(true) }}
        />
      ) : (
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
                {doc.status ?? 'draft'}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Documento">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do documento" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
            <select className="input-base" value={docType} onChange={(e) => setDocType(e.target.value)}>
              {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Conteúdo</label>
            <textarea className="input-base" rows={6} placeholder="Escreva o conteúdo..." style={{ resize: 'vertical' }} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={createDoc.isPending}>Salvar</button>
        </form>
      </Modal>
    </div>
  );
};
