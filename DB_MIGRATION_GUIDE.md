# Database Migration Guide (Prisma + Turso)

This guide documents the database migration workflow for Quartermaster. Because Turso operates over an HTTP connection (libSQL), Prisma's native `prisma migrate deploy` CLI tool cannot connect to the remote database. 

To solve this, we use a local SQLite file for development and migration generation, and a custom migration runner script to safely apply migrations to the remote Turso database.

---

## 🛠️ The Migration Workflow

### 1. Make Schema Changes (Local Development)
Modify `prisma/schema.prisma` as needed for your features.

### 2. Generate a Migration
Generate the migration files against your local SQLite database. This creates a SQL migration script in `prisma/migrations/` and updates your local client:

```bash
bun run db:migrate --name your_migration_name
```

> [!IMPORTANT]
> Always commit the generated migration directories (e.g. `prisma/migrations/20260628XXXXXX_your_migration_name/migration.sql`) to Git. This acts as the migration ledger for the project.

### 3. Deploy to Remote Turso (Production/Staging)
To apply the generated migrations to the remote Turso instance, run:

```bash
bun run db:migrate:deploy
```

**What this command does:**
* It executes the script at [scripts/migrate-turso.ts](file:///g:/Programing/quartermaster/scripts/migrate-turso.ts).
* It reads the remote `_prisma_migrations` table on Turso to see which migrations have already been run.
* It reads your local `prisma/migrations/` directory to identify pending migrations.
* It applies pending migrations to Turso sequentially inside database transactions.
* It updates the remote `_prisma_migrations` table so they aren't executed again.

### 4. Seed the Database (Optional)
If you need to seed default brands and categories to the remote database:

```bash
bun run db:seed
```

---

## 💻 Available DB Scripts

These commands are defined in your `package.json` for easy use:

| Script | Command | Purpose |
|---|---|---|
| `bun run db:generate` | `prisma generate` | Generates the TypeScript Prisma client types |
| `bun run db:push` | `prisma db push` | Pushes the schema state directly (Use *only* for prototyping; bypasses migrations) |
| `bun run db:migrate` | `prisma migrate dev` | Generates a new migration SQL file and updates the local DB |
| `bun run db:migrate:deploy` | `bun scripts/migrate-turso.ts` | Safely deploys pending migrations to remote Turso DB |
| `bun run db:seed` | `bun prisma/seed.ts` | Seeds categories (with 3D emojis) and brands (with logo domains) |
| `bun run db:studio` | `prisma studio` | Opens the Prisma database explorer interface |
