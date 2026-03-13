import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro Board",
  description: "Real-time agile retrospective board",
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
