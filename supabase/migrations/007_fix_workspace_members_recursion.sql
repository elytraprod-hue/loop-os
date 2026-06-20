-- Migration 007: Fix infinite recursion in workspace_members select policy

-- 1. Create a security definer function to check workspace membership without triggering RLS recursion
create or replace function public.get_user_workspace_ids(usr_id uuid)
returns setof uuid as $$
  select workspace_id from public.workspace_members where user_id = usr_id;
$$ language sql security definer;

-- 2. Drop the old recursive select policy on workspace_members
drop policy if exists "Membros podem ver membros do workspace" on public.workspace_members;

-- 3. Recreate the policy using the security definer function
create policy "Membros podem ver membros do workspace"
  on public.workspace_members for select
  using (
    workspace_id in (
      select public.get_user_workspace_ids(auth.uid())
    )
  );
