import { ImageResponse } from "next/og";

export const alt = "Check Local First — Reno's Local Business Directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#253022",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9ca889",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          Reno, Nevada
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 96,
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#faf6e9",
            textAlign: "center",
          }}
        >
          <span>Check Local First</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            color: "#e8ebe6",
            textAlign: "center",
          }}
        >
          Discover and support independently owned businesses
        </div>
      </div>
    ),
    { ...size }
  );
}
