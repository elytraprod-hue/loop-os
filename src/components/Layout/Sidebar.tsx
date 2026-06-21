// src/components/Layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { tenant } from '../../config/tenant';
import {
  LayoutDashboard, Users, FolderOpen, FileText,
  Video, DollarSign, Brain, BarChart3, Shield,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const navigation = [
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col z-100 transition-all duration-250 overflow-hidden ${collapsed ? 'w-24' : 'w-[238px]'}`}>
      {/* Logo */}
      <div className={`h-18 flex items-center ${collapsed ? 'justify-center' : 'justify-start'} ${collapsed ? '' : 'px-6'} border-b border-white/10 gap-2.5`}>
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-extrabold text-sm">{tenant.name.charAt(0)}</span>
        </div>
        {!collapsed && (
          <span className="font-display font-black text-orange-500 text-xl whitespace-nowrap">
            {tenant.name}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              flex items-center gap-3 p-2.5 mb-1 rounded-xl ${collapsed ? 'justify-center' : 'justify-start px-4'}
              transition-all duration-150 text-sm
              ${isActive 
                ? 'border-l-[3px] border-orange-500 bg-orange-500/10 text-orange-400 font-semibold' 
                : 'text-gray-400 hover:bg-white/8'
              }
            `}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm hover:text-gray-300 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Recolher</>}
        </button>
      </div>
    </aside>
  );
};
