import { site } from "@/data/site";
import { isFilled, siteUrl } from "./utils";

/**
 * schema.org/AutoRepair (підтип AutomotiveBusiness).
 * Повертає null, доки ключові дані не заповнені реальними значеннями —
 * вигадані SEO-дані гірші за їх відсутність.
 */
export function autoRepairJsonLd(): Record<string, unknown> | null {
  const { name, phone, address } = site;
  if (!isFilled(name) || !isFilled(phone) || !isFilled(address.street) || !isFilled(address.city)) return null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name,
    description: site.description,
    url: siteUrl(),
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      ...(isFilled(address.region) ? { addressRegion: address.region } : {}),
      ...(isFilled(address.postalCode) ? { postalCode: address.postalCode } : {}),
      addressCountry: "UA",
    },
  };
  if (isFilled(site.email)) data.email = site.email;
  if (address.geo) data.geo = { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng };
  if (site.schemaOpeningHours.length) data.openingHours = site.schemaOpeningHours;
  const sameAs = site.messengers.filter((m) => m.id === "instagram" && m.href).map((m) => m.href);
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}
