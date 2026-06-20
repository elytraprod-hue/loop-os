-- Migration 003: Deliverables and Review Comments

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

-- Public access for review via token (no auth required)
create policy "Qualquer um pode ver deliverables com token público"
  on public.deliverables for select
  using (true);

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

-- Indexes
create index if not exists idx_deliverables_project on public.deliverables(project_id);
create index if not exists idx_deliverables_token on public.deliverables(public_token);
create index if not exists idx_review_comments_deliverable on public.review_comments(deliverable_id);

-- Triggers
create trigger set_updated_at
  before update on public.deliverables
  for each row execute function public.update_updated_at();

create trigger set_updated_at
  before update on public.review_comments
  for each row execute function public.update_updated_at();
