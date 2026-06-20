// src/config/env.ts
export const env = {
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'] as string,
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'] as string,
  anthropicApiKey: import.meta.env['ANTHROPIC_API_KEY'] as string,
  stripePublishableKey: import.meta.env['VITE_STRIPE_PUBLISHABLE_KEY'] as string,
  stripeSecretKey: import.meta.env['STRIPE_SECRET_KEY'] as string,
  stripeWebhookSecret: import.meta.env['STRIPE_WEBHOOK_SECRET'] as string,
} as const;

export type EnvConfig = typeof env;
