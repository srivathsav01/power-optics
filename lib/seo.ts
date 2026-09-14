import { site } from "@/content/site";
import type { Frame } from "@/types/frame";

/** Serialises JSON-LD safely for a <script> tag (escapes "<" per Next.js guidance). */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export function opticianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Optician",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "₹₹",
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.hoursSchema.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
  };
}

/** Frames are sold in store only, so offers use InStoreOnly availability. */
export function frameListSchema(frames: Frame[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: frames.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${f.brand} ${f.name}`,
        description: f.description,
        brand: { "@type": "Brand", name: f.brand },
        url: `${site.url}/shop?frame=${f.slug}`,
        offers: {
          "@type": "Offer",
          price: f.priceINR,
          priceCurrency: "INR",
          availability: "https://schema.org/InStoreOnly",
          seller: { "@type": "Optician", name: site.name },
        },
      },
    })),
  };
}
