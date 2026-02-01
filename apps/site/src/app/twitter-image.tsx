import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0f172a 0%, #0b3b2a 55%, #052e16 100%)",
          color: "#ffffff"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 860 }}>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05 }}>
              Myst Pressure Washing
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, opacity: 0.92, lineHeight: 1.25 }}>
              Pressure washing and soft washing across North Metro Atlanta.
            </div>
          </div>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 28,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -4 }}>M</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 600, opacity: 0.9 }}>
            Request an estimate • Text us photos • Same-week openings
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>mystwashing.com</div>
        </div>
      </div>
    ),
    size
  );
}

