-- Migration 006: Auto Workspace creation on signup
-- Sets up a trigger on auth.users to automatically create a workspace and a member entry for new registrations.

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_workspace_id uuid;
  workspace_name text;
  workspace_slug text;
begin
  -- Get workspace name from email prefix or default
  workspace_name := split_part(new.email, '@', 1);
  if workspace_name is null or workspace_name = '' then
    workspace_name := 'Meu Workspace';
  else
    -- Capitalize name
    workspace_name := concat(upper(substring(workspace_name from 1 for 1)), substring(workspace_name from 2), ' Workspace');
  end if;

  -- Create a unique slug using user id
  workspace_slug := concat('workspace-', lower(substring(new.id::text from 1 for 8)));

  -- Create a workspace for the new user
  insert into public.workspaces (name, slug)
  values (workspace_name, workspace_slug)
  on conflict (slug) do update set name = excluded.name
  returning id into new_workspace_id;

  -- Add the user to the workspace members as 'admin'
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, new.id, 'admin')
  on conflict (workspace_id, user_id) do update set role = 'admin';

  return new;
exception
  when others then
    -- Fail gracefully and log error if needed
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute the function on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fallback insert policies for client-side workspace creation
create policy "Qualquer usuário autenticado pode criar um workspace"
  on public.workspaces for insert
  with check (auth.role() = 'authenticated');

create policy "Usuários podem se adicionar a workspaces"
  on public.workspace_members for insert
  with check (auth.uid() = user_id);
