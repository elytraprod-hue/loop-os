// src/modules/auth/authService.ts
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthSession {
  user: AuthUser;
  session: Session;
}

export { useAuth } from './AuthProvider';
