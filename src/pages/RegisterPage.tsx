// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/authService';
import { supabase } from '../lib/supabase';
import { tenant } from '../config/tenant';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp, user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/app/dashboard' },
    });
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="glass animate-scaleIn" style={{ maxWidth: 440, width: '100%', borderRadius: 24, padding: 40, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Conta criada!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Verifique seu email para confirmar o cadastro.
          </p>
          <Link to="/" className="btn btn--primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div
        className="glass animate-scaleIn"
        style={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 24,
          padding: 36,
          backdropFilter: 'var(--glass-blur)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{tenant.name.charAt(0)}</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{tenant.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Crie sua conta</p>
        </div>

        <button
          onClick={handleGitHub}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,.15)',
            background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Cadastrar com GitHub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" required
              style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Senha</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
            />
          </div>
          {error && (
            <div style={{ background: 'rgba(239,68,68,.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn--primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <span style={{ color: 'var(--text-muted)' }}>Já tem conta? </span>
          <Link to="/" style={{ color: 'var(--accent)' }}>Entrar</Link>
        </div>
      </div>
    </div>
  );
};
