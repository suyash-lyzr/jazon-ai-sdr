import type { Metadata } from "next";
import "./globals.css";
import { JazonAppShell } from "@/components/jazon-app-shell";

export const metadata: Metadata = {
  title: "Jazon - AI SDR Platform",
  description: "Enterprise AI-powered sales development representative platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <JazonAppShell>{children}</JazonAppShell>
      </body>
    </html>
  );
}
