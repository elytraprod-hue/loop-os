-- Migration 007: Fix RLS infinite recursion on workspace_members
-- 
-- PROBLEM: The SELECT policy on workspace_members queries workspace_members itself,
-- causing infinite recursion: "infinite recursion detected in policy for relation workspace_members"
--
-- SOLUTION: Create a SECURITY DEFINER helper function that bypasses RLS to check
-- membership, then use it in all policies that need to verify workspace access.
--
-- This pattern is the official Supabase recommendation for this exact scenario:
-- https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions

-- ============================================================
-- STEP 1: Drop conflicting old policies
-- ============================================================

-- workspace_members policies (recursive ones)
drop policy if exists "Membros podem ver membros do workspace" on public.workspace_members;
drop policy if exists "Admins podem gerenciar membros" on public.workspace_members;
drop policy if exists "Usuários podem se adicionar a workspaces" on public.workspace_members;

-- workspaces policies (also reference workspace_members subquery)
drop policy if exists "Usuários podem ver seus próprios workspaces" on public.workspaces;
drop policy if exists "Admins podem atualizar o workspace" on public.workspaces;
drop policy if exists "Qualquer usuário autenticado pode criar um workspace" on public.workspaces;

-- Other tables that reference workspace_members in their policies
drop policy if exists "Membros podem ver runs do workspace" on public.ai_tool_runs;

-- ============================================================
-- STEP 2: Create SECURITY DEFINER helper functions
-- These functions run as the function owner (bypassing RLS)
-- so they can safely query workspace_members without recursion.
-- ============================================================

-- Returns all workspace_ids that the current user is a member of
create or replace function public.get_user_workspace_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select workspace_id
  from public.workspace_members
  where user_id = auth.uid();
$$;

-- Returns true if the current user is an admin of a given workspace
create or replace function public.is_workspace_admin(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- Returns true if the current user is a member (any role) of a given workspace
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- STEP 3: Re-create workspace_members policies using the helper
-- ============================================================

-- SELECT: a member can see their own membership record, or others in their workspaces
create policy "Membros podem ver membros do workspace"
  on public.workspace_members for select
  using (
    user_id = auth.uid()
    or workspace_id in (select public.get_user_workspace_ids())
  );

-- INSERT: a user can add themselves to a workspace
create policy "Usuários podem se adicionar a workspaces"
  on public.workspace_members for insert
  with check (auth.uid() = user_id);

-- UPDATE/DELETE: only admins can manage other members
create policy "Admins podem gerenciar membros"
  on public.workspace_members for all
  using (public.is_workspace_admin(workspace_id));

-- ============================================================
-- STEP 4: Re-create workspaces policies using the helper
-- ============================================================

create policy "Usuários podem ver seus próprios workspaces"
  on public.workspaces for select
  using (id in (select public.get_user_workspace_ids()));

create policy "Qualquer usuário autenticado pode criar um workspace"
  on public.workspaces for insert
  with check (auth.role() = 'authenticated');

create policy "Admins podem atualizar o workspace"
  on public.workspaces for update
  using (public.is_workspace_admin(id));

-- ============================================================
-- STEP 5: Re-create ai_tool_runs policy using helper
-- ============================================================

create policy "Membros podem ver runs do workspace"
  on public.ai_tool_runs for select
  using (public.is_workspace_member(workspace_id));

-- ============================================================
-- DONE: All recursive RLS policies have been replaced with
-- non-recursive SECURITY DEFINER function-based policies.
-- ============================================================
