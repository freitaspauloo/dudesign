import type { Metadata } from "next";
import { FitCallForm } from "@/src/components/FitCallForm";

export const metadata: Metadata = {
  title: "Book a fit call",
  description: "Book a 30-minute fit call for an AI Product Sprint.",
};

export default function ContactPage() {
  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>Book a 30-minute fit call.</h1>
        <p>One decision-maker. We leave with a yes, a no, or not this surface.</p>
      </header>
      <FitCallForm />
    </>
  );
}
