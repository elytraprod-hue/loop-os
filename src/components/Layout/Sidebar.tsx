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
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 96 : 238,
        background: 'linear-gradient(180deg, rgba(17,17,17,.92) 0%, rgba(13,13,13,.96) 100%)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'width .25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: '1px solid var(--glass-border)',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>L</span>
        </div>
        {!collapsed && (
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: 'var(--accent)',
              whiteSpace: 'nowrap',
            }}
          >
            {tenant.name}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '12px 0' : '10px 16px',
              marginBottom: 4,
              borderRadius: 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all .15s',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
            })}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--glass-border)' }}>
        <button
          onClick={onToggle}
          className="btn-icon btn-ghost"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 8px',
            gap: 8,
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Recolher</>}
        </button>
      </div>
    </aside>
  );
};
