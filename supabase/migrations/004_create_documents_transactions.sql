-- Migration 004: Documents and Transactions

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

-- Indexes
create index if not exists idx_documents_project on public.documents(project_id);
create index if not exists idx_documents_workspace on public.documents(workspace_id);
create index if not exists idx_documents_type on public.documents(type);
create index if not exists idx_transactions_workspace on public.transactions(workspace_id);
create index if not exists idx_transactions_project on public.transactions(project_id);
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_status on public.transactions(status);

-- Triggers
create trigger set_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.transactions
  for each row execute function public.update_updated_at();
