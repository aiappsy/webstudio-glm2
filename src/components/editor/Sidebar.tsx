// /src/components/editor/Sidebar.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";
import { nanoid } from "nanoid";

export default function Sidebar() {
  const addBlock = useEditorStore((s) => s.addBlock);

  function add(type: string) {
    addBlock({
      id: nanoid(),
      type,
      props: {},
      children: []
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg">Add Blocks</h2>

      <button onClick={() => add("section")} className="block w-full p-2 bg-blue-100 rounded">
        Section
      </button>

      <button onClick={() => add("text")} className="block w-full p-2 bg-blue-100 rounded">
        Text
      </button>

      <button onClick={() => add("image")} className="block w-full p-2 bg-blue-100 rounded">
        Image
      </button>

      <button onClick={() => add("button")} className="block w-full p-2 bg-blue-100 rounded">
        Button
      </button>
    </div>
  );
}
