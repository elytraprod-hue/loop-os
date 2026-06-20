import { useState } from 'react';
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useDocumentsQuery, useCreateDocumentMutation, useUpdateDocumentMutation, useDeleteDocumentMutation } from '../../hooks/useDbQuery';

const types = ['briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico'] as const;

export const DocumentsPage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: documents, isLoading, error, refetch } = useDocumentsQuery(workspaceId);
  const createDoc = useCreateDocumentMutation();
  const updateDoc = useUpdateDocumentMutation();
  const deleteDoc = useDeleteDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<{ id: string; title: string; type: string; content?: any } | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<string>('briefing');
  const [content, setContent] = useState('');

  const isEditing = !!editingDoc;
  const docs = documents ?? [];
  const filtered = filterType ? docs.filter(d => d.type === filterType) : docs;

  const openCreate = () => {
    setEditingDoc(null);
    setTitle('');
    setContent('');
    setDocType('briefing');
    setModalOpen(true);
  };

  const openEdit = (doc: { id: string; title: string; type: string; content?: any }) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDocType(doc.type);
    setContent(doc.content?.body ?? '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;

    if (isEditing) {
      updateDoc.mutate(
        { id: editingDoc!.id, title, type: docType, content: content ? { body: content } : undefined },
        {
          onSuccess: () => { toast.success('Documento atualizado'); setModalOpen(false); },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createDoc.mutate(
        { workspace_id: workspaceId, project_id: '', title, type: docType, content: content ? { body: content } : undefined },
        {
          onSuccess: () => { toast.success('Documento criado'); setModalOpen(false); setTitle(''); setContent(''); setDocType('briefing'); },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Excluir documento "${title}"?`)) return;
    deleteDoc.mutate(id, {
      onSuccess: () => toast.success('Documento excluído'),
      onError: (err) => toast.error(err.message),
    });
  };

  const isPending = createDoc.isPending || updateDoc.isPending;

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
        <button onClick={openCreate} className="btn btn-primary">
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
          action={{ label: 'Novo Documento', onClick: openCreate }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((doc) => (
            <div key={doc.id} className="glass" style={{ padding: 24, borderRadius: 16, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{doc.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${doc.status === 'approved' ? 'badge-success' : doc.status === 'review' ? 'badge-warning' : 'badge-neutral'}`}>
                  {doc.status ?? 'draft'}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => openEdit(doc)} className="btn-icon btn-ghost" title="Editar">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(doc.id, doc.title)} className="btn-icon btn-ghost" title="Excluir">
                    <Trash2 size={14} color="var(--danger)" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Documento' : 'Novo Documento'}>
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
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
