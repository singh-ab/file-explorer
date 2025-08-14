"use client";
import React, { useState, useEffect } from "react";

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
      <div className="flex-1 flex items-center justify-center text-gray-600 bg-white">
        Select a file to view its contents
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-800">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-600 bg-white">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-3 border-b border-gray-300 bg-white">
        <h3 className="font-medium text-sm text-gray-800">{filePath}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-white">
        <pre className="text-sm whitespace-pre-wrap font-mono bg-white p-4 border border-gray-200 rounded text-gray-800">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default FileViewer;
