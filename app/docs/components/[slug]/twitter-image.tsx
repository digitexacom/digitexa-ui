import { ogContentType, ogSize, renderOg } from "../../../_docs/og";
import { allComponents } from "../../../_docs/nav";

export const alt = "Digitexa UI component";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = allComponents.find((c) => c.slug === slug);
  return renderOg({
    kicker: "Component",
    title: item?.title ?? "Components",
    description: item?.description ?? "Open-source, copy-paste React components.",
  });
}
