import type { Metadata } from "next";
import "./prototypes.css";

export const metadata: Metadata = {
  title: { absolute: "Prototypes | Arch" },
  robots: { index: false, follow: false },
};

export default function PrototypesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
