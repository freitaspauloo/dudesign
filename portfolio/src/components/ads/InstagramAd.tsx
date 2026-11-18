import type { InstagramAd as InstagramAdData } from "@/src/content/instagram-ads";
import { assetPath } from "@/src/lib/asset-path";

export type AdFormat = "feed" | "story";

export function InstagramAd({
  ad,
  format = "feed",
}: {
  ad: InstagramAdData;
  format?: AdFormat;
}) {
  return (
    <article
      className={`ig-ad ig-ad--${ad.layout} ig-ad--${format}`}
      data-ad={ad.slug}
      data-format={format}
    >
      <div className="ig-ad__top">
        <p className="ig-ad__mark">Dudesign</p>
        <p className="ig-ad__headline">
          {ad.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {ad.layout === "flow" && ad.flow ? (
          <ol className="ig-ad__flow">
            {ad.flow.map((step) => (
              <li key={step.index}>
                <span>{step.index}</span>
                <strong>{step.label}</strong>
              </li>
            ))}
          </ol>
        ) : null}
        {ad.layout === "bleed" ? <p className="ig-ad__credit">{ad.credit}</p> : null}
      </div>

      <div className="ig-ad__media">
        <img
          src={assetPath(ad.image.src)}
          alt={ad.image.alt}
          style={{ objectPosition: ad.image.position }}
          decoding="sync"
        />
      </div>

      {ad.layout !== "bleed" ? <p className="ig-ad__credit">{ad.credit}</p> : null}
    </article>
  );
}
