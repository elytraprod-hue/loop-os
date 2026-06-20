// src/modules/video-review/PublicReviewPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { VideoPlayer } from './components/VideoPlayer';
import { TimestampComment } from './components/TimestampComment';
import { CommentForm } from './components/CommentForm';

export const PublicReviewPage = () => {
  const { publicToken } = useParams<{ publicToken: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const queryClient = useQueryClient();

  const { data: deliverable, isLoading, error } = useQuery({
    queryKey: ['public-deliverable', publicToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title)')
        .eq('public_token', publicToken)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!publicToken,
  });

  const { data: comments } = useQuery({
    queryKey: ['public-comments', deliverable?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_comments')
        .select('*')
        .eq('deliverable_id', deliverable.id)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!deliverable?.id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (payload: { content: string; timestamp: number }) => {
      const { error } = await supabase.from('review_comments').insert({
        deliverable_id: deliverable.id,
        user_id: '00000000-0000-0000-0000-000000000000',
        guest_name: 'Convidado',
        timestamp_seconds: payload.timestamp,
        content: payload.content,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['public-comments', deliverable?.id] }),
  });

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description="Vídeo não encontrado ou link inválido" />;
  if (!deliverable) return <ErrorState description="Vídeo não encontrado" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{deliverable.title}</h1>
          <p className="text-text-muted">{(deliverable.projects as any)?.title}</p>
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
                Comentar em {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
              </h3>
              <CommentForm
                currentTime={currentTime}
                onSubmit={addCommentMutation.mutateAsync}
                isLoading={addCommentMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {(!comments || comments.length === 0) ? (
              <p className="text-sm text-text-muted">Nenhum comentário. Clique em um momento do vídeo para adicionar.</p>
            ) : (
              comments.map((c) => (
                <TimestampComment
                  key={c.id}
                  id={c.id}
                  author={c.guest_name}
                  content={c.content}
                  timestamp={c.timestamp_seconds}
                  resolved={c.resolved}
                  created_at={c.created_at}
                  onSeek={(t) => setCurrentTime(t)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
