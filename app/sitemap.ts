import type { MetadataRoute } from "next";

import { docPages } from "./_docs/content";
import { allComponents, examples } from "./_docs/nav";
import { MODIFIED_AT } from "./_docs/seo";
import { siteUrl } from "./_docs/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "weekly") => ({
    url: `${siteUrl}${path}`,
    lastModified: MODIFIED_AT,
    changeFrequency,
    priority,
    alternates: { languages: { en: `${siteUrl}${path}` } },
  });
  return [
    page("", 1),
    page("/docs", 0.9),
    ...docPages.filter((p) => p !== "introduction").map((p) => page(`/docs/${p}`, 0.8)),
    page("/docs/ai", 0.8),
    page("/docs/components", 0.9),
    ...allComponents.map((c) => page(`/docs/components/${c.slug}`, 0.7)),
    ...examples.map((e) => page(e.href, 0.5, "monthly")),
  ];
}
