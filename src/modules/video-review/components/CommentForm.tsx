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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--accent)', background: 'rgba(var(--accent-rgb),0.1)', borderRadius: 4, padding: '2px 6px' }}>
          {formatTime(currentTime)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Adicione um comentário neste momento do vídeo..."
          style={{
            flex: 1,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            padding: '8px 12px',
            fontSize: 14,
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <Button type="submit" size="sm" isLoading={isLoading}>
          Enviar
        </Button>
      </div>
    </form>
  );
};
