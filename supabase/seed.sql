-- Seed data for development
-- Run after migrations have been applied

-- Create a default workspace for testing
insert into public.workspaces (id, name, slug, config)
values
  ('00000000-0000-0000-0000-000000000001', 'Demo Studio', 'demo-studio', '{"theme": {"primary": "#1a1a1a", "accent": "#4f46e5"}}'::jsonb);

-- Note: workspace_members will be created via the application after user signup.
-- Run the following in Supabase SQL editor after creating a test user:
-- insert into public.workspace_members (workspace_id, user_id, role)
-- values ('00000000-0000-0000-0000-000000000001', '<USER_UUID>', 'admin');

-- Sample clients
insert into public.clients (workspace_id, name, email, phone, company, status)
values
  ('00000000-0000-0000-0000-000000000001', 'Maria Silva', 'maria@exemplo.com', '(11) 99999-0001', 'TechVision', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'João Santos', 'joao@exemplo.com', '(11) 99999-0002', 'Criativa Mídia', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'Ana Costa', 'ana@exemplo.com', '(11) 99999-0003', 'Inovação Digital', 'prospect');

-- Sample projects
insert into public.projects (workspace_id, client_id, title, status, type, start_date, end_date)
values
  ('00000000-0000-0000-0000-000000000001', (select id from public.clients where email = 'maria@exemplo.com'), 'Comercial TechVision 2026', 'pre_production', 'commercial', '2026-07-01', '2026-08-15'),
  ('00000000-0000-0000-0000-000000000001', (select id from public.clients where email = 'joao@exemplo.com'), 'Documentário Criativa', 'briefing', 'documentary', '2026-08-01', null),
  ('00000000-0000-0000-0000-000000000001', null, 'Curta Experimental', 'production', 'film', '2026-06-15', '2026-07-30');

-- Sample documents
insert into public.documents (project_id, workspace_id, title, type, content, status)
values
  ((select id from public.projects where title = 'Comercial TechVision 2026'), '00000000-0000-0000-0000-000000000001', 'Briefing TechVision', 'briefing', '{"objective": "Comercial institucional", "duration": 30, "format": "16:9"}'::jsonb, 'approved');
