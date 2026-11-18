import Link from "next/link";
import { InstagramAd, type AdFormat } from "@/src/components/ads/InstagramAd";
import { CopyCaption } from "@/src/components/CopyCaption";
import { instagramAds, type InstagramAd as InstagramAdData } from "@/src/content/instagram-ads";

export default function InstagramAdsReviewPage() {
  return (
    <div className="ads-review">
      <header className="ads-bar">
        <Link href="/">Dudesign</Link>
        <span>Instagram</span>
      </header>

      <h1>Feed and Stories.</h1>
      <p className="ads-lead">
        Same three ideas. Feed is 1080 × 1350. Stories are 1080 × 1920, with
        the headline and the work clear of the story header and the reply bar.
      </p>
      <p className="ads-held">
        Shown work is already published: 3M Zeno, Ford, and Afeela. Aligned,
        BuiltOps, and Conifer are not used. Nothing here is a concept interface,
        a price, or a performance claim. This page is not linked from the site.
      </p>

      <h2 className="ads-section">Feed · 1080 × 1350</h2>
      <div className="ads-grid">
        {instagramAds.map((ad) => (
          <AdCard key={ad.slug} ad={ad} format="feed" />
        ))}
      </div>

      <h2 className="ads-section">Stories · 1080 × 1920</h2>
      <div className="ads-grid">
        {instagramAds.map((ad) => (
          <AdCard key={`${ad.slug}-story`} ad={ad} format="story" />
        ))}
      </div>
    </div>
  );
}

function AdCard({ ad, format }: { ad: InstagramAdData; format: AdFormat }) {
  const file = format === "story" ? ad.storyFile : ad.file;

  return (
    <article className="ads-card">
      <div className="ads-card__meta">
        <span>{ad.number}</span>
        <span>{ad.direction}</span>
      </div>
      <div className={`ads-scale ads-scale--${format}`}>
        <div className={`ads-scale__inner ads-scale__inner--${format}`}>
          <InstagramAd ad={ad} format={format} />
        </div>
      </div>
      <h2>{ad.headline.join(" ")}</h2>
      <p className="ads-card__note">{ad.workNote}</p>
      <p className="ads-card__file">{file}</p>
      {format === "feed" ? (
        <>
          <pre>{ad.caption}</pre>
          <CopyCaption label="caption" text={ad.caption} />
        </>
      ) : null}
      <Link
        className="ads-card__full"
        href={`/ads/render/${ad.slug}?format=${format}`}
      >
        Full size
      </Link>
    </article>
  );
}
