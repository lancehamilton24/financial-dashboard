# Financial Dashboard

A monorepo containing the services, clients, and shared packages for the Financial Dashboard platform.

## Project Structure

```text
financial-dashboard/
|-- clients/
|   `-- ...                  # Future frontend applications
|-- servers/
|   `-- node-api/            # Fastify REST API
|       |-- src/
|       |   |-- clients/     # External provider clients
|       |   |-- config/      # Environment config
|       |   |-- routes/      # Fastify route plugins
|       |   |-- schemas/     # Request and response schemas
|       |   |-- services/    # Business logic
|       |   |-- types/       # TypeScript types
|       |   |-- utils/       # Shared package utilities
|       |   `-- server.ts    # API entry point
|       |-- .env.example
|       |-- package.json
|       `-- tsconfig.json
|-- .npmrc                   # Prevents npm lockfile creation
|-- package.json             # Workspace root
|-- pnpm-lock.yaml
`-- pnpm-workspace.yaml      # Defines JavaScript workspace packages
```

Current workspace locations are:

- `clients/*` for frontend applications.
- `servers/*` for backend applications.

This repo can also contain non-JavaScript projects in the future, such as .NET or Python APIs. Those projects should use their native tooling, while pnpm continues to manage JavaScript and TypeScript packages.

## Prerequisites

- Node.js 20 or newer
- pnpm 10.33.2

Prefer Corepack when available so the pnpm version comes from `package.json`:

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
```

If Corepack is not available, install pnpm globally:

```bash
npm install -g pnpm@10.33.2
```

## Getting Started

Install JavaScript dependencies from the repo root:

```bash
pnpm install
```

Copy the API environment examples and fill in local .env values:

```bash
cp servers/node-api/.env.example servers/node-api/.env
```

Start the Node API in development mode:

```bash
pnpm --filter @financial-dashboard/node-api dev
```

The API serves Swagger UI at:

```text
http://localhost:3001/docs
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

# Run a script in a specific package
pnpm --filter @financial-dashboard/node-api dev

# Run dev scripts across packages
pnpm --parallel run dev
```

## Working With Dependencies

Use pnpm for JavaScript and TypeScript dependency work.

```bash
# Add a dependency to a specific package
pnpm --filter @financial-dashboard/node-api add fastify

# Add a dev dependency to a specific package
pnpm --filter @financial-dashboard/node-api add -D eslint

# Add shared root tooling only
pnpm add -w some-tool

# Remove a dependency from a specific package
pnpm --filter @financial-dashboard/node-api remove axios
```

Do not create or commit `package-lock.json` or `yarn.lock`.

## Environment Variables

Each application package owns its own `.env` file. Commit `.env.example` files, but never commit real `.env` files.

### `@financial-dashboard/node-api`

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3001` | Port the API listens on |
| `NODE_ENV` | `development` | Runtime environment |
| `ALPHA_VANTAGE_API_KEY` | none | Alpha Vantage API key |
| `ALPHA_VANTAGE_BASE_URL` | none | Alpha Vantage API base URL |

## Current API Package

`servers/node-api` is an ESM Fastify REST API.

- Source lives in `servers/node-api/src`.
- Routes are registered under `/api`.
- Swagger UI is available at `/docs`.
- Configuration reads are centralized in `src/config`.
- External API access lives under `src/clients`.
- Business logic lives under `src/services`.

## Future Polyglot Repo Direction

The repo is intentionally structured so additional implementations can live side by side:

```text
clients/react-web
clients/angular-web
servers/node-api
servers/dotnet-api
servers/python-api
packages/api-contract
packages/api-client-ts
```

The future `packages/api-contract` package can hold an OpenAPI contract that describes the HTTP API independently of any specific backend implementation. A generated `packages/api-client-ts` package can then provide typed API calls for React, Angular, or other TypeScript clients.

## Adding a JavaScript Workspace Package

1. Create a folder under `clients/`, `servers/`, or `packages/`.
2. Run `pnpm init` inside it.
3. Set `"private": true`.
4. Use a scoped package name such as `@financial-dashboard/react-web`.
5. Run `pnpm install` from the repo root.

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
