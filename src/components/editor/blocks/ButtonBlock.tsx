// /src/components/editor/blocks/ButtonBlock.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function ButtonBlock({
  id,
  text = "Click me",
  link = "#",
  ...props
}: any) {
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <a
      href={link}
      className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer my-2"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectBlock(id);
      }}
    >
      {text}
    </a>
  );
}
