import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

// ─── Workspace ───────────────────────────────────────────────

export function useWorkspaceQuery() {
  return useQuery<Workspace | null>({
    queryKey: ['workspace'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(*)')
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const w = data.workspaces as unknown as Workspace;
      return w;
    },
  });
}

export function useCreateWorkspaceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, userId }: { name: string; userId: string }) => {
      const slug = `workspace-${Math.random().toString(36).substring(2, 10)}`;
      const { data: ws, error: wsError } = await supabase
        .from('workspaces')
        .insert({ name, slug })
        .select()
        .single();
      if (wsError) throw wsError;

      const { error: memError } = await supabase
        .from('workspace_members')
        .insert({ workspace_id: ws.id, user_id: userId, role: 'admin' });
      if (memError) throw memError;

      return ws;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
}

export function useWorkspaceMembersQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace_members', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*, users:user_id(email)')
        .eq('workspace_id', workspaceId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

// ─── Clients ────────────────────────────────────────────────

export function useClientsQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['clients', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

export function useClientQuery(clientId?: string) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
}

export function useCreateClientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; name: string; email?: string; phone?: string; company?: string; status?: string }) => {
      const { data, error } = await supabase.from('clients').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; email?: string; phone?: string; company?: string; status?: string }) => {
      const { data, error } = await supabase.from('clients').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

// ─── Projects ───────────────────────────────────────────────

export function useProjectsQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name, company)')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

export function useProjectQuery(projectId?: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(*)')
        .eq('id', projectId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; client_id?: string; title: string; type: string }) => {
      const { data, error } = await supabase.from('projects').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; title?: string; status?: string; type?: string; client_id?: string; start_date?: string | null; end_date?: string | null; metadata?: Record<string, any> | null }) => {
      const { data, error } = await supabase.from('projects').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

// ─── Documents ──────────────────────────────────────────────

export function useDocumentsQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

export function useCreateDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; project_id?: string | null; title: string; type: string; content?: Record<string, unknown>; status?: string }) => {
      const { data, error } = await supabase.from('documents').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; title?: string; type?: string; content?: Record<string, unknown>; status?: string; project_id?: string | null }) => {
      const { data, error } = await supabase.from('documents').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
}

// ─── Deliverables ──────────────────────────────────────────

export function useDeliverableQuery(deliverableId?: string) {
  return useQuery({
    queryKey: ['deliverable', deliverableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title, clients(name))')
        .eq('id', deliverableId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!deliverableId,
  });
}

export function useDeliverableByTokenQuery(token?: string) {
  return useQuery({
    queryKey: ['deliverable_token', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title, clients(name))')
        .eq('public_token', token)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });
}

export function useReviewCommentsQuery(deliverableId?: string) {
  return useQuery({
    queryKey: ['review_comments', deliverableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_comments')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!deliverableId,
  });
}

export function useCreateCommentMutation() {
  return useMutation({
    mutationFn: async (payload: { deliverable_id: string; user_id: string; guest_name?: string; timestamp_seconds: number; content: string }) => {
      const { data, error } = await supabase.from('review_comments').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
  });
}

export function useDeliverablesQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['deliverables', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*, projects(title, clients(name))')
        .in('project_id', (await supabase.from('projects').select('id').eq('workspace_id', workspaceId)).data?.map(p => p.id) ?? [])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

export function useCreateDeliverableMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { project_id: string; title: string; video_url?: string }) => {
      const { data, error } = await supabase.from('deliverables').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deliverables'] }),
  });
}

export function useUpdateDeliverableMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; title?: string; status?: string; video_url?: string }) => {
      const { data, error } = await supabase.from('deliverables').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deliverables'] }),
  });
}

export function useDeleteDeliverableMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('deliverables').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deliverables'] }),
  });
}

// ─── Transactions ──────────────────────────────────────────

export function useTransactionsQuery(workspaceId?: string) {
  return useQuery({
    queryKey: ['transactions', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, projects(title)')
        .eq('workspace_id', workspaceId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId,
  });
}

export function useCreateTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; type: string; amount: number; description: string; date?: string; project_id?: string | null }) => {
      const { data, error } = await supabase.from('transactions').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useUpdateTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; type?: string; amount?: number; description?: string; status?: string }) => {
      const { data, error } = await supabase.from('transactions').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useDeleteTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

// ─── Notifications ─────────────────────────────────────────

export function useNotificationsQuery(userId?: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ─── AI Tool Runs ──────────────────────────────────────────

export function useCreateAiRunMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; user_id: string; tool_id: string; input: Record<string, unknown>; output: string }) => {
      const { data, error } = await supabase.from('ai_tool_runs').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai_runs'] }),
  });
}
