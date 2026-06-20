import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '../../components/ui/VideoPlayer';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useDeliverableQuery, useReviewCommentsQuery, useCreateCommentMutation } from '../../hooks/useDbQuery';
import { useAuth } from '../auth/AuthProvider';
import { toast } from 'sonner';

export const VideoPlayerPage = () => {
  const { deliverableId } = useParams();
  const { user } = useAuth();
  const { data: deliverable, isLoading, error, refetch } = useDeliverableQuery(deliverableId);
  const { data: comments, refetch: refetchComments } = useReviewCommentsQuery(deliverableId);
  const createComment = useCreateCommentMutation();
  const [currentTime, setCurrentTime] = useState(0);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!commentText.trim() || !deliverableId || !user) return;
    createComment.mutate(
      { deliverable_id: deliverableId, user_id: user.id, timestamp_seconds: Math.floor(currentTime), content: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText('');
          refetchComments();
          toast.success('Comentário adicionado');
        },
        onError: () => toast.error('Erro ao adicionar comentário'),
      }
    );
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><LoadingSpinner size="lg" /></div>;
  if (error) return <ErrorState description="Erro ao carregar vídeo" onRetry={refetch} />;
  if (!deliverable) return <ErrorState description="Vídeo não encontrado" />;

  return (
    <div className="animate-fadeUp">
      <Link to="/app/video-review" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="page-hero" style={{ marginBottom: 24 }}>
        <h1>{deliverable.title}</h1>
        <p>{(deliverable as any).projects?.title}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        <VideoPlayer
          src={deliverable.hls_url || deliverable.video_url || undefined}
          onTimeUpdate={setCurrentTime}
        />

        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Comentários</span>
            <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>{comments?.length || 0}</span>
          </div>

          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
            {(comments || []).length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                Nenhum comentário ainda. Clique em um momento do vídeo e comente.
              </p>
            )}
            {(comments || []).map((c: any) => (
              <div key={c.id} className="glass-soft" style={{ padding: '10px 14px', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
                    {formatTime(c.timestamp_seconds)}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {c.guest_name || 'Usuário'}
                  </span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.4 }}>{c.content}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 8 }}>
            <input
              className="input-base"
              style={{ fontSize: 13, padding: '8px 12px' }}
              placeholder={`Comentar em ${formatTime(currentTime)}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
            />
            <Button size="sm" onClick={handleAddComment} loading={createComment.isPending}>
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
