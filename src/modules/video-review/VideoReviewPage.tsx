import { useState } from 'react';
import { Plus, Video, Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useDeliverablesQuery, useCreateDeliverableMutation, useUpdateDeliverableMutation, useDeleteDeliverableMutation } from '../../hooks/useDbQuery';

export const VideoReviewPage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: deliverables, isLoading, error, refetch } = useDeliverablesQuery(workspaceId);
  const createDeliverable = useCreateDeliverableMutation();
  const updateDeliverable = useUpdateDeliverableMutation();
  const deleteDeliverable = useDeleteDeliverableMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; title: string; video_url?: string } | null>(null);
  const [copied, setCopied] = useState('');
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const isEditing = !!editing;
  const items = deliverables ?? [];

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/review/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setVideoUrl('');
    setModalOpen(true);
  };

  const openEdit = (d: { id: string; title: string; video_url?: string }) => {
    setEditing(d);
    setTitle(d.title);
    setVideoUrl(d.video_url ?? '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !user) return;

    if (isEditing) {
      updateDeliverable.mutate(
        { id: editing!.id, title, video_url: videoUrl || undefined },
        { onSuccess: () => { toast.success('Vídeo atualizado'); setModalOpen(false); }, onError: (err) => toast.error(err.message) }
      );
    } else {
      createDeliverable.mutate(
        { project_id: '', title, video_url: videoUrl || undefined },
        { onSuccess: () => { toast.success('Vídeo enviado'); setModalOpen(false); setTitle(''); setVideoUrl(''); }, onError: (err) => toast.error(err.message) }
      );
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Excluir vídeo "${title}"?`)) return;
    deleteDeliverable.mutate(id, {
      onSuccess: () => toast.success('Vídeo excluído'),
      onError: (err) => toast.error(err.message),
    });
  };

  const isPending = createDeliverable.isPending || updateDeliverable.isPending;

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
        <ErrorState description="Erro ao carregar vídeos" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-5xl text-white tracking-tight">Video Review</h1>
          <p className="text-[#c4c4c4] text-base mt-2 leading-relaxed">Compartilhe vídeos e colete feedback com timestamp</p>
        </div>
        <button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all flex items-center gap-2">
          <Plus size={16} /> Novo Upload
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nenhum vídeo enviado"
          description="Faça o upload do primeiro vídeo para começar"
          action={{ label: 'Novo Upload', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((d) => (
            <div key={d.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all">
              <div className="aspect-video bg-[#111] flex items-center justify-center">
                <Video size={32} className="text-gray-500" />
              </div>
              <div className="p-5">
                <div className="font-semibold text-sm mb-2">{d.title}</div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${d.status === 'delivered' ? 'bg-green-500/10 text-green-400' : d.status === 'processing' ? 'bg-blue-500/10 text-blue-400' : d.status === 'ready' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {d.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(d.id, d.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                    {d.token && (
                      <button onClick={() => copyToken(d.token)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-white/5 transition-all" title="Copiar link público">
                        {copied === d.token ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Editar Vídeo' : 'Novo Vídeo'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Título</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="Título do vídeo" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">URL do Vídeo</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full" placeholder="https://..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Enviar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
