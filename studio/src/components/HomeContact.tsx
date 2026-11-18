import { site } from "@/src/content/site";
import { sprintClose } from "@/src/content/sprint";

export function HomeContact() {
  return (
    <section id="contact" className="frame-contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{sprintClose.title}</h2>
      <p>{sprintClose.line}</p>
      <p>
        <a href={`mailto:${site.email}?subject=Fit%20call`}>{site.email}</a>
      </p>
    </section>
  );
}
