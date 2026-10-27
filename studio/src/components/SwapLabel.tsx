/**
 * dudesign.us nav-link label treatment (nav links only — buttons on the
 * reference site use a single label + rotating arrow instead): two stacked
 * copies of the label in a box clipped to 1.2222em (22px @ 18px type). Hover
 * slides the stack up 1.5778em so the second copy lands bottom-aligned; it
 * stays at 0.6 opacity by design. Second copy is aria-hidden.
 */
export function SwapLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="swap">
      <span className="swap-inner">
        <span className="swap-line">{children}</span>
        <span className="swap-line" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
