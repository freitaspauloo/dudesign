import type { SocialPost } from "@/content/social-posts";

type PostVisualProps = {
  post: SocialPost;
};

export function PostVisual({ post }: PostVisualProps) {
  return (
    <div className={`pv pv-${post.slug}`} data-visual={post.slug}>
      {visualFor(post.slug)}
    </div>
  );
}

function visualFor(slug: string) {
  switch (slug) {
    case "wait-three-months":
      return <WaitThreeMonths />;
    case "ford-operator":
      return <FordOperator />;
    case "model-default":
      return <ModelDefault />;
    case "how-a-surface-ships":
      return <HowASurfaceShips />;
    case "not-that-hire":
      return <NotThatHire />;
    case "fortune-500-craft":
      return <Fortune500Craft />;
    case "yc-landing":
      return <YcLanding />;
    case "product-was-last":
      return <ProductWasLast />;
    case "keep-the-system":
      return <KeepTheSystem />;
    default:
      return null;
  }
}

function WaitThreeMonths() {
  return (
    <div className="pv-fill pv-poster">
      <img className="pv-poster-photo" src="/posts/mac-hill.png" alt="" />
      <div className="pv-poster-card" aria-hidden />
      <p className="pv-poster-head">
        They wait months for a Figma file. I ship the first code in week two.
      </p>
      <p className="pv-poster-sub">
        Here&apos;s how I do it
        <img className="pv-poster-arrow" src="/posts/poster-arrow.svg" alt="" />
      </p>
    </div>
  );
}

function FordOperator() {
  return (
    <div className="pv-fill pv-photo">
      <img src="/work/cases/ford.png" alt="" />
      <div className="pv-photo-bar">
        <span>Ford</span>
        <span>The operator screen</span>
      </div>
    </div>
  );
}

function ModelDefault() {
  return (
    <div className="pv-fill pv-split">
      <div className="pv-split-pane is-default">
        <p className="pv-split-label">Default</p>
        <div className="pv-fake-ui">
          <div className="pv-fake-bar" />
          <div className="pv-fake-chat">
            <span className="is-user">Build me a dashboard</span>
            <span className="is-bot">Here is a beautiful, sleek, modern interface…</span>
          </div>
          <div className="pv-fake-input">Ask anything</div>
        </div>
      </div>
      <div className="pv-split-pane is-designed">
        <p className="pv-split-label">Designed</p>
        <img src="/work/cases/frameline.png" alt="" />
      </div>
    </div>
  );
}

function HowASurfaceShips() {
  return (
    <div className="pv-fill pv-paper">
      <p className="pv-kicker is-ink">How a surface ships</p>
      <ol className="pv-stack">
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
          <em>Clickable. Not a file.</em>
        </li>
      </ol>
    </div>
  );
}

function NotThatHire() {
  return (
    <div className="pv-fill pv-cols">
      <div className="pv-col is-mute">
        <p className="pv-col-kicker">File</p>
        <p className="pv-col-title">Handoff</p>
        <ul>
          <li>Figma dump</li>
          <li>Wait</li>
          <li>Rebuild</li>
        </ul>
      </div>
      <div className="pv-col is-live">
        <p className="pv-col-kicker">Code</p>
        <p className="pv-col-title">Ship</p>
        <ul>
          <li>The surface</li>
          <li>In the product</li>
          <li>Clickable</li>
        </ul>
      </div>
    </div>
  );
}

function Fortune500Craft() {
  return (
    <div className="pv-fill pv-ink pv-face">
      <img src="/work/01.png" alt="" />
      <div className="pv-face-copy">
        <p className="pv-kicker">Paulo Freitas</p>
        <p className="pv-hero is-tight">
          a product
          <br />
          designer who
          <br />
          engineers
        </p>
        <p className="pv-foot">surfaces, shipped in code</p>
      </div>
    </div>
  );
}

function YcLanding() {
  return (
    <div className="pv-fill pv-ink pv-ascii">
      <p className="pv-kicker">YC · landing</p>
      <pre className="pv-tree">{`      /\\
     /  \\
    / /\\ \\
   / /  \\ \\
  /_/    \\_\\
     ||`}</pre>
      <p className="pv-hero is-mid">looks generated</p>
      <p className="pv-foot">keep the system. fix the buttons.</p>
    </div>
  );
}

function ProductWasLast() {
  return (
    <div className="pv-fill pv-paper pv-route">
      <p className="pv-kicker is-ink">The product</p>
      <p className="pv-route-note">was last on the page</p>
      <div className="pv-page">
        <div className="pv-page-hero">Talk</div>
        <div className="pv-page-row">
          <i />
          <i />
          <i />
        </div>
        <div className="pv-diagram">
          <span>Local</span>
          <b />
          <span>Route</span>
          <b />
          <span>Cloud</span>
        </div>
        <p className="pv-diagram-cap">This is the product</p>
      </div>
    </div>
  );
}

function KeepTheSystem() {
  return (
    <div className="pv-fill pv-paper pv-btns">
      <p className="pv-kicker is-ink">Keep the system</p>
      <div className="pv-btn-stack">
        <span className="is-primary">Get started</span>
        <span className="is-secondary">Talk to us</span>
        <span className="is-ghost">Read the docs</span>
      </div>
      <p className="pv-btn-note">Same weight is the problem</p>
    </div>
  );
}
