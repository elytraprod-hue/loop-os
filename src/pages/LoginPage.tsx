// src/pages/LoginPage.tsx
import { useState } from 'react';
import { tenant } from '../config/tenant';
import { Modal } from '../components/ui/Modal';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with Supabase auth
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/app/dashboard' },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>L</span>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
          {tenant.name}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Entre para continuar</p>
      </div>

      {/* GitHub OAuth */}
      <button
        onClick={handleGitHub}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.15)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 20,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Entrar com GitHub
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>ou</span>
        <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 12,
              padding: '12px 14px',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 12,
              padding: '12px 14px',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            background: '#f97316',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          Entrar
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8 }}>
          <a href="/forgot-password" style={{ color: 'var(--text-muted)' }}>Esqueceu a senha?</a>
          <a href="/signup" style={{ color: 'var(--accent)' }}>Criar conta</a>
        </div>
      </form>
    </Modal>
  );
};
