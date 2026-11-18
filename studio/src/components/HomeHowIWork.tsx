import { sprintPromises, sprintWeeks } from "@/src/content/sprint";

const items = [
  sprintPromises[0],
  sprintPromises[1],
  sprintPromises[2],
  {
    title: "Ask first.",
    body: sprintWeeks.week1[0].body,
  },
  {
    title: "Show the tradeoffs.",
    body: sprintWeeks.week1[1].body,
  },
  {
    title: "Check in every day.",
    body: sprintWeeks.daily,
  },
];

export function HomeHowIWork() {
  return (
    <section id="how-i-work" className="frame-how" aria-labelledby="how-i-work-heading">
      <h2 id="how-i-work-heading">How we work</h2>
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
