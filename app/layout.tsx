import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arch — Chain (round 3)",
  description: "Hero prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
