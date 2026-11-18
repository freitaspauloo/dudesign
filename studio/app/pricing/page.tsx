import type { Metadata } from "next";
import Link from "next/link";
import { BtnArrow } from "@/src/components/BtnArrow";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One AI Product Sprint. Two weeks, $4,500, shipped in your product.",
};

const leaveWith = [
  "The bet, in one page",
  "The flow, including the AI moment",
  "The interface",
  "Type, color and components for that surface",
  "Production UI in your codebase",
  "A recorded walkthrough",
];

const weeks = [
  "Before: a 30-minute fit call, a one-page intake, and half the fee to hold the slot.",
  "Week 1: questions on day 1, then the flow with 2 or 3 options, then a clickable prototype.",
  "Week 2: production UI in your code, then staging, a recorded walkthrough and a handoff note.",
  "Every day: a 10-minute check-in.",
];

const payment = [
  "Half to book, half at the end.",
  "USD, by wire or ACH.",
  "IP transfers to you on the final payment.",
  "We may publish a case study, only after you review it.",
];

export default function PricingPage() {
  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>One sprint. One price. {site.price}.</h1>
        <p>
          A founding price while we build the next set of case studies. We run
          one sprint at a time, so your two weeks get our full attention.
        </p>
        <Link href={site.bookHref} className="btn btn--solid">
          Book a sprint
          <BtnArrow />
        </Link>
      </header>

      <section className="frame-how" aria-labelledby="compare-heading">
        <h2 id="compare-heading" className="visually-hidden">
          How the sprint compares
        </h2>
        <table className="sprint-table">
          <caption className="visually-hidden">How the sprint compares</caption>
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">What you get</th>
              <th scope="col">Cost</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Design agency</th>
              <td>A file handed off for your team to build</td>
              <td>Project fee</td>
              <td>Months</td>
            </tr>
            <tr>
              <th scope="row">Full-time hire</th>
              <td>One designer, after a long search</td>
              <td>$150k to $220k a year</td>
              <td>Months to hire and ramp</td>
            </tr>
            <tr>
              <th scope="row">Software house</th>
              <td>A build team, usually without senior product design</td>
              <td>$40k to $80k</td>
              <td>Months</td>
            </tr>
            <tr className="is-accent">
              <th scope="row">DUDESIGN</th>
              <td>Senior the whole way, working in your code</td>
              <td>Flat {site.price}</td>
              <td>Two weeks, one sprint at a time</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="frame-how" aria-labelledby="leave-with-heading">
        <h2 id="leave-with-heading">What you leave with</h2>
        <ul>
          {leaveWith.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Not included: the rest of the app, brand identity, a marketing site,
          auth, APIs or infrastructure. If you need backend work, we quote it
          separately with an engineering partner.
        </p>
      </section>

      <section className="frame-how" aria-labelledby="two-weeks-heading">
        <h2 id="two-weeks-heading">The two weeks</h2>
        <ul>
          {weeks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="frame-how" aria-labelledby="payment-heading">
        <h2 id="payment-heading">Payment</h2>
        <ul>
          {payment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="frame-how" aria-labelledby="after-heading">
        <h2 id="after-heading">After the sprint</h2>
        <p>
          After the sprint, we can join your team from {site.retainerFrom} a
          month, with a 3-month minimum. Continue within two weeks and the
          sprint fee is credited to your first month.
        </p>
      </section>
    </>
  );
}
