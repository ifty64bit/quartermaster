import path from "node:path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: {
		alias: {
			"@": path.resolve("./src"),
		},
		tsconfigPaths: true,
	},
	plugins: [
		nitro({
			rollupConfig: {
				external: [
					"vinxi",
					"h3", // Isolates cookie/http helpers from crashing the export runtime
				],
			},
			experimental: {
				// Prevents Nitro from restructuring module exports into broken chunks
				asyncContext: true,
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	build: {
		rolldownOptions: {
			output: { inlineDynamicImports: true },
		},
	},
});

export default config;
