import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "../posts.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});


export const metadata: Metadata = {
  title: "Posts — Paulo Freitas",
  description: "I design complex product surfaces and ship them in code.",
  robots: { index: false, follow: false },
};

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`posts-root ${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable}`}
    >
      {children}
    </div>
  );
}
