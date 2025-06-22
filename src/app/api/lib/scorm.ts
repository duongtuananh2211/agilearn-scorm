import xml2js from "xml2js";
import fs from "fs/promises";

export async function parseManifest(manifestPath: string) {
  let resourcePaths: string[] = [];
  let indexFilePath: string | null = null;
  try {
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const parser = new xml2js.Parser();
    const manifest = await parser.parseStringPromise(manifestContent);
    type ResourceType = {
      $?: { href?: string };
      file?: Array<{ $?: { href?: string } }>;
    };
    const resources = manifest?.manifest?.resources?.[0]
      ?.resource as Array<ResourceType>;
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
