import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { site } from "@/data/site";
import { isFilled, siteUrl } from "@/lib/utils";
import { autoRepairJsonLd } from "@/lib/structured-data";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { SmoothAnchors } from "@/components/layout/SmoothAnchors";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

// Локальне SEO: місто в title лише коли воно вказане
const city = isFilled(site.city) ? site.cityIn : null;
const brand = isFilled(site.name) ? site.name : "Автосервіс";
const title = city ? `${brand} — автосервіс у ${city}: діагностика та ремонт авто` : `${brand} — діагностика, ТО та ремонт автомобілів`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s — ${brand}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: brand,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = autoRepairJsonLd();
  return (
    <html lang="uk" className={`${manrope.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {/* Тема до першого малювання — без «спалаху» світлої/темної */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-100 -translate-y-24 rounded-md bg-accent px-4 py-3 font-semibold text-accent-ink transition-transform focus:translate-y-0"
        >
          Перейти до змісту
        </a>
        <BookingProvider>{children}</BookingProvider>
        <SmoothAnchors />
        <RevealObserver />
        <CookieNotice />
        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        ) : null}
      </body>
    </html>
  );
}
