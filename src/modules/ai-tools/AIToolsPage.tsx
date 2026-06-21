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
      <div className="mb-7">
        <h1 className="font-display font-black text-5xl text-white tracking-tight">Frame AI</h1>
        <p className="text-[#c4c4c4] text-base mt-2 leading-relaxed">Acelere a pré-produção, comercial e pós-produção do seu estúdio audiovisual</p>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-6 items-start">
        
        {/* Left Side: Category Sidebar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2 pl-2 pb-3 border-b border-white/10">
            <Brain size={18} className="text-orange-500" />
            <span className="font-display font-extrabold text-sm text-[#e8e8e8]">Menu Inteligente</span>
          </div>

          {toolCategories.map(cat => (
            <div key={cat.category} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-2">
                {cat.category}
              </span>
              <div className="flex flex-col gap-0.5">
                {cat.tools.map(t => {
                  const isSelected = activeToolId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTool(t.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer w-full text-left border transition-all ${isSelected ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'text-gray-400 border-transparent hover:bg-white/5'}`}
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
        <div className="grid grid-cols-[1fr_1.2fr] gap-6 items-start">
          
          {/* Inputs Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[480px]">
            <div>
              <h2 className="font-display font-black text-lg text-[#e8e8e8] m-0">
                {activeTool.name.toUpperCase()}
              </h2>
              <p className="text-xs text-gray-400 my-1 mb-5">
                {activeTool.desc}
              </p>

              <form onSubmit={handleExecute} className="flex flex-col gap-3.5">
                {activeTool.fields.map(f => (
                  <div key={f.name}>
                    <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-bold">
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <select
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#e8e8e8] focus:border-orange-500/50 focus:outline-none w-full text-sm"
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                      >
                        <option value="">Selecione uma opção...</option>
                        {(f.options ?? []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full text-sm resize-y"
                        rows={f.rows || 4}
                        placeholder={f.placeholder}
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                      />
                    ) : (
                      <input
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full text-sm"
                        type="text"
                        placeholder={f.placeholder}
                        value={formValues[f.name] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </form>
            </div>

            <button
              onClick={handleExecute}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 py-3.5 transition-all w-full flex items-center justify-center gap-2 mt-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'GERANDO...' : `GERAR ${activeTool.name.toUpperCase().split(' ').pop()}`}
            </button>
          </div>

          {/* Outputs Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl min-h-[480px] flex flex-col overflow-hidden">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-black/10">
              <span className="text-[11px] font-bold text-gray-400">RESULTADO GERADO</span>
              <div className="flex gap-1.5">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-lg px-3 py-1.5 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copiar
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-lg px-3 py-1.5 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Baixar .TXT
                </button>
                <button
                  onClick={handleClear}
                  className="bg-white/5 hover:bg-white/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-1.5 text-xs transition-all"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Simulated terminal content */}
            <div className="flex-1 p-6 overflow-y-auto bg-black/15 flex flex-col justify-start items-stretch">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <Loader2 size={32} className="animate-spin text-orange-500" />
                  <span className="text-sm font-semibold">A inteligência artificial está gerando seu conteúdo...</span>
                </div>
              ) : output ? (
                <div className="text-white text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500 text-center px-6">
                  <Brain size={42} className="opacity-50" />
                  <span className="text-sm font-medium">
                    Preencha os campos do formulário à esquerda <br /> e clique em gerar para ver o resultado aqui.
                  </span>
                </div>
              )}
            </div>

            {/* Refine footer bar */}
            {output && !loading && (
              <div className="flex gap-2 p-4 border-t border-white/10 bg-black/20">
                <input
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none flex-1 text-sm"
                  placeholder="Deseja alterar algo? Digite o ajuste aqui..."
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRefine(); }}
                />
                <button
                  onClick={handleRefine}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-5 py-2.5 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
