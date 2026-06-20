// src/hooks/useDbQuery.ts
// Database query helpers using TanStack Query + Supabase
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useWorkspaceQuery() {
  return useQuery({
    queryKey: ['workspace'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(*)')
        .single();
      if (error) throw error;
      return data?.workspaces ?? null;
    },
  });
}

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
      return data;
    },
    enabled: !!workspaceId,
  });
}

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
      return data;
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

export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; name: string; email?: string; phone?: string; company?: string }) => {
      const { data, error } = await supabase.from('clients').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; email?: string; phone?: string; company?: string; status?: string }) => {
      const { data, error } = await supabase.from('clients').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspace_id: string; client_id?: string; title: string; type: string }) => {
      const { data, error } = await supabase.from('projects').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}

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
      return data;
    },
    enabled: !!workspaceId,
  });
}

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
      return data;
    },
    enabled: !!userId,
  });
}
