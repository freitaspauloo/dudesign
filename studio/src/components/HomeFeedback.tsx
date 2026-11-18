import { feedback } from "@/src/content/feedback";

export function HomeFeedback() {
  return (
    <section id="feedback" className="frame-feedback" aria-label="The sprint">
      <figure>
        <p>{feedback.statement}</p>
        <figcaption>
          <span className="frame-feedback__role">{feedback.source}</span>
        </figcaption>
      </figure>
    </section>
  );
}
