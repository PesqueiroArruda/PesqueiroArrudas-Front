# Pesqueiro Arruda's Frontend

Restaurant operations application built with Next.js Pages Router, React,
TypeScript, Chakra UI, Axios, and Socket.IO. Features include commands,
payments, kitchen orders, stock, and cashier reports.

## Local development

Use Node.js 22 and Yarn Classic 1.22 (the versions used for repository validation).

```sh
yarn install --frozen-lockfile
```

Create or update `.env.local` with the public backend URL shown in `.env.example`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080
```

The separate backend must be running and allow the frontend origin for HTTP
and Socket.IO. If the variable is omitted, the application uses its existing
production backend URL. Confirm the target before changing restaurant data.
The variable is included in the browser bundle; changing it requires restarting
development or rebuilding production. Never put credentials in public variables.

```sh
yarn dev
```

Open `http://localhost:3000`. Authentication requires a valid backend access key.

## Validation

```sh
yarn test
yarn typecheck
yarn lint
yarn build
yarn start
```

`yarn start` serves the completed production build. Tests in `tests/*.test.cjs`
use Node's test runner and compile TypeScript utilities in memory; they do not
contact the backend. They cover payment validation, monthly grouping, and
download cleanup, report route resolution, and discounted command balances. Browser and backend integration still require manual checks.

See [Repository Guidelines](AGENTS.md) for contributor conventions and
[Repository Review](docs/REPOSITORY_REVIEW.md) for findings and remaining work.
