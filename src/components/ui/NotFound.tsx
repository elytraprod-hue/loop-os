// src/components/ui/NotFound.tsx
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
