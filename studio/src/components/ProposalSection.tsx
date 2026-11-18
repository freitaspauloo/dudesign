/** 3 by 3 pixel marks. 1 is a solid cell. */
const glyphs = ["111001101", "111011101", "010111010", "101010101", "111011001", "110101011"];

function PixelIcon({ pattern, delay }: { pattern: string; delay: string }) {
  const cells = pattern
    .split("")
    .map((bit, index) => ({ bit, index }))
    .filter((cell) => cell.bit === "1");
  const blink = cells[cells.length - 1]?.index;

  return (
    <svg
      className="pixel-loader"
      viewBox="0 0 5 5"
      width="22"
      height="22"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {cells.map(({ index }) => (
        <rect
          key={index}
          x={(index % 3) * 2}
          y={Math.floor(index / 3) * 2}
          width="1"
          height="1"
          data-blink={index === blink ? "" : undefined}
          style={{ animationDelay: delay }}
        />
      ))}
    </svg>
  );
}

export function ProposalSection() {
  return (
    <section className="frame-proposal" aria-labelledby="proposal-heading">
      <div className="frame-proposal__loaders">
        {glyphs.map((pattern, index) => (
          <PixelIcon key={pattern} pattern={pattern} delay={`${index * 0.18}s`} />
        ))}
      </div>
      <div className="frame-proposal__copy">
        <h2 id="proposal-heading">
          We get the product ready to launch, raise, and look like the company
          you are pitching. Two weeks, in the product.
        </h2>
        <div className="frame-proposal__meter">
          <div className="frame-proposal__meter-labels">
            <span>Kickoff</span>
            <span>In the product</span>
          </div>
          <div className="frame-proposal__meter-track" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
