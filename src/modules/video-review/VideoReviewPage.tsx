// src/modules/video-review/VideoReviewPage.tsx
import { useState } from 'react';
import { Search, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';

export const VideoReviewPage = () => {
  const [search, setSearch] = useState('');

  const { data: deliverables, isLoading, error, refetch } = useQuery({
    queryKey: ['deliverables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = (deliverables ?? []).filter((d) => {
    const q = search.toLowerCase();
    return !search || d.title.toLowerCase().includes(q);
  });

  const stats = {
    total: deliverables?.length ?? 0,
    ready: deliverables?.filter((d) => d.status === 'ready').length ?? 0,
    pending: deliverables?.filter((d) => d.status === 'pending').length ?? 0,
  };

  if (isLoading) return <LoadingSpinner size="xl" className="mx-auto mt-20" />;
  if (error) return <ErrorState description={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Review</h1>
        <p className="text-text-muted">Revise vídeos e adicione comentários com timestamp</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Prontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.ready}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Buscar vídeos..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum vídeo encontrado" description="Nenhum vídeo disponível para revisão" icon={<Video className="h-12 w-12" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Link
              key={d.id}
              to={`/video-review/${d.id}`}
              className="block rounded-lg border border-border bg-surface p-4 hover:border-accent/50 transition-colors"
            >
              <div className="aspect-video rounded-md bg-black flex items-center justify-center mb-3">
                <Video className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="font-medium text-text-primary truncate">{d.title}</h3>
              <p className="text-sm text-text-muted truncate mt-1">
                {(d.projects as any)?.title}
              </p>
              <div className="flex items-center justify-between mt-3">
                <StatusBadge status={d.status} variant="deliverable" />
                <ExternalLink className="h-3 w-3 text-text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
