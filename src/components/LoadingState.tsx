import React from "react";
import { CircularProgress } from "@/components/ui/CircularProgress";

export default function LoadingState({
  size = 64,
  message = "please wait...",
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f9fafb",
      }}
    >
      <CircularProgress size={size} />
      <p style={{ marginTop: 24, color: "#555", fontSize: 18 }}>{message}</p>
    </div>
  );
}
