import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.dirname(fileURLToPath(import.meta.url));
export const pluginRoot = path.dirname(srcDir);
const pluginData = process.env.CLAUDE_PLUGIN_DATA || pluginRoot;
export const tsxBin = path.join(pluginData, "node_modules", ".bin", "tsx");

export function srcFile(name: string): string {
  return path.join(srcDir, name);
}
