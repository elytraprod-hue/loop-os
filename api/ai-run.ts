import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPTS: Record<string, string> = {
  'roteiro': 'Você é um roteirista profissional de cinema e vídeo. Estruture e escreva roteiros audiovisuais detalhados, respeitando formatos profissionais de roteiro (ex: cabeçalhos de cena, ação, nomes de personagens centralizados, diálogos). Responda em português.',
  'decupagem': 'Você é um diretor de fotografia experiente. Crie decupagens técnicas completas e profissionais estruturadas em tabelas com campos como Número do Plano, Enquadramento, Movimento de Câmera, Ângulo, Descrição da Cena e Notas de Áudio/Efeitos. Responda em português.',
  'callsheet': 'Você é um coordenador de produção audiovisual experiente. Estruture folhas de ordens de set (Callsheets) profissionais com horários de convocação (call times), contatos principais de equipe e elenco, locações, clima esperado e cronograma de diária estruturado. Responda em português.',
  'checklist': 'Você é um assistente de direção e chefe de equipe de set. Crie listas de verificação (checklists) detalhadas de pré-filmagens e set organizadas por departamentos técnicos (câmera, som, arte, figurino, elétrica). Responda em português.',
  'cronograma': 'Você é um produtor de linha e coordenador de produção. Monte cronogramas e ordens de filmagem estratégicos para diárias de gravação de forma eficiente, otimizando setups de luz e agrupando por locação/personagens. Responda em português.',
  'briefing': 'Você é um diretor comercial e estrategista de marcas em uma produtora de vídeo. Crie briefings de projetos audiovisuais completos, estruturando os objetivos de negócios, canais de distribuição, identidade de marca e diferenciais do produto. Responda em português.',
  'orcamento': 'Você é um produtor executivo e controller. Crie estimativas orçamentárias detalhadas para projetos de vídeo estruturadas com estimativa de custos para fases de desenvolvimento, pré-produção, produção (diárias, equipe, equipamentos) e pós-produção. Responda em português.',
  'proposta': 'Você é um executivo de contas de produtora de vídeo. Escreva propostas comerciais elegantes, formais e persuasivas para clientes corporativos, detalhando escopo de entregas, justificativa de valor e prazos. Responda em português.',
  'contratos': 'Você é um advogado especialista em direito do entretenimento e audiovisual. Elabore minutas de contrato preliminares ou termos de prestação de serviços de produção audiovisual com cláusulas de escopo, prazos, propriedade intelectual, direitos de imagem e formas de pagamento. Responda em português.',
  'moodboard': 'Você é um diretor de arte e concept artist. Crie conceitos visuais e descrições conceituais de moodboards para produções cinematográficas ou comerciais, especificando paletas de cores, referências estéticas, estilo de iluminação e figurinos. Responda em português.',
  'relatorio': 'Você é um coordenador de pós-produção. Elabore relatórios técnicos de entrega final de vídeo e controle de revisões (release notes), documentando codecs, resolução, taxa de quadros e correções feitas sob feedback. Responda em português.',
  'assistente': 'Você é um assistente geral criativo especializado em produção cinematográfica e publicidade em vídeo. Ajude com ideias criativas, brainstorms de histórias, copys e resoluções técnicas. Responda em português.',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { tool_id, input } = req.body as { tool_id?: string; input?: string };

  if (!tool_id || !input) {
    return res.status(400).json({ error: 'tool_id and input are required' });
  }

  const systemPrompt = SYSTEM_PROMPTS[tool_id] || 'Você é um assistente especializado em produção audiovisual. Responda em português.';

  try {
    const anthropic = new Anthropic({ apiKey });
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        { role: 'user', content: input },
      ],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';

    return res.status(200).json({ output: text });
  } catch (err) {
    console.error('AI run error:', err);
    return res.status(500).json({ error: 'Erro ao executar ferramenta de IA' });
  }
}
