"use client";
import React, { useState, useEffect } from "react";
import { 
  VscFile, 
  VscJson, 
  VscMarkdown,
  VscFileMedia,
  VscCode,
  VscFileSubmodule
} from "react-icons/vsc";
import { 
  DiJavascript1, 
  DiCss3,
  DiReact 
} from "react-icons/di";
import { FaHtml5 } from "react-icons/fa";

interface FileViewerProps {
  filePath: string | null;
}

const FileViewer: React.FC<FileViewerProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setContent("");
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/read?path=${encodeURIComponent(filePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContent(data.content);
        } else {
          setError(data.error || "Failed to load file");
        }
      })
      .catch((err) => {
        setError("Error loading file: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filePath]);

  if (!filePath) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">
          <VscFile size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const getLanguage = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    if (ext === "tsx" || ext === "ts") return "typescript";
    if (ext === "js" || ext === "jsx") return "javascript";
    if (ext === "json") return "json";
    if (ext === "css") return "css";
    if (ext === "md") return "markdown";
    return "text";
  };

  const getFileIcon = () => {
    if (!filePath) return <VscFile className="text-gray-500" size={16} />;
    
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'json':
        return <VscJson className="text-yellow-600" size={16} />;
      case 'md':
        return <VscMarkdown className="text-blue-400" size={16} />;
      case 'js':
      case 'jsx':
        return <DiJavascript1 className="text-yellow-400" size={16} />;
      case 'ts':
        return <VscCode className="text-blue-500" size={16} />;
      case 'tsx':
        return <DiReact className="text-blue-500" size={16} />;
      case 'css':
        return <DiCss3 className="text-blue-600" size={16} />;
      case 'html':
        return <FaHtml5 className="text-orange-500" size={16} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <VscFileMedia className="text-purple-500" size={16} />;
      default:
        return <VscFile className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center">
        {getFileIcon()} 
        <span className="ml-2 text-sm text-gray-700 font-medium">
          {filePath.split("\\").pop()}
        </span>
        <span className="ml-2 text-xs text-gray-500">({filePath})</span>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed text-gray-800 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default FileViewer;
