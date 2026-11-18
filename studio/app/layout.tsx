import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { BookSprintCta } from "@/src/components/BookSprintCta";
import { SiteCursor } from "@/src/components/cursor/SiteCursor";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import { site } from "@/src/content/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
});

const suisse = localFont({
  src: "../fonts/SuisseIntl-Regular.otf",
  variable: "--font-suisse",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DUDESIGN | Product sprints for AI startups",
    template: "%s | DUDESIGN",
  },
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: [
      {
        url: "/brand/mark-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/mark-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/brand/mark-light.svg",
  },
  openGraph: {
    title: "DUDESIGN | Product sprints for AI startups",
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${suisse.variable} ${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className={suisse.className}>
        <SiteCursor />
        <div className="page page--frame">
          <SiteHeader />
          <main className="page-main">{children}</main>
          <BookSprintCta />
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
