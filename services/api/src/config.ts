import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const EnvironmentConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  GCP_PROJECT_ID: z.string().default('fundable-ai-dev'),
  GCP_REGION: z.string().default('us-central1'),
  FIREBASE_PROJECT_ID: z.string().default('fundable-ai-dev'),
  FIRESTORE_DATABASE_ID: z.string().default('(default)'),
  GCS_BUCKET_DOCUMENTS: z.string().default('fundable-ai-documents-dev'),
  GCS_BUCKET_EXPORTS: z.string().default('fundable-ai-exports-dev'),
  VERTEX_AI_LOCATION: z.string().default('us-central1'),
  GEMINI_MODEL_EXTRACTION: z.string().default('gemini-3.6-flash'),
  GEMINI_MODEL_GENERATION: z.string().default('gemini-3.6-flash'),
  GEMINI_API_KEY: z.string().optional(),
  ENABLE_MOCK_GCP: z.string().transform((val) => val === 'true').default('true')
});

export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;

export function loadConfig(): EnvironmentConfig {
  const result = EnvironmentConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment configuration:', result.error.format());
    throw new Error('Environment configuration validation failed');
  }
  return result.data;
}

export const config = loadConfig();
