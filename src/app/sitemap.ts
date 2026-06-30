import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/assessment"].map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}
