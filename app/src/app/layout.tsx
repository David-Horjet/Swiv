"use client";

import AppkitProvider from "@/context/AppkitProvider";
import { SolanaProvider } from "@/context/SolanaProvider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
      <Analytics/>
    </html>
  );
}
