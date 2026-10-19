/**
 * Typed access to EXPO_PUBLIC_ environment variables (see .env).
 * Each variable must be read as `process.env.EXPO_PUBLIC_X` (dot notation) so Expo can inline it.
 */

const APP_ENVS = ['development', 'preview', 'production'] as const;
export type AppEnv = (typeof APP_ENVS)[number];

function isAppEnv(value: string | undefined): value is AppEnv {
  return APP_ENVS.some((appEnv) => appEnv === value);
}

function toAppEnv(value: string | undefined): AppEnv {
  return isAppEnv(value) ? value : 'development';
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

const appEnv = toAppEnv(process.env.EXPO_PUBLIC_APP_ENV);

export const env = {
  appEnv,
  isDev: appEnv === 'development',
  mockLatencyMs: toNumber(process.env.EXPO_PUBLIC_MOCK_LATENCY_MS, 800),
} as const;
