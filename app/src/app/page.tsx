"use client";

import { useState, useEffect } from "react"
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/utils/connection";
import { WalletButton } from "@/context/SolanaProvider";
import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/sections/home/hero-section";
import FeaturesSection from "@/components/sections/home/features-section";
import TestimonialsSection from "@/components/sections/home/testimonials-section";
import PartnersSection from "@/components/sections/home/partners-section";
import CtaSection from "@/components/sections/home/cta-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  const wallet = useAnchorWallet(); // Get connected wallet
  console.log(wallet);

  const initializeContract = async () => {
    if (!wallet) return alert("Connect your wallet first!");

    try {
      const program = getProgram(wallet);
      console.log("programs: ", program);
      const tx = await program.methods.initialize().rpc();
      console.log("Transaction successful:", tx);
      alert("Smart contract initialized!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar isScrolled={isScrolled} />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
      <Footer />

      <div>
        <WalletButton />
        <button onClick={initializeContract}>Initialize Contract</button>
      </div>
    </div>
  );
}
