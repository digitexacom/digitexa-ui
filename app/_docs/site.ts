// Where the registry is served from. Set NEXT_PUBLIC_SITE_URL when deploying.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
