import { ImageResponse } from "next/og";

export const alt = "Amara Studio — Beauty & Hair";
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
          background: "#1c1210",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 25% 20%, rgba(217,107,132,0.28), transparent 55%)",
          }}
        />
        <span
          style={{
            fontSize: 22,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#d96b84",
          }}
        >
          Amara Studio
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 78,
            color: "#f7f4ef",
            fontFamily: "Georgia, serif",
          }}
        >
          Beauty &amp; Hair
        </span>
        <span style={{ marginTop: 22, fontSize: 28, color: "#cdbfba" }}>
          Termine einfach online buchen
        </span>
      </div>
    ),
    { ...size }
  );
}
