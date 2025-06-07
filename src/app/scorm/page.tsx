"use client";

import { collection, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Scorm12API, Scorm2004API } from "scorm-again";

// Extend the Window interface to include SCORM API properties
declare global {
  interface Window {
    API?: Scorm12API;
    API_1484_11?: Scorm2004API;
  }
}

export default function ScormPage() {
  const [path, setPath] = useState<string | null>(null);

  const firestore = useFirestore();
  const { data, status } = useFirestoreCollectionData(
    path
      ? query(
          collection(firestore, "scorms"),
          where("path", "==", path),
          limit(1)
        )
      : query(collection(firestore, "scorms"), limit(1))
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(new URLSearchParams(window.location.search).get("path"));
      window.API = new Scorm12API({
        logLevel: 2,
      });
      window.API_1484_11 = new Scorm2004API({ logLevel: 2 });
    }
  }, []);

  if (status !== "success" || !data[0] || !path) return null;

  const target = data[0];
  return (
    <>
      <iframe
        className="w-full h-screen"
        src={`${path}/${target.indexFilePath}`}
      />
    </>
  );
}
