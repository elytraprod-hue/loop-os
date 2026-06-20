// src/lib/anthropic.ts
import { env } from '../config/env';
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: env.anthropicApiKey ?? '',
});

export type AnthropicClient = typeof anthropic;
