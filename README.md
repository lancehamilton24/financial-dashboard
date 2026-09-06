# Financial Dashboard

A monorepo containing deployable applications and shared packages for the Financial Dashboard platform.

## Project Structure

```text
financial-dashboard/
|-- apps/
|   |-- web/                 # Frontend application (planned)
|   `-- api/                 # Fastify REST API
|       |-- src/
|       |   |-- config/      # Environment config
|       |   |-- modules/     # Feature-oriented API modules
|       |   |-- app.ts       # Fastify app setup
|       |   `-- server.ts    # API startup entry point
|       |-- .env.example
|       |-- package.json
|       `-- tsconfig.json
|-- packages/
|   |-- api-clients/         # Reusable external-provider clients
|   `-- api-contracts/       # Shared frontend/backend API types
|-- .npmrc                   # Prevents npm lockfile creation
|-- package.json             # Workspace root
|-- pnpm-lock.yaml
`-- pnpm-workspace.yaml      # Defines JavaScript workspace packages
```

Current workspace locations are:

- `apps/*` for deployable applications.
- `packages/*` for shared libraries.

## Prerequisites

- Node.js 20 or newer
- pnpm 10.33.2

## Getting Started

Install JavaScript dependencies from the repo root:

```bash
pnpm install
```

Copy the API environment examples and fill in local .env values:

```bash
cp apps/api/.env.example apps/api/.env
```

Start all apps in development mode:

```bash
pnpm --parallel run dev
```

## Common Commands

```bash
# Run all available checks
pnpm run check

# Build all packages with a build script
pnpm run build

# Typecheck all packages with a typecheck script
pnpm run typecheck

# Lint all packages with a lint script
pnpm run lint

# Test all packages with a test script
pnpm run test
```

## Git Hygiene

Always commit:

- `pnpm-lock.yaml`
- `.env.example` files

Never commit:

- `.env` files
- `node_modules/`
- `dist/`
- `package-lock.json`
- `yarn.lock`
