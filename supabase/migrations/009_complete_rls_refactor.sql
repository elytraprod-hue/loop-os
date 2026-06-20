-- Migration 009: Complete RLS Refactor to resolve infinite recursion loops

-- 1. Create a security definer function to check workspace membership without triggering RLS recursion
create or replace function public.is_member_of_workspace(workspace_id uuid)
returns boolean security definer as $$
  select exists (
    select 1 from public.workspace_members 
    where workspace_members.workspace_id = is_member_of_workspace.workspace_id 
      and workspace_members.user_id = auth.uid()
  );
$$ language sql;

-- 2. Create a security definer function to check workspace admin role without triggering RLS recursion
create or replace function public.is_workspace_admin(workspace_id uuid)
returns boolean security definer as $$
  select exists (
    select 1 from public.workspace_members 
    where workspace_members.workspace_id = is_workspace_admin.workspace_id 
      and workspace_members.user_id = auth.uid()
      and workspace_members.role = 'admin'
  );
$$ language sql;

-- 3. Drop and recreate policies for workspaces table
drop policy if exists "Usuários podem ver seus próprios workspaces" on public.workspaces;
create policy "Usuários podem ver seus próprios workspaces"
  on public.workspaces for select
  using (public.is_member_of_workspace(id));

drop policy if exists "Admins podem atualizar o workspace" on public.workspaces;
create policy "Admins podem atualizar o workspace"
  on public.workspaces for update
  using (public.is_workspace_admin(id));

-- 4. Drop and recreate policies for workspace_members table
drop policy if exists "Membros podem ver membros do workspace" on public.workspace_members;
create policy "Membros podem ver membros do workspace"
  on public.workspace_members for select
  using (public.is_member_of_workspace(workspace_id));

drop policy if exists "Admins podem gerenciar membros" on public.workspace_members;
create policy "Admins podem gerenciar membros"
  on public.workspace_members for all
  using (public.is_workspace_admin(workspace_id));
