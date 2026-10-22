// Where the docs and registry are served from. Set NEXT_PUBLIC_SITE_URL (and SITE_URL for the registry build) when deploying.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const repoUrl = process.env.NEXT_PUBLIC_REPO_URL ?? null;

export const installCommand = (...items: string[]) =>
  `curl -fsSL ${siteUrl}/dx.mjs | node --input-type=module - add ${items.join(" ")}`;
