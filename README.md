# Quartermaster — Personal Asset Management

A personal, web-based inventory system to track purchased physical assets (PCs, components, cameras, furniture, etc.) with price, warranty, documents, and lifecycle history.

Built with [TanStack Start](https://tanstack.com/start).

---

## Tech Stack

| Layer           | Choice                                 |
|-----------------|----------------------------------------|
| Framework       | TanStack Start + React 19 + TypeScript |
| Styling         | Tailwind CSS v4 + tailwindcss-animate  |
| Database        | Turso (libSQL/SQLite) via Prisma       |
| Auth            | Better Auth (email/password + Google)  |
| Data Fetching   | TanStack Query                         |
| Validation      | Valibot                                |
| Icons           | Lucide React                           |
| Lint/Format     | Biome                                  |
| React Compiler  | Babel plugin (automatic memoization)   |
| Deployment      | Nitro / Vercel                         |

---

## Getting Started

```bash
bun install
```

Copy the environment file and fill in your secrets:

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
bun run dev
```

The app runs on **http://localhost:3000**.

---

## Environment Variables

| Variable             | Description                        |
|----------------------|------------------------------------|
| `DATABASE_URL`       | Prisma datasource URL (SQLite)     |
| `TURSO_DATABASE_URL` | Turso/libSQL database URL          |
| `TURSO_AUTH_TOKEN`   | Turso auth token                   |
| `BETTER_AUTH_SECRET` | Better Auth secret key             |
| `GOOGLE_CLIENT_ID`   | Google OAuth client ID             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret       |

---

## Database

### Schema

The database includes these models:

- **User** — accounts with email/password and Google OAuth
- **Session** — auth sessions
- **Account** — OAuth provider accounts
- **Verification** — email verification codes
- **TwoFactor** — 2FA secrets
- **Asset** — physical assets with purchase info, warranty, condition
- **AssetHistory** — lifecycle events (created, sold, repaired, etc.)
- **Media** — photos and invoices attached to assets
- **Category** — asset categories (PC, Camera, Furniture, etc.)
- **Brand** — asset brands

### Commands

```bash
bun run db:generate   # Generate Prisma client
bun run db:push       # Push schema to DB
bun run db:migrate    # Run migrations
bun run db:studio     # Open Prisma Studio
bun run db:seed       # Seed the database
```

---

## Auth

Authentication is handled by **Better Auth** with:

- Email/password sign-up & sign-in
- Google OAuth
- Session management via cookies (TanStack Start integration)

---

## Scripts

| Script               | Description                        |
|----------------------|------------------------------------|
| `bun run dev`        | Start dev server (port 3000)       |
| `bun run build`      | Build for production               |
| `bun run vercel:deploy` | Deploy to Vercel (preview)      |
| `bun run vercel:prod`   | Deploy to Vercel (production)   |
| `bun run test`       | Run tests (Vitest)                 |
| `bun run lint`       | Lint with Biome                    |
| `bun run format`     | Format with Biome                  |
| `bun run check`      | Lint + format check                |

---

## Project Structure

```
src/
├── components/       # Shared UI components (form, layout, ui)
│   ├── form/
│   ├── layout/
│   └── ui/
├── features/         # Feature modules
│   ├── assets/
│   ├── attachments/
│   ├── categories/
│   ├── dashboard/
│   ├── depreciation/
│   ├── locations/
│   ├── maintenance/
│   └── search/
├── lib/              # Core utilities
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client config
│   ├── prisma.ts         # Prisma client (Turso adapter)
│   └── providers/        # React Query, Better Auth components
├── routes/           # File-based routes
│   ├── __root.tsx
│   ├── index.tsx
│   └── api/auth/$.ts
├── server/           # Server middleware & queries
│   ├── middleware/
│   └── queries/
├── router.tsx        # Router configuration
└── styles.css        # Tailwind entry + theme tokens
```

---

## Features (In Progress)

- [x] Auth (email/password + Google)
- [x] Database schema (Prisma + Turso)
- [ ] Asset CRUD
- [ ] Categories & Brands
- [ ] Search & filtering
- [ ] Dashboard (counts, charts, warranty alerts)
- [ ] Image & receipt uploads
- [ ] Warranty tracking
- [ ] Depreciation engine
- [ ] Maintenance log

---

## Deployment

The project uses Nitro's **Vercel** preset. Build output goes to `.vercel/output/`.

### Local preview

```bash
cp .env.example .env.local         # fill in all vars
bun run build                      # produces .vercel/output/
```

### Deploy

Install the [Vercel CLI](https://vercel.com/docs/cli) and run:

```bash
bun run build
bun run vercel:deploy              # vercel deploy --prebuilt
bun run vercel:prod                # promote to production
```

### Environment variables (production)

Set all vars from `.env.example` in the [Vercel dashboard](https://vercel.com/) or via:

```bash
vercel env add TURSO_AUTH_TOKEN
vercel env add BETTER_AUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

### Runtime notes

- `process.env` is read directly by Nitro on Vercel (Node.js runtime) — no polyfill needed.
- Turso (libSQL HTTP) works with Node.js `fetch` — no TCP sockets required.
- `prisma/seed.ts`'s `better-sqlite3` adapter is local-only and not bundled into the deployment.
