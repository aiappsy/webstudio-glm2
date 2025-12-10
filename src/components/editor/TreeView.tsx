// /src/components/editor/TreeView.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function TreeView() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  function render(block: any, level = 0) {
    return (
      <div key={block.id} className="ml-2">
        <div
          className="cursor-pointer p-1 hover:bg-gray-200 rounded"
          style={{ marginLeft: level * 12 }}
          onClick={() => selectBlock(block.id)}
        >
          {block.type} ({block.id})
        </div>
        {block.children?.map((child: any) => render(child, level + 1))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">Structure</h2>
      {blocks.map((b) => render(b))}
    </div>
  );
}
