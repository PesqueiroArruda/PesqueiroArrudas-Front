# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 13 Pages Router application using React 18, TypeScript, and Chakra UI for restaurant operations.

- `src/pages/`: routes, dynamic pages such as `command/[id].tsx`, and application setup in `_app.tsx`.
- `src/pages-components/`: feature modules such as `Commands`, `Kitchen`, and `Stock`. Keep feature-specific components, services, reducers, and types within their module.
- `src/components/`, `src/hooks/`, `src/types/`, and `src/utils/`: shared UI, hooks, models, and helpers.
- `src/services/serverApi.ts`: shared Axios client.
- `public/`: directly served assets; `src/assets/`: imported images and audio.

## Build, Test, and Development Commands

Use Yarn consistently with the committed `yarn.lock`.

- `yarn install`: install dependencies.
- `yarn dev`: start the development server at `http://localhost:3000`.
- `yarn build`: create the production build and run Next.js build-time checks.
- `yarn start`: serve the production build after building.
- `yarn lint`: run the configured Next.js ESLint checks.
- `yarn typecheck`: check TypeScript without generating files.
- `yarn test`: run regression tests with Node's built-in test runner.
- `yarn prettier --check <path>`: check formatting of changed files; use `--write` to format them.

## Coding Style & Naming Conventions

Follow `.prettierrc`: two-space indentation, LF endings, semicolons, single quotes, ES5 trailing commas, and parentheses around arrow parameters. ESLint combines Airbnb, React, TypeScript, Next.js, and Prettier configurations.

Use PascalCase for components and types, camelCase for functions and utilities, and `use` prefixes for hooks. Preserve the existing `index.tsx` logic and `layout.tsx` presentation pattern. TypeScript uses strict mode and `src` as its import base, allowing imports such as `utils/formatPrice`.

## Testing Guidelines

Regression tests live in `tests/*.test.cjs` and use Node's built-in test runner. The helper compiles actual TypeScript utilities in memory. No coverage threshold is configured. Before submitting, run `yarn test`, `yarn typecheck`, `yarn lint`, and `yarn build`. Manually exercise affected workflows, including mobile layouts and socket updates. Record validation and any failures in the pull request.

## Commit & Pull Request Guidelines

Recent commits commonly use `Feat:` and `Fix:` prefixes followed by concise descriptions; older messages vary. Keep commits focused. Describe the change, link relevant issues, list validation performed, and include screenshots for visible UI changes in pull requests.

## Security & Configuration

Keep secrets out of commits; `.env*.local` is ignored. Configure `NEXT_PUBLIC_API_URL` using `.env.example`; `src/services/apiConfig.ts` shares it between HTTP and sockets. Without it, the existing production URL is used. Confirm the backend before testing data-changing workflows. Public environment variables must never contain secrets.
