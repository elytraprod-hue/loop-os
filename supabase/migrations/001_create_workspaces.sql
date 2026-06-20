-- Migration 001: Workspaces and workspace members
-- Creates the base tenant/multi-workspace structure

-- Enable UUID extension
create extension if not exists "uuid-ossp";

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

-- Indexes
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_workspace_members_workspace on public.workspace_members(workspace_id);
create index if not exists idx_workspaces_slug on public.workspaces(slug);

-- Auto-update updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.workspace_members
  for each row execute function public.update_updated_at();
