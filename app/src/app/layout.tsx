import { SolanaProvider } from "@/context/SolanaProvider";
import { Analytics } from "@vercel/analytics/react";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const bricolage_GrotesqueFont = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwivTrade | Real-Time Perpetual Swaps",
  description: "Trade synthetic assets with ultra-fast execution, low fees, and up to 50x leverage. Built on Sonic for instant, decentralized trading. ⚡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bricolage_GrotesqueFont.className} antialiased`}>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
      <Analytics />
    </html>
  );
}
