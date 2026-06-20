// src/modules/video-review/components/CommentForm.tsx
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

interface CommentFormProps {
  currentTime: number;
  isLoading?: boolean;
  onSubmit: (data: { content: string; timestamp: number }) => Promise<void>;
}

export const CommentForm = ({ currentTime, isLoading, onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit({ content: content.trim(), timestamp: currentTime });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-accent bg-accent/10 rounded px-1.5 py-0.5">
          {formatTime(currentTime)}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Adicione um comentário neste momento do vídeo..."
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <Button type="submit" size="sm" isLoading={isLoading}>
          Enviar
        </Button>
      </div>
    </form>
  );
};
