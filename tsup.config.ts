import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    hook: "src/hook.ts",
    cli: "src/cli.ts",
    fork: "src/fork.ts",
    grid: "src/grid.ts",
    "working-watchdog": "src/working-watchdog.ts",
    "gradient-loop": "src/gradient-loop.ts",
    timer: "src/timer.ts",
  },
  banner: { js: "#!/usr/bin/env node" },
  format: ["cjs"],
  outExtension: () => ({ js: ".cjs" }),
  target: "node18",
  platform: "node",
  bundle: true,
  splitting: false,
  clean: true,
  sourcemap: false,
  minify: false,
  shims: false,
});
