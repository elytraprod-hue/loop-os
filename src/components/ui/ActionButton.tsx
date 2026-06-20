import React from 'react';
import { Button, type ButtonProps } from './Button';

interface ActionButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

export const ActionButton = ({ children, icon, ...props }: ActionButtonProps) => {
  return (
    <Button icon={icon} {...props}>
      {children}
    </Button>
  );
};
