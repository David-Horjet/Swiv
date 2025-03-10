"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import type { NavItem } from "@/types"

interface NavbarProps {
  isScrolled: boolean
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Trading", href: "#trading" },
  { label: "Staking", href: "#staking" },
  { label: "Docs", href: "#docs" },
  { label: "Community", href: "#community" },
]

export default function Navbar({ isScrolled }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Logo />
          </motion.div>
          <nav className="hidden md:flex ml-10 space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-blue-500 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm">Connect Wallet</Button>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-blue-500 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800">
              <Button variant="outline" size="sm">
                Log In
              </Button>
              <Button size="sm">Connect Wallet</Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

