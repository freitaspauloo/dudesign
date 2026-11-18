const items = [
  {
    title: "Start from the job, not the screen",
    body: "I write the job to be done and the constraint before I open a file. If I cannot say what the person is trying to finish, I am not ready to draw.",
  },
  {
    title: "Decide in the open",
    body: "Options, a recommendation, and what I am giving up. I would rather disagree early than polish the wrong thing.",
  },
  {
    title: "Prototype the hard part in code",
    body: "When the risk is interaction, density, or state, I build it. A Figma frame cannot show latency, an empty state, or a flow that fails halfway.",
  },
  {
    title: "Write it down",
    body: "Decisions, edge cases, and what the interface must never do. The next person should not have to recover it from a file.",
  },
  {
    title: "Ship, then tighten",
    body: "I would rather put a thin, true version in front of people than a complete one that has never met them.",
  },
  {
    title: "Stay through build",
    body: "I work next to engineering while it is built. The design is not done when the file is handed over.",
  },
];

export function HomeHowIWork() {
  return (
    <section id="how-i-work" className="frame-how" aria-labelledby="how-i-work-heading">
      <h2 id="how-i-work-heading">How I work</h2>
      <ol className="frame-how__list">
        {items.map((item, index) => (
          <li key={item.title}>
            <span className="frame-how__index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
