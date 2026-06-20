-- Migration 005: AI Tool Runs, Notifications, and App State

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

-- ============================================================
-- APP STATE (UI persistence per user)
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

-- Indexes
create index if not exists idx_ai_tool_runs_workspace on public.ai_tool_runs(workspace_id);
create index if not exists idx_ai_tool_runs_user on public.ai_tool_runs(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_app_state_user on public.app_state(user_id);
create index if not exists idx_app_state_key on public.app_state(workspace_id, user_id, key);

-- Triggers
create trigger set_updated_at
  before update on public.ai_tool_runs
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.notifications
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.app_state
  for each row execute function public.update_updated_at();
