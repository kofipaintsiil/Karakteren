import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.no";
  const now = new Date();
  return [
    { url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
