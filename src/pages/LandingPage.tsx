// src/pages/LandingPage.tsx
import { useState } from 'react';
import { ArrowRight, Film, Edit3, Share2, BarChart, Shield, Zap } from 'lucide-react';
import { tenant } from '../config/tenant';
import { LoginModal } from './LoginPage';

const features = [
  { icon: Film, title: 'Gestão de Projetos', desc: 'Pipeline completo do briefing à entrega' },
  { icon: Edit3, title: 'Documentos', desc: 'Briefings, roteiros, propostas e contratos' },
  { icon: Share2, title: 'Video Review', desc: 'Comentários com timestamp, aprovações' },
  { icon: BarChart, title: 'Analytics', desc: 'Métricas de produção e financeiro' },
  { icon: Shield, title: 'White Label', desc: 'Sua marca, seu sistema' },
  { icon: Zap, title: 'IA Integrada', desc: 'Ferramentas inteligentes de produção' },
];

const steps = [
  { num: '01', title: 'Configure', desc: 'Personalize o sistema com sua marca' },
  { num: '02', title: 'Produza', desc: 'Gerencie projetos do briefing à entrega' },
  { num: '03', title: 'Entregue', desc: 'Compartilhe com links públicos e colete feedback' },
];

export const LandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#090909 0%,#101010 44%,#0b0b0b 100%)' }}>
      {/* Hero */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(249,115,22,.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px,8vw,72px)',
            lineHeight: 1.1,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>{tenant.name}</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent), #fdba74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Produção Audiovisual
          </span>
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 18,
            maxWidth: 560,
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          Sistema completo para gestão de produção audiovisual — do briefing à entrega, com review de vídeo, documentos e analytics.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setLoginOpen(true)} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
            Entrar <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: 16 }}>
            Saiba mais
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          Tudo que você precisa
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="glass animate-fadeUp"
              style={{
                padding: 28,
                borderRadius: 20,
                transition: 'transform .2s, box-shadow .2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--accent-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <f.icon size={22} color="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          Como funciona
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {steps.map((s) => (
            <div
              key={s.num}
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '24px 32px',
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 32,
                  color: 'var(--accent)',
                  minWidth: 60,
                }}
              >
                {s.num}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        {tenant.name} &copy; {new Date().getFullYear()}
      </footer>

      {/* Floating access button */}
      <button
        onClick={() => setLoginOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 50,
          padding: '12px 24px',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(249,115,22,.3)',
        }}
      >
        Acessar sistema
      </button>

      {/* Login modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};
