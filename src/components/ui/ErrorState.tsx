import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export const ErrorState = ({ title = 'Algo deu errado', description, onRetry, icon }: ErrorStateProps) => {
  return (
    <div className="error-state" role="alert">
      {icon && <div className="empty-state-icon text-error">{icon}</div>}
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-text">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Tentar novamente
        </Button>
      )}
    </div>
  );
};
