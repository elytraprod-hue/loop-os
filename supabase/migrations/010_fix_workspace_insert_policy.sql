-- Migration 010: Fix workspace creation by adding INSERT policy
-- This allows authenticated users to create new workspaces

-- Drop existing insert policy if it exists (for safety)
drop policy if exists "Usuários podem criar workspaces" on public.workspaces;

-- Create INSERT policy to allow authenticated users to create workspaces
create policy "Usuários podem criar workspaces"
  on public.workspaces for insert
  with check (auth.uid() is not null);

-- Also add a policy to allow the creator to be automatically added as admin
-- This will be handled by the trigger in migration 006
