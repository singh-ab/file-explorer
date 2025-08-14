import * as fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json({
        success: false,
        error: "File path is required",
      });
    }

    const basePath = process.cwd();
    const fullPath = path.resolve(basePath, filePath);

    if (!fullPath.startsWith(basePath)) {
      return NextResponse.json({
        success: false,
        error: "Access denied: Path outside project directory",
      });
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({
        success: false,
        error: "File not found",
      });
    }

    const data = fs.readFileSync(fullPath, { encoding: "utf8" });

    return NextResponse.json({
      success: true,
      content: data,
      path: filePath,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
