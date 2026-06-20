import { useState } from 'react';
import { Brain, Sparkles, Play, FileText, DollarSign, Loader2, Camera, Calendar, MessageSquare, Briefcase, FileCheck, Image, Clipboard, CheckSquare } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspaceQuery, useCreateAiRunMutation } from '../../hooks/useDbQuery';
import { toast } from 'sonner';

interface ToolField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  rows?: number;
}

interface Tool {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
  fields: ToolField[];
  compiler: (v: Record<string, string>) => string;
}

const toolCategories = [
  {
    category: 'Pré-Produção',
    tools: [
      {
        id: 'roteiro',
        name: 'Gerador de Roteiro',
        desc: 'Escreva roteiros profissionais estruturados.',
        icon: Play,
        fields: [
          { name: 'title', label: 'Título do Projeto', type: 'text', placeholder: 'Ex: Deriva Urbana' },
          { name: 'format', label: 'Formato', type: 'select', options: ['Curta-metragem (ficção)', 'Comercial / Publicidade', 'Documentário', 'Web Série', 'Vídeo Institucional'] },
          { name: 'duration', label: 'Duração', type: 'text', placeholder: 'Ex: 5 min' },
          { name: 'genre', label: 'Gênero / Tom', type: 'text', placeholder: 'Ex: Drama, humor, comercial' },
          { name: 'synopsis', label: 'Sinopse / Ideia', type: 'textarea', placeholder: 'Descreva a história ou o conceito central...', rows: 4 },
          { name: 'characters', label: 'Personagens', type: 'text', placeholder: 'Ex: João (30 anos), Maria (28 anos)' },
          { name: 'locations', label: 'Locações', type: 'text', placeholder: 'Ex: Metrô SP, apartamento, rua' },
          { name: 'aesthetic', label: 'Referência Estética', type: 'text', placeholder: 'Ex: Kiarostami, Nolan, City of God' },
          { name: 'observations', label: 'Observações / Restrições', type: 'textarea', placeholder: 'Ex: Sem diálogos, focado em narração...', rows: 3 }
        ],
        compiler: (v: Record<string, string>) => `Gere um roteiro profissional completo com as seguintes especificações:
Título: ${v['title'] || 'Sem título'}
Formato: ${v['format'] || 'Ficção'}
Duração: ${v['duration'] || 'Não especificada'}
Gênero/Tom: ${v['genre'] || 'Neutro'}
Sinopse/Ideia: ${v['synopsis'] || 'Sem sinopse'}
Personagens: ${v['characters'] || 'Sem descrição'}
Locações: ${v['locations'] || 'Não especificadas'}
Referência Estética: ${v['aesthetic'] || 'Sem referência'}
Observações: ${v['observations'] || 'Nenhuma'}`
      },
      {
        id: 'decupagem',
        name: 'Decupagem Técnica',
        desc: 'Gere listas de planos e ângulos de câmera.',
        icon: Camera,
        fields: [
          { name: 'scene', label: 'Descrição da Cena / Ação', type: 'textarea', placeholder: 'Descreva o que acontece na cena...', rows: 5 },
          { name: 'tone', label: 'Clima Visual / Iluminação', type: 'text', placeholder: 'Ex: Luz de fim de tarde, sombrio, alto contraste' },
          { name: 'gear', label: 'Câmera e Equipamento', type: 'text', placeholder: 'Ex: Alexa Mini LF, Lentes Anamórficas' },
          { name: 'preferences', label: 'Tipos de Planos Preferidos', type: 'text', placeholder: 'Ex: Muitos close-ups, plano sequência' }
        ],
        compiler: (v: Record<string, string>) => `Gere uma decupagem técnica de câmera profissional (tabela detalhada com Número do Plano, Enquadramento, Movimento, Ângulo, Descrição da Ação e Áudio) para a seguinte cena:
Descrição da Cena: ${v['scene'] || ''}
Clima Visual: ${v['tone'] || 'Luz natural'}
Equipamento: ${v['gear'] || 'Lente 35mm'}
Tipos de Planos: ${v['preferences'] || 'Planos médios e close-ups'}`
      },
      {
        id: 'callsheet',
        name: 'Callsheet',
        desc: 'Organize horários, equipes e elenco para a diária.',
        icon: FileText,
        fields: [
          { name: 'project', label: 'Título do Projeto', type: 'text', placeholder: 'Ex: Comercial Coca-Cola' },
          { name: 'date', label: 'Data da Diária', type: 'text', placeholder: 'Ex: 25 de Outubro' },
          { name: 'crew', label: 'Equipe Principal / Contatos', type: 'textarea', placeholder: 'Ex: Diretor: Carlos, DF: Pedro...', rows: 3 },
          { name: 'actors', label: 'Elenco Escalado', type: 'textarea', placeholder: 'Ex: Maria (Entrada 08:00), João (Entrada 10:00)...', rows: 3 },
          { name: 'locations', label: 'Locação e Endereço', type: 'text', placeholder: 'Ex: Galpão na Barra Funda, SP' },
          { name: 'schedule', label: 'Cronograma de Horários', type: 'textarea', placeholder: 'Ex: 07:00 Calltime / 12:00 Almoço / 18:00 Wrap...', rows: 3 }
        ],
        compiler: (v: Record<string, string>) => `Elabore uma folha de ordens (Callsheet) profissional de set para a diária com as seguintes especificações:
Projeto: ${v['project'] || 'Filme'}
Data: ${v['date'] || 'Hoje'}
Equipe: ${v['crew'] || 'Diretor e Câmera'}
Elenco: ${v['actors'] || 'Nenhum elenco cadastrado'}
Locação: ${v['locations'] || 'Estúdio'}
Cronograma de Horários: ${v['schedule'] || '08:00 Início / 18:00 Término'}`
      },
      {
        id: 'checklist',
        name: 'Checklist de Set',
        desc: 'Gere checklists por departamentos de produção.',
        icon: CheckSquare,
        fields: [
          { name: 'department', label: 'Departamento', type: 'select', options: ['Câmera & Elétrica', 'Som Direto', 'Direção de Arte / Objetos', 'Figurino & Maquiagem', 'Produção Geral'] },
          { name: 'needs', label: 'Necessidades Específicas / Roteiro', type: 'textarea', placeholder: 'Descreva itens especiais da cena que precisam de atenção...', rows: 4 }
        ],
        compiler: (v: Record<string, string>) => `Crie um checklist de set profissional e operacional detalhado para o departamento: ${v['department'] || 'Câmera'}.
Considere as seguintes necessidades específicas do roteiro: ${v['needs'] || 'Equipamentos padrão'}`
      },
      {
        id: 'cronograma',
        name: 'Cronograma',
        desc: 'Distribua cenas e setups nos dias de filmagem.',
        icon: Calendar,
        fields: [
          { name: 'days', label: 'Total de Dias de Gravação', type: 'text', placeholder: 'Ex: 3 dias' },
          { name: 'scenes', label: 'Quantidade de Cenas', type: 'text', placeholder: 'Ex: 15 cenas' },
          { name: 'complexity', label: 'Complexidade de Set', type: 'select', options: ['Baixa (1 locação simples)', 'Média (locações internas e externas)', 'Alta (muitos figurantes, efeitos ou dublês)'] }
        ],
        compiler: (v: Record<string, string>) => `Elabore um cronograma estratégico de diárias de filmagem (Plano de Filmagem) dividindo ${v['scenes'] || '10'} cenas em ${v['days'] || '2'} dias de gravação, levando em conta que a complexidade do set é ${v['complexity'] || 'Média'}. Forneça dicas de setups e ordem lógica de gravação.`
      }
    ]
  },
  {
    category: 'Comercial',
    tools: [
      {
        id: 'briefing',
        name: 'Briefing Inteligente',
        desc: 'Estruture briefings profissionais com foco na marca.',
        icon: MessageSquare,
        fields: [
          { name: 'brand', label: 'Cliente / Marca', type: 'text', placeholder: 'Ex: Hamburgueria X' },
          { name: 'product', label: 'Produto / Serviço', type: 'text', placeholder: 'Ex: Novo Hamburguer Artesanal' },
          { name: 'target', label: 'Público-Clvo', type: 'text', placeholder: 'Ex: Jovens de 18-35 anos, SP' },
          { name: 'goal', label: 'Objetivo Principal do Vídeo', type: 'text', placeholder: 'Ex: Gerar desejo e cliques no Instagram' },
          { name: 'channels', label: 'Canais de Veiculação', type: 'text', placeholder: 'Ex: Instagram, TikTok, YouTube Ads' }
        ],
        compiler: (v: Record<string, string>) => `Desenvolva um briefing de campanha audiovisual inteligente e estratégico para a marca ${v['brand'] || 'Marca X'}, promovendo o produto ${v['product'] || 'Produto X'}.
Público-Alvo: ${v['target'] || 'Geral'}
Objetivo: ${v['goal'] || 'Engajamento'}
Canais: ${v['channels'] || 'Redes sociais'}`
      },
      {
        id: 'orcamento',
        name: 'Orçamento',
        desc: 'Estime custos e rubricas orçamentárias.',
        icon: DollarSign,
        fields: [
          { name: 'scope', label: 'Escopo do Projeto', type: 'textarea', placeholder: 'Ex: 1 vídeo institucional de 2 min + 3 cortes curtos...', rows: 3 },
          { name: 'days', label: 'Dias de Gravação', type: 'text', placeholder: 'Ex: 1 diária de 10h' },
          { name: 'crew', label: 'Tamanho Estimado da Equipe', type: 'text', placeholder: 'Ex: 5 profissionais' },
          { name: 'post', label: 'Pós-Produção Requerida', type: 'select', options: ['Básica (corte e cor)', 'Média (cor, mixagem e motion simples)', 'Avançada (efeitos visuais, 3D, animações)'] }
        ],
        compiler: (v: Record<string, string>) => `Gere uma estimativa de orçamento estruturada (com tabelas de equipe, equipamentos, produção de set, pós-produção e margem de contingência) para o seguinte projeto audiovisual:
Escopo: ${v['scope'] || 'Vídeo curto'}
Diárias: ${v['days'] || '1'}
Equipe: ${v['crew'] || '3 pessoas'}
Pós-Produção: ${v['post'] || 'Básica'}`
      },
      {
        id: 'proposta',
        name: 'Proposta Comercial',
        desc: 'Escreva apresentações formais para fechamento de vendas.',
        icon: Briefcase,
        fields: [
          { name: 'client', label: 'Nome do Cliente', type: 'text', placeholder: 'Ex: Clínica Sorriso' },
          { name: 'scope', label: 'Entregáveis da Proposta', type: 'textarea', placeholder: 'Ex: Roteiro, captação, 1 vídeo final com duas rodadas de alterações...', rows: 3 },
          { name: 'value', label: 'Valor Proposto (R$)', type: 'text', placeholder: 'Ex: R$ 8.500,00' },
          { name: 'deadline', label: 'Prazo de Entrega', type: 'text', placeholder: 'Ex: 15 dias após aprovação' }
        ],
        compiler: (v: Record<string, string>) => `Escreva uma proposta comercial de produção de vídeo formal, profissional e vendedora para o cliente ${v['client'] || 'Cliente X'}.
Entregáveis: ${v['scope'] || 'Vídeo comercial'}
Preço: R$ ${v['value'] || '0,00'}
Prazo de Entrega: ${v['deadline'] || '15 dias'}`
      },
      {
        id: 'contratos',
        name: 'Contratos',
        desc: 'Gere minutas básicas de prestação de serviço.',
        icon: FileCheck,
        fields: [
          { name: 'contractor', label: 'Contratante (Razão Social / CPF)', type: 'text', placeholder: 'Ex: Empresa X LTDA' },
          { name: 'contractee', label: 'Contratado (Sua Produtora)', type: 'text', placeholder: 'Ex: Minha Produtora LTDA' },
          { name: 'object', label: 'Objeto do Contrato / Escopo', type: 'textarea', placeholder: 'Ex: Produção de 1 vídeo promocional de 60s...', rows: 3 },
          { name: 'value', label: 'Valor e Condições de Pagamento', type: 'text', placeholder: 'Ex: R$ 5.000 (50% entrada, 50% entrega)' }
        ],
        compiler: (v: Record<string, string>) => `Gere um contrato padrão e seguro de prestação de serviços audiovisuais entre:
Contratante: ${v['contractor'] || 'Contratante X'}
Contratado: ${v['contractee'] || 'Produtora Y'}
Objeto (Escopo): ${v['object'] || 'Produção de vídeo'}
Valor e Condições: ${v['value'] || 'À combinar'}`
      }
    ]
  },
  {
    category: 'Criativo & Entrega',
    tools: [
      {
        id: 'moodboard',
        name: 'Moodboard & Look',
        desc: 'Descreva a identidade de arte, luz e referências.',
        icon: Image,
        fields: [
          { name: 'concept', label: 'Conceito Criativo / Mensagem', type: 'textarea', placeholder: 'Ex: Urbano, tecnológico, com cores quentes saturadas...', rows: 3 },
          { name: 'palette', label: 'Paleta de Cores Recomendada', type: 'text', placeholder: 'Ex: Neon, laranja e azul ciano' },
          { name: 'references', label: 'Filmes / Diretores de Referência', type: 'text', placeholder: 'Ex: Blade Runner 2049, Dennis Villeneuve' }
        ],
        compiler: (v: Record<string, string>) => `Desenvolva uma decupagem conceitual de Direção de Arte e Look Visual detalhada. Explique o clima, cenografia, figurino, iluminação e aplicação prática das cores para o conceito:
Conceito: ${v['concept'] || 'Urbano'}
Paleta: ${v['palette'] || 'Cores quentes'}
Referências: ${v['references'] || 'Sem referência'}`
      },
      {
        id: 'relatorio',
        name: 'Relatório de Entrega',
        desc: 'Detalhamento de codec, resolução e revisões.',
        icon: Clipboard,
        fields: [
          { name: 'file', label: 'Nome do Arquivo Final', type: 'text', placeholder: 'Ex: Nubank_Institucional_FINAL_V2_4K.mp4' },
          { name: 'specs', label: 'Especificações de Codec / Resolução', type: 'text', placeholder: 'Ex: H.264, 3840x2160, 24fps, Rec709' },
          { name: 'changes', label: 'Ajustes Feitos (Rodada de Feedback)', type: 'textarea', placeholder: 'Ex: Reduzido o volume da trilha sonora e adicionado letterbox...', rows: 3 }
        ],
        compiler: (v: Record<string, string>) => `Crie uma folha técnica de entrega e relatório de alterações (Release Notes) do vídeo para o cliente:
Arquivo: ${v['file'] || 'video.mp4'}
Especificações Técnicas: ${v['specs'] || '1080p'}
Alterações Aplicadas: ${v['changes'] || 'Nenhum ajuste'}`
      },
      {
        id: 'assistente',
        name: 'Assistente Livre',
        desc: 'Prompt aberto para qualquer tarefa audiovisual.',
        icon: Sparkles,
        fields: [
          { name: 'prompt', label: 'O que deseja criar?', type: 'textarea', placeholder: 'Ex: Escreva 3 ideias de roteiro de 15 segundos para uma ótica...', rows: 8 }
        ],
        compiler: (v: Record<string, string>) => v['prompt'] || 'Olá, em que posso ajudar no seu projeto audiovisual hoje?'
      }
    ]
  }
];

export const AIToolsPage = () => {
  const { user } = useAuth();
  const { data: workspace } = useWorkspaceQuery();
  const saveRun = useCreateAiRunMutation();

  const [activeToolId, setActiveToolId] = useState<string>('roteiro');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refineInput, setRefineInput] = useState<string>('');

  // Find active tool details
  const activeTool: Tool = toolCategories
    .flatMap(cat => cat.tools)
    .find(t => t.id === activeToolId) as Tool;

  const handleSelectTool = (id: string) => {
    setActiveToolId(id);
    setFormValues({});
    setOutput('');
    setRefineInput('');
  };

  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || loading) return;

    const prompt = activeTool.compiler(formValues);
    if (!prompt.trim()) {
      toast.error('Preencha os campos para poder gerar.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/ai-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: activeToolId, input: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao executar');
      setOutput(data.output);

      if (workspace?.id) {
        saveRun.mutate({
          workspace_id: workspace.id,
          user_id: user.id,
          tool_id: activeToolId,
          input: formValues,
          output: data.output,
        });
      }
      toast.success('Conteúdo gerado com sucesso!');
    } catch (err) {
      setOutput(err instanceof Error ? err.message : 'Erro ao executar ferramenta');
      toast.error('Erro ao executar IA');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refineInput.trim() || !output || !user || loading) return;
    setLoading(true);
    const refineText = refineInput.trim();
    setRefineInput('');
    const prompt = `Aqui está o conteúdo gerado anteriormente:\n${output}\n\nPor favor, faça os seguintes ajustes neste conteúdo:\n${refineText}`;

    try {
      const res = await fetch('/api/ai-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: activeToolId, input: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao refinar');
      setOutput(data.output);
      toast.success('Ajustes aplicados!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao aplicar ajustes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Conteúdo copiado!');
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeToolId}_gerado.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo baixado!');
  };

  const handleClear = () => {
    setFormValues({});
    setOutput('');
    setRefineInput('');
  };

  return (
    <div className="animate-fadeUp">
      <div className="page-hero" style={{ marginBottom: 28 }}>
        <h1>Frame AI</h1>
        <p>Acelere a pré-produção, comercial e pós-produção do seu estúdio audiovisual</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Left Side: Category Sidebar */}
        <div className="glass" style={{ borderRadius: 16, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, paddingBottom: 12, borderBottom: '1px solid var(--glass-border)' }}>
            <Brain size={18} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>Menu Inteligente</span>
          </div>

          {toolCategories.map(cat => (
            <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: 8 }}>
                {cat.category}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cat.tools.map(t => {
                  const isSelected = activeToolId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTool(t.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: isSelected ? 'var(--accent-dim)' : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        border: isSelected ? '1px solid var(--accent-border)' : '1px solid transparent',
                        transition: 'all 0.15s'
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Center/Right Panels Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, alignItems: 'start' }}>
          
          {/* Inputs Section */}
          <div className="glass" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 480 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
                {activeTool.name.toUpperCase()}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 20px 0' }}>
                {activeTool.desc}
              </p>

              <form onSubmit={handleExecute} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeTool.fields.map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 700 }}>
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <select
                        className="input-base"
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: 8, fontSize: 13, padding: '10px 14px' }}
                      >
                        <option value="">Selecione uma opção...</option>
                        {(f.options ?? []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        className="input-base"
                        rows={f.rows || 4}
                        placeholder={f.placeholder}
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                        style={{ fontSize: 13, resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        className="input-base"
                        type="text"
                        placeholder={f.placeholder}
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                        style={{ fontSize: 13 }}
                      />
                    )}
                  </div>
                ))}
              </form>
            </div>

            <button
              onClick={handleExecute}
              className="btn btn--primary"
              style={{ width: '100%', padding: '14px 24px', fontSize: 13, fontWeight: 700, borderRadius: 10, marginTop: 24, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'GERANDO...' : `GERAR ${activeTool.name.toUpperCase().split(' ').pop()}`}
            </button>
          </div>

          {/* Outputs Section */}
          <div className="glass" style={{ borderRadius: 16, minHeight: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Header controls bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>RESULTADO GERADO</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="btn btn--sm btn--secondary"
                  style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, opacity: output ? 1 : 0.5, cursor: output ? 'pointer' : 'default' }}
                >
                  Copiar
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="btn btn--sm btn--secondary"
                  style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, opacity: output ? 1 : 0.5, cursor: output ? 'pointer' : 'default' }}
                >
                  Baixar .TXT
                </button>
                <button
                  onClick={handleClear}
                  className="btn btn--sm btn--secondary"
                  style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)' }}
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Simulated terminal content */}
            <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: output || loading ? 'flex-start' : 'center', alignItems: output || loading ? 'stretch' : 'center' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
                  <Loader2 size={32} className="animate-spin" color="var(--accent)" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>A inteligência artificial está gerando seu conteúdo...</span>
                </div>
              ) : output ? (
                <div style={{ color: '#fff', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                  {output}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '0 24px' }}>
                  <Brain size={42} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    Preencha os campos do formulário à esquerda <br /> e clique em gerar para ver o resultado aqui.
                  </span>
                </div>
              )}
            </div>

            {/* Refine footer bar */}
            {output && !loading && (
              <div style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <input
                  className="input-base"
                  style={{ fontSize: 13, padding: '10px 14px', flex: 1 }}
                  placeholder="Deseja alterar algo? Digite o ajuste aqui..."
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRefine(); }}
                />
                <button
                  onClick={handleRefine}
                  className="btn btn--primary"
                  style={{ padding: '10px 20px', fontSize: 12, borderRadius: 10 }}
                  disabled={!refineInput.trim()}
                >
                  Refinar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
