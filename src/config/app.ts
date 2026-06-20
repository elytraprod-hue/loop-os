// src/config/app.ts
import { env } from './env';

export const appConfig = {
  supabase: {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
  },
  anthropic: {
    apiKey: env.anthropicApiKey,
  },
  stripe: {
    publishableKey: env.stripePublishableKey,
    secretKey: env.stripeSecretKey,
    webhookSecret: env.stripeWebhookSecret,
  },
  features: {
    aiTools: true,
    videoReview: true,
    finance: true,
    analytics: true,
    crm: true,
    documents: true,
    notifications: true,
    gantt: true,
    stripe: false,
  },
} as const;

export type AppConfig = typeof appConfig;
