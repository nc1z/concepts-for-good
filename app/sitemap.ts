import type { MetadataRoute } from "next";
import { pocCards } from "@/lib/pocs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conceptsforgood.sg";

export default function sitemap(): MetadataRoute.Sitemap {
  const pocRoutes = pocCards.map((poc) => ({
    url: `${siteUrl}/pocs/${poc.slug}`,
    lastModified: new Date(poc.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pocRoutes,
  ];
}
