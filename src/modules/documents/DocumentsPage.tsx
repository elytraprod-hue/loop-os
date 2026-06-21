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
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl text-[#e8e8e8]">Documentos</h1>
          <p className="text-[#aaaaaa] text-sm mt-1">Gerencie briefings, roteiros e contratos da sua produtora</p>
        </div>
        <button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all flex items-center gap-2">
          <Plus size={16} /> Novo Documento
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterType ? 'bg-orange-500 text-black' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400'}`}>
          Todos
        </button>
        {types.map((t) => (
          <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? 'bg-orange-500 text-black' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400'}`}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((doc) => {
            const project = (projects ?? []).find(p => p.id === doc.project_id);
            return (
              <div key={doc.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[180px] hover:bg-white/8 transition-all">
                <div>
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" title={doc.title}>
                        {doc.title}
                      </div>
                      <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mt-0.5">
                        {doc.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  {project && (
                    <div className="text-xs text-gray-400 mb-3.5 bg-white/5 px-2 py-1 rounded-md inline-block">
                      Projeto: <strong className="text-white">{project.title}</strong>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${doc.status === 'approved' ? 'bg-green-500/10 text-green-400' : doc.status === 'review' ? 'bg-yellow-500/10 text-yellow-400' : doc.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {statusLabels[doc.status || 'draft']}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => exportToPDF(doc)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-white/5 transition-all" title="Exportar PDF">
                      <Download size={14} />
                    </button>
                    <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(doc.id, doc.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Documento' : 'Novo Documento'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Título</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="Título do documento" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Tipo</label>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Status</label>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full" value={docStatus} onChange={(e) => setDocStatus(e.target.value)}>
                {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Vincular a Projeto (Opcional)</label>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              <option value="">Nenhum (Documento Global)</option>
              {(projects ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Conteúdo</label>
            <textarea className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full resize-y font-mono text-sm" rows={8} placeholder="Escreva o corpo do documento aqui..." value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all" onClick={() => setModalOpen(false)}>Cancelar</button>
            {isEditing && (
              <button type="button" className="bg-white/5 hover:bg-white/10 border border-orange-500/50 text-orange-500 rounded-xl px-6 py-3 transition-all" onClick={() => exportToPDF({ title, type: docType, content: { body: content }, project_id: selectedProjectId, status: docStatus })}>
                Exportar PDF
              </button>
            )}
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
