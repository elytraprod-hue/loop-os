import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { VideoPlayer } from '../../components/ui/VideoPlayer';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useDeliverableByTokenQuery, useReviewCommentsQuery, useCreateCommentMutation } from '../../hooks/useDbQuery';
import { toast } from 'sonner';

export const PublicReviewPage = () => {
  const { publicToken } = useParams();
  const { data: deliverable, isLoading, error } = useDeliverableByTokenQuery(publicToken);
  const { data: comments, refetch: refetchComments } = useReviewCommentsQuery(deliverable?.id);
  const createComment = useCreateCommentMutation();
  const [currentTime, setCurrentTime] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim() || !deliverable?.id) return;
    createComment.mutate(
      {
        deliverable_id: deliverable.id,
        user_id: '00000000-0000-0000-0000-000000000000', // placeholder for anonymous
        guest_name: guestName.trim() || 'Anônimo',
        timestamp_seconds: Math.floor(currentTime),
        content: commentText.trim(),
      },
      {
        onSuccess: () => {
          setCommentText('');
          refetchComments();
          toast.success('Comentário enviado!');
        },
        onError: () => toast.error('Erro ao enviar comentário'),
      }
    );
  };

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><LoadingSpinner size="lg" /></div>;
  if (error) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><ErrorState description="Link de review inválido ou expirado" /></div>;
  if (!deliverable) return null;

  return (
    <div style={{ minHeight: '100vh', padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 4 }}>
          {deliverable.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {(deliverable as any).projects?.title ? `Projeto: ${(deliverable as any).projects.title}` : ''}
        </p>
      </div>

      <VideoPlayer
        src={deliverable.hls_url || deliverable.video_url || undefined}
        onTimeUpdate={setCurrentTime}
        className="animate-fadeUp"
      />

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>
            Comentários ({comments?.length || 0})
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Comentar'}
          </Button>
        </div>

        {showForm && (
          <div className="glass" style={{ padding: 16, borderRadius: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              className="input-base"
              style={{ fontSize: 13, padding: '8px 12px' }}
              placeholder="Seu nome (opcional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input-base"
                style={{ fontSize: 13, padding: '8px 12px', flex: 1 }}
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
        )}

        {(comments || []).length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 40 }}>
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(comments || []).map((c: any) => (
            <div key={c.id} className="glass-soft" style={{ padding: '10px 14px', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                  {formatTime(c.timestamp_seconds)}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {c.guest_name || 'Anônimo'}
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.4 }}>{c.content}</p>
            </div>
          ))}
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
