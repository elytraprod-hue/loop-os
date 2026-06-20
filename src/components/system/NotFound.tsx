import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const NotFound = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ maxWidth: 448, textAlign: 'center' }}>
        <h1 style={{ fontSize: 60, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, margin: 0 }}>404</h1>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
