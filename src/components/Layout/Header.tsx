// src/components/Layout/Header.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/authService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold">Studio OS</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar clientes, projetos..."
            className="pl-8 w-64"
          />
        </div>

        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>

        <div className="relative" ref={menuRef}>
          <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)}>
            <User className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-border bg-surface shadow-lg">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-hover hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-hover hover:text-text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
