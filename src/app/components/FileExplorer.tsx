"use client";
import React, { useEffect, useState } from "react";
import { FSNode } from "../types";

interface FileExplorerProps {
  onFileSelect?: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [tree, setTree] = useState<FSNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dirdisp")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTree(data.tree);
        } else {
          console.error("Failed to load directory tree:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching directory tree:", error);
      });
  }, []);

  const toggleFolder = (node: FSNode) => {
    (node as any).__open = !(node as any).__open;
    setTree([...tree]);
  };

  const openFile = (path: string) => {
    setSelectedFile(path);
    if (onFileSelect) {
      onFileSelect(path);
    }
  };

  const renderNode = (node: FSNode, level: number = 0): React.JSX.Element => {
    const isOpen = (node as any).__open;
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path} style={{ marginLeft: level * 20 }}>
        <div
          className={`flex items-center cursor-pointer p-1 hover:bg-gray-100 text-gray-800 ${
            isSelected ? "bg-blue-100 text-blue-900" : ""
          }`}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node);
            } else {
              openFile(node.path);
            }
          }}
        >
          {node.type === "folder" && (
            <span className="mr-1">{isOpen ? "📂" : "📁"}</span>
          )}
          {node.type === "file" && <span className="mr-1">📄</span>}
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {node.type === "folder" && isOpen && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer w-64 h-full border-r border-gray-300 overflow-auto bg-white">
      <div className="p-2 font-semibold border-b border-gray-300 bg-white text-gray-800">
        File Explorer
      </div>
      <div className="p-2 bg-white">{tree.map((node) => renderNode(node))}</div>
    </div>
  );
};

export default FileExplorer;
