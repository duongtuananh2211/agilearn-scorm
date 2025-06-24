import { NextRequest } from "next/server";
import { join } from "path";
import { statSync } from "fs";
import archiver from "archiver";

const SCORMS_DIR = join(process.cwd(), "public", "scorms");

function isValidScormFolder(name: string): boolean {
  return /^[\w-]+$/.test(name);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name || !isValidScormFolder(name)) {
    return new Response("Invalid or missing SCORM name", { status: 400 });
  }
  const scormPath = join(SCORMS_DIR, name);
  try {
    if (!statSync(scormPath).isDirectory()) {
      return new Response("SCORM package not found", { status: 404 });
    }
  } catch {
    return new Response("SCORM package not found", { status: 404 });
  }

  // Set headers for download
  const headers = new Headers({
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="${name}.zip"`,
  });

  // Use ReadableStream for Next.js API route
  const readableStream = new ReadableStream({
    start(controller) {
      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      archive.on("end", () => controller.close());
      archive.on("error", (err) => controller.error(err));
      archive.directory(scormPath, false);
      archive.finalize();
    },
  });

  return new Response(readableStream, { headers });
}
