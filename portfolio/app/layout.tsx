import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
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
    default: `${site.name} | Senior Product Designer`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
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
    title: `${site.name} | Senior Product Designer`,
    description: site.tagline,
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
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
