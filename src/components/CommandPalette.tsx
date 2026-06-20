// src/components/CommandPalette.tsx
import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, FileText, Video, DollarSign, Brain, BarChart3, Shield } from 'lucide-react';

const pages = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'CRM', href: '/app/crm', icon: Users },
  { name: 'Projetos', href: '/app/projects', icon: FolderOpen },
  { name: 'Documentos', href: '/app/documents', icon: FileText },
  { name: 'Video Review', href: '/app/video-review', icon: Video },
  { name: 'Financeiro', href: '/app/finance', icon: DollarSign },
  { name: 'Ferramentas IA', href: '/app/ai-tools', icon: Brain },
  { name: 'Análises', href: '/app/analytics', icon: BarChart3 },
  { name: 'Admin', href: '/app/admin', icon: Shield },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: open ? 'grid' : 'none',
        placeItems: 'center',
        padding: '24px',
        background: 'rgba(0,0,0,.58)',
        backdropFilter: 'blur(18px)',
        animation: 'fadeIn .15s ease-out',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Palette"
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 20,
          boxShadow: '0 24px 90px rgba(0,0,0,.4)',
          overflow: 'hidden',
          animation: 'scaleIn .2s ease-out',
        }}
      >
        <Command.Input
          placeholder="Buscar páginas, ações..."
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <Command.List style={{ padding: '8px', maxHeight: 300, overflowY: 'auto' }}>
          <Command.Empty style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Nenhum resultado encontrado.
          </Command.Empty>
          <Command.Group heading="Navegação" style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 12px 8px' }}>
            {pages.map((page) => (
              <Command.Item
                key={page.name}
                onSelect={() => { navigate(page.href); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <page.icon size={16} color="var(--accent)" />
                {page.name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </div>
  );
};
