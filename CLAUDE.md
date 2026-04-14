# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` / `npx expo start` — start the Expo dev server (Metro).
- `npm run ios` / `npm run android` / `npm run web` — start with a specific target.
- `npm test` — runs `jest --watchAll` via the `jest-expo` preset. Run a single test with `npx jest path/to/file.test.tsx` or `npx jest -t "test name"`.
- `npm run lint` — `expo lint`.
- `npm run reset-project` — moves starter code aside (rarely needed; starter template helper).

The API base URL is read from `EXPO_PUBLIC_API` in `.env`, exposed through `app.config.js` → `expo.extra.EXPO_PUBLIC_API`. Set this before starting the dev server or API calls will fail.

## Architecture

FairFriends is an Expo Router (SDK 54, React Native 0.81, React 19) app for tracking shared expenses, IOUs ("promises"), and group balances with friends. It talks to a separate Rails-style JSON backend.

### Routing (expo-router, file-based)

- `app/_layout.tsx` is the root. It wires providers in this order: `I18nextProvider` → `ServerProvider` → `SessionProvider` → `ToastProvider` → `Stack`. Every stack screen uses the shared `CustomHeader`.
- `app/(tabs)/_layout.tsx` defines the four authenticated tabs: `home`, `contactsIndex`, `balancesIndex`, `promisesIndex`. It gates on `useSession()` — a null session shows a loading state; a falsy session redirects to `/login`.
- Top-level screens outside tabs (`profile`, `notifications`, `contactRequests`, `addContact`, `balanceShow`, `promiseShow`, `formPayment`, `formPromise`, `formBalance`, `splitPromise`, `login`, `signup`) are registered in the root Stack and opened by navigation, not tabs.
- `typedRoutes` is enabled in `app.config.js`, so route strings are type-checked.
- Path alias `@/*` maps to the project root (see `tsconfig.json`), e.g. `@/services/api`.

### State & context

There are three app-wide contexts (no Redux/Zustand):

- **`services/authContext.tsx`** — `SessionProvider` holds `{ session, user }`. `signIn` / `signUp` call the API, persist via `useStorage`, and `router.replace('/(tabs)/home')`. On mount it hydrates from storage and redirects to `/login` if missing. It also calls `registerSessionHandler` so that non-React code (the axios interceptor) can read the current session.
- **`services/serverContext.tsx`** — polls `${API}/health` every 5s until the backend responds. Used to show a reconnect UI; the backend is a free-tier instance that cold-starts.
- **`services/ToastContext.tsx`** + `services/toastService.js` — imperative `toast(msg, type)` available from non-React modules (e.g. `api.js`) via a module-level singleton.

### API layer

- **`services/api.js`** is the single axios instance. All network calls go through the exported functions (`getBalances`, `createPromise`, `acceptPayment`, etc.). Do not create new axios instances; add a new exported function here instead.
- A request interceptor pulls the current session from `sessionGlobalSingleton` and injects `Authorization: Bearer <token>` plus `Accept-Language: <i18n.language>`. This is why `authContext` has to register itself with the singleton on mount.
- All calls are wrapped in `apiCall()`, which catches errors, shows a toast, and resolves to `null` on failure — callers should null-check the response rather than relying on try/catch.

### Presentation layer

- **`presentational/`** holds all reusable UI components (cards, inputs, states, headers). Screens in `app/` compose these; prefer extending an existing component over adding a new one if a similar one exists (there are many: `Card`, `BalanceCard`, `MiniBalanceCard`, `PromiseCard`, `MiniPromiseCard`, etc.).
- **`theme/`** is the design system: `spacing`, `typography`, `colors`, `shadows`. Import from `@/theme` or `../theme` — don't hardcode colors/sizes in components.
- `presentational/BaseStyles.tsx` has shared StyleSheet primitives used across screens.

### Internationalization

- `app/i18n/index.ts` initializes i18next with `en` and `es` translations. Device locale picks the initial language, with `es` as fallback.
- All user-facing strings should use `useTranslation()` and keys from `app/i18n/translations/{en,es}.json`. When adding a screen or string, add keys to **both** JSON files.
- The current language is forwarded to the backend via the `Accept-Language` header (see interceptor in `api.js`).

### Domain model (vocabulary)

- **Balance / Group** — a shared tab among multiple users (`createBalance`/`createGroup` are aliases). Detail and info endpoints return different shapes.
- **Promise** — a single IOU between users; may be split across members (`splitPromise`, `split_promises` endpoint).
- **Payment** — an amount applied to a promise; payments go through an accept/reject flow (`acceptPayment`, `rejectPayment`).
- **Friendship** — contact relationships with request/accept/reject/cancel states.

### TypeScript

- **We are not actually writing TypeScript yet.** Files use `.tsx`/`.ts` extensions but are authored as plain JavaScript/JSX — don't add type annotations, interfaces, or generics to new code, and don't "fix" untyped props on existing components. The extension is only there so Expo/Metro picks up JSX and the alias config.
- `strict` is on in `tsconfig.json` but the codebase hasn't been typed to satisfy it; treat type errors as informational, not blockers.
- A few files in `services/` are still `.js` (`api.js`, `toastService.js`, `sessionGlobalSingleton.js`). Don't rename them opportunistically.
