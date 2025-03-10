import { FooterLink, SocialLink } from "@/types"
import { ArrowRight, Twitter, Github, MessageCircle, Send } from "lucide-react"
import Logo from "../ui/logo"

const platformLinks: FooterLink[] = [
  { label: "Trading", href: "#trading" },
  { label: "Staking", href: "#staking" },
  { label: "Liquidity", href: "#liquidity" },
  { label: "Governance", href: "#governance" },
  { label: "Analytics", href: "#analytics" },
]

const resourceLinks: FooterLink[] = [
  { label: "Documentation", href: "#documentation" },
  { label: "API", href: "#api" },
  { label: "Status", href: "#status" },
  { label: "Terms of Service", href: "#terms-of-service" },
  { label: "Privacy Policy", href: "#privacy-policy" },
]

const socialLinks: SocialLink[] = [
  { label: "Twitter", href: "#twitter", icon: Twitter },
  { label: "Discord", href: "#discord", icon: MessageCircle },
  { label: "Telegram", href: "#telegram", icon: Send },
  { label: "GitHub", href: "#github", icon: Github },
]

export default function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-gray-400 text-sm">The most advanced perpetual swaps platform built on Sonic.</p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                  aria-label={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-blue-500 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-blue-500 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Subscribe</h4>
            <p className="text-gray-400 text-sm mb-4">Stay updated with the latest news and announcements.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Email address"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md flex items-center justify-center"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Swiv Protocol. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

