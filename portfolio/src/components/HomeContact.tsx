import { site } from "@/src/content/site";

export function HomeContact() {
  return (
    <section id="contact" className="frame-contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Building a product? Write me.</h2>
      <p>
        <a href={`mailto:${site.email}?subject=Senior%20product%20design`}>{site.email}</a>
      </p>
    </section>
  );
}
