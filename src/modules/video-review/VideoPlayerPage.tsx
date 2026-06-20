// src/modules/video-review/VideoPlayerPage.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/authService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { VideoPlayer } from './components/VideoPlayer';
import { TimestampComment } from './components/TimestampComment';
import { CommentForm } from './components/CommentForm';

export const VideoPlayerPage = () => {
  const { deliverableId } = useParams<{ deliverableId: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: deliverable, isLoading, error } = useQuery({
    queryKey: ['deliverable', deliverableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title)')
        .eq('id', deliverableId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!deliverableId,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', deliverableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_comments')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!deliverableId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (payload: { content: string; timestamp: number }) => {
      const { error } = await supabase.from('review_comments').insert({
        deliverable_id: deliverableId,
        user_id: user?.id,
        guest_name: user?.email ?? '',
        timestamp_seconds: payload.timestamp,
        content: payload.content,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', deliverableId] }),
  });

  const toggleResolvedMutation = useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      const { error } = await supabase.from('review_comments').update({ resolved }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', deliverableId] }),
  });

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} />;
  if (!deliverable) return <ErrorState description="Entrega não encontrada" />;

  const activeComments = comments?.filter((c) => !c.resolved) ?? [];
  const resolvedComments = comments?.filter((c) => c.resolved) ?? [];

  return (
    <div className="space-y-6">
      <Link to="/video-review" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{deliverable.title}</h1>
          <p className="text-sm text-text-muted">{(deliverable.projects as any)?.title}</p>
        </div>
        <StatusBadge status={deliverable.status} variant="deliverable" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer
            src={deliverable.video_url ?? undefined}
            hlsSrc={deliverable.hls_url ?? undefined}
            onTimeUpdate={setCurrentTime}
          />

          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Adicionar comentário em {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
            </h3>
            <CommentForm
              currentTime={currentTime}
              onSubmit={addCommentMutation.mutateAsync}
              isLoading={addCommentMutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">
              Comentários ({activeComments.length})
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {activeComments.length === 0 ? (
                <p className="text-sm text-text-muted">Nenhum comentário ainda</p>
              ) : (
                activeComments.map((c) => (
                  <TimestampComment
                    key={c.id}
                    id={c.id}
                    author={c.guest_name || c.user_id.slice(0, 8)}
                    content={c.content}
                    timestamp={c.timestamp_seconds}
                    resolved={c.resolved}
                    created_at={c.created_at}
                    onSeek={(t) => setCurrentTime(t)}
                    onToggleResolved={(id, resolved) => toggleResolvedMutation.mutateAsync({ id, resolved })}
                  />
                ))
              )}
            </div>
          </div>

          {resolvedComments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">
                Resolvidos ({resolvedComments.length})
              </h3>
              <div className="space-y-2">
                {resolvedComments.map((c) => (
                  <TimestampComment
                    key={c.id}
                    id={c.id}
                    author={c.guest_name || c.user_id.slice(0, 8)}
                    content={c.content}
                    timestamp={c.timestamp_seconds}
                    resolved={c.resolved}
                    created_at={c.created_at}
                    onToggleResolved={(id, resolved) => toggleResolvedMutation.mutateAsync({ id, resolved })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
