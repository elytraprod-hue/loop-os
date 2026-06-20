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
    <div style={{
      borderRadius: 8,
      border: `1px solid ${resolved ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
      padding: 12,
      background: resolved ? 'rgba(34,197,94,0.05)' : 'var(--surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <button
              onClick={() => onSeek?.(timestamp)}
              style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--accent)', background: 'rgba(var(--accent-rgb),0.1)', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}
            >
              {formatTime(timestamp)}
            </button>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{author}</span>
          </div>
          <p style={{ fontSize: 14, color: resolved ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: resolved ? 'line-through' : 'none' }}>
            {content}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {new Date(created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        {onToggleResolved && (
          <button
            onClick={() => onToggleResolved(id, !resolved)}
            style={{ marginTop: 2, color: resolved ? 'var(--success)' : 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {resolved ? <CheckCircle size={16} /> : <Circle size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};
