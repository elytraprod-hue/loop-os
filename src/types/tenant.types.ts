// src/types/tenant.types.ts
import { tenant } from '../config/tenant';

export type TenantConfig = typeof tenant;

export type FeatureFlag = keyof TenantConfig['features'];

export interface TenantSettings {
  name: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  features: Record<FeatureFlag, boolean>;
}
