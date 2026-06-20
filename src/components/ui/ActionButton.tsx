// src/components/ui/ActionButton.tsx
import React from 'react';
import { Button } from './Button';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className,
}: ActionButtonProps) => {
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover',
    danger: 'bg-error text-white hover:bg-error/90',
    success: 'bg-success text-white hover:bg-success/90',
  };

  return (
    <Button
      onClick={onClick}
      className={`flex items-center gap-2 ${variantStyles[variant]} ${className}`}
      size={size}
    >
      {icon}
      {children}
    </Button>
  );
};
