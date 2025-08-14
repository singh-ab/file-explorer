import { NextResponse } from "next/server";
import * as fs from "fs";
import path from "path";

interface MoveRequestBody {
  source: string;
  target: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MoveRequestBody>;
    const { source, target } = body;

    if (!source || !target) {
      return NextResponse.json(
        { success: false, error: "source and target required" },
        { status: 400 }
      );
    }

    const basePath = process.cwd();
    const sourceFull = path.resolve(basePath, source);
    const targetFullRaw = path.resolve(basePath, target);

    if (
      !sourceFull.startsWith(basePath) ||
      !targetFullRaw.startsWith(basePath)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(sourceFull)) {
      return NextResponse.json(
        { success: false, error: "Source does not exist" },
        { status: 404 }
      );
    }

    let destinationDirFull = targetFullRaw;
    if (
      !fs.existsSync(destinationDirFull) ||
      !fs.statSync(destinationDirFull).isDirectory()
    ) {
      destinationDirFull = path.dirname(destinationDirFull);
    }

    const isSourceDir = fs.statSync(sourceFull).isDirectory();
    if (isSourceDir) {
      const attempted = path.join(
        destinationDirFull,
        path.basename(sourceFull)
      );
      if (
        attempted === sourceFull ||
        attempted.startsWith(sourceFull + path.sep)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot move a folder into itself or its descendant",
          },
          { status: 400 }
        );
      }
    }

    const destinationFull = path.join(
      destinationDirFull,
      path.basename(sourceFull)
    );

    if (fs.existsSync(destinationFull)) {
      return NextResponse.json(
        { success: false, error: "Destination exists" },
        { status: 409 }
      );
    }

    fs.renameSync(sourceFull, destinationFull);

    const relativeNewPath = path.relative(basePath, destinationFull);
    return NextResponse.json({ success: true, newPath: relativeNewPath });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Move failed",
      },
      { status: 500 }
    );
  }
}
