// /src/components/editor/Toolbar.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function Toolbar() {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);

  if (!selectedId) {
    return <div className="p-2 border-b bg-white">No block selected</div>;
  }

  function update(prop: string, value: string) {
    updateBlock(selectedId, { [prop]: value });
  }

  return (
    <div className="p-3 border-b bg-white flex items-center gap-4">
      <span className="font-medium">Editing Block: {selectedId}</span>

      <input
        placeholder="Text content"
        onChange={(e) => update("text", e.target.value)}
        className="border p-1"
      />

      <button
        onClick={() => removeBlock(selectedId)}
        className="ml-auto bg-red-200 px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}
