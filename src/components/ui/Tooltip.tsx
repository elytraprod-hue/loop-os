import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = ({ content, children, side = 'top', className }: TooltipProps) => {
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={4}
          className={cn(
            'z-[5002] px-3 py-1.5 text-xs font-medium rounded-lg',
            'glass shadow-sm animate-fadeIn',
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white/10" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export type { TooltipProps };
