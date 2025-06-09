"use client";

import { Button } from "@/components/ui/button";
import { addDoc, collection } from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFirestore } from "reactfire";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const firestore = useFirestore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage("");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const navigate = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as {
          indexFilePath: string;
          resourcePaths: string[];
          path: string;
          originalName: string;
        };

        const collectionRef = collection(firestore, "scorms");
        const docRef = await addDoc(collectionRef, {
          originalName: data.originalName.replace(/\.zip$/, ""),
          indexFilePath: data.indexFilePath,
          resourcePaths: data.resourcePaths,
          path: data.path,
          createdAt: new Date(),
        });

        console.log("Document written with ID: ", docRef.id);

        setMessage(
          "File uploaded and extracted successfully! Path: " + data.path
        );

        navigate.push("/");
      }
    } catch (err) {
      setMessage((err as Error).message || "Upload failed.");
    }
    setUploading(false);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
      <Link href={"/"}>
        <Button variant={"ghost"}>
          <ChevronLeft /> Back to home
        </Button>
      </Link>

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #0070f3",
          borderRadius: 8,
          padding: 32,
          textAlign: "center",
          background: isDragActive ? "#e6f7ff" : "#fafafa",
          marginBottom: 24,
          cursor: "pointer",
        }}
        className="h-[300px] flex items-center justify-center mt-10"
      >
        <input {...getInputProps()} />
        {file ? (
          <p>Selected file: {file.name}</p>
        ) : isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag &apos;n&apos; drop a file here, or click to select a file</p>
        )}
      </div>
      {file && (
        <form onSubmit={handleUpload}>
          <Button className="w-full" size={"lg"}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      )}
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
};

export default UploadPage;
