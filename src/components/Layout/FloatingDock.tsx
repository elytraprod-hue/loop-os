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
      className={`fixed bottom-6 left-[calc(238px+26px)] flex gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 z-50 transition-all duration-250 ${collapsed ? 'left-[calc(96px+26px)]' : 'left-[calc(238px+26px)]'}`}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl w-8 h-8 flex items-center justify-center transition-all"
      >
        <Plus size={16} />
      </button>

      {open && actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/8 transition-all animate-fadeIn relative"
          title={action.label}
        >
          <action.icon size={16} />
        </button>
      ))}
    </div>
  );
};
