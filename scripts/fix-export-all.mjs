import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SERVER_DIR = join(ROOT_DIR, ".output/server");
const VERCEL_DIR = join(ROOT_DIR, ".vercel/output/functions/__server.func");

function fixFile(filePath) {
	const content = readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	const importMatch = lines[0]?.match(/import\s*\{[^}]*__exportAll\s+as\s+__exportAll\$1[^}]*\}/);
	if (!importMatch) return false;

	let localDefLine = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].match(/^var __exportAll\s*=/)) {
			localDefLine = i;
			break;
		}
	}

	if (localDefLine === -1) return false;

	let patched = false;
	for (let i = 0; i < localDefLine; i++) {
		if (lines[i].includes("__exportAll(") && !lines[i].includes("__exportAll$1(")) {
			lines[i] = lines[i].replace(/__exportAll\(/g, "__exportAll$1(");
			patched = true;
		}
	}

	if (patched) {
		writeFileSync(filePath, lines.join("\n"), "utf-8");
	}
	return patched;
}

function walkDir(dir, ext) {
	const results = [];
	try {
		for (const entry of readdirSync(dir)) {
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath);
			if (stat.isDirectory()) {
				results.push(...walkDir(fullPath, ext));
			} else if (extname(fullPath) === ext) {
				results.push(fullPath);
			}
		}
	} catch {}
	return results;
}

let count = 0;
for (const dir of [SERVER_DIR, VERCEL_DIR]) {
	for (const file of walkDir(dir, ".mjs")) {
		if (fixFile(file)) {
			console.log(`Patched: ${file}`);
			count++;
		}
	}
}
console.log(`Done. Patched ${count} file(s).`);
