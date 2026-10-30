# VAULTA — Design audit & implementation checklist

Source of truth: `assets/vaulta-ui/screens/01–39` (393 × 852 HTML mockups), `assets/vaulta-logo/`.
Audited 2026-10-19. Tick items as they ship; keep this file current.

Legend: ✅ done · 🟡 partly done · ⬜ not started

---

## 1. Foundation

| Item                                                                             | Status | Where                                                          |
| -------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------- |
| Expo SDK 58, React Native 0.88, TypeScript (strict), Yarn                        | ✅     | `package.json`, `tsconfig.json`                                |
| Expo Router (typed routes), `src/app`                                            | ✅     | `src/app/`                                                     |
| NativeWind 4 + Tailwind 3, global CSS                                            | ✅     | `tailwind.config.js`, `global.css`                             |
| ESLint (`eslint-config-expo`, flat config) + Prettier (+ Tailwind class sorting) | ✅     | `eslint.config.js`, `.prettierrc` — `yarn lint`, `yarn format` |
| Environment config (`EXPO_PUBLIC_*`, typed reader, per-EAS-profile values)       | ✅     | `.env`, `src/lib/env.ts`, `eas.json`                           |
| Folder structure                                                                 | ✅     | see README                                                     |
| Dev client + EAS build profiles                                                  | ✅     | `eas.json`                                                     |
| App icon, adaptive icon, splash, favicon from the "vaulta." logo kit             | ✅     | `app.json`, `assets/images/`                                   |
| Form validation: React Hook Form + Zod                                           | ✅     | `src/lib/schemas/`                                             |
| NativeWind rem = 16 on native (matches web)                                      | ✅     | `metro.config.js`                                              |
| Fonts: Manrope 400/500/600/700                                                   | ✅     | `src/app/_layout.tsx`                                          |

## 2. Design tokens (`src/constants/tokens.js`)

| Token group     | Status | Notes                                                                                                                                                                                    |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colours (light) | ✅     | Navy `#101828`, green `#16A875` (pressed `#13965F`, text `#0E7F57`), bg `#F5F7FA`, borders `#E4E7EC` / `#D0D5DD`, status solid/text/soft                                                 |
| Colours (dark)  | ✅     | From `assets/vaulta-ui-dark` (README + CSS): bg `#0B0F17`, surface `#161B26`, raised `#1F2633`, hero `#1A2232`, border `#262E3D`, green text `#3CCB91`, tint `#10291F` (`palette.night`) |
| Typography      | ✅     | display 32 · h1 28 · h2 20 · h3 17 · body-lg 16 · body 15 · body-sm 14 · caption 13 · small 12 · xs 11 · overline 11                                                                     |
| Spacing         | ✅     | 4-pt scale + `gutter` 20 (app screens) + `gutter-lg` 24 (auth screens)                                                                                                                   |
| Radii           | ✅     | 8 · 12 (inputs, icon buttons) · 14 (buttons) · 16 (cards) · 20 (balance card) · 24 · full                                                                                                |
| Shadows         | ✅     | sm/md/lg, navy-tinted                                                                                                                                                                    |
| Icon stroke     | ✅     | `ICON_STROKE = 1.8` in `src/constants/icons.ts`                                                                                                                                          |

## 3. Shared components

### Built

| Component           | Path                                    | Covers                                                                                      |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Text`              | `components/ui/Text.tsx`                | Type scale, weights, tones                                                                  |
| `Button`            | `components/ui/Button.tsx`              | primary · secondary · outline · outlineInverse · disabled · loading · icons                 |
| `TextField` (Input) | `components/forms/TextField.tsx`        | label, hint, error (icon + red ring), success, focus ring, icons                            |
| `PasswordField`     | `components/forms/PasswordField.tsx`    | show/hide toggle                                                                            |
| `PasswordStrength`  | `components/forms/PasswordStrength.tsx` | 4-segment meter: Weak · Fair · Good · Strong                                                |
| `Checkbox`          | `components/forms/Checkbox.tsx`         | text or rich label (inline links), error                                                    |
| `OtpInput`          | `components/forms/OtpInput.tsx`         | 6 boxes, paste and SMS autofill                                                             |
| `SegmentedControl`  | `components/ui/SegmentedControl.tsx`    | e.g. Email / Phone number                                                                   |
| `ProgressBar`       | `components/ui/ProgressBar.tsx`         | thin (4px step) · default (8px)                                                             |
| `IconTile`          | `components/ui/IconTile.tsx`            | 52px soft-green icon square                                                                 |
| `TextLink`          | `components/ui/TextLink.tsx`            | green link, standalone or inline                                                            |
| `AuthScreen`        | `components/layout/AuthScreen.tsx`      | shared layout for screens 02–06                                                             |
| `Card`              | `components/ui/Card.tsx`                | outlined (default) · elevated · filled · brand                                              |
| `Avatar`            | `components/ui/Avatar.tsx`              | initials / photo / icon; green · neutral · brand · add; 40/44/52/80                         |
| `IconButton`        | `components/ui/IconButton.tsx`          | outline (design `.ib`) · ghost · soft · primary; optional icon size                         |
| `Badge`             | `components/ui/Badge.tsx`               | 11px/600 pill (`.tag`); accent · neutral                                                    |
| `BalanceCard`       | `components/money/BalanceCard.tsx`      | navy card, decorative ring, hide/show balance, copy (simulated), month inflow, All accounts |
| `QuickAction`       | `components/money/QuickAction.tsx`      | 56px tile + 13px label (08)                                                                 |
| `TransactionRow`    | `components/money/TransactionRow.tsx`   | category tile, name, meta, signed amount; money in in accent green                          |
| `TabBar`            | `components/layout/TabBar.tsx`          | custom bottom tabs (`.nav`); unbuilt tabs show a message                                    |
| `Logo`              | `components/ui/Logo.tsx`                | "vaulta." wordmark · reversed · monogram · mono (tintable)                                  |
| `Loader`            | `components/ui/Loader.tsx`              | inline / full screen                                                                        |
| `Screen`            | `components/layout/Screen.tsx`          | safe area, scroll, keyboard, background                                                     |
| `ScreenHeader`      | `components/layout/ScreenHeader.tsx`    | back button, centred title, right action, large title                                       |
| `CopyButton`        | `components/ui/CopyButton.tsx`          | 28px green copy icon, tick on press (simulated)                                             |

### To build (found in the audit)

| Component                                 | Used on                   | Notes                                                                                                |
| ----------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------- |
| ⬜ `Amount` / money text                  | 08 10 12 19 20 21 28 29 … | Tabular figures, muted kobo (`.00` in `#98A2B3`), sign colours. **Must solve the ₦ glyph — see §7.** |
| ⬜ `ListRow` / `SettingsRow`              | 09 15 17 22 34–39         | Icon tile (36–40px, `#F2F4F7`), title 15/500, subtitle 13, chevron or value, `#F2F4F7` dividers      |
| ⬜ `Chip` / `FilterChip`                  | 11 13 14 15 19 22         | 36px pill; selected = `#EAF8F1` bg, green border, `#0E7F57` text, check icon                         |
| ⬜ `Switch`                               | 18 25 31 36–39            | 48×28 track, 22px knob, green when on                                                                |
| ⬜ `ProgressBar` over-budget variant      | 32                        | Base component built; add the red over-budget state                                                  |
| 🟡 `Badge` / `Tag`                        | 01 15 23 31               | Built with accent · neutral tones (09); add status tones when needed                                 |
| ⬜ `NumberPad`                            | 19                        | 3×4 keypad with delete                                                                               |
| ⬜ `RangeSlider`                          | 14                        | Two thumbs — needs `react-native-gesture-handler` (in Expo Go and dev build)                         |
| ⬜ `DateField`                            | 14 27                     | From/To pickers — decide: native picker module vs custom sheet                                       |
| ⬜ `PaymentCard` (visual card)            | 01 23 24                  | Green card art, masked number, flip/reveal                                                           |
| ⬜ Charts: bar, donut, line               | 23 25 27 30 31 33         | `react-native-svg` is installed; build simple SVG charts rather than adding a chart library          |
| ✅ `KeyValueList` (`.kv`)                 | 10 12 20 29               | Built: `components/ui/KeyValueList.tsx`                                                              |
| ⬜ `EmptyState` / `Toast` (copy feedback) | 07 08 12 21 24            | "Copied" confirmation                                                                                |

## 4. Navigation

| Item                                             | Status | Where / notes                                                                                                                          |
| ------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Auth & onboarding stack (welcome anchor)         | ✅     | `src/app/(auth)/_layout.tsx`; `/` redirects to `/welcome`                                                                              |
| Mock session (sign in, sign up → verify)         | ✅     | `src/store/session.tsx`                                                                                                                |
| Screen headers (custom, matches `.hd`)           | ✅     | `ScreenHeader`, `AuthScreen`                                                                                                           |
| Signed-in area + guard (`Stack.Protected`)       | ✅     | `src/app/(app)/`; `<Stack.Protected guard={!!user} redirectTo="/welcome">` in the root layout. Sign-in and “Go to dashboard” open Home |
| Bottom tabs: Home · Transfer · Savings · Profile | 🟡     | `(app)/(tabs)/_layout.tsx` + `TabBar`. Only Home exists; the other three show a message until built                                    |
| Modal presentation                               | ⬜     | `presentation: 'modal'` — search (13)                                                                                                  |
| Bottom sheets (native `formSheet`)               | ⬜     | 14 filter (detent 0.9), 29 confirm deposit (`fitToContents`). Android sheets show no native header                                     |
| Session persistence                              | ⬜     | In memory today; a full reload signs out                                                                                               |

Tabs, a modal and a formSheet were prototyped and verified on web earlier, then removed until their screens are built.

## 5. Screens → routes

Routes are relative to `src/app/`. `(app)` screens will require a session.

| #   | Screen                   | Route                                            | Presentation                     | Status                                                                                       |
| --- | ------------------------ | ------------------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------- |
| 01  | Welcome                  | `(auth)/welcome`                                 | stack root, navy                 | ✅                                                                                           |
| 02  | Sign in                  | `(auth)/sign-in`                                 | push                             | ✅ email/phone tabs, validation, wrong-password attempts, Face ID (simulated)                |
| 03  | Create account           | `(auth)/sign-up`                                 | push                             | ✅ validation, strength meter, terms; +234 only                                              |
| 04  | Verify phone             | `(auth)/verify-phone`                            | push                             | ✅ OTP, resend countdown; any 6-digit code passes                                            |
| 05  | Forgot password          | `(auth)/forgot-password`                         | push                             | ✅                                                                                           |
| 06  | Reset password           | `(auth)/reset-password`                          | push                             | ✅ live rules checklist, match check                                                         |
| 07  | You’re all set           | `(auth)/all-set`                                 | replace, no back gesture         | ✅ copy simulated; dashboard / Face ID / card show a message                                 |
| 08  | Home                     | `(app)/(tabs)/index`                             | tab                              | ✅ hide balance, copy (simulated); unbuilt destinations show a message                       |
| 09  | Accounts                 | `(app)/accounts/index`                           | push                             | ✅ totals computed from mock accounts; actions show a message                                |
| 10  | Account details          | `(app)/accounts/[id]`                            | push                             | ✅ ledger balance from pending holds; copy (simulated); more options, actions show a message |
| 11  | Transactions             | `(app)/transactions/index`                       | push                             | ⬜ chips, grouped list, load more                                                            |
| 12  | Transaction details      | `(app)/transactions/[id]`                        | push                             | ⬜ share, receipt, copy ref                                                                  |
| 13  | Search transactions      | `(app)/transactions/search`                      | modal                            | ⬜                                                                                           |
| 14  | Filter transactions      | `(app)/transactions/filter`                      | formSheet 0.9                    | ⬜                                                                                           |
| 15  | Notifications            | `(app)/notifications`                            | push                             | ⬜                                                                                           |
| 16  | Transfer                 | `(app)/(tabs)/transfer`                          | tab                              | ⬜                                                                                           |
| 17  | Select recipient         | `(app)/transfers/recipient`                      | push                             | ⬜                                                                                           |
| 18  | Add recipient            | `(app)/transfers/add-recipient`                  | push                             | ⬜ bank picker, account lookup                                                               |
| 19  | Enter amount             | `(app)/transfers/amount`                         | push                             | ⬜ NumberPad, quick-amount chips                                                             |
| 20  | Review transfer          | `(app)/transfers/review`                         | push                             | ⬜                                                                                           |
| 21  | Transfer successful      | `(app)/transfers/success`                        | replace, no back gesture         | ⬜                                                                                           |
| 22  | Transfer history         | `(app)/transfers/history`                        | push                             | ⬜                                                                                           |
| 23  | Cards                    | `(app)/cards/index`                              | push                             | ⬜                                                                                           |
| 24  | Card details             | `(app)/cards/[id]`                               | push                             | ⬜ reveal number (mock only)                                                                 |
| 25  | Card controls            | `(app)/cards/[id]/controls`                      | push                             | ⬜ switches, limit                                                                           |
| 26  | Savings                  | `(app)/(tabs)/savings`                           | tab                              | ⬜                                                                                           |
| 27  | New savings goal         | `(app)/goals/new`                                | push                             | ⬜ icon picker, auto-save                                                                    |
| 28  | Goal details             | `(app)/goals/[id]`                               | push                             | ⬜                                                                                           |
| 29  | Add money to savings     | `(app)/goals/[id]/add-money` + `confirm-deposit` | push + formSheet (fitToContents) | ⬜                                                                                           |
| 30  | Spending analytics       | `(app)/insights/index`                           | push                             | ⬜ bar chart                                                                                 |
| 31  | Category breakdown       | `(app)/insights/categories`                      | push                             | ⬜ donut                                                                                     |
| 32  | Monthly budget           | `(app)/insights/budget`                          | push                             | ⬜                                                                                           |
| 33  | Monthly report           | `(app)/insights/report`                          | push                             | ⬜ share / PDF (simulated)                                                                   |
| 34  | Profile                  | `(app)/(tabs)/profile`                           | tab                              | ⬜                                                                                           |
| 35  | Edit profile             | `(app)/settings/edit-profile`                    | push                             | ⬜                                                                                           |
| 36  | Personal information     | `(app)/settings/personal`                        | push                             | ⬜                                                                                           |
| 37  | Security                 | `(app)/settings/security`                        | push                             | ⬜                                                                                           |
| 38  | Notification preferences | `(app)/settings/notifications`                   | push                             | ⬜                                                                                           |
| 39  | Appearance               | `(app)/settings/appearance`                      | push                             | ⬜ wire to `ThemeProvider`                                                                   |

Stack folders are `transfers/`, `goals/` and `settings/` (not `transfer/`, `savings/`, `profile/`) so they don't share a path with the tab routes.

## 6. Icons (design → Lucide)

All design icons are 24-grid, 1.8 stroke, round caps — Lucide matches. Add each to `src/constants/icons.ts` when first used.

| Design use                  | Lucide                                     | Design use             | Lucide                      |
| --------------------------- | ------------------------------------------ | ---------------------- | --------------------------- |
| Back                        | `chevron-left`                             | Forward / row chevron  | `chevron-right`             |
| Dropdown                    | `chevron-down`                             | Collapse               | `chevron-up`                |
| Close                       | `x`                                        | More options           | `ellipsis-vertical`         |
| Check / rule met            | `check`                                    | Add                    | `plus`                      |
| Show / hide                 | `eye` / `eye-off`                          | Search                 | `search`                    |
| Filter                      | `list-filter`                              | Edit                   | `pencil`                    |
| Copy                        | `copy`                                     | Share                  | `share`                     |
| Download / PDF / receipt    | `download`                                 | Delete key             | `delete`                    |
| Home tab                    | `house`                                    | Transfer tab           | `arrow-right-left`          |
| Savings tab / vault         | `briefcase-medical` (closest shape)        | Profile tab            | `user`                      |
| Notifications               | `bell`                                     | Settings               | `settings`                  |
| Money in                    | `arrow-down-left`                          | Money out / send       | `arrow-up-right`            |
| Up / down change            | `arrow-down` / `chevron-up`                | Next                   | `arrow-right`               |
| Lock / PIN                  | `lock` / `rectangle-ellipsis`              | Reset password         | `lock-keyhole-open`         |
| Security / verified / alert | `shield` / `shield-check` / `shield-alert` | Face ID                | `scan-face`                 |
| Phone / device              | `smartphone`                               | Laptop / gadgets       | `laptop` / `laptop-minimal` |
| Email                       | `mail`                                     | Statement / report     | `file-text`                 |
| Recent                      | `clock`                                    | Transfer history       | `rotate-ccw-clock`          |
| Calendar                    | `calendar`                                 | Bank                   | `landmark`                  |
| Card                        | `credit-card`                              | Contactless            | `nfc`                       |
| Freeze                      | `snowflake`                                | Replace / auto-save    | `rotate-cw`                 |
| Limits                      | `sliders-vertical`                         | Online / international | `globe` / `arrow-up-right`  |
| Groceries                   | `shopping-cart`                            | Transport / car        | `car`                       |
| Food                        | `utensils`                                 | Bills / electricity    | `zap`                       |
| Travel                      | `plane`                                    | Education              | `graduation-cap`            |
| Gifts                       | `gift`                                     | Tip                    | `lightbulb`                 |
| Interest paid               | `circle-check`                             | Warning / error        | `circle-alert`              |
| Favourite                   | `star`                                     | Category chart         | `chart-pie`                 |
| Budget                      | `archive` (closest shape)                  | Help                   | `circle-question-mark`      |
| Sign out                    | `log-out`                                  | Change photo           | `camera`                    |
| Light / dark / system       | `sun` / `moon` / `monitor`                 | Appearance             | `contrast`                  |

## 7. Open issues and decisions

1. **₦ is missing from Manrope.** Manrope has no U+20A6 glyph, so the Naira sign falls back to a system font beside Manrope digits (visible on the Welcome balance card). Options: render the symbol with a font that has it (e.g. Inter, symbol only), draw it as a small SVG inside an `Amount` component, or accept the fallback. Decide before building `Amount`.
2. **Logo kit replaced** with the "vaulta." wordmark (matches design 01). Lives in `assets/vaulta-logo/`.
3. **Type was designed in Inter** (and the new wordmark is Inter Bold). Manrope is slightly wider — check long amounts and titles on tight rows.
4. **Input focus/error rings** come from the auth screens (03, 04, 02): green border + 4px `#EAF8F1` ring on focus, red border + 4px `#FEE4E2` ring on error.
5. **Dark theme** tokens now come from `assets/vaulta-ui-dark`. The app still runs in light (`<ThemeProvider theme="light">`); switching is screen 39.
6. **Native sizes**: NativeWind now uses `inlineRem: 16`, so rem-based classes match web. Check on a device.
7. **Mock data**: Naira, Nigerian banks and names, matching the designs. Keep all figures fictional and never collect real card or bank details.
