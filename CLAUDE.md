# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js 13 (Pages Router) + React 18 + TypeScript front end for a restaurant/pesqueiro's internal operations system (comandas, cozinha, estoque, caixa, dashboard, integração iFood). The backend is a separate repository (Express/Mongoose API); this repo only talks to it over HTTP and Socket.IO.

## Commands

Use Yarn (the committed lockfile is `yarn.lock`).

- `yarn install` — install dependencies
- `yarn dev` — dev server at `http://localhost:3000`
- `yarn build` — production build (also runs Next's build-time checks)
- `yarn start` — serve the production build
- `yarn lint` — Next.js ESLint (Airbnb + React + TypeScript + Next + Prettier)
- `yarn typecheck` — `tsc --noEmit`, no emitted files
- `yarn test` — runs `tests/*.test.cjs` with Node's built-in test runner
- `node --test tests/payments.test.cjs` — run a single test file the same way
- `yarn prettier --check <path>` / `--write <path>` — format check/fix

Before considering a change done: `yarn typecheck`, `yarn lint`, and `yarn test` at minimum; `yarn build` for anything touching routing, data fetching, or env config. Manually exercise affected flows, including mobile layout and any Socket.IO-driven updates — these aren't covered by the test suite.

Tests in `tests/*.test.cjs` compile the actual TypeScript utilities in memory (not a separate mocked copy), so they double as a way to sanity-check pure `utils/` functions without spinning up Next.

## Architecture

### Feature module pattern

Each screen lives under `src/pages-components/<Feature>/` and is wired into a thin route file in `src/pages/`. Within a feature module:
- `index.tsx` — state, data fetching, Socket.IO listeners, event handlers. This is where `serverApi` calls happen.
- `layout.tsx` — presentation only, receives everything as props. Preserve this split when editing; don't pull fetching/state logic into a layout file.
- `components/<SubComponent>/` — same `index.tsx`/`layout.tsx` split, nested arbitrarily deep for modals and sub-widgets (e.g. `Command/components/AddProductModal/SetAmountModal/`).
- `services/<Feature>Service.ts` — a class instance wrapping `serverApi` (axios) calls for that feature.
- `reducers/` — some modules (`Commands`, `Command`) hold list/product state in `useReducer` + React Context (`CommandsContext`, `CommandContext`) so deeply nested modals can dispatch updates without prop drilling.

Shared, cross-feature code goes in `src/components/`, `src/hooks/`, `src/types/`, `src/utils/`, and `src/lib/`. `src/services/serverApi.ts` is the single Axios instance every feature service builds on; `src/services/apiConfig.ts` resolves `API_URL` from `NEXT_PUBLIC_API_URL`, falling back to the production Railway URL — the frontend does not talk to a local backend unless that env var is set.

### Auth pattern (two layers, not unified)

- **Route-level**: pages using `getServerSideProps` read an `isAuthorized` cookie (via `nookies`) and redirect to `/login` if absent. Some feature `index.tsx` files (e.g. `Commands`, `Command`) additionally run a `hasCleanedAuthStorage_v1` one-time localStorage migration on mount that force-redirects to `/login` if not yet run — this is legacy cleanup from a past auth scheme change, not a general pattern to copy for new code.
- **Role-level**: `localStorage.getItem('isAdmin') === 'true'` gates admin-only UI (delete buttons, price edits, the `IfoodOrders` screen entirely, etc.) inside already-authorized pages. This is checked client-side per component, not centrally.

### Real-time updates (Socket.IO)

`pages/_app.tsx` creates a single `socket.io-client` instance at module scope (`autoConnect: false`, connected in a `useEffect`) and exposes it via `SocketContext`. Every feature that needs live updates pulls `const { socket } = useContext(SocketContext)` and registers/unregisters listeners in its own `useEffect` — there's no central event bus. Common events: `command-created`, `command-updated`, `command-deleted`, `product-updated`, `kitchen-order-created`, `ifood-order-received`, `ifood-order-updated`, `ifood-order-cancelled`. When emitting a new event from the backend, check whether an already-open screen needs a matching listener added, rather than assuming a page will refetch on its own.

### Styling: two UI systems coexist

- **Tailwind v4 + shadcn-style primitives** (`src/components/ui/*`, e.g. `button.tsx`, `dialog.tsx`, `table.tsx`, `badge.tsx`) are the current standard for new UI. Compose classes with the `cn()` helper (`src/lib/utils.ts`, `clsx` + `tailwind-merge`), not manual string concatenation. `components/ui/badge.tsx` already defines color variants (`default`, `gold`, `cyan`, `success`, `destructive`, `outline`) — reuse these instead of hand-rolling `bg-*` classes for status pills.
- **Chakra UI** (`ChakraProvider` in `_app.tsx`) is still used for `useToast()` notifications and a handful of older components/modals. Don't migrate existing Chakra usage as a drive-by; both systems are expected to coexist.
- Design tokens (brand colors like `navy`, `gold`, `cyan`, `text-muted`) and font variables (`--font-heading` = Bitter, `--font-body` = Manrope) are set up in `styles/globals.css` / the Tailwind theme, not hardcoded per component.

### iFood integration (`IfoodOrders` feature, `types/IfoodOrder.ts`)

Orders placed on iFood arrive via the backend's webhook, are listed at `/ifood-orders`, and become a normal `Command` on accept — flagged only by a naming convention: `table` is set to `"iFood #<last 6 chars of the iFood order id>"`. Anything checking "is this comanda from iFood" does `table?.startsWith('iFood #')` rather than a dedicated boolean field — follow that convention rather than introducing a schema field for it.

Items from an iFood order are matched to catalog `Product`s by normalized-name matching (`utils/normalizeName.ts`, `utils/resolveIfoodItemProduct.ts`) with a manual-once-then-remembered fallback (`IfoodProductMapping`, keyed by iFood's `externalCode`). An item that never gets linked to a catalog product still gets a line in the `Command`, but with a non-`Product` `_id` (the raw iFood item id) — code that treats every `Command.products[]._id` as a real catalog product id (e.g. restocking on delete) needs to tolerate that id not resolving to anything.

Kitchen/bar routing category lists (`categoriesToKitchenPrepare` / `categoriesToBarPrepare`) are duplicated in three places that must be kept in sync: `Command/components/SendToKitchenModal/index.tsx`, `Command/components/AddProductModal/index.tsx`, and the backend's `IfoodController.js` (which auto-routes accepted iFood orders without going through either modal). `DeliveryStatusBadge` (`src/components/DeliveryStatusBadge/`) renders the iFood delivery lifecycle (`confirmed` → `dispatched` → `concluded`) wherever `Command.deliveryStatus` / `IfoodOrder.deliveryStatus` is set.

## Coding conventions

`.prettierrc`: 2-space indent, LF, semicolons, single quotes, ES5 trailing commas, parens around arrow params. PascalCase for components/types, camelCase for functions/utilities, `use` prefix for hooks. TypeScript strict mode; `src` is the import base, so `import { parseToBRL } from 'utils/parseToBRL'` (no relative `../../..`).

## Commit conventions

Recent commits use `Feat:` / `Fix:` prefixes with a concise description. Keep commits focused on one change.
