import type { Metadata } from "next";
import "./ads.css";

export const metadata: Metadata = {
  title: "Instagram ads",
  description: "Feed concepts for review. Not published.",
  robots: { index: false, follow: false },
};

export default function AdsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="ads-root">{children}</div>;
}
