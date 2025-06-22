import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync, createReadStream } from "fs";
import unzipper from "unzipper";
import { parseManifest } from "../lib/scorm";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function extractZip(zipPath: string, destDir: string) {
  return new Promise<void>((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destDir }))
      .on("close", resolve)
      .on("error", reject);
  });
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const zipName = file.name.replace(/\.zip$/, "");
    const slug = slugify(zipName);
    const scormDir = path.join(process.cwd(), "public", "scorms", slug);

    if (!existsSync(scormDir)) {
      mkdirSync(scormDir, { recursive: true });
    }

    const zipPath = path.join(scormDir, originalName);
    await fs.writeFile(zipPath, buffer);

    await extractZip(zipPath, scormDir);

    const manifestPath = path.join(scormDir, "imsmanifest.xml");
    const { resourcePaths, indexFilePath } = await parseManifest(manifestPath);

    await fs.unlink(zipPath);

    return NextResponse.json({
      success: true,
      path: `/scorms/${slug}`,
      originalName,
      resourcePaths,
      indexFilePath,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
