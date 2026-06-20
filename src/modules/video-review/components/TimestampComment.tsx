// src/modules/video-review/components/TimestampComment.tsx
import { CheckCircle, Circle } from 'lucide-react';

interface TimestampCommentProps {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  resolved: boolean;
  created_at: string;
  onSeek?: (time: number) => void;
  onToggleResolved?: (id: string, resolved: boolean) => void;
}

export const TimestampComment = ({
  id,
  author,
  content,
  timestamp,
  resolved,
  created_at,
  onSeek,
  onToggleResolved,
}: TimestampCommentProps) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-lg border p-3 transition-colors ${resolved ? 'border-success/20 bg-success/5' : 'border-border bg-surface'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onSeek?.(timestamp)}
              className="text-xs font-mono text-accent hover:text-accent-light bg-accent/10 rounded px-1.5 py-0.5"
            >
              {formatTime(timestamp)}
            </button>
            <span className="text-xs font-medium text-text-primary truncate">{author}</span>
          </div>
          <p className={`text-sm ${resolved ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {content}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {new Date(created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        {onToggleResolved && (
          <button
            onClick={() => onToggleResolved(id, !resolved)}
            className={`mt-0.5 ${resolved ? 'text-success' : 'text-text-muted hover:text-success'} transition-colors`}
          >
            {resolved ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
