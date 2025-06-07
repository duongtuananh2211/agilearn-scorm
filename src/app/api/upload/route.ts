import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync, createReadStream } from "fs";
import unzipper from "unzipper";
import xml2js from "xml2js";

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

async function parseManifest(manifestPath: string) {
  let resourcePaths: string[] = [];
  let indexFilePath: string | null = null;
  try {
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const parser = new xml2js.Parser();
    const manifest = await parser.parseStringPromise(manifestContent);
    type ResourceType = { $?: { href?: string }; file?: Array<{ $?: { href?: string } }> };
    const resources = manifest?.manifest?.resources?.[0]?.resource as Array<ResourceType>;
    if (Array.isArray(resources)) {
      for (const res of resources) {
        if (res.$?.href) {
          resourcePaths.push(res.$.href);
          if (!indexFilePath) {
            indexFilePath = res.$.href;
          }
        }
        if (Array.isArray(res.file)) {
          for (const file of res.file) {
            if (file.$?.href) {
              resourcePaths.push(file.$.href);
            }
          }
        }
      }
    }
  } catch {
    resourcePaths = [];
    indexFilePath = null;
  }
  return { resourcePaths, indexFilePath };
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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
