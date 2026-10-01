import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { isFilled } from "@/lib/utils";

export const alt = "Автосервіс — діагностика, ТО та ремонт автомобілів";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Знаємо, що потрібно вашому авто.";
const SUB = "Діагностика · ТО · Ремонт";

/** Підвантажує Manrope лише з потрібними гліфами (кирилиця для заголовка) */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Manrope:wght@700&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const name = isFilled(site.name) ? site.name : "Автосервіс";
  const font = await loadFont(HEADLINE + SUB + name);

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
          background: "#0a0a0b",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#f4f4f5",
          fontFamily: font ? "Manrope" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#c9cdd3" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#f5a524" }} />
          {name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>{HEADLINE}</div>
          <div style={{ fontSize: 30, color: "#f5a524" }}>{SUB}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Manrope", data: font, weight: 700, style: "normal" }] : undefined,
    },
  );
}
