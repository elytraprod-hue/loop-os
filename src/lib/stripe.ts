// src/lib/stripe.ts
import { env } from '../config/env';
import Stripe from 'stripe';

export const stripe = new Stripe(env.stripeSecretKey ?? '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export type StripeClient = typeof stripe;
