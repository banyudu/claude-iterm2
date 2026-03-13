import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.dirname(fileURLToPath(import.meta.url));
export const pluginRoot = path.dirname(srcDir);
export const tsxBin = path.join(pluginRoot, "node_modules", ".bin", "tsx");

export function srcFile(name: string): string {
  return path.join(srcDir, name);
}
