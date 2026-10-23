import type { Metadata } from "next";

import { BUILT_AT } from "./build-info.gen";
import { repoUrl, siteUrl } from "./site";

export const SITE_NAME = "Digitexa UI";
/** First public release of the kit; used as datePublished. */
export const PUBLISHED_AT = "2026-10-22T20:12:53Z";
export const MODIFIED_AT = BUILT_AT;
export const HOME_DESCRIPTION =
  "53 open-source, copy-paste React components for Next.js and Tailwind CSS v4, with kanban, timeline and calendar views, dark mode and AI-ready docs.";

const abs = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

/** Canonical, hreflang, Open Graph and Twitter tags for one page. */
export function pageMetadata({
  path,
  title,
  description,
  type = "article",
}: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: abs(path), languages: { en: abs(path), "x-default": abs(path) } },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      url: abs(path),
      title: fullTitle,
      description,
      ...(type === "article" ? { publishedTime: PUBLISHED_AT, modifiedTime: MODIFIED_AT } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

const organization = {
  "@type": "Organization",
  "@id": `${siteUrl}/#org`,
  name: "Digitexa",
  url: "https://digitexa.com",
  ...(repoUrl ? { sameAs: [repoUrl.replace(/\/[^/]+$/, "")] } : {}),
};

/** Home page graph: the site, its publisher and the source code. */
export function siteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: SITE_NAME, description, publisher: { "@id": `${siteUrl}/#org` }, inLanguage: "en" },
      {
        "@type": "SoftwareSourceCode",
        name: SITE_NAME,
        description,
        url: siteUrl,
        ...(repoUrl ? { codeRepository: repoUrl } : {}),
        license: "https://opensource.org/licenses/MIT",
        programmingLanguage: ["TypeScript", "React", "CSS"],
        runtimePlatform: "Next.js",
        author: { "@id": `${siteUrl}/#org` },
        datePublished: PUBLISHED_AT,
        dateModified: MODIFIED_AT,
      },
    ],
  };
}

/** Docs page graph: the article plus its breadcrumb trail. */
export function docJsonLd({ path, title, description, trail }: { path: string; title: string; description: string; trail: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description,
        url: abs(path),
        mainEntityOfPage: abs(path),
        inLanguage: "en",
        datePublished: PUBLISHED_AT,
        dateModified: MODIFIED_AT,
        author: { "@id": `${siteUrl}/#org` },
        publisher: organization,
        // component pages have their own card; other pages share the site card
        image: path.startsWith("/docs/components/") ? `${abs(path)}/opengraph-image` : `${siteUrl}/opengraph-image`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
      },
    ],
  };
}
