"use client";

import { collection, limit, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Scorm12API, Scorm2004API } from "scorm-again";

export default function ScormPage() {
  const path = new URLSearchParams(window.location.search).get("path");

  const firestore = useFirestore();
  const { data, status } = useFirestoreCollectionData(
    query(collection(firestore, "scorms"), where("path", "==", path), limit(1))
  );

  useEffect(() => {
    if (window) {
      window.API = new Scorm12API({
        logLevel: 2,
      });
      window.API_1484_11 = new Scorm2004API({ logLevel: 2 });
    }
  }, []);

  if (status !== "success" || !data[0]) return null;

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
