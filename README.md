# VAULTA

Fintech and digital banking mobile app UI — a 60-day React Native frontend challenge.
Frontend only: all data is mocked and every interaction is simulated.

Progress, the design audit and the screen → route map: [docs/IMPLEMENTATION_CHECKLIST.md](docs/IMPLEMENTATION_CHECKLIST.md).

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · NativeWind 4 (Tailwind 3) ·
Reanimated 4 · Lucide icons · Manrope (Expo Google Fonts) · React Hook Form + Zod

## Run

```bash
yarn install
yarn start          # dev server — open in the VAULTA development build (yarn start:go for Expo Go)
yarn android        # open on an Android emulator/device
yarn ios            # iOS simulator (macOS only) — on Windows use Expo Go on an iPhone
yarn web            # browser
yarn build:dev:android  # new development build (EAS) — only after native changes
```

After changing `tailwind.config.js`, `babel.config.js`, `metro.config.js` or `.env`, restart with
`yarn start --clear`.

## Checks

```bash
yarn verify         # typecheck + lint + format check — run before committing
yarn lint           # ESLint (expo + strict type-aware typescript-eslint + Prettier)
yarn format         # Prettier, sorts Tailwind classes
yarn typecheck      # tsc --noEmit
yarn check-deps     # verify package versions match the Expo SDK
```

Add native packages with `yarn expo install <pkg>` so versions match the SDK.

## Environment

`.env` holds shared, non-secret defaults (committed). Put personal overrides in `.env.local`
(gitignored). Read values through `src/lib/env.ts`, not `process.env` directly.

| Variable                      | Default       | Purpose                                                                      |
| ----------------------------- | ------------- | ---------------------------------------------------------------------------- |
| `EXPO_PUBLIC_APP_ENV`         | `development` | `development` · `preview` · `production` (set per EAS profile in `eas.json`) |
| `EXPO_PUBLIC_MOCK_LATENCY_MS` | `800`         | Simulated delay for mock requests                                            |

`EXPO_PUBLIC_` values are bundled into the app — never put secrets in them.

## Navigation

Only the authentication & onboarding screens (designs 01–07) exist so far.

```
src/app/
  _layout.tsx          fonts, theme, session provider
  index.tsx            redirects to /welcome
  (auth)/              welcome · sign-in · sign-up · verify-phone · forgot-password ·
                       reset-password · all-set
```

Flows: Welcome → Create account → Verify phone → All set · Welcome → Sign in ·
Sign in → Forgot password → Reset password → Sign in.

Auth is mocked in `src/store/session.tsx` — nothing is sent anywhere. Sign-in accepts any
valid email/phone with a password of 8+ characters; shorter passwords simulate “incorrect
password” (3 attempts). Any 6-digit verification code is accepted. Actions with no screen yet
(dashboard, Face ID, virtual card) show a short message.

Screens hide the native header and render `<ScreenHeader />`; auth screens use `<AuthScreen />`.

## Project layout

- `src/app/` — routes (Expo Router). Only screens and `_layout.tsx` files live here.
- `src/components/ui` — primitives: `Text`, `TextLink`, `Button`, `Card`, `Avatar`, `IconButton`,
  `IconTile`, `Logo`, `Loader`, `ProgressBar`, `SegmentedControl`.
- `src/components/forms` — `TextField`, `PasswordField`, `PasswordStrength`, `Checkbox`, `OtpInput`.
- `src/lib/schemas` — Zod schemas for forms (used with React Hook Form).
- `src/components/layout` — `Screen` (safe area + scroll), `ScreenHeader`, `AuthScreen`,
  `ThemeProvider` / `useTheme`.
- `src/constants/tokens.js` — **design tokens** (palette, light/dark semantic colours, type
  scale, spacing, radii, shadows). Shared by Tailwind and app code.
- `src/constants/icons.ts` — icon registry. Add Lucide icons here and import from
  `@/constants/icons`, never from `lucide-react-native` directly (keeps the bundle small).
- `src/mock`, `src/types`, `src/utils`, `src/lib`, `src/hooks`, `src/services`, `src/store`.

## Styling conventions

- Token values come from the screen designs in `assets/vaulta-ui` (navy `#101828`,
  green `#16A875`, background `#F5F7FA`, border `#E4E7EC`). Primary buttons are green with
  navy text; green text on white uses `accent` (`#0E7F57`) for contrast.
- Use semantic colour classes (`bg-surface`, `text-muted`, `border-border`, `bg-primary`,
  `bg-brand`, `text-accent`…).
  They resolve to CSS variables set by `ThemeProvider`, so switching
  `<ThemeProvider theme="dark">` re-skins the app without class changes.
- Font weight is chosen by font family (`font-sans-semibold`), not `font-semibold`, because
  each Manrope weight is a separate font file. Prefer the `Text` component's `variant`/`weight`.
- Spacing tokens: `xs sm md lg xl 2xl 3xl 4xl gutter gutter-lg` (e.g. `p-lg`, `gap-md`, `px-gutter`);
  Tailwind's numeric scale still works too, and is the same size on native and web
  (`inlineRem: 16` in `metro.config.js`).
- Logo: `<Logo />` uses the "vaulta." kit in `assets/vaulta-logo` (wordmark, monogram).

## Forms & keyboard

- Every screen renders inside `<Screen>`. Any screen with inputs must use `<Screen scroll>`
  (auth screens get this from `<AuthScreen>`): it uses `KeyboardAwareScrollView` from
  `react-native-keyboard-controller`, which scrolls the focused input above the keyboard on iOS
  and Android (including Android edge-to-edge, where the window no longer resizes).
- Don't wrap content in another `KeyboardAvoidingView`/`ScrollView`. ESLint blocks React Native's
  `KeyboardAvoidingView`, which does nothing on Android here.
- `react-native-keyboard-controller` is a native module: it works in the development build, not in
  Expo Go.
- Forms use React Hook Form + Zod (`src/lib/schemas`); read live values with `useWatch`, not
  `watch()` (React Compiler).

## TypeScript

The code is strictly typed; `yarn verify` must pass.

- **Compiler** (`tsconfig.json`): `strict` plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noUnused*`,
  `noImplicitReturns`, `verbatimModuleSyntax` and more. `src/constants/tokens.js` is checked via
  `// @ts-check` + JSDoc.
- **Lint**: typescript-eslint `strictTypeChecked` — no `any` (explicit or leaked), promises must be
  awaited or `void`-ed, `import type` for types.
- Optional component props are declared `prop?: T | undefined` so callers can pass `maybeValue`.
- New `EXPO_PUBLIC_*` variables must also be declared in `src/types/env.d.ts`.
- Images are imported (`import logo from '…png'`), typed by `src/types/assets.d.ts`.
- Avoid `as` casts and non-null `!`; narrow with type guards instead.
