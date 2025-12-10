// /src/lib/ai-builder/diff.ts

import { writeProjectFile } from "./files";

export interface FilePatch {
  path: string;
  content: string;
}

export async function applyPatches(root: string, patches: FilePatch[]) {
  for (const patch of patches) {
    await writeProjectFile(root, patch.path, patch.content);
  }
}
