import { BtnArrow } from "@/src/components/BtnArrow";

const lines = [
  "Look 10x bigger",
  "Get to market faster",
  "Raise with a product",
  "Earn customer trust",
  "Stand out in the room",
  "Save the quarter",
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="frame-marquee__group" aria-hidden={hidden || undefined}>
      {lines.map((line) => (
        <li key={line} className="frame-marquee__item">
          <span>{line}</span>
          <BtnArrow direction="right" size={12} />
        </li>
      ))}
    </ul>
  );
}

export function FrameMarquee() {
  return (
    <div className="frame-marquee" aria-label="What the work is for">
      <div className="frame-marquee__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
