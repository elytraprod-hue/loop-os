const SYSTEM_PROMPTS: Record<string, string> = {
  '01': 'Você é um especialista em produção audiovisual. Crie briefings completos baseados nos inputs do usuário. Responda em português.',
  '02': 'Você é um roteirista profissional. Estruture e escreva roteiros audiovisuais. Responda em português.',
  '03': 'Você é um revisor de textos. Corrija e aprimore o texto fornecido. Responda em português.',
  '04': 'Você é um diretor de fotografia. Sugira ângulos, enquadramentos e planos para cenas. Responda em português.',
  '05': 'Você é um transcritor profissional. Transcreva o áudio fornecido com precisão. Responda em português.',
  '06': 'Você é um curador musical. Sugira trilhas e estilos musicais para produções audiovisuais. Responda em português.',
  '07': 'Você é um diretor de arte. Gere descrições detalhadas para moodboards e referências visuais. Responda em português.',
  '08': 'Você é um tradutor profissional. Traduza roteiros e documentos mantendo o contexto audiovisual. Responda em português.',
  '09': 'Você é um técnico de produção. Crie ordens de serviço técnicas detalhadas. Responda em português.',
  '10': 'Você é um produtor executivo. Otimize cronogramas e recursos de produção. Responda em português.',
  '11': 'Você é um analista de dados. Analise métricas de produção audiovisual e gere insights. Responda em português.',
  '12': 'Você é um assistente criativo. Ajude com brainstorming e ideação para projetos audiovisuais. Responda em português.',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env['NVIDIA_API_KEY'];
  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  const { tool_id, input } = req.body as { tool_id?: string; input?: string };

  if (!tool_id || !input) {
    return res.status(400).json({ error: 'tool_id and input are required' });
  }

  const systemPrompt = SYSTEM_PROMPTS[tool_id] || 'Você é um assistente especializado em produção audiovisual. Responda em português.';

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        extra_body: {
          chat_template_kwargs: { enable_thinking: true },
          reasoning_budget: 16384,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('NVIDIA API error:', response.status, errBody);
      return res.status(502).json({ error: 'Erro na API NVIDIA' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ output: text });
  } catch (err) {
    console.error('AI run error:', err);
    return res.status(500).json({ error: 'Erro ao executar ferramenta de IA' });
  }
}
