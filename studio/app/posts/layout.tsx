import type { Metadata } from "next";
import { GeistPixelSquare } from "geist/font/pixel";
import "../posts.css";

export const metadata: Metadata = {
  title: "Posts",
  description: "I design complex product surfaces and ship them in code.",
  robots: { index: false, follow: false },
};

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`posts-root ${GeistPixelSquare.variable}`}>{children}</div>
  );
}
