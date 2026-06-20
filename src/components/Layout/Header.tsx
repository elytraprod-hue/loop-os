import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/authService';
import { tenant } from '../../config/tenant';


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
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 64,
        padding: '0 24px',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(13,13,13,.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        marginBottom: 24,
        borderRadius: 16,
      }}
    >
      <button
        onClick={onMenuClick}
        className="btn-icon btn-ghost"
        aria-label="Menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div style={{ flex: 1 }}>
        <h2 className="h4" style={{ margin: 0 }}>{tenant.name}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', display: 'none' }} className="search-desktop">
          <div style={{ position: 'relative', width: 256 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
            <input
              placeholder="Buscar..."
              className="input-base"
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .search-desktop { display: block; }
          }
        `}</style>

        <button className="btn-icon btn-ghost" aria-label="Notificações">
          <Bell size={18} />
        </button>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            className="btn-icon btn-ghost"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu do usuário"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {menuOpen && (
            <div
              className="glass"
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 8,
                width: 200,
                borderRadius: 12,
                padding: 8,
                zIndex: 200,
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--glass-border)',
                  marginBottom: 4,
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </p>
              </div>
              <Link
                to="/app/admin"
                className="btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  width: '100%',
                }}
                onClick={() => setMenuOpen(false)}
              >
                <Settings size={16} />
                Configurações
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  width: '100%',
                }}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
