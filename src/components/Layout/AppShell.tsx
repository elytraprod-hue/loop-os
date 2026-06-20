import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingDock } from './FloatingDock';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main
        style={{
          marginLeft: collapsed ? 96 : 238,
          padding: '32px 42px 118px',
          flex: 1,
          transition: 'margin-left .25s ease',
          minHeight: '100vh',
        }}
      >
        <Header onMenuClick={() => setCollapsed(v => !v)} />
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      <FloatingDock collapsed={collapsed} />
    </div>
  );
};
