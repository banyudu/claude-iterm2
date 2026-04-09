import path from "node:path";

// At runtime this module is bundled into dist/*.cjs, so __dirname resolves to
// the dist directory. Sibling bundles (hook.cjs, working-watchdog.cjs,
// gradient-loop.cjs, timer.cjs, …) live next to each other.
// `__dirname` is a CJS-only global; the declaration keeps tsc happy under
// ESM source mode while esbuild/tsup supplies the real value in CJS output.
declare const __dirname: string;

export const nodeBin = process.execPath;

export function distFile(name: string): string {
  return path.join(__dirname, name);
}
