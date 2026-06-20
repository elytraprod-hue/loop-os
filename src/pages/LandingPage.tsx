import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, FolderOpen, FileText, TrendingUp, DollarSign, Menu, X, Cpu } from 'lucide-react';
import { tenant } from '../config/tenant';
import { LoginModal } from './LoginPage';

const features = [
  { title: 'Gestão de Projetos', desc: 'Pipeline completo e automatizado, do briefing à entrega final do material.', icon: FolderOpen },
  { title: 'Estúdio de Documentos', desc: 'Briefings estruturados, roteiros colaborativos, propostas e contratos digitais.', icon: FileText },
  { title: 'Video Review Integrado', desc: 'Revisão frame a frame com comentários vinculados a timestamps e aprovações do cliente.', icon: Play },
  { title: 'Painel de Analytics', desc: 'Gráficos e métricas precisas sobre produtividade, prazos e saúde financeira.', icon: TrendingUp },
  { title: 'Arquitetura White Label', desc: 'Personalize com a identidade visual da sua produtora: logo, cores e domínio próprio.', icon: Sparkles },
  { title: 'Inteligência Artificial', desc: 'Gere briefings, ideias de roteiro e resumos executivos em segundos com IA.', icon: Cpu },
];

const steps = [
  { num: '01', title: 'Personalize a Marca', desc: 'Configure as cores, logotipos e domínios da sua produtora em instantes.' },
  { num: '02', title: 'Produza sem Barreiras', desc: 'Organize fases de produção, controle roteiros, orçamentos e cronogramas Gantt.' },
  { num: '03', title: 'Aprovação Acelerada', desc: 'Colete feedback direto de vídeo dos clientes com marcações de tempo precisas.' },
];

export const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(location.pathname === '/signin');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('#ff7425');

  // Interactive Mockup states
  const [mockupTab, setMockupTab] = useState<'review' | 'projects' | 'finance'>('review');
  const [demoTime, setDemoTime] = useState<number>(10);
  const [demoProjects, setDemoProjects] = useState([
    { id: 1, title: 'Comercial Coca-Cola', client: 'Coca-Cola', status: 'production' },
    { id: 2, title: 'Documentário Cerrado', client: 'WWF', status: 'briefing' },
    { id: 3, title: 'Videoclipe Anitta', client: 'Warner', status: 'delivered' }
  ]);

  const handleMoveDemoProject = (id: number) => {
    setDemoProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextStatus: Record<string, string> = {
        briefing: 'production',
        production: 'delivered',
        delivered: 'briefing'
      };
      return { ...p, status: nextStatus[p.status] || 'briefing' };
    }));
  };

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    setLoginOpen(location.pathname === '/signin');
  }, [location.pathname]);

  useEffect(() => {
    const themeMap: Record<string, { dim: string; border: string; glow: string }> = {
      '#ff7425': { dim: 'rgba(255, 116, 37, 0.14)', border: 'rgba(255, 116, 37, 0.28)', glow: 'rgba(255, 116, 37, 0.18)' },
      '#6366f1': { dim: 'rgba(99, 102, 241, 0.14)', border: 'rgba(99, 102, 241, 0.28)', glow: 'rgba(99, 102, 241, 0.18)' },
      '#06b6d4': { dim: 'rgba(6, 182, 212, 0.14)', border: 'rgba(6, 182, 212, 0.28)', glow: 'rgba(6, 182, 212, 0.18)' },
      '#10b981': { dim: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.28)', glow: 'rgba(16, 185, 129, 0.18)' },
    };
    const currentTheme = themeMap[accentColor] || { dim: 'rgba(255, 116, 37, 0.14)', border: 'rgba(255, 116, 37, 0.28)', glow: 'rgba(255, 116, 37, 0.18)' };
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-dim', currentTheme.dim);
    document.documentElement.style.setProperty('--accent-border', currentTheme.border);
    document.documentElement.style.setProperty('--accent-glow', currentTheme.glow);
  }, [accentColor]);

  const handleCloseLogin = () => {
    setLoginOpen(false);
    if (location.pathname === '/signin') {
      navigate('/');
    }
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="my-app" style={{ position: 'relative', minHeight: '100vh', background: '#070708', overflow: 'hidden', color: '#fff' }}>
      
      {/* Custom Cursor */}
      <div className="cursor-outer d-none d-lg-block" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-inner d-none d-lg-block" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Background Grid & Decorative Lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />
      <div className="lines">
        <div className="line" /><div className="line" /><div className="line" />
        <div className="line" /><div className="line" />
      </div>

      {/* Ambient Glowing Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '50vw',
        height: '50vw',
        maxHeight: 600,
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        top: '-15%',
        left: '25%',
        filter: 'blur(120px)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.55,
        transition: 'background 0.5s ease'
      }} />
      <div style={{
        position: 'absolute',
        width: '40vw',
        height: '40vw',
        maxHeight: 500,
        background: 'radial-gradient(circle, rgba(255,255,255,0.01) 0%, transparent 60%)',
        bottom: '10%',
        right: '10%',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7
      }} />

      {/* ===== HEADER ===== */}
      <header className="glass" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 76,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        background: 'rgba(7, 7, 8, 0.65)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px var(--accent-glow)', transition: 'all 0.3s' }}>
              <Play size={16} color="#000" fill="#000" style={{ marginLeft: 2 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 21, color: '#fff', letterSpacing: '-0.02em' }}>
              {tenant.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="d-none d-lg-flex">
            <a href="#features" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, transition: 'color 0.2s' }}>Recursos</a>
            <a href="#workflow" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, transition: 'color 0.2s' }}>Como Funciona</a>
            <a href="#brand-showcase" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, transition: 'color 0.2s' }}>Demonstração</a>
          </nav>

          {/* Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setLoginOpen(true)}
              className="btn btn-sm btn-primary d-none d-sm-inline-flex"
              style={{ padding: '10px 22px', fontSize: 13, borderRadius: 10, cursor: 'pointer', height: 40 }}
            >
              Entrar no Cockpit
            </button>
            
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="d-flex d-lg-none"
              style={{ color: '#fff', cursor: 'pointer', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="glass" style={{
          position: 'fixed',
          top: 76,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(7, 7, 8, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          animation: 'slideDown 0.3s ease-out'
        }}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 18, fontWeight: 700, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Recursos</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 18, fontWeight: 700, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Como Funciona</a>
          <a href="#brand-showcase" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 18, fontWeight: 700, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Demonstração</a>
          
          <button
            onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
          >
            Acessar Sistema
          </button>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section style={{ padding: '170px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="row" style={{ alignItems: 'center', gap: 40 }}>
            {/* Left Copywriting */}
            <div className="col-12 col-lg-6" style={{ textAlign: 'left', paddingRight: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Sparkles size={13} /> Sistema Cockpit Audiovisual
              </div>
              
              <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', lineHeight: 1.1, fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.02em' }}>
                Acelere suas <br />
                produções com <br />
                <span className="text-stroke" style={{ WebkitTextStroke: '2px var(--accent)' }}>{tenant.name}</span>
              </h1>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
                Gerencie briefings inteligentes, alinhe cronogramas Gantt, colete aprovações de vídeo com comentários por timestamp e unifique o fluxo financeiro sob a sua própria identidade de marca.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link to="/signin" className="btn btn--primary" style={{ padding: '16px 30px', fontSize: 13, fontWeight: 700, borderRadius: 12 }}>
                  Acessar Cockpit <ArrowRight size={16} />
                </Link>
                <a href="#brand-showcase" className="btn btn--secondary" style={{ padding: '16px 30px', fontSize: 13, fontWeight: 700, borderRadius: 12 }}>
                  Ver Personalização
                </a>
              </div>

              {/* Interactive Brand Customizer dot selector */}
              <div id="brand-showcase" style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  White Label — Teste as cores da sua marca:
                </span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {[
                    { color: '#ff7425', name: 'Laranja Studio' },
                    { color: '#6366f1', name: 'Índigo Digital' },
                    { color: '#06b6d4', name: 'Ciano Criativo' },
                    { color: '#10b981', name: 'Esmeralda Filmes' },
                  ].map(t => (
                    <button
                      key={t.color}
                      onClick={() => setAccentColor(t.color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: t.color,
                        border: accentColor === t.color ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                        boxShadow: accentColor === t.color ? `0 0 14px ${t.color}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        transform: accentColor === t.color ? 'scale(1.2)' : 'scale(1)',
                      }}
                      title={t.name}
                    />
                  ))}
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8, fontWeight: 600 }}>
                    {accentColor === '#ff7425' ? 'Laranja Audiovisual' :
                     accentColor === '#6366f1' ? 'Índigo Produtora' :
                     accentColor === '#06b6d4' ? 'Ciano Tecnológico' : 'Esmeralda Cinema'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Interactive Mockup Dashboard */}
            <div className="col-12 col-lg-6">
              <div className="glass animate-scaleIn" style={{
                borderRadius: 20,
                padding: 0,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px var(--accent-glow)',
                border: '1px solid var(--glass-border)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.4s ease',
              }}>
                {/* Simulated Window Title Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
                    cockpit.{tenant.name.toLowerCase().replace(' ', '')}.com.br
                  </div>
                  <div style={{ width: 36 }} />
                </div>

                <div style={{ display: 'flex', height: 430, flexDirection: 'row' }}>
                  {/* Mockup Sidebar */}
                  <div style={{ width: 140, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '18px 8px', background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', paddingLeft: 8, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Navegar Módulos
                    </div>
                    {[
                      { id: 'review', label: 'Video Review', icon: Play },
                      { id: 'projects', label: 'Kanban Fases', icon: FolderOpen },
                      { id: 'finance', label: 'Financeiro', icon: DollarSign },
                    ].map(tab => {
                      const isSelected = mockupTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setMockupTab(tab.id as any)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 10px',
                            borderRadius: 8,
                            background: isSelected ? 'var(--accent-dim)' : 'transparent',
                            color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                            fontSize: 12,
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                            width: '100%',
                            border: isSelected ? '1px solid var(--accent-border)' : '1px solid transparent'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s' }} />
                          </div>
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mockup Dynamic Content */}
                  <div style={{ flex: 1, padding: 20, background: 'rgba(7,7,8,0.3)', overflowY: 'auto' }}>
                    {mockupTab === 'review' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fadeIn">
                        {/* Simulated Video Player */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 12, background: '#121214', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #1b0f06 0%, #06040b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}>
                              <Play size={18} color="var(--accent)" fill="var(--accent)" style={{ marginLeft: 2 }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 10, fontWeight: 600 }}>Corte_Final_v2_Recortado.mp4</span>
                          </div>

                          {/* Controls bar overlay */}
                          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.75)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ fontSize: 9, color: '#fff', fontFamily: 'var(--font-mono)' }}>{formatTime(demoTime)}</span>
                            {/* Track bar */}
                            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, position: 'relative' }}>
                              <div style={{ width: `${(demoTime / 40) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s ease' }} />
                              {/* Clicking points markers */}
                              <div style={{ position: 'absolute', left: '25%', top: -2, width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid var(--accent)', cursor: 'pointer' }} onClick={() => setDemoTime(10)} />
                              <div style={{ position: 'absolute', left: '75%', top: -2, width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid var(--accent)', cursor: 'pointer' }} onClick={() => setDemoTime(30)} />
                            </div>
                            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>00:40</span>
                          </div>
                        </div>

                        {/* Interactive Comments Feed */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Comentários com Timestamp (Clique para Navegar)
                          </div>
                          {[
                            { time: 10, author: 'Carlos (Diretor de Arte)', text: 'Adorei a tonalidade de cor nessa introdução, mantém a paleta comercial perfeitamente.' },
                            { time: 30, author: 'Mariana (Marketing Cliente)', text: 'O encerramento precisa de mais 2 segundos com o logo da marca visível.' }
                          ].map(comment => (
                            <div
                              key={comment.time}
                              onClick={() => setDemoTime(comment.time)}
                              className="glass-soft"
                              style={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                cursor: 'pointer',
                                border: demoTime === comment.time ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                background: demoTime === comment.time ? 'var(--accent-soft)' : 'rgba(255,255,255,0.02)',
                                transition: 'all 0.25s',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Play size={8} fill="var(--accent)" /> 00:{comment.time}
                                </span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{comment.author}</span>
                              </div>
                              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mockupTab === 'projects' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fadeIn">
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                          Kanban Interativo (Clique no card para mover de fase)
                        </div>
                        
                        <div style={{ display: 'flex', gap: 8 }}>
                          {[
                            { id: 'briefing', label: 'Briefing' },
                            { id: 'production', label: 'Produção' },
                            { id: 'delivered', label: 'Entregue' }
                          ].map(col => {
                            const itemsInCol = demoProjects.filter(p => p.status === col.id);
                            return (
                              <div key={col.id} style={{ flex: 1, background: 'rgba(255,255,255,0.015)', borderRadius: 10, padding: 8, minHeight: 180, border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, paddingLeft: 2 }}>
                                  {col.label} · {itemsInCol.length}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {itemsInCol.map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => handleMoveDemoProject(p.id)}
                                      className="glass-soft"
                                      style={{
                                        padding: 12,
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        background: 'rgba(255,255,255,0.01)',
                                        transition: 'all 0.2s',
                                      }}
                                    >
                                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.title}</div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{p.client}</span>
                                        <span className={`badge ${p.status === 'delivered' ? 'badge-success' : p.status === 'production' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: 7, padding: '1px 5px' }}>
                                          {p.status === 'delivered' ? 'Entregue' : p.status === 'production' ? 'Produção' : 'Briefing'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {mockupTab === 'finance' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fadeIn">
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                          Fluxo de Caixa & Margem Operacional
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                          {[
                            { label: 'Receitas', value: 'R$ 75.000', color: 'var(--success)' },
                            { label: 'Custos', value: 'R$ 28.300', color: 'var(--danger)' },
                            { label: 'Resultado', value: 'R$ 46.700', color: 'var(--accent)' }
                          ].map(m => (
                            <div key={m.label} className="glass-soft" style={{ padding: 12, borderRadius: 10, textAlign: 'center' }}>
                              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* CSS Progress Bar */}
                        <div className="glass-soft" style={{ padding: 16, borderRadius: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                            <span>Faturamento (72%)</span>
                            <span>Despesas Operacionais (28%)</span>
                          </div>
                          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                            <div style={{ width: '72%', background: 'linear-gradient(90deg, var(--success-dim), var(--success))' }} />
                            <div style={{ width: '28%', background: 'linear-gradient(90deg, var(--danger-dim), var(--danger))' }} />
                          </div>
                        </div>

                        {/* Simulated Transactions List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Extrato Unificado
                          </div>
                          {[
                            { desc: 'Entrada Parcela 2 Comercial Coca-Cola', type: 'income', val: 'R$ 20.000', project: 'Coca-Cola' },
                            { desc: 'Pagamento Diárias de Câmera/Luz', type: 'expense', val: 'R$ 6.400', project: 'Comercial' }
                          ].map((tx, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.015)', borderRadius: 8, fontSize: 11, border: '1px solid rgba(255,255,255,0.02)' }}>
                              <div>
                                <div style={{ color: '#fff', fontWeight: 600 }}>{tx.desc}</div>
                                <span style={{ fontSize: 9, color: 'var(--accent)' }}>Projeto: {tx.project}</span>
                              </div>
                              <span style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                                {tx.type === 'income' ? '+' : '-'} {tx.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETAILED FEATURES SECTION ===== */}
      <section id="features" className="section" style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                <span className="sub-title">
                  <Sparkles size={14} /> Soluções do Cockpit
                </span>
                <h2 className="title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                  A produtividade que seu estúdio precisa
                </h2>
              </div>
            </div>
          </div>
          <div className="row gaper">
            {features.map((f) => (
              <div key={f.title} className="col-12 col-sm-6 col-lg-4">
                <div className="glass glass-hover" style={{ padding: 36, borderRadius: 20, transition: 'all 0.3s ease', cursor: 'default', height: '100%' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 10px var(--accent-glow)' }}>
                    <f.icon size={20} color="var(--accent)" />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, marginBottom: 12, color: '#fff' }}>{f.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== PIPELINE / WORKFLOW SECTION ===== */}
      <section id="workflow" className="section" style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                <span className="sub-title">
                  <Sparkles size={14} /> Fluxo de Trabalho
                </span>
                <h2 className="title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                  Como unificamos sua produção
                </h2>
              </div>
            </div>
          </div>
          
          <div className="row gaper" style={{ marginTop: 20 }}>
            {steps.map((step) => (
              <div key={step.num} className="col-12 col-lg-4">
                <div className="glass" style={{ padding: 36, borderRadius: 24, position: 'relative', overflow: 'hidden', height: '100%' }}>
                  {/* Decorative big gradient backdrop number */}
                  <div style={{ position: 'absolute', right: 10, top: -10, fontSize: 120, fontWeight: 900, color: 'rgba(255,255,255,0.015)', fontFamily: 'var(--font-display)', userSelect: 'none' }}>
                    {step.num}
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 16 }}>
                    PASSO {step.num}
                  </span>
                  <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)', color: '#fff' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== CALL TO ACTION SECTION ===== */}
      <section id="cta" className="section" style={{ padding: '120px 0', textAlign: 'center', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center" style={{ marginBottom: 0 }}>
                <span className="sub-title">
                  <Sparkles size={14} /> Comece Agora
                </span>
                <h2 className="title" style={{ marginBottom: 20, fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                  Pronto para profissionalizar seu estúdio?
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 40px', fontSize: 16, lineHeight: 1.7 }}>
                  Junte-se a produtoras líderes que já usam o cockpit {tenant.name} para centralizar tarefas, fechar orçamentos e encantar clientes.
                </p>
                <div>
                  <Link to="/signin" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 36px', borderRadius: 12 }}>
                    Criar Workspace Cockpit <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="section pb-0" style={{ padding: '80px 0 0', borderTop: '1px solid rgba(255,255,255,.06)', position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <div className="row gaper align-items-start">
            <div className="col-12 col-lg-6" style={{ marginBottom: 40 }}>
              <div className="logo" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={14} color="#000" fill="#000" style={{ marginLeft: 2 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#fff' }}>{tenant.name}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 420, fontSize: 14, lineHeight: 1.8 }}>
                O cockpit definitivo white-label criado especialmente para produtoras, filmmakers e estúdios de pós-produção audiovisual gerenciarem seus negócios em alto nível.
              </p>
            </div>
            
            <div className="col-12 col-lg-6" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Contato da Produtora</h4>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <a href={`mailto:contato@${tenant.name.toLowerCase().replace(' ', '')}.com.br`} style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 700 }}>
                  contato@{tenant.name.toLowerCase().replace(' ', '')}.com.br
                </a>
                <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                  Tel: +55 (11) 99999-9999
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer__copyright" style={{ marginTop: 60, padding: '24px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
                  Copyright &copy; {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Login CTA Button in the corner */}
      <Link to="/signin" className="btn btn--primary" style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100, boxShadow: '0 4px 24px var(--accent-glow)', textDecoration: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 13 }}>
        Acessar Sistema
      </Link>

      <LoginModal open={loginOpen} onClose={handleCloseLogin} />
    </div>
  );
};
