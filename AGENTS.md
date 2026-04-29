# Agent Rules

## Project Overview

- This is a pnpm monorepo for the Financial Dashboard platform.
- Workspace packages live under `clients/*` and `servers/*`, as defined in `pnpm-workspace.yaml`.
- The root `package.json` is private and declares `pnpm@10.33.2` as the package manager.
- Use Node.js 20 or newer.

## Package Layout

- `servers/node-api` is the current backend package.
- `servers/node-api` is an ESM Fastify REST API named `@financial-dashboard/node-api`.
- API source lives in `servers/node-api/src`.
- `servers/node-api/src/server.js` creates the Fastify app, registers CORS, and mounts routes under `/api`.
- `servers/node-api/src/config/index.js` reads environment config from `process.env`.
- `servers/node-api/src/routes` contains Fastify route plugins. The health route is `GET /api/health`.
- `servers/node-api/src/services` is reserved for business logic.
- `clients/` exists for future frontend packages, but it is currently empty.

## Package Manager Rules

- Use pnpm for all project dependency and script work.
- Do not create or commit `package-lock.json` or `yarn.lock`.
- Commit `pnpm-lock.yaml` whenever dependency changes update it.
- Add dependencies to the package that uses them with `pnpm --filter <package-name> add <dependency>`.
- Add shared root tooling only with `pnpm add -w <tool>`.
- The README mentions a root `.npmrc`, but one is not currently present. Do not assume it exists.

## Common Commands

- Install all dependencies from the repo root: `pnpm install`
- Start the API in dev mode: `pnpm --filter @financial-dashboard/node-api dev`
- Start the API normally: `pnpm --filter @financial-dashboard/node-api start`
- Run API tests: `pnpm --filter @financial-dashboard/node-api test`
- Run dev scripts across packages: `pnpm --parallel run dev`

## Environment Rules

- Each package owns its own `.env` file.
- Never commit `.env` files.
- Commit `.env.example` files when adding or changing required variables.
- `servers/node-api` expects:
  - `PORT`, defaulting to `3001`
  - `NODE_ENV`, defaulting to `development`
- `servers/node-api` scripts use Node's native `--env-file=.env` flag, so run package scripts through pnpm from the workspace rather than starting source files ad hoc.

## Coding Conventions

- Preserve ESM syntax in Node packages.
- Prefer Fastify route plugins in `src/routes` for new endpoints.
- Keep business logic out of route handlers when it grows beyond trivial behavior; place it under `src/services`.
- Keep configuration reads centralized under `src/config`.
- Use native `node --test` unless the project intentionally adopts another test runner.
- Keep changes scoped to the relevant workspace package.

## Git Hygiene

- Never commit `node_modules/`, `dist/`, `.env`, `package-lock.json`, or `yarn.lock`.
- Always treat existing uncommitted changes as user work unless told otherwise.
- Do not revert unrelated changes.
