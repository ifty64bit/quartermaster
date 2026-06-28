import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const dbUrl = process.env.TURSO_DATABASE_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
	console.error("❌ Error: TURSO_DATABASE_URL is not set");
	process.exit(1);
}

const client = createClient({
	url: dbUrl,
	authToken: dbToken,
});

async function main() {
	console.log("🚀 Starting database migration for Turso...");

	// 1. Ensure the _prisma_migrations tracking table exists
	await client.execute(`
		CREATE TABLE IF NOT EXISTS _prisma_migrations (
			id TEXT PRIMARY KEY NOT NULL,
			checksum TEXT NOT NULL,
			finished_at DATETIME,
			migration_name TEXT NOT NULL,
			logs TEXT,
			rolled_back_at DATETIME,
			started_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			applied_steps_count INTEGER DEFAULT 0 NOT NULL
		);
	`);

	// 2. Read local migrations directory
	const migrationsPath = path.join(process.cwd(), "prisma", "migrations");
	if (!fs.existsSync(migrationsPath)) {
		console.log("ℹ️ No migrations directory found. Nothing to deploy.");
		return;
	}

	const localMigrationDirs = fs
		.readdirSync(migrationsPath)
		.filter((file) => {
			const fullPath = path.join(migrationsPath, file);
			return fs.statSync(fullPath).isDirectory();
		})
		.sort(); // Sort chronologically by timestamp prefix

	// 3. Fetch applied migrations from remote Turso DB
	const appliedResult = await client.execute(
		"SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL",
	);
	const appliedMigrations = new Set(
		appliedResult.rows.map((row) => row.migration_name as string),
	);

	// 4. Determine pending migrations
	const pendingMigrations = localMigrationDirs.filter(
		(dir) => !appliedMigrations.has(dir),
	);

	if (pendingMigrations.length === 0) {
		console.log("✅ Database is up to date. No pending migrations.");
		return;
	}

	console.log(`⏳ Found ${pendingMigrations.length} pending migrations to apply...`);

	// 5. Apply each pending migration sequentially
	for (const migrationName of pendingMigrations) {
		const migrationFilePath = path.join(
			migrationsPath,
			migrationName,
			"migration.sql",
		);

		if (!fs.existsSync(migrationFilePath)) {
			console.warn(`⚠️ Warning: migration.sql not found in ${migrationName}. Skipping.`);
			continue;
		}

		const sql = fs.readFileSync(migrationFilePath, "utf8").trim();
		if (!sql) {
			console.log(`ℹ️ Migration ${migrationName} is empty. Marking as applied.`);
		}

		console.log(`⚙️ Applying migration: ${migrationName}`);

		// Start a transaction to ensure atomicity
		const transaction = await client.transaction("write");

		try {
			if (sql) {
				// Execute the migration queries
				await transaction.executeMultiple(sql);
			}

			// Generate checksum and ID (SHA-256 and UUIDv4)
			const checksum = crypto.createHash("sha256").update(sql).digest("hex");
			const migrationId = crypto.randomUUID();

			// Record the migration as finished
			await transaction.execute({
				sql: `
					INSERT INTO _prisma_migrations (
						id, checksum, finished_at, migration_name, started_at, applied_steps_count
					) VALUES (?, ?, datetime('now'), ?, datetime('now'), 1)
				`,
				args: [migrationId, checksum, migrationName],
			});

			await transaction.commit();
			console.log(`✅ Successfully applied: ${migrationName}`);
		} catch (error) {
			console.error(`❌ Failed to apply migration: ${migrationName}`);
			console.error(error);
			await transaction.rollback();
			process.exit(1);
		}
	}

	console.log("🎉 All migrations successfully applied to Turso!");
}

main()
	.catch((err) => {
		console.error("❌ Migration runner failed:", err);
		process.exit(1);
	})
	.finally(() => {
		client.close();
	});
