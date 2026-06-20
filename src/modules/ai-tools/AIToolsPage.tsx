// src/modules/ai-tools/AIToolsPage.tsx
import { useState } from 'react';
import { Brain, Sparkles, MessageSquare, FileText, Pen, Camera, Mic, Music, Image, Globe, Code, Zap, BarChart } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const tools = [
  { icon: MessageSquare, name: 'Gerador de Briefing', desc: 'Cria briefings completos baseados em inputs' },
  { icon: FileText, name: 'Redator de Roteiros', desc: 'Estrutura e escreve roteiros profissionais' },
  { icon: Pen, name: 'Revisor de Texto', desc: 'Corrige e aprimora textos' },
  { icon: Camera, name: 'Análise de Cenas', desc: 'Sugere ângulos e enquadramentos' },
  { icon: Mic, name: 'Transcrição', desc: 'Transcreve áudio para texto' },
  { icon: Music, name: 'Curadoria Musical', desc: 'Sugere trilhas e estilos' },
  { icon: Image, name: 'Moodboard Automático', desc: 'Gera referências visuais' },
  { icon: Globe, name: 'Tradutor', desc: 'Traduz roteiros e documentos' },
  { icon: Code, name: 'Gerador de OS', desc: 'Cria ordens de serviço técnicas' },
  { icon: Zap, name: 'Otimizador', desc: 'Otimiza cronogramas e recursos' },
  { icon: BarChart, name: 'Analisador de Dados', desc: 'Analisa métricas de produção' },
  { icon: Sparkles, name: 'Assistente Criativo', desc: 'Brainstorming e ideação' },
];

export const AIToolsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);

  const openTool = (tool: typeof tools[0]) => {
    setSelectedTool(tool);
    setModalOpen(true);
  };

  return (
    <div className="animate-fadeUp">
      <div className="page-hero">
        <h1>Ferramentas de IA</h1>
        <p>Ferramentas inteligentes para produção audiovisual</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {tools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => openTool(tool)}
            className="glass"
            style={{
              padding: 24,
              borderRadius: 16,
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <tool.icon size={18} color="var(--accent)" />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{tool.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.4 }}>{tool.desc}</div>
          </button>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedTool?.name || 'Ferramenta IA'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea className="input-base" rows={4} placeholder="Digite seu input aqui..." style={{ resize: 'vertical' }} />
          <button className="btn btn-primary">
            <Brain size={16} /> Executar
          </button>
          <div className="glass" style={{ padding: 20, borderRadius: 12, minHeight: 100 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Resposta aparecerá aqui...</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
