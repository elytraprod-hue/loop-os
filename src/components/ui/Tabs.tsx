import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: { value: string; label: string; icon?: React.ReactNode }[];
  children: React.ReactNode;
  className?: string;
}

export const Tabs = ({ value, onValueChange, tabs, children, className }: TabsProps) => {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          width: 'fit-content',
          ...(className ? {} : undefined),
        }}
        className={className}
        role="tablist"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              transition: 'all .2s',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--text-secondary)',
              outline: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {tab.icon}
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </div>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value} style={{ outline: 'none' }}>
          {children}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

export const TabsContent = TabsPrimitive.Content;

export type { TabsProps };
