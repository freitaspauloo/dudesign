import { assetPath } from "@/src/lib/asset-path";

export function PixelFontsPost() {
  return (
    <div className="pv-fill pv-pixel-fonts">
      <div
        className="pv-pixel-fonts__card"
        style={{ backgroundImage: `url(${assetPath("/posts/pixel-fonts-bg.png")})` }}
      >
        <p className="pv-pixel-fonts__line pv-pixel-fonts__line--pixel">pixel</p>
        <p className="pv-pixel-fonts__line pv-pixel-fonts__line--fonts">fonts</p>
      </div>
    </div>
  );
}
