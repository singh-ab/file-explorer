"use client";
import React, { useState } from "react";
import FileExplorer from "../components/FileExplorer";
import FileViewer from "../components/FileViewer";

const ViewingPage = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-screen flex bg-white">
      <FileExplorer onFileSelect={setSelectedFile} />
      <FileViewer filePath={selectedFile} />
    </div>
  );
};

export default ViewingPage;
