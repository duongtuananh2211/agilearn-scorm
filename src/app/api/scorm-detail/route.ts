import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { parseManifest } from "../lib/scorm";

// GET /api/scorm-detail?name=phan-loai-rac-thai-off
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing scorm name" }, { status: 400 });
  }

  const scormDir = path.join(process.cwd(), "public", "scorms", name);
  try {
    // Read imsmanifest.xml for metadata
    const manifestPath = path.join(scormDir, "imsmanifest.xml");

    const { resourcePaths, indexFilePath } = await parseManifest(manifestPath);

    // Optionally, parse manifest XML for more details
    // For now, just return the manifest content and file list

    const indexPath = indexFilePath;
    return NextResponse.json({ name, indexPath, resourcePaths });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 404 });
  }
}
