import { NextResponse } from "next/server";

// This endpoint is not currently used in the file browser
// It's kept for potential future file editing functionality
export async function POST() {
  return NextResponse.json({
    success: false,
    error: "Write functionality not implemented",
  });
}
