"use client";
import React, { useEffect, useState } from "react";
import { FSNode } from "../types";
import {
  FaFolder,
  FaFolderOpen,
  FaChevronRight,
  FaChevronDown,
  FaHtml5,
} from "react-icons/fa";
import {
  VscFile,
  VscJson,
  VscMarkdown,
  VscFileMedia,
  VscSettings,
  VscCode,
} from "react-icons/vsc";
import { DiJavascript1, DiCss3, DiReact, DiNpm } from "react-icons/di";

interface FileExplorerProps {
  onFileSelect?: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [tree, setTree] = useState<FSNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const refreshTree = () => {
    fetch("/api/dirdisp")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTree(data.tree);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    refreshTree();
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

  const handleDragStart = (e: React.DragEvent, path: string) => {
    setDraggedItem(path);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPath: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetPath) {
      console.log(`Moving ${draggedItem} to ${targetPath}`);
    }
    setDraggedItem(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", "");

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          refreshTree();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "tsx":
      case "ts":
        return <DiReact size={16} className="text-gray-600" />;
      case "js":
      case "jsx":
        return <DiJavascript1 size={16} className="text-gray-600" />;
      case "json":
        return <VscJson size={16} className="text-gray-600" />;
      case "md":
        return <VscMarkdown size={16} className="text-gray-600" />;
      case "css":
        return <DiCss3 size={16} className="text-gray-600" />;
      case "html":
        return <FaHtml5 size={16} className="text-gray-600" />;
      case "svg":
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <VscFileMedia size={16} className="text-gray-600" />;
      case "config":
      case "env":
        return <VscSettings size={16} className="text-gray-600" />;
      case "mjs":
        return <VscCode size={16} className="text-gray-600" />;
      default:
        return <VscFile size={16} className="text-gray-600" />;
    }
  };

  const renderNode = (node: FSNode, level: number = 0): React.JSX.Element => {
    const isOpen = (node as any).__open;
    const isSelected = selectedFile === node.path;
    const isDragging = draggedItem === node.path;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center text-sm select-none transition-colors duration-150 ${
            isSelected
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          } ${isDragging ? "opacity-50" : ""}`}
          style={{ paddingLeft: level * 16 + 8 }}
          draggable
          onDragStart={(e) => handleDragStart(e, node.path)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node.path)}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node);
            } else {
              openFile(node.path);
            }
          }}
        >
          {node.type === "folder" && (
            <>
              <span className="mr-1 text-gray-500">
                {isOpen ? (
                  <FaChevronDown size={10} />
                ) : (
                  <FaChevronRight size={10} />
                )}
              </span>
              <span className="mr-2 text-gray-600">
                {isOpen ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
              </span>
            </>
          )}
          {node.type === "file" && (
            <span className="mr-2 ml-4 flex items-center">
              {getFileIcon(node.name)}
            </span>
          )}
          <span className="py-1 cursor-pointer">{node.name}</span>
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
    <div
      className={`w-72 h-full bg-gray-50 border-r border-gray-200 ${
        isDragOver ? "border-blue-400 bg-blue-50" : ""
      }`}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 border-b border-gray-200 uppercase tracking-wide">
        Explorer
        {isDragOver && (
          <span className="text-blue-600 ml-2">Drop files here</span>
        )}
      </div>
      <div className="py-1">{tree.map((node) => renderNode(node))}</div>
    </div>
  );
};

export default FileExplorer;
