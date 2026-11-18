import { notFound } from "next/navigation";
import { InstagramAd, type AdFormat } from "@/src/components/ads/InstagramAd";
import {
  getInstagramAd,
  instagramAds,
} from "@/src/content/instagram-ads";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ format?: string }>;
};

export function generateStaticParams() {
  return instagramAds.map((ad) => ({ slug: ad.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ad = getInstagramAd(slug);
  return {
    title: ad ? ad.direction : "Ad",
    robots: { index: false, follow: false },
  };
}

export default async function InstagramAdRenderPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const format: AdFormat =
    (await searchParams).format === "story" ? "story" : "feed";
  const ad = getInstagramAd(slug);
  if (!ad) notFound();

  return (
    <div className="ads-render" data-format={format}>
      <InstagramAd ad={ad} format={format} />
    </div>
  );
}
