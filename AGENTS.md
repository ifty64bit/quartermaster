# AGENTS.md

Repo-specific guidance for OpenCode sessions on **Quartermaster** (TanStack Start + React 19 + Prisma 7 + Better Auth). Read alongside `README.md` (stack, scripts, structure) and `agent/personal-asset-management-PRD.md` (product spec). This file captures what those don't.

## Commands

- Package manager is **bun** (`bun add`, `bun run <script>`). Don't use npm/yarn — lockfile is `bun.lock`.
- No `typecheck` script exists. Run typecheck with `bunx tsc --noEmit` (`tsconfig` is `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
- `bun run check` = Biome lint + format **check** (non-fixing). To auto-fix formatting run `bun run format`.
- Biome only lints `src/**`, `.vscode/**`, `index.html`, `vite.config.ts` (see `biome.json`). It does **not** cover `prisma/`, `generated/`, or root configs.
- `bun run test` runs Vitest, but **no test files exist yet** — a green run means nothing executed. Don't treat it as verification.
- After adding/renaming files under `src/routes/`, run `bun run generate-routes` (`tsr generate`) to regenerate `src/routeTree.gen.ts`. The dev server also regenerates it on change.

## Prisma / DB — gotchas

- The Prisma client is generated to **`generated/prisma/`** (custom `output` in `schema.prisma`), which is **gitignored**. Run `bun run db:generate` before TS will resolve Prisma imports.
- Import the runtime client from the generated path (e.g. `../../generated/prisma/client` from `src/lib`), **not** `@prisma/client`. The `@` alias maps to `src/*` only, so it cannot reach the root-level `generated/` dir.
- All `db:*` scripts load **`.env`** via `dotenv -e .env` — not `.env.local`. The README's `cp .env.example .env.local` is misleading for DB work; put real values in `.env` or Prisma commands fail.
- The seed and the runtime both use `@prisma/adapter-libsql` → Turso (`src/lib/prisma.ts` for runtime, `prisma/seed.ts` for seeding). The seed runs via `bun prisma/seed.ts` (Bun executes TS natively; `tsx` is unusable here because Node.js isn't installed and its native `better-sqlite3` addon can't compile). Don't reintroduce `@prisma/adapter-better-sqlite3` — it requires a native build that this Bun-only environment can't produce.

## Conventions

- Path alias `@/*` → `src/*` (in both `tsconfig.json` and `vite.config.ts`). Prefer it for `src` imports.
- **React Compiler is enabled** (babel plugin in `vite.config.ts`). Do **not** add defensive `useMemo` / `useCallback` / `React.memo` — the compiler memoizes automatically. Only memoize with a measured reason.
- Biome formatting: **tabs, double quotes**. Run `bun run format` before committing; don't hand-format.
- `src/routeTree.gen.ts` and `generated/prisma/**` are generated — never edit by hand.
- Better Auth is mounted as a catch-all at `src/routes/api/auth/$.ts` (GET/POST → `auth.handler`). Server config: `src/lib/auth.ts`; browser client: `src/lib/auth-client.ts`.
- Keep Prisma calls server-side (via `src/lib/prisma.ts`); features live under `src/features/<domain>/` with server queries in `src/server/`.
- Use the `cn()` helper (`clsx` + `tailwind-merge`) at `src/lib/utils.ts` for conditional Tailwind class merging — it resolves conflicts correctly. Import as `import { cn } from "@/lib/utils"`.

## Code quality rule

Before declaring a task done, run and pass **both**:

1. `bun run check` — Biome lint + format
2. `bunx tsc --noEmit` — TypeScript typecheck

- Prefer clean designs over quick fixes
- Leave the codebase better than you found it
- Future teams inherit your decisions — choose debt-free solutions

Plus, only when relevant:
- Changed/added a route file → `bun run generate-routes` (keep `routeTree.gen.ts` in sync).
- Changed `prisma/schema.prisma` → `bun run db:generate` (regenerate the client so TS compiles).

Never commit generated artifacts (`generated/`, `src/routeTree.gen.ts`), `.env`, or `*.db`. No comments in code unless explicitly asked.
