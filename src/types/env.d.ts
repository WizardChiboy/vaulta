// Declares the app's EXPO_PUBLIC_ variables (see .env) so they can be read with dot notation —
// which Expo needs to inline them — under `noPropertyAccessFromIndexSignature`.
// Add a line here whenever you add a variable to .env.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_APP_ENV?: string;
    readonly EXPO_PUBLIC_MOCK_LATENCY_MS?: string;
  }
}
