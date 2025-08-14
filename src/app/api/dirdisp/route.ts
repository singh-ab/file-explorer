import * as fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

function getDirectoryTree(dirPath: string, basePath: string): any[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    let ignoredPatterns: string[] = [];
    try {
      const gitignore = fs.readFileSync(
        path.join(basePath, ".gitignore"),
        "utf8"
      );
      ignoredPatterns = gitignore
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
        .map((line) => {
          if (line.startsWith("/")) line = line.substring(1);
          if (line.endsWith("/")) line = line.substring(0, line.length - 1);
          return line;
        });
    } catch {}

    const defaultIgnored = [
      ".next",
      "node_modules",
      ".git",
      ".vercel",
      "out",
      "build",
      ".DS_Store",
    ];
    defaultIgnored.forEach((pattern) => {
      if (!ignoredPatterns.includes(pattern)) {
        ignoredPatterns.push(pattern);
      }
    });

    return entries
      .filter((entry) => {
        return !ignoredPatterns.some((pattern) => {
          if (pattern.includes("*")) {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"));
            return regex.test(entry.name);
          }
          return entry.name === pattern;
        });
      })
      .map((entry) => {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(basePath, fullPath);

        if (entry.isDirectory()) {
          return {
            name: entry.name,
            type: "folder" as const,
            path: relativePath,
            children: getDirectoryTree(fullPath, basePath),
          };
        } else {
          return {
            name: entry.name,
            type: "file" as const,
            path: relativePath,
          };
        }
      });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const basePath = process.cwd();
    const tree = getDirectoryTree(basePath, basePath);

    return NextResponse.json({ success: true, tree });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
