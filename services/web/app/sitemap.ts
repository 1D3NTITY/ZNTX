import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zntx.de/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://zntx.de/impressum",
      lastModified: new Date(),
      priority: 0.2,
    },
    {
      url: "https://zntx.de/datenschutz",
      lastModified: new Date(),
      priority: 0.2,
    },
  ];
}
