// src/components/Layout/FloatingDock.tsx
import { useState } from 'react';
import { Plus, UserPlus, FolderPlus, FilePlus } from 'lucide-react';

interface FloatingDockProps {
  collapsed: boolean;
}

export const FloatingDock = ({ collapsed }: FloatingDockProps) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: 'Novo Cliente', icon: UserPlus, onClick: () => {} },
    { label: 'Novo Projeto', icon: FolderPlus, onClick: () => {} },
    { label: 'Novo Documento', icon: FilePlus, onClick: () => {} },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: collapsed ? 122 : 264,
        bottom: 24,
        zIndex: 50,
        transition: 'left .25s ease',
      }}
    >
      <div
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 8px',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        }}
      >
        <button
          onClick={() => setOpen(v => !v)}
          className="btn-icon"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 10,
            width: 32,
            height: 32,
          }}
        >
          <Plus size={16} />
        </button>

        {open && actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="btn-icon btn-ghost"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              color: 'var(--text-secondary)',
              animation: 'fadeIn .2s ease-out',
              position: 'relative',
            }}
            title={action.label}
          >
            <action.icon size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};
