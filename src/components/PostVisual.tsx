import type { SocialPost } from "@/content/social-posts";
import { assetPath } from "@/lib/asset-path";

type PostVisualProps = {
  post: SocialPost;
};

export function PostVisual({ post }: PostVisualProps) {
  return (
    <div className={`pv pv-${post.slug}`} data-visual={post.slug} data-kind={post.kind}>
      {visualFor(post)}
    </div>
  );
}

function visualFor(post: SocialPost) {
  if (post.kind === "portfolio" && post.portfolioImage) {
    return <PortfolioFrame src={post.portfolioImage} />;
  }

  switch (post.slug) {
    case "wait-three-months":
      return <WaitThreeMonths />;
    case "how-a-surface-ships":
      return <ProcessSurfaceShips />;
    case "model-default":
      return <ProcessModelDefault />;
    default:
      return null;
  }
}

function PortfolioFrame({ src }: { src: string }) {
  return (
    <div className="pv-fill pv-portfolio">
      <div className="pv-portfolio-outline">
        <div className="pv-portfolio-device">
          <div className="pv-portfolio-screen">
            <img src={assetPath(src)} alt="" decoding="sync" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitThreeMonths() {
  return (
    <div className="pv-fill pv-poster">
      <img className="pv-poster-photo" src={assetPath("/posts/mac-hill.png")} alt="" />
      <div className="pv-poster-card" aria-hidden />
      <p className="pv-poster-head">
        They wait months for a Figma file. I ship the first code in week two.
      </p>
      <p className="pv-poster-sub">
        Here&apos;s how I do it
        <img
          className="pv-poster-arrow"
          src={assetPath("/posts/poster-arrow.svg")}
          alt=""
        />
      </p>
    </div>
  );
}

function ProcessSurfaceShips() {
  return (
    <div className="pv-fill pv-process">
      <p className="pv-process-kicker">How a surface ships</p>
      <ol className="pv-process-steps">
        <li>
          <span>01</span>
          <strong>Bet</strong>
          <em>What it is for</em>
        </li>
        <li>
          <span>02</span>
          <strong>Surface</strong>
          <em>The screen a human uses</em>
        </li>
        <li>
          <span>03</span>
          <strong>In the product</strong>
          <em>Clickable. Not a file</em>
        </li>
      </ol>
      <p className="pv-process-foot">Figma is a step. Not the product.</p>
    </div>
  );
}

function ProcessModelDefault() {
  return (
    <div className="pv-fill pv-process">
      <p className="pv-process-kicker">Most AI products</p>
      <p className="pv-process-head">look the same</p>
      <p className="pv-process-foot">
        That&apos;s the model. Not a product.
      </p>
    </div>
  );
}
