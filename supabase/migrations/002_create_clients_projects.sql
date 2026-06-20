-- Migration 002: Clients and Projects

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

-- Indexes
create index if not exists idx_clients_workspace on public.clients(workspace_id);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_projects_workspace on public.projects(workspace_id);
create index if not exists idx_projects_client on public.projects(client_id);
create index if not exists idx_projects_status on public.projects(status);

-- Triggers
create trigger set_updated_at
  before update on public.clients
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at();
