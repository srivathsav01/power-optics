import type { MetadataRoute } from "next";
import { policies } from "@/content/policies";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    ...policies.map((p) => ({ path: `/policies/${p.slug}`, priority: 0.3 })),
  ];
  return pages.map((p) => ({ url: `${site.url}${p.path}`, priority: p.priority }));
}
