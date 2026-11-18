/**
 * dudesign.us button arrow: 16x16 up-right arrow (exact path lifted from the
 * reference site) that rotates +45deg to point right on button hover.
 */
const PATH =
  "M 13.667 1.583 L 4 1.583 C 3.586 1.583 3.25 1.919 3.25 2.333 C 3.25 2.747 3.586 3.083 4 3.083 L 11.856 3.083 L 1.803 13.136 C 1.51 13.429 1.51 13.904 1.803 14.197 C 2.096 14.49 2.571 14.49 2.864 14.197 L 12.917 4.144 L 12.917 12 C 12.917 12.414 13.252 12.75 13.667 12.75 C 14.081 12.75 14.417 12.414 14.417 12 L 14.417 2.333 C 14.417 1.919 14.081 1.583 13.667 1.583 Z";

type Props = {
  /** "up-right" is the button default; "right" and "left" suit inline links. */
  direction?: "up-right" | "right" | "left";
  size?: number;
};

export function BtnArrow({ direction = "up-right", size = 16 }: Props) {
  return (
    <span
      className={`btn-arrow btn-arrow--${direction}`}
      aria-hidden="true"
      style={size !== 16 ? { width: size, height: size } : undefined}
    >
      <svg viewBox="0 0 16 16" width={size} height={size} focusable="false">
        <path d={PATH} fill="currentColor" />
      </svg>
    </span>
  );
}
