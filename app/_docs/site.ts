// Registry'nin yayınlandığı adres. Yayına alınca NEXT_PUBLIC_SITE_URL ile değiştir.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
