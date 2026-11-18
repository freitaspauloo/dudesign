"use client";

import { useState } from "react";
import { site } from "@/src/content/site";

type Fields = {
  name: string;
  email: string;
  company: string;
  product: string;
  job: string;
  repo: string;
};

const empty: Fields = {
  name: "",
  email: "",
  company: "",
  product: "",
  job: "",
  repo: "",
};

export function FitCallForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields: Fields = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      product: String(data.get("product") ?? ""),
      job: String(data.get("job") ?? ""),
      repo: String(data.get("repo") ?? ""),
    };
    const body = [
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      `Company: ${fields.company}`,
      `What does the product do? ${fields.product}`,
      `What is the one job this sprint should make obvious? ${fields.job}`,
      fields.repo ? `Repo or build link: ${fields.repo}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    // TODO: replace mailto with a real endpoint.
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Fit call: ${fields.company}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="fit-form" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" required autoComplete="name" defaultValue={empty.name} />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Company
        <input name="company" required autoComplete="organization" />
      </label>
      <label>
        What does the product do?
        <textarea name="product" required rows={4} />
      </label>
      <label>
        What is the one job this sprint should make obvious?
        <textarea name="job" required rows={4} />
      </label>
      <label>
        Repo or build link (optional)
        <input name="repo" type="url" />
      </label>
      <button type="submit" className="btn btn--solid">
        Request a fit call
      </button>
      {sent ? <p>Thanks. We&apos;ll reply by email.</p> : null}
      <p>
        Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </form>
  );
}
