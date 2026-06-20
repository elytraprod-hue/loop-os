// src/components/ui/ErrorState.tsx
import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export const ErrorState = ({ title = 'Something went wrong', description, onRetry, icon }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-error/20 bg-error/5 p-12 text-center">
      {icon && <div className="mb-4 text-error">{icon}</div>}
      <h3 className="text-lg font-semibold text-error mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
};
