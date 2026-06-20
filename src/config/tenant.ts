// src/config/tenant.ts
export const tenant = {
  name: import.meta.env['VITE_TENANT_NAME'] ?? 'Studio OS',
  logoUrl: import.meta.env['VITE_TENANT_LOGO'] ?? '/logo.svg',
  primaryColor: import.meta.env['VITE_PRIMARY_COLOR'] ?? '#1a1a1a',
  accentColor: import.meta.env['VITE_ACCENT_COLOR'] ?? '#4f46e5',
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

export type TenantConfig = typeof tenant;
