import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return base
    ? [
        { url: base, priority: 1 },
        { url: `${base}/portfolio`, priority: 0.9 },
      ]
    : [];
}
