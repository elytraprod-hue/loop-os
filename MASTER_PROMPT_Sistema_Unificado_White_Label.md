# MASTER PROMPT — Sistema Unificado (White Label Ready)
> Para uso no Cursor / Windsurf. Cole este documento como contexto inicial antes de qualquer geração de código.

---

## 🎯 OBJETIVO FINAL

Unificar três sistemas existentes — **DNZ Central**, **FRAME.AI Director** e **FRAME.AI Landing** — em uma única aplicação limpa, sem identidade visual fixa, sem nome no código, sem referências de marca. O sistema deve ser uma **plataforma white label** para produção audiovisual profissional, pronta para receber qualquer identidade e configuração via variáveis de ambiente e um arquivo de tenant/config.

O resultado final é um único repositório, um único deploy, uma única base de dados (Supabase), e um único conjunto de componentes reutilizáveis.

---

## 🏗️ STACK DEFINITIVA

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 7 |
| Linguagem | TypeScript (strict) |
| Banco de dados | Supabase (Postgres + Auth + Realtime + Storage) |
| Estilização | CSS Variables (design tokens) — sem Tailwind, sem CSS-in-JS |
| Componentes | shadcn/ui como base (headless, customizável) |
| IA | Anthropic Claude via @anthropic-ai/sdk |
| Pagamentos | Stripe |
| PDF | jsPDF + html2canvas |
| Vídeo | hls.js |
| Deploy | Vercel (frontend) + Supabase (backend/db) |
| Validação | Zod |
| Segurança | Supabase RLS (Row Level Security) |

> Não use Express/SQLite. Todo o backend vive no Supabase (Edge Functions quando necessário). A autenticação JWT do FRAME.AI Director deve ser migrada para Supabase Auth.

---

## 📁 ESTRUTURA DE PASTAS (canônica)

```
/
├── src/
│   ├── main.tsx                      # Entry point
│   ├── App.tsx                       # Router + providers
│   ├── config/
│   │   ├── tenant.ts                 # WHITE LABEL: nome, cores, logo, features flags
│   │   └── env.ts                    # Variáveis de ambiente tipadas
│   ├── lib/
│   │   ├── supabase.ts               # Cliente Supabase singleton
│   │   ├── anthropic.ts              # Wrapper Anthropic SDK
│   │   └── stripe.ts                 # Wrapper Stripe
│   ├── types/
│   │   ├── database.types.ts         # Gerado pelo Supabase CLI
│   │   ├── tenant.types.ts           # Tipos de configuração white label
│   │   └── domain.types.ts           # Tipos de domínio (Project, Client, Deliverable...)
│   ├── hooks/
│   │   ├── useAsync.ts
│   │   ├── useAutoSave.ts
│   │   ├── useClipboard.ts
│   │   ├── useConfirm.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteList.ts
│   │   ├── useKeyboard.ts
│   │   ├── useSupabaseQuery.ts
│   │   └── useToast.ts
│   ├── components/
│   │   ├── ui/                       # Primitivos (Button, Input, Modal, Badge, Card...)
│   │   ├── form-fields/              # ChipSelector, CurrencyInput, DurationPicker, MaskedInput, TimeInput
│   │   ├── skeletons/                # Loading states por módulo
│   │   ├── system/                   # ErrorBoundary, NotFound, ProtectedRoute
│   │   ├── CommandPalette.tsx        # ⌘K global
│   │   └── Layout/
│   │       ├── AppShell.tsx          # Shell principal (sidebar + header + content)
│   │       ├── Sidebar.tsx           # Navegação lateral (config-driven)
│   │       └── Header.tsx            # Topbar com busca + notificações + avatar
│   ├── modules/                      # Cada módulo é independente e lazy-loaded
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── authService.ts
│   │   ├── crm/
│   │   │   ├── CRMPage.tsx
│   │   │   ├── Pipeline.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   └── crmService.ts
│   │   ├── projects/
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── GanttTimeline.tsx
│   │   │   └── projectsService.ts
│   │   ├── video-review/
│   │   │   ├── VideoReviewPage.tsx   # Privado
│   │   │   ├── PublicReviewPage.tsx  # Link público sem auth
│   │   │   ├── VideoPlayer.tsx       # hls.js wrapper
│   │   │   ├── TimestampComments.tsx
│   │   │   └── reviewService.ts
│   │   ├── documents/
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── DocumentEditor.tsx
│   │   │   ├── PDFExport.tsx
│   │   │   └── documentsService.ts
│   │   ├── finance/
│   │   │   ├── FinancePage.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Forecast.tsx
│   │   │   └── financeService.ts
│   │   ├── ai-tools/
│   │   │   ├── AIToolsPage.tsx
│   │   │   ├── ToolRunner.tsx        # Interface de execução das 12 tools
│   │   │   ├── tools.config.ts       # Definição das ferramentas (migrado do shared/tools.ts)
│   │   │   └── aiService.ts
│   │   ├── analytics/
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── analyticsService.ts
│   │   ├── admin/
│   │   │   ├── AdminPage.tsx
│   │   │   ├── UsersManager.tsx
│   │   │   └── adminService.ts
│   │   └── notifications/
│   │       ├── NotificationCenter.tsx  # Supabase Realtime
│   │       └── notificationsService.ts
│   └── styles/
│       ├── tokens.css                # CSS custom properties (design tokens white label)
│       ├── reset.css
│       └── global.css
├── supabase/
│   ├── migrations/                   # Migrations unificadas e incrementais
│   └── functions/                    # Edge Functions (AI, webhooks Stripe)
├── public/
│   └── (assets estáticos sem marca)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## 🎨 WHITE LABEL — COMO FUNCIONA

### `src/config/tenant.ts`
Este é o único arquivo que muda entre deployments. Nunca hardcode nome, logo, cores ou strings de marca em nenhum outro lugar.

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
    stripe: false,   // ativar por tenant
  },
} as const;

export type TenantConfig = typeof tenant;
```

### `src/styles/tokens.css`
Todas as cores do sistema derivam de CSS variables injetadas dinamicamente a partir do `tenant.ts`. Nenhum componente usa cor hardcoded.

```css
:root {
  --color-primary: #1a1a1a;
  --color-accent: #4f46e5;
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-border: rgba(255,255,255,0.08);
  --color-text-primary: #ffffff;
  --color-text-muted: rgba(255,255,255,0.5);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
```

---

## 🗄️ BANCO DE DADOS — SCHEMA UNIFICADO (Supabase)

### Tabelas core

```sql
-- Workspaces (multi-tenant)
workspaces (id, name, slug, config jsonb, created_at)

-- Auth já gerenciado pelo Supabase Auth (auth.users)

-- Membros por workspace
workspace_members (id, workspace_id, user_id, role, created_at)
-- role: 'owner' | 'admin' | 'member' | 'viewer'

-- Clientes
clients (id, workspace_id, name, email, phone, company, status, metadata jsonb, created_at, updated_at)

-- Projetos
projects (id, workspace_id, client_id, title, status, type, start_date, end_date, metadata jsonb, created_at, updated_at)
-- status: 'briefing' | 'pre_production' | 'production' | 'post_production' | 'review' | 'delivered' | 'archived'

-- Deliverables (Video Review)
deliverables (id, project_id, title, video_url, hls_url, status, public_token uuid, created_at)

-- Comentários de Review (por timestamp)
review_comments (id, deliverable_id, user_id, guest_name, timestamp_seconds, content, resolved, created_at)

-- Documentos
documents (id, project_id, workspace_id, title, type, content jsonb, status, created_at, updated_at)
-- type: 'briefing' | 'roteiro' | 'proposta' | 'contrato' | 'ordem_servico'

-- Financeiro
transactions (id, workspace_id, project_id, type, amount, currency, description, date, status, metadata jsonb)
-- type: 'income' | 'expense'

-- Ferramentas IA (execuções)
ai_tool_runs (id, workspace_id, user_id, tool_id, input jsonb, output text, tokens_used int, created_at)

-- Notificações
notifications (id, workspace_id, user_id, type, title, body, read, metadata jsonb, created_at)

-- Estado do app (migrado do app_state do DNZ Central)
app_state (id, workspace_id, user_id, key text, value jsonb, updated_at)
```

### RLS (Row Level Security)
Toda tabela deve ter RLS ativo. Regra base:
```sql
-- Membros só veem dados do seu workspace
USING (workspace_id IN (
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
));
```

---

## 🤖 MÓDULO DE IA — 12 FERRAMENTAS

Migrar as ferramentas do `shared/tools.ts` do FRAME.AI Director para `src/modules/ai-tools/tools.config.ts`. Cada ferramenta segue esta interface:

```typescript
interface AITool {
  id: string;              // '01' a '12'
  name: string;
  description: string;
  category: 'pre_production' | 'production' | 'post_production' | 'business';
  inputSchema: z.ZodSchema;
  systemPrompt: string;
}
```

A execução de todas as ferramentas passa por uma Supabase Edge Function (`/functions/ai-run`) que:
1. Valida input com Zod
2. Chama Anthropic API
3. Salva o resultado em `ai_tool_runs`
4. Retorna o output ao cliente

---

## 🔐 AUTENTICAÇÃO

Usar exclusivamente **Supabase Auth**. Eliminar o sistema JWT/Express do FRAME.AI Director.

- Login: email/password (Supabase Auth)
- Sessão: gerenciada por `supabase.auth.getSession()`
- Proteção de rotas: componente `<ProtectedRoute>` que verifica sessão ativa
- Review público: sem auth, baseado em `public_token` do deliverable (UUID único, acesso via query param)
- Admin: baseado em `role` na tabela `workspace_members`

---

## 💳 STRIPE (feature flag)

Quando `tenant.features.stripe === true`:
- Planos e assinaturas gerenciados via Stripe
- Webhook recebido por Supabase Edge Function `/functions/stripe-webhook`
- Status de assinatura armazenado em `workspaces.config.subscription`
- Bloqueio de acesso a módulos premium feito no frontend via `tenant.features.*`

---

## ⌘ COMMAND PALETTE

O `CommandPalette.tsx` deve ser global, ativado por `Ctrl+K` / `⌘+K`, e incluir:

- Navegação entre módulos
- Busca de clientes (`clients`)
- Busca de projetos (`projects`)
- Ações rápidas: "Novo projeto", "Nova proposta", "Upload de vídeo"
- Busca de ferramentas de IA

---

## 🔔 NOTIFICAÇÕES (Supabase Realtime)

O `NotificationCenter.tsx` escuta o canal `notifications:workspace_id` via Supabase Realtime. Eventos que geram notificação:
- Novo comentário em review
- Projeto mudou de status
- Documento aprovado
- Pagamento recebido (Stripe webhook)

---

## 📋 REGRAS DE IMPLEMENTAÇÃO

### O que o agente DEVE fazer:
- Usar TypeScript strict em todos os arquivos
- Tipar todas as respostas do Supabase com `database.types.ts`
- Usar Zod para validar inputs de formulários e payloads de API
- Implementar `ErrorBoundary` em todos os módulos
- Usar lazy loading (`React.lazy + Suspense`) em todos os módulos do router
- Manter cada módulo isolado: sem imports cruzados entre módulos (usar hooks/services compartilhados em `src/hooks` e `src/lib`)
- Usar CSS variables do `tokens.css` para qualquer cor, nunca hex hardcoded
- Nomear variáveis e funções em inglês; comentários e strings de UI podem ser em português

### O que o agente NÃO DEVE fazer:
- Usar nomes de marca no código (`dnz`, `frame`, `nexo`, `centralis`) — exceto em variáveis de ambiente
- Instalar Express, SQLite ou better-sqlite3
- Criar autenticação paralela ao Supabase Auth
- Escrever CSS inline nos componentes
- Criar um `App.jsx` monolítico — cada módulo tem seu próprio roteamento
- Usar `any` no TypeScript
- Usar `localStorage` para estado crítico — usar `app_state` no Supabase

---

## 🚀 ORDEM DE EXECUÇÃO (para o agente)

Execute nesta sequência exata. Não avance para a próxima fase sem concluir a atual.

### FASE 1 — Scaffolding
1. Criar estrutura de pastas conforme definido acima
2. Configurar `vite.config.ts`, `tsconfig.json`, `vercel.json`
3. Instalar dependências do `package.json`
4. Criar `src/config/tenant.ts` e `src/styles/tokens.css`
5. Criar `src/lib/supabase.ts`

### FASE 2 — Auth
6. Implementar `LoginPage.tsx`
7. Implementar `ProtectedRoute.tsx`
8. Implementar `AppShell.tsx` com sidebar config-driven

### FASE 3 — Banco de dados
9. Escrever todas as migrations Supabase em `supabase/migrations/`
10. Gerar `database.types.ts` com Supabase CLI
11. Ativar RLS em todas as tabelas

### FASE 4 — Módulos (lazy-loaded, na ordem)
12. `crm` — clientes e pipeline
13. `projects` — projetos com fluxo de status
14. `documents` — editor + exportação PDF
15. `video-review` — player HLS + comentários por timestamp + link público
16. `finance` — lançamentos e previsão
17. `ai-tools` — 12 ferramentas com Supabase Edge Function
18. `analytics` — métricas operacionais
19. `admin` — gestão de usuários e workspace
20. `notifications` — Supabase Realtime

### FASE 5 — Componentes globais
21. `CommandPalette.tsx`
22. `NotificationCenter.tsx`
23. Skeleton loaders para cada módulo

### FASE 6 — Integrações externas
24. Stripe (Edge Function de webhook)
25. Google Drive (migrado do `driveService.js`)

### FASE 7 — Qualidade
26. Audit de TypeScript (zero erros `tsc --noEmit`)
27. Audit de acessibilidade (foco visível, ARIA roles)
28. Teste de responsividade mobile
29. Audit de performance (Lighthouse)

---

## 📦 PACKAGE.JSON — DEPENDÊNCIAS

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
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript": "^5.x",
    "vite": "^7.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## 🌍 VARIÁVEIS DE AMBIENTE (.env)

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # somente Edge Functions

# Anthropic
ANTHROPIC_API_KEY=                # somente Edge Functions

# Stripe
STRIPE_SECRET_KEY=                # somente Edge Functions
STRIPE_WEBHOOK_SECRET=            # somente Edge Functions
VITE_STRIPE_PUBLISHABLE_KEY=

# White Label (por tenant/deploy)
VITE_TENANT_NAME=
VITE_TENANT_LOGO=
VITE_PRIMARY_COLOR=
VITE_ACCENT_COLOR=
```

---

## ✅ CRITÉRIO DE CONCLUSÃO

O sistema está pronto quando:
- [ ] Um novo tenant pode ser configurado alterando apenas `.env` e nenhum outro arquivo
- [ ] Todos os módulos carregam via lazy loading sem erro
- [ ] `tsc --noEmit` retorna zero erros
- [ ] Um usuário consegue criar workspace → cliente → projeto → deliverable → compartilhar link de review público → receber comentário com timestamp
- [ ] As 12 ferramentas de IA executam via Supabase Edge Function
- [ ] Notificações chegam em tempo real via Supabase Realtime
- [ ] O sistema não contém nenhuma string de marca hardcoded fora de `.env`
