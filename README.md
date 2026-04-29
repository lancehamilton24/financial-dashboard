# Financial Dashboard

A monorepo containing all services and clients for the Financial Dashboard platform.

---

## Project Structure

```
financial-dashboard/
├── clients/
│   └── react-frontend/        # React web application
├── servers/
│   └── node-api/              # Fastify REST API
│       ├── src/
│       │   ├── config/        # Environment config
│       │   ├── routes/        # Fastify route plugins
│       │   ├── services/      # Business logic
│       │   └── server.js      # App entry point
│       ├── .env
│       ├── .env.example
│       └── package.json
├── .gitignore
├── .npmrc                     # Enforces pnpm usage
├── package.json               # Workspace root
└── pnpm-workspace.yaml        # Defines workspace packages
```

New clients go in `clients/`, new servers or shared packages go in `servers/`.

---

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10

Install pnpm globally if you don't have it:

```bash
npm install -g pnpm
```

> This is the only time you should use `npm` in this project.

---

## Why pnpm and not npm?

This project uses **pnpm** instead of npm for three reasons:

**1. Monorepo workspaces work better**
pnpm's `--filter` flag makes it easy to run commands in specific packages, and the `workspace:*` protocol lets packages reference each other locally without any extra config.

**2. Stricter dependency resolution**
npm hoists all packages to a shared `node_modules`, which means a package can accidentally import something it never declared as a dependency and it just silently works. pnpm prevents this, which catches bugs before they become problems in production.

**3. Disk space and speed**
pnpm stores packages in a global content-addressable store and symlinks them rather than copying. If ten packages all depend on `fastify`, it's stored once on disk instead of ten times.

The lockfile is `pnpm-lock.yaml` at the repo root — treat it the same as you would `package-lock.json` and always commit it.

---

## Getting Started

Install all dependencies from the repo root:

```bash
pnpm install
```

Start the API in development mode:

```bash
pnpm --filter @financial-dashboard/node-api dev
```

---

## Common pnpm Commands

### Installing dependencies

```bash
# Add a dependency to a specific package
pnpm --filter @financial-dashboard/node-api add fastify

# Add a dev dependency to a specific package
pnpm --filter @financial-dashboard/node-api add -D eslint

# Add a dependency to the workspace root (shared tooling only)
pnpm add -w some-tool

# Install all dependencies across all packages
pnpm install
```

### Running scripts

```bash
# Run a script in a specific package
pnpm --filter @financial-dashboard/node-api dev
pnpm --filter @financial-dashboard/react-frontend dev

# Run a script in all packages at once
pnpm --parallel run dev

# Run a script in all packages under servers/
pnpm --filter "./servers/**" run dev
```

### Removing dependencies

```bash
# Remove a dependency from a specific package
pnpm --filter @financial-dashboard/node-api remove axios
```

### Referencing local packages

If a client needs to import from a shared server package:

```bash
pnpm --filter @financial-dashboard/react-frontend add @financial-dashboard/shared
```

pnpm will symlink the local package directly — no publishing required.

---

## Environment Variables

Each package manages its own `.env` file. An `.env.example` is committed to the repo as a reference — never commit `.env` itself.

Copy the example and fill in your values:

```bash
cp servers/node-api/.env.example servers/node-api/.env
```

### node-api

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port the API listens on |
| `NODE_ENV` | `development` | Runtime environment |

---

## Adding a New Package

1. Create the folder under `clients/` or `servers/`
2. Run `pnpm init` inside it
3. Set `"private": true` and a scoped name like `@financial-dashboard/my-package` in its `package.json`
4. Run `pnpm install` from the repo root to register it in the workspace

The `pnpm-workspace.yaml` at the root already covers all folders under `clients/` and `servers/`, so no changes needed there.

---

## Git

Always commit:
- `pnpm-lock.yaml`
- `.env.example` files

Never commit:
- `.env` files
- `node_modules/`
- `dist/`
- `package-lock.json` or `yarn.lock`