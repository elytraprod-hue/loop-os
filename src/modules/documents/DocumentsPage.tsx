import { useState } from 'react';
import { Plus, FileText, Pencil, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useDocumentsQuery, useProjectsQuery, useCreateDocumentMutation, useUpdateDocumentMutation, useDeleteDocumentMutation } from '../../hooks/useDbQuery';

const types = ['briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico'] as const;
const statuses = ['draft', 'review', 'approved', 'rejected'] as const;

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  review: 'Em Revisão',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export const DocumentsPage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  
  const { data: documents, isLoading, error, refetch } = useDocumentsQuery(workspaceId);
  const { data: projects } = useProjectsQuery(workspaceId);
  
  const createDoc = useCreateDocumentMutation();
  const updateDoc = useUpdateDocumentMutation();
  const deleteDoc = useDeleteDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<{ id: string; title: string; type: string; content?: any; project_id?: string | null; status?: string } | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  
  // Form states
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<string>('briefing');
  const [content, setContent] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [docStatus, setDocStatus] = useState<string>('draft');

  const isEditing = !!editingDoc;
  const docs = documents ?? [];
  const filtered = filterType ? docs.filter(d => d.type === filterType) : docs;

  const openCreate = () => {
    setEditingDoc(null);
    setTitle('');
    setContent('');
    setDocType('briefing');
    setSelectedProjectId('');
    setDocStatus('draft');
    setModalOpen(true);
  };

  const openEdit = (doc: any) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDocType(doc.type);
    setContent(doc.content?.body ?? '');
    setSelectedProjectId(doc.project_id ?? '');
    setDocStatus(doc.status ?? 'draft');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;

    const payload = {
      title,
      type: docType,
      content: content ? { body: content } : { body: '' },
      project_id: selectedProjectId || null,
      status: docStatus,
    };

    if (isEditing) {
      updateDoc.mutate(
        { id: editingDoc!.id, ...payload },
        {
          onSuccess: () => { toast.success('Documento atualizado'); setModalOpen(false); },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createDoc.mutate(
        { workspace_id: workspaceId, ...payload },
        {
          onSuccess: () => {
            toast.success('Documento criado');
            setModalOpen(false);
            setTitle('');
            setContent('');
            setDocType('briefing');
            setSelectedProjectId('');
            setDocStatus('draft');
          },
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

  const exportToPDF = (doc: any) => {
    try {
      const pdf = new jsPDF();
      const text = doc.content?.body ?? '';
      const margin = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const maxLineWidth = pageWidth - margin * 2;

      // Header Brand
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(26, 26, 26);
      pdf.text(doc.title, margin, 25);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      
      const associatedProject = (projects ?? []).find(p => p.id === doc.project_id);
      const projectText = associatedProject ? `PROJETO: ${associatedProject.title.toUpperCase()}` : 'DOCUMENTO GLOBAL';
      pdf.text(`TIPO: ${doc.type.toUpperCase()}  |  STATUS: ${(statusLabels[doc.status || 'draft'] || 'Rascunho').toUpperCase()}  |  ${projectText}`, margin, 32);

      // Divider Line
      pdf.setDrawColor(210, 210, 210);
      pdf.line(margin, 36, pageWidth - margin, 36);

      // Body Content
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');

      const splitText = pdf.splitTextToSize(text, maxLineWidth);
      let cursorY = 46;

      for (let i = 0; i < splitText.length; i++) {
        if (cursorY + 10 > pageHeight - margin) {
          pdf.addPage();
          cursorY = margin;
        }
        pdf.text(splitText[i], margin, cursorY);
        cursorY += 7;
      }

      pdf.save(`${doc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF baixado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao exportar documento para PDF.');
    }
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
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1>Documentos</h1>
          <p>Gerencie briefings, roteiros e contratos da sua produtora</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((doc) => {
            const project = (projects ?? []).find(p => p.id === doc.project_id);
            return (
              <div key={doc.id} className="glass" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={16} color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={doc.title}>
                        {doc.title}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginTop: 2 }}>
                        {doc.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  {project && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14, background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>
                      Projeto: <strong style={{ color: '#fff' }}>{project.title}</strong>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <span className={`badge ${doc.status === 'approved' ? 'badge-success' : doc.status === 'review' ? 'badge-warning' : doc.status === 'rejected' ? 'badge-danger' : 'badge-neutral'}`}>
                    {statusLabels[doc.status || 'draft']}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => exportToPDF(doc)} className="btn-icon btn-ghost" title="Exportar PDF" style={{ padding: 6 }}>
                      <Download size={14} color="var(--accent)" />
                    </button>
                    <button onClick={() => openEdit(doc)} className="btn-icon btn-ghost" title="Editar" style={{ padding: 6 }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(doc.id, doc.title)} className="btn-icon btn-ghost" title="Excluir" style={{ padding: 6 }}>
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Documento' : 'Novo Documento'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do documento" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Tipo</label>
              <select className="input-base" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Status</label>
              <select className="input-base" value={docStatus} onChange={(e) => setDocStatus(e.target.value)}>
                {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Vincular a Projeto (Opcional)</label>
            <select className="input-base" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              <option value="">Nenhum (Documento Global)</option>
              {(projects ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Conteúdo</label>
            <textarea className="input-base" rows={8} placeholder="Escreva o corpo do documento aqui..." style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 13 }} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={() => exportToPDF({ title, type: docType, content: { body: content }, project_id: selectedProjectId, status: docStatus })} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                Exportar PDF
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
