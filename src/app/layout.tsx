import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Recommender",
  description:
    "Movie recommendation engine that suggests 5 similar movies based on your selection using machine learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
