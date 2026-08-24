import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zntx.de/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `https://zntx.de/projekte/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
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
