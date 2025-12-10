// /src/lib/ai-builder/files.ts

import fs from "fs/promises";
import path from "path";

export async function listProjectFiles(root: string) {
  async function walk(dir: string): Promise<any[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await walk(full));
      } else {
        const stat = await fs.stat(full);
        results.push({
          path: full.replace(root + "/", ""),
          size: stat.size
        });
      }
    }
    return results;
  }

  return walk(root);
}

export async function readProjectFile(root: string, filePath: string): Promise<string> {
  const full = path.join(root, filePath);
  return fs.readFile(full, "utf-8");
}

export async function writeProjectFile(root: string, filePath: string, content: string) {
  const full = path.join(root, filePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content);
}
