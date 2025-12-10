// /src/components/editor/blocks/SectionBlock.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function SectionBlock({
  id,
  childrenBlocks,
  ...props
}: any) {
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <div
      className="border border-gray-300 p-6 rounded mb-6 bg-white shadow-sm cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
    >
      {childrenBlocks?.map((child: any) => {
        const Component = require("./" + child.type.charAt(0).toUpperCase() + child.type.slice(1) + "Block.tsx")?.default;
        if (!Component) return null;
        return <Component key={child.id} id={child.id} {...child.props} childrenBlocks={child.children} />;
      })}
    </div>
  );
}
