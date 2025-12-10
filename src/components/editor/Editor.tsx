
// /src/components/editor/Editor.tsx

import React from "react";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import TreeView from "./TreeView";

export default function Editor() {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white p-4">
        <Sidebar />
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        <Toolbar />
        <Canvas />
      </div>

      {/* Right Tree View */}
      <div className="w-64 border-l bg-white p-4">
        <TreeView />
      </div>
    </div>
  );
}
