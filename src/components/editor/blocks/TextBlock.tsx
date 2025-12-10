// /src/components/editor/blocks/TextBlock.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function TextBlock({
  id,
  text = "Sample text",
  ...props
}: any) {
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <p
      className="text-lg my-2 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
    >
      {text}
    </p>
  );
}
