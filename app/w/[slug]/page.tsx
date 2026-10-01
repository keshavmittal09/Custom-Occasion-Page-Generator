import type { Metadata } from "next";
import { headers } from "next/headers";
import Viewer from "@/components/viewer/Viewer";
import { getPageSummary } from "@/lib/publicPage";

type Props = { params: Promise<{ slug: string }> };

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
}

// Rich link previews (WhatsApp/Instagram): title with the name + dynamic OG image.
// Locked pages only reveal the first name, never the content.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getPageSummary(slug);
  if (!s) return { title: "Wishly · Page not found" };
  const title = s.locked ? `Something special is coming for ${s.firstName} 🎁` : `${s.title}, ${s.firstName}! 🎉`;
  const description = `A surprise page made with love by ${s.from} on Wishly.`;
  const image = `${await origin()}/api/og/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function WishPage({ params }: Props) {
  const { slug } = await params;
  return <Viewer slug={slug} />;
}
