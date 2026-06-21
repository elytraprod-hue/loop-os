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
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main className={`ml-[238px] min-h-screen bg-[#0d0d0d] flex-1 transition-all duration-250 ${collapsed ? 'ml-24' : 'ml-[238px]'} p-8 pb-32`}>
        <Header onMenuClick={() => setCollapsed(v => !v)} />
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      <FloatingDock collapsed={collapsed} />
    </div>
  );
};
