"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "#faf6e9",
          color: "#423926",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: "22px" }}>Something went wrong.</p>
        <p style={{ fontSize: "14px", color: "#596155" }}>
          Please try again, or come back in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#2c4a34",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
