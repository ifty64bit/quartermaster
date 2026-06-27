import { defineConfig } from "nitro/config";

// Vercel deployment preset for TanStack Start.
//
// Build output goes to `.vercel/output/`. Deploy with `bun run vercel:deploy`.
// Environment variables are read from `.env.local` (local dev) or set in the
// Vercel dashboard / CLI (production).
export default defineConfig({
	preset: "vercel",
	vercel:{
		functions: {
			runtime: "bun1.x"
		}
	},
	// Prisma client is generated to `generated/prisma/` (root-level,
	// gitignored). Nitro bundles it into the serverless function.
});
