-- ============================================================
-- LOOP-OS — Full Schema Seed
-- Paste this entire script in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- AUTO-UPDATE FUNCTION
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- WORKSPACES
-- ============================================================
create table if not exists public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  config      jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Usuários podem ver seus próprios workspaces"
  on public.workspaces for select
  using (
    id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem atualizar o workspace"
  on public.workspaces for update
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
create table if not exists public.workspace_members (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

create policy "Membros podem ver membros do workspace"
  on public.workspace_members for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem gerenciar membros"
  on public.workspace_members for all
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_workspace_members_workspace on public.workspace_members(workspace_id);
create index if not exists idx_workspaces_slug on public.workspaces(slug);

create trigger set_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.workspace_members
  for each row execute function public.update_updated_at();

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists public.clients (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name         text not null,
  email        text,
  phone        text,
  company      text,
  status       text not null default 'active' check (status in ('active', 'inactive', 'prospect')),
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Membros podem ver clientes do workspace"
  on public.clients for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem criar clientes"
  on public.clients for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem atualizar clientes"
  on public.clients for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem deletar clientes"
  on public.clients for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create index if not exists idx_clients_workspace on public.clients(workspace_id);
create index if not exists idx_clients_status on public.clients(status);

create trigger set_updated_at
  before update on public.clients
  for each row execute function public.update_updated_at();

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists public.projects (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id    uuid references public.clients(id) on delete set null,
  title        text not null,
  status       text not null default 'briefing' check (status in ('briefing', 'pre_production', 'production', 'post_production', 'review', 'delivered', 'archived')),
  type         text not null default 'other' check (type in ('film', 'commercial', 'documentary', 'web_series', 'other')),
  start_date   date,
  end_date     date,
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Membros podem ver projetos do workspace"
  on public.projects for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem criar projetos"
  on public.projects for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem atualizar projetos"
  on public.projects for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem deletar projetos"
  on public.projects for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create index if not exists idx_projects_workspace on public.projects(workspace_id);
create index if not exists idx_projects_client on public.projects(client_id);
create index if not exists idx_projects_status on public.projects(status);

create trigger set_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at();

-- ============================================================
-- DELIVERABLES
-- ============================================================
create table if not exists public.deliverables (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  title        text not null,
  video_url    text,
  hls_url      text,
  status       text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'delivered')),
  public_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.deliverables enable row level security;

create policy "Membros podem ver deliverables do projeto"
  on public.deliverables for select
  using (
    project_id in (
      select p.id from public.projects p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create policy "Membros podem criar deliverables"
  on public.deliverables for insert
  with check (
    project_id in (
      select p.id from public.projects p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create policy "Membros podem atualizar deliverables"
  on public.deliverables for update
  using (
    project_id in (
      select p.id from public.projects p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create policy "Qualquer um pode ver deliverables com token público"
  on public.deliverables for select
  using (true);

create index if not exists idx_deliverables_project on public.deliverables(project_id);
create index if not exists idx_deliverables_token on public.deliverables(public_token);

create trigger set_updated_at
  before update on public.deliverables
  for each row execute function public.update_updated_at();

-- ============================================================
-- REVIEW COMMENTS
-- ============================================================
create table if not exists public.review_comments (
  id                 uuid primary key default uuid_generate_v4(),
  deliverable_id     uuid not null references public.deliverables(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  guest_name         text not null default '',
  timestamp_seconds  numeric not null default 0,
  content            text not null,
  resolved           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.review_comments enable row level security;

create policy "Membros podem ver comments do deliverable"
  on public.review_comments for select
  using (
    deliverable_id in (
      select d.id from public.deliverables d
      join public.projects p on p.id = d.project_id
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create policy "Usuários autenticados podem criar comments"
  on public.review_comments for insert
  with check (auth.uid() = user_id);

create policy "Membros podem atualizar comments"
  on public.review_comments for update
  using (
    deliverable_id in (
      select d.id from public.deliverables d
      join public.projects p on p.id = d.project_id
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create index if not exists idx_review_comments_deliverable on public.review_comments(deliverable_id);

create trigger set_updated_at
  before update on public.review_comments
  for each row execute function public.update_updated_at();

-- ============================================================
-- DOCUMENTS
-- ============================================================
create table if not exists public.documents (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title        text not null,
  type         text not null check (type in ('briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico')),
  content      jsonb default '{}'::jsonb,
  status       text not null default 'draft' check (status in ('draft', 'review', 'approved', 'rejected')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Membros podem ver documentos do workspace"
  on public.documents for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem criar documentos"
  on public.documents for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem atualizar documentos"
  on public.documents for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem deletar documentos"
  on public.documents for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create index if not exists idx_documents_project on public.documents(project_id);
create index if not exists idx_documents_workspace on public.documents(workspace_id);
create index if not exists idx_documents_type on public.documents(type);

create trigger set_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at();

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table if not exists public.transactions (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id   uuid references public.projects(id) on delete set null,
  type         text not null check (type in ('income', 'expense')),
  amount       numeric not null check (amount > 0),
  currency     text not null default 'BRL',
  description  text not null,
  date         date not null default current_date,
  status       text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Membros podem ver transações do workspace"
  on public.transactions for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem criar transações"
  on public.transactions for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Membros podem atualizar transações"
  on public.transactions for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Admins podem deletar transações"
  on public.transactions for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create index if not exists idx_transactions_workspace on public.transactions(workspace_id);
create index if not exists idx_transactions_project on public.transactions(project_id);
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_status on public.transactions(status);

create trigger set_updated_at
  before update on public.transactions
  for each row execute function public.update_updated_at();

-- ============================================================
-- AI TOOL RUNS
-- ============================================================
create table if not exists public.ai_tool_runs (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  tool_id      text not null,
  input        jsonb default '{}'::jsonb,
  output       text not null default '',
  tokens_used  integer not null default 0 check (tokens_used >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.ai_tool_runs enable row level security;

create policy "Membros podem ver runs do workspace"
  on public.ai_tool_runs for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members where user_id = auth.uid()
    )
  );

create policy "Usuários podem criar seus próprios runs"
  on public.ai_tool_runs for insert
  with check (auth.uid() = user_id);

create index if not exists idx_ai_tool_runs_workspace on public.ai_tool_runs(workspace_id);
create index if not exists idx_ai_tool_runs_user on public.ai_tool_runs(user_id);

create trigger set_updated_at
  before update on public.ai_tool_runs
  for each row execute function public.update_updated_at();

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  type         text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  title        text not null,
  body         text not null default '',
  read         boolean not null default false,
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Usuários podem ver suas próprias notificações"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Sistema pode criar notificações"
  on public.notifications for insert
  with check (true);

create policy "Usuários podem marcar suas notificações como lidas"
  on public.notifications for update
  using (auth.uid() = user_id);

create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

create trigger set_updated_at
  before update on public.notifications
  for each row execute function public.update_updated_at();

-- ============================================================
-- APP STATE
-- ============================================================
create table if not exists public.app_state (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  key          text not null,
  value        jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(workspace_id, user_id, key)
);

alter table public.app_state enable row level security;

create policy "Usuários podem ver seus próprios app_state"
  on public.app_state for select
  using (auth.uid() = user_id);

create policy "Usuários podem upsert seus próprios app_state"
  on public.app_state for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios app_state"
  on public.app_state for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios app_state"
  on public.app_state for delete
  using (auth.uid() = user_id);

create index if not exists idx_app_state_user on public.app_state(user_id);
create index if not exists idx_app_state_key on public.app_state(workspace_id, user_id, key);

create trigger set_updated_at
  before update on public.app_state
  for each row execute function public.update_updated_at();

-- ============================================================
-- SEED DATA: Default workspace + admin member
-- ============================================================
insert into public.workspaces (id, name, slug, config)
values (
  '00000000-0000-0000-0000-000000000001',
  'Loop',
  'loop',
  '{"theme":"loop","locale":"pt-BR"}'::jsonb
) on conflict (slug) do nothing;
