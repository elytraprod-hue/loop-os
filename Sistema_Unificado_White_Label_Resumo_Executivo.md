# Sistema Unificado - Resumo Executivo

## 🎯 Visão Geral

Este documento fornece uma **visão completa e detalhada** da unificação de três sistemas existentes — **DNZ Central**, **FRAME.AI Director** e **FRAME.AI Landing** — em um único sistema **white label** pronto para produção.

## 📊 Status Atual dos Sistemas

### 1. DNZ Central (does-not-zero)
**Status**: ✅ Funcional em produção
**Principais Funcionalidades**:
- CRM com pipeline e gestão de clientes
- Fluxo completo de projetos audiovisuais (Briefing → Roteiro → Produção → Entrega)
- Propostas com histórico
- Studio de documentos com exportação PDF
- Financeiro operacional
- Video Review com link público e comentários por timestamp
- Relatórios operacionais
- Command Palette
- Lazy loading de abas pesadas
- Hooks e componentes reutilizáveis

**Tecnologias**:
- React 18 + Vite 6
- Supabase (Postgres + Auth + Realtime)
- Vercel (deploy)
- hls.js (vídeo)

### 2. FRAME.AI Director (frame-ai-director)
**Status**: ✅ Funcional
**Principais Funcionalidades**:
- 12 ferramentas de IA para produção audiovisual
- Sistema completo de autenticação e gerenciamento
- Integração com Stripe para assinaturas
- Sistema de ferramentas baseado em SQLite

**Tecnologias**:
- React 19 + Vite 7
- Express.js (backend)
- SQLite (better-sqlite3)
- Anthropic Claude (IA)
- Stripe (pagamentos)

### 3. FRAME.AI Landing (frame-ai-landing)
**Status**: ✅ Funcional
**Principais Funcionalidades**:
- Documentação completa de análise e implementação
- Sistema de ferramentas similar ao Director
- Landing page com portfolio e cases

**Tecnologias**:
- React + Vite
- Express.js (backend)
- SQLite (better-sqlite3)
- Stripe (pagamentos)

## 🏗️ Arquitetura Unificada Proposta

### Stack Definitivo

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 7 |
| Linguagem | TypeScript (strict) |
| Banco de dados | Supabase (Postgres + Auth + Realtime + Storage) |
| Estilização | CSS Variables (design tokens) |
| Componentes | shadcn/ui |
| IA | Anthropic Claude |
| Pagamentos | Stripe |
| PDF | jsPDF + html2canvas |
| Vídeo | hls.js |
| Deploy | Vercel + Supabase |
| Validação | Zod |
| Segurança | Supabase RLS |

### Estrutura de Pastas Canônica

```
src/
├── config/                    # Configuração white label
├── lib/                      # Bibliotecas compartilhadas
├── types/                    # Tipos TypeScript
├── hooks/                    # Hooks reutilizáveis
├── components/               # Componentes UI
├── modules/                  # Módulos lazy-loaded
│   ├── auth/                # Autenticação
│   ├── crm/                 # Gestão de clientes
│   ├── projects/            # Gerenciamento de projetos
│   ├── documents/           # Editor de documentos
│   ├── video-review/        # Review de vídeo
│   ├── finance/             # Finanças
│   ├── ai-tools/            # Ferramentas de IA
│   ├── analytics/           # Análises
│   ├── admin/               # Administração
│   └── notifications/       # Notificações
└── styles/                   # Design tokens
```

## 🎨 Configuração White Label

### Como Funciona

**Tenant Configuration** (`src/config/tenant.ts`):
- Nome, logo, cores, flags de recursos
- Configurado via variáveis de ambiente
- Sem hardcode de marca em nenhum outro lugar

**Design Tokens** (`src/styles/tokens.css`):
- Todas as cores derivadas de CSS variables
- Injetadas dinamicamente a partir da configuração do tenant
- Sem cores hardcoded em componentes

### Exemplo de Configuração

```typescript
export const tenant = {
  name: process.env.VITE_TENANT_NAME ?? 'Studio OS',
  logoUrl: process.env.VITE_TENANT_LOGO ?? '/logo.svg',
  primaryColor: process.env.VITE_PRIMARY_COLOR ?? '#1a1a1a',
  accentColor: process.env.VITE_ACCENT_COLOR ?? '#4f46e5',
  features: {
    aiTools: true,
    videoReview: true,
    finance: true,
    analytics: true,
    crm: true,
    documents: true,
    notifications: true,
    gantt: true,
    stripe: false,
  },
} as const;
```

## 🗄️ Banco de Dados Unificado (Supabase)

### Schema Proposto

**Tabelas Core**:

| Tabela | Descrição |
|---|---|
| `workspaces` | Multi-tenant: cada cliente tem um workspace |
| `workspace_members` | Membros por workspace (owner, admin, member, viewer) |
| `clients` | Gestão de clientes por workspace |
| `projects` | Fluxo completo de projetos (briefing → entrega) |
| `deliverables` | Video Review com public_token para acesso público |
| `review_comments` | Comentários por timestamp para deliverables |
| `documents` | Editor de documentos com exportação PDF |
| `transactions` | Lançamentos financeiros |
| `ai_tool_runs` | Histórico de execuções de ferramentas de IA |
| `notifications` | Notificações em tempo real |
| `app_state` | Estado da aplicação (migrado do DNZ Central) |

### Segurança (RLS)

Todas as tabelas possuem Row Level Security:
```sql
-- Membros só veem dados do seu workspace
USING (workspace_id IN (
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
));
```

## 🤖 Módulo de IA — 12 Ferramentas

### Configuração

**Ferramentas** (`src/modules/ai-tools/tools.config.ts`):
- Migrado do `shared/tools.ts` do FRAME.AI Director
- Interface unificada para todas as ferramentas
- Schema de input com Zod

### Execução

**Edge Function** (`/functions/ai-run`):
- Valida input com Zod
- Chama Anthropic API
- Salva resultado em `ai_tool_runs`
- Retorna output ao cliente

## 🔐 Autenticação Unificada

### Abordagem

- **Exclusivo Supabase Auth**: Eliminar sistema JWT/Express do FRAME.AI Director
- **Proteção de Rotas**: Componente `<ProtectedRoute>`
- **Review Público**: Baseado em `public_token` (sem auth)
- **Admin**: Baseado em `role` na tabela `workspace_members`

### Fluxo

1. Usuário faz login com email/password (Supabase Auth)
2. Sessão gerenciada por `supabase.auth.getSession()`
3. Rotas protegidas verificam sessão ativa
4. Review público acessível via `public_token` do deliverable

## 💳 Integração Stripe

### Feature Flag

Quando `tenant.features.stripe === true`:
- Planos e assinaturas gerenciados via Stripe
- Webhook recebido por Edge Function (`/functions/stripe-webhook`)
- Status armazenado em `workspaces.config.subscription`
- Bloqueio de acesso feito no frontend

## ⌘ Command Palette

### Funcionalidades

- Ativação: `Ctrl+K` / `⌘+K`
- Navegação entre módulos
- Busca de clientes e projetos
- Ações rápidas (novo projeto, upload de vídeo)
- Busca de ferramentas de IA

## 🔔 Notificações em Tempo Real

### Implementação

- **Supabase Realtime**: Escuta canal `notifications:workspace_id`
- **Eventos**: Novo comentário, mudança de status, aprovação de documento, pagamento recebido
- **Componente**: `NotificationCenter.tsx`

## 📋 Regras de Implementação

### O que DEVE ser feito

- ✅ Usar TypeScript strict em todos os arquivos
- ✅ Tipar todas as respostas do Supabase
- ✅ Usar Zod para validação
- ✅ Implementar ErrorBoundary
- ✅ Lazy loading de módulos
- ✅ Manter módulos isolados
- ✅ Usar CSS variables para cores
- ✅ Nomear em inglês

### O que NÃO DEVE ser feito

- ❌ Nomes de marca no código (exceto variáveis de ambiente)
- ❌ Express, SQLite, better-sqlite3
- ❌ Autenticação paralela ao Supabase
- ❌ CSS inline
- ❌ App.jsx monolítico
- ❌ `any` no TypeScript
- ❌ localStorage para estado crítico

## 🚀 Ordem de Execução

### FASE 1: Scaffolding
1. Criar estrutura de pastas
2. Configurar ferramentas de build
3. Instalar dependências
4. Criar tenant.config e tokens.css
5. Criar supabase client

### FASE 2: Autenticação
6. Implementar LoginPage
7. Implementar ProtectedRoute
8. Implementar AppShell

### FASE 3: Banco de Dados
9. Escrever migrations
10. Gerar database.types.ts
11. Ativar RLS

### FASE 4: Módulos (lazy-loaded)
12. `crm` — clientes e pipeline
13. `projects` — projetos com timeline
14. `documents` — editor + PDF
15. `video-review` — player + comentários
16. `finance` — lançamentos e previsão
17. `ai-tools` — 12 ferramentas
18. `analytics` — métricas
19. `admin` — gestão de usuários
20. `notifications` — tempo real

### FASE 5: Componentes Globais
21. CommandPalette
22. NotificationCenter
23. Skeleton loaders

### FASE 6: Integrações
24. Stripe webhook
25. Google Drive

### FASE 7: Qualidade
26. Audit de TypeScript
27. Acessibilidade
28. Responsividade
29. Performance

## 📦 Dependências

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@supabase/supabase-js": "^2.x",
    "hls.js": "^1.6.16",
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.x",
    "stripe": "^17.x",
    "zod": "^4.x"
  }
}
```

## 🌍 Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# IA
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_PUBLISHABLE_KEY=

# White Label
VITE_TENANT_NAME=
VITE_TENANT_LOGO=
VITE_PRIMARY_COLOR=
VITE_ACCENT_COLOR=
```

## ✅ Critério de Conclusão

O sistema está pronto quando:

- ✅ Novo tenant pode ser configurado alterando apenas `.env`
- ✅ Todos os módulos carregam via lazy loading
- ✅ `tsc --noEmit` retorna zero erros
- ✅ Usuário consegue criar fluxo completo (workspace → cliente → projeto → deliverable → review público)
- ✅ 12 ferramentas de IA executam via Edge Function
- ✅ Notificações chegam em tempo real
- ✅ Sem strings de marca hardcoded fora de `.env`

---

## 📁 Documentos Relacionados

1. `MASTER_PROMPT_Sistema_Unificado_White_Label.md` - Prompt principal para implementação
2. `Sistema_DOES_NOT_ZERO_Unificar_Analise_Completa.md` - Análise completa dos sistemas originais
3. `Sistema_DOES_NOT_ZERO_Unificar_Resumo_Executivo.md` - Resumo executivo

## 🎯 Direção Futura

### Próximos Passos Sugeridos

1. **Comece com a unificação de componentes** - Identifique componentes comuns
2. **Implemente lazy loading** - Foco no DNZ Central (maior base de usuários)
3. **Adicione novas funcionalidades** - Notification Center e Timeline Gantt
4. **Documente tudo** - Mantenha documentação técnica atualizada
5. **Implemente testes** - Adicione testes de integração e unitários

### Considerações de Negócio

- **White Label Ready**: Sistema pronto para receber qualquer identidade
- **Multi-tenant**: Cada cliente tem seu próprio workspace
- **Funcionalidades escalonáveis**: Ativadas/desativadas via flags de recursos
- **Pronto para produção**: Baseado em sistemas já funcionais

---

**Este documento serve como guia completo para unificar três sistemas existentes em uma única plataforma white label profissional e pronta para produção.**