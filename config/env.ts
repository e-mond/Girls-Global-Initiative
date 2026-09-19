import { z } from "zod";

/**
 * Environment shape for Foundations.
 * Production fail-closed checks for Paystack/SMTP expand in Unit 8.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  NEXT_PUBLIC_MOCK_API: z.enum(["true", "false"]).optional(),
  NEXT_PUBLIC_ENABLE_MSW: z.enum(["true", "false"]).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

/** Parse process.env safely without throwing during Foundations boot. */
export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment configuration", parsed.error.flatten());
    return {
      NODE_ENV: (process.env.NODE_ENV as AppEnv["NODE_ENV"]) ?? "development",
    };
  }
  return parsed.data;
}

/** True when local/dev should prefer MSW over live integrations. */
export function shouldUseMsw(env: AppEnv = getEnv()): boolean {
  if (env.NODE_ENV === "production") {
    return false;
  }
  return (
    env.NEXT_PUBLIC_MOCK_API === "true" ||
    env.NEXT_PUBLIC_ENABLE_MSW === "true" ||
    !env.DATABASE_URL
  );
}
