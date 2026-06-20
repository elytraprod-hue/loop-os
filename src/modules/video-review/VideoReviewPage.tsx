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
      <div className="page-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Video Review</h1>
          <p>Compartilhe vídeos e colete feedback com timestamp</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {items.map((d) => (
            <div key={d.id} className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={32} color="var(--text-muted)" />
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{d.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${d.status === 'delivered' ? 'badge-success' : d.status === 'processing' ? 'badge-info' : d.status === 'ready' ? 'badge-info' : 'badge-warning'}`}>
                    {d.status}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => openEdit(d)} className="btn-icon btn-ghost" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(d.id, d.title)} className="btn-icon btn-ghost" title="Excluir">
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                    {d.token && (
                      <button onClick={() => copyToken(d.token)} className="btn-icon btn-ghost" title="Copiar link público">
                        {copied === d.token ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Título</label>
            <input className="input-base" placeholder="Título do vídeo" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>URL do Vídeo</label>
            <input className="input-base" placeholder="https://..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Enviar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
