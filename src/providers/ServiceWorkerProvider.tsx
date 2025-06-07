"use client";

import { useEffect } from "react";

export default function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Register the service worker when the component mounts
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.debug("Service Worker is supported in this browser.");
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
      });
    }
  }, []);

  return <>{children}</>;
}
