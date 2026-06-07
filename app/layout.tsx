import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwipeUp AI Academy — Velara",
  description:
    "A simulated company workstation. Join Velara, get a real problem, solve it with AI, watch the business react.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
