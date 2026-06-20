// src/types/domain.types.ts
// Core domain types for the unified system

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  workspace_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'prospect';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  client_id?: string;
  title: string;
  status: 'briefing' | 'pre_production' | 'production' | 'post_production' | 'review' | 'delivered' | 'archived';
  type: 'film' | 'commercial' | 'documentary' | 'web_series' | 'other';
  start_date?: string;
  end_date?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  title: string;
  video_url?: string;
  hls_url?: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  public_token: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewComment {
  id: string;
  deliverable_id: string;
  user_id: string;
  guest_name: string;
  timestamp_seconds: number;
  content: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  project_id: string;
  workspace_id: string;
  title: string;
  type: 'briefing' | 'roteiro' | 'proposta' | 'contrato' | 'ordem_servico';
  content?: Record<string, any>;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  workspace_id: string;
  project_id?: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIToolRun {
  id: string;
  workspace_id: string;
  user_id: string;
  tool_id: string;
  input?: Record<string, any>;
  output: string;
  tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  workspace_id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  body: string;
  read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AppState {
  id: string;
  workspace_id: string;
  user_id: string;
  key: string;
  value?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
