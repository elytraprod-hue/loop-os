import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
}

export const DropdownMenu = ({ trigger, children, align = 'start', className }: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={4}
          className={`glass ${className || ''}`.trim()}
          style={{
            zIndex: 5002,
            borderRadius: 12,
            padding: '4px 0',
            minWidth: 180,
            boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          }}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuItemProps
>(({ className, children, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      fontSize: 14,
      cursor: 'pointer',
      outline: 'none',
      color: 'var(--text-secondary)',
      borderRadius: 6,
      ...style,
    }}
    className={className}
    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = () => (
  <DropdownMenuPrimitive.Separator style={{ height: 1, background: 'var(--glass-border)', margin: '4px 8px' }} />
);

export const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    style={{
      padding: '6px 12px',
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}
    className={className}
  >
    {children}
  </div>
);

export type { DropdownMenuProps };
