// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a post on X: a GTA 6 meme whose picture carries the
// make.fun ghost. This program has exactly one job — hand the grader the
// post's address by copying POST.json from the repository root into the
// output directory, where the gate reads it.
//
// Local run (the same shape the grader uses):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// On success it prints nothing and out/POST.json matches POST.json byte for
// byte. On any failure it explains what went wrong on stderr and exits 1.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(botDir, 'POST.json');
const targetPath = join(outputDir, 'POST.json');

if (!existsSync(sourcePath)) {
  fail(`POST.json not found in bot directory "${botDir}"`);
}

try {
  mkdirSync(outputDir, { recursive: true });
} catch (err) {
  fail(`could not create output directory "${outputDir}": ${(err as Error).message}`);
}

try {
  copyFileSync(sourcePath, targetPath);
} catch (err) {
  fail(`could not copy POST.json to "${targetPath}": ${(err as Error).message}`);
}

// Read both files back and compare: a copy that silently truncated or wrote
// different bytes would hand the gate a broken address, so treat any
// mismatch as a hard failure instead of a quiet success.
const sourceBytes = readFileSync(sourcePath);
const copiedBytes = readFileSync(targetPath);
if (!sourceBytes.equals(copiedBytes)) {
  fail(`copied POST.json (${copiedBytes.length} bytes) differs from the source (${sourceBytes.length} bytes)`);
}
