import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { tenant } from '../config/tenant';
import { LoginModal } from './LoginPage';

const features = [
  { title: 'Gestão de Projetos', desc: 'Pipeline completo do briefing à entrega' },
  { title: 'Documentos', desc: 'Briefings, roteiros, propostas e contratos' },
  { title: 'Video Review', desc: 'Comentários com timestamp, aprovações' },
  { title: 'Analytics', desc: 'Métricas de produção e financeiro' },
  { title: 'White Label', desc: 'Sua marca, seu sistema' },
  { title: 'IA Integrada', desc: 'Ferramentas inteligentes de produção' },
];

const steps = [
  { num: '01', title: 'Configure', desc: 'Personalize o sistema com sua marca' },
  { num: '02', title: 'Produza', desc: 'Gerencie projetos do briefing à entrega' },
  { num: '03', title: 'Entregue', desc: 'Compartilhe com links públicos e colete feedback' },
];

// Flow diagram SVG - clean minimal illustration of the 3-step pipeline
const workflowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="360" viewBox="0 0 500 360" fill="none">
  <defs>
    <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,116,37,.15)"/>
      <stop offset="100%" stop-color="rgba(255,116,37,.02)"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="498" height="358" rx="20" stroke="rgba(255,255,255,.08)" stroke-width="1" fill="url(#flowGrad)"/>
  
  <!-- Step 1: Briefing -->
  <rect x="40" y="50" width="120" height="100" rx="12" stroke="rgba(255,116,37,.4)" stroke-width="1.5" fill="rgba(255,116,37,.06)"/>
  <text x="100" y="88" text-anchor="middle" fill="#ff7425" font-size="13" font-weight="700" font-family="Syne">Briefing</text>
  <text x="100" y="110" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">Definição de</text>
  <text x="100" y="126" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">escopo e prazo</text>
  
  <!-- Arrow 1 -->
  <path d="M165 100 L190 100" stroke="rgba(255,255,255,.15)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <polygon points="190,94 200,100 190,106" fill="rgba(255,255,255,.15)"/>
  
  <!-- Step 2: Produção -->
  <rect x="200" y="50" width="120" height="100" rx="12" stroke="rgba(255,116,37,.4)" stroke-width="1.5" fill="rgba(255,116,37,.06)"/>
  <text x="260" y="88" text-anchor="middle" fill="#ff7425" font-size="13" font-weight="700" font-family="Syne">Produção</text>
  <text x="260" y="110" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">Acompanhamento</text>
  <text x="260" y="126" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">em tempo real</text>
  
  <!-- Arrow 2 -->
  <path d="M325 100 L350 100" stroke="rgba(255,255,255,.15)" stroke-width="1.5"/>
  <polygon points="350,94 360,100 350,106" fill="rgba(255,255,255,.15)"/>
  
  <!-- Step 3: Entrega -->
  <rect x="360" y="50" width="105" height="100" rx="12" stroke="rgba(255,116,37,.4)" stroke-width="1.5" fill="rgba(255,116,37,.06)"/>
  <text x="412" y="88" text-anchor="middle" fill="#ff7425" font-size="13" font-weight="700" font-family="Syne">Entrega</text>
  <text x="412" y="110" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">Review com</text>
  <text x="412" y="126" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">timestamp</text>
  
  <!-- Bottom row: modules -->
  <rect x="40" y="190" width="205" height="50" rx="8" stroke="rgba(255,255,255,.06)" stroke-width="1" fill="rgba(255,255,255,.02)"/>
  <text x="142" y="220" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="12" font-family="Syne">CRM · Documentos · Financeiro</text>
  
  <rect x="260" y="190" width="205" height="50" rx="8" stroke="rgba(255,255,255,.06)" stroke-width="1" fill="rgba(255,255,255,.02)"/>
  <text x="362" y="220" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="12" font-family="Syne">Video Review · Analytics · IA</text>
  
  <!-- Connection line between bottom modules -->
  <path d="M250 215 L255 215" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
  
  <!-- Tagline at bottom -->
  <text x="250" y="290" text-anchor="middle" fill="rgba(255,255,255,.15)" font-size="11">white label · SaaS · produção audiovisual</text>
</svg>`;

export const LandingPage = () => {
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(location.pathname === '/signin');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="my-app" style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* Custom Cursor */}
      <div className="cursor-outer" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-inner" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Lines pattern */}
      <div className="lines">
        <div className="line" /><div className="line" /><div className="line" />
        <div className="line" /><div className="line" />
      </div>

      {/* ===== Banner ===== */}
      <section className="banner" style={{ padding: '300px 0 130px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner__content" style={{ textAlign: 'center' }}>
                <h1 className="text-uppercase fw-9 mb-0" style={{ fontWeight: 900 }}>
                  We are
                  <br />
                  <span className="text-stroke">{tenant.name}</span>
                  <br />
                  <span className="interval" style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
                    <Sparkles size={40} style={{ color: 'var(--accent)', opacity: .6 }} />
                    produção audiovisual
                  </span>
                </h1>
                <div className="banner__content-inner" style={{ maxWidth: 560, margin: '80px auto 0' }}>
                  <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.8 }}>
                    Sistema completo para gestão de produção audiovisual — do briefing à entrega, com review de vídeo, documentos e analytics.
                  </p>
                  <div className="section__content-cta" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
                    <Link to="/signin" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      Acessar sistema <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="cta section__content-cta" style={{ display: 'flex', gap: 60, justifyContent: 'center', flexWrap: 'wrap', marginTop: 60 }}>
                    <div className="single">
                      <h5 style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}>12+</h5>
                      <p style={{ color: 'rgba(255,255,255,.5)', textTransform: 'capitalize' }}>anos de experiência</p>
                    </div>
                    <div className="single">
                      <h5 style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}>5k+</h5>
                      <p style={{ color: 'rgba(255,255,255,.5)', textTransform: 'capitalize' }}>projetos realizados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social sidebar left */}
        <div style={{ position: 'absolute', bottom: 200, left: 40, display: 'flex', flexDirection: 'column', gap: 20, writingMode: 'vertical-rl', transform: 'rotate(-180deg)' }}>
          <a href={`mailto:contato@${tenant.name.toLowerCase()}.com`} style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>
            mail : contato@{tenant.name.toLowerCase()}.com
          </a>
          <span style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>
            Tel : +55 11 99999 9999
          </span>
        </div>

        {/* Social sidebar right */}
        <div style={{ position: 'absolute', bottom: 200, right: 40, display: 'flex', flexDirection: 'column', gap: 20, writingMode: 'vertical-rl', transform: 'rotate(-180deg)' }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>linkedin</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>facebook</a>
        </div>

        {/* Play button */}
        <a className="video-frame" href="/signin" onClick={(e) => { e.preventDefault(); setLoginOpen(true); }}
          style={{
            position: 'absolute', bottom: 120, right: '10%', width: 160, height: 160,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Ccircle cx='80' cy='80' r='78' fill='none' stroke='%23ff7425' stroke-width='1' stroke-dasharray='6 10' /%3E%3C/svg%3E"
            alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'rotateInfinite 24s linear infinite' }} />
          <Play size={36} color="var(--accent)" />
        </a>
      </section>

      {/* ===== Features ===== */}
      <section className="section" style={{ padding: '130px 0', position: 'relative' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                <span className="sub-title">
                  <Sparkles size={14} /> Recursos
                </span>
                <h2 className="title">Tudo que você precisa</h2>
              </div>
            </div>
          </div>
          <div className="row gaper">
            {features.map((f, i) => (
              <div key={f.title} className="col-12 col-sm-6 col-lg-4">
                <div className="glass" style={{ padding: 32, borderRadius: 20, textAlign: 'center', transition: 'transform .3s, box-shadow .3s', cursor: 'default', height: '100%' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18 }}>0{i + 1}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>{f.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== Workflow ===== */}
      <section className="section" style={{ padding: '130px 0', position: 'relative' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                <span className="sub-title">
                  <Sparkles size={14} /> Fluxo
                </span>
                <h2 className="title">Como funciona</h2>
              </div>
            </div>
          </div>
          <div className="row gaper align-items-center">
            <div className="col-12 col-lg-6">
              <div style={{ paddingRight: 40 }}>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(workflowSvg)}`}
                  alt="Fluxo de trabalho: Briefing → Produção → Entrega" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="section__content">
                {steps.map((s) => (
                  <div key={s.num} className="offer__cta-single" style={{ marginBottom: 24, padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 40, fontFamily: "'Syne', sans-serif", minWidth: 70 }}>{s.num}</span>
                      <div>
                        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{s.title}</h4>
                        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ padding: '130px 0', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                <span className="sub-title">
                  <Sparkles size={14} /> Comece agora
                </span>
                <h2 className="title" style={{ marginBottom: 20 }}>Pronto para transformar sua produção?</h2>
                <p style={{ color: 'rgba(255,255,255,.5)', maxWidth: 500, margin: '0 auto 40px' }}>
                  Junte-se a profissionais que já utilizam {tenant.name} para gerenciar seus projetos audiovisuais.
                </p>
                <div className="section__content-cta" style={{ marginTop: 0 }}>
                  <Link to="/signin" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    Acessar sistema <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lines"><div className="line" /><div className="line" /><div className="line" /><div className="line" /><div className="line" /></div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="section pb-0" style={{ padding: '80px 0 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div className="container">
          <div className="row gaper align-items-center">
            <div className="col-12 col-lg-5">
              <div className="logo" style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: '#fff' }}>{tenant.name}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,.5)', maxWidth: 400, fontSize: 14, lineHeight: 1.8 }}>
                Sistema white label para gestão de produção audiovisual.
              </p>
              <div className="section__content-cta" style={{ marginTop: 30 }}>
                <h2><a href={`mailto:contato@${tenant.name.toLowerCase()}.com`} style={{ color: 'var(--accent)', fontSize: 24, fontWeight: 700 }}>contato@{tenant.name.toLowerCase()}.com</a></h2>
              </div>
            </div>
            <div className="col-12 col-lg-7 col-xl-6 offset-xl-1">
              <div className="social justify-content-start" style={{ marginBottom: 24 }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Linkedin"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <a href={`mailto:contato@${tenant.name.toLowerCase()}.com`} style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> contato@{tenant.name.toLowerCase()}.com
                </a>
                <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> (11) 99999-9999
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__copyright" style={{ marginTop: 60, padding: '24px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12" style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>
                  Copyright &copy; {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating login button */}
      <Link to="/signin" className="btn btn--primary" style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 50, boxShadow: '0 4px 24px rgba(249,115,22,.3)', textDecoration: 'none' }}>
        Acessar sistema
      </Link>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};
