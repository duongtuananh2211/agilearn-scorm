"use client";

import { Scorm } from "@/app/types/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

export default function ScormCard({ scorm }: { scorm: Scorm }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [dowloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDownloaded(localStorage.getItem(`scorm-${scorm.id}`) === "true");
    }
  }, [setIsDownloaded, scorm.id]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);

    const totalResources = scorm.resourcePaths.length;
    let downloadedResources = 0;

    try {
      for (const resourcePath of scorm.resourcePaths) {
        const response = await fetch(`${scorm.path}/${resourcePath}`);
        if (!response.ok) {
          throw new Error(`Failed to download resource: ${resourcePath}`);
        }

        downloadedResources++;
        setDownloadProgress(
          Math.round((downloadedResources / totalResources) * 100)
        );
      }

      /// save the resource state to the user's device
      if (typeof window !== "undefined") {
        localStorage.setItem(`scorm-${scorm.id}`, "true");
      }
      setIsDownloaded(true);
    } catch (error) {
      console.error("Error downloading SCORM resources:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [scorm.resourcePaths, scorm.path, scorm.id]);

  return (
    <Card>
      <CardHeader className="text-[24px] ">{scorm.originalName}</CardHeader>

      <CardContent className="h-full flex items-end gap-2">
        <Button
          onClick={() =>
            (window.location.href = `/scorm?path=${encodeURIComponent(
              scorm.path
            )}`)
          }
          className="cursor-pointer"
        >
          Play
        </Button>

        {isDownloaded ? (
          <div className="h-full flex items-center font-bold">Downloaded</div>
        ) : (
          <Button
            variant={"outline"}
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? (
              <>
                <Loader2Icon className="animate-spin" />
                {dowloadProgress}% Downloading...
              </>
            ) : (
              "Download"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
