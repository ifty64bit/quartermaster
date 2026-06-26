import { defineConfig } from "nitro/config";

// Cloudflare Workers deployment for TanStack Start.
//
// `cloudflare_module` runs on workerd (same runtime as prod). Nitro
// polyfills `process.env` from the wrangler `vars` + secrets, so
// libraries that read `process.env.X` (better-auth, Prisma) work.
//
// Local dev secrets live in `.dev.vars` (gitignored) — copy
// `.dev.vars.example` and fill in real values. Production secrets
// are set with `bun run cf:secret <NAME>`.
export default defineConfig({
	preset: "cloudflare_module",
	cloudflare: {
		wrangler: {
			compatibility_flags: ["nodejs_compat"],
			// Non-secret config goes here. Secrets (BETTER_AUTH_SECRET,
			// TURSO_AUTH_TOKEN, GOOGLE_CLIENT_*) must NOT be committed —
			// set them via `bun run cf:secret <NAME>` / .dev.vars.
			vars: {
				TURSO_DATABASE_URL: "libsql://develop-ifty64bit.aws-ap-south-1.turso.io",
				DATABASE_URL: "libsql://develop-ifty64bit.aws-ap-south-1.turso.io",
				BETTER_AUTH_URL: "http://localhost:3000",
			},
		},
	},
	// Prisma client is generated to `generated/prisma/` (root-level,
	// gitignored). With cloudflare_module Nitro bundles it into the
	// worker — no externalization needed.
});