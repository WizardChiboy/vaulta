import { env } from './env';

/** Resolves with `value` after the configured mock latency, to simulate a network request. */
export function simulateRequest<T>(value: T, delayMs: number = env.mockLatencyMs): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}
