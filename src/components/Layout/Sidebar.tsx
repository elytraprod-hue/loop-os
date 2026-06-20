// src/components/Layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { Home, Users, FolderOpen, FileText, Video, DollarSign, Brain, BarChart3, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Projetos', href: '/projects', icon: FolderOpen },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Video Review', href: '/video-review', icon: Video },
  { name: 'Financeiro', href: '/finance', icon: DollarSign },
  { name: 'Ferramentas de IA', href: '/ai-tools', icon: Brain },
  { name: 'Análises', href: '/analytics', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export const Sidebar = () => {
  return (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-text-muted hover:bg-surface-hover hover:text-text-primary'
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};
