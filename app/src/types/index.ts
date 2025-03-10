import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink extends FooterLink {
  icon: LucideIcon
}

export interface StatItem {
  label: string
  value: string
}

export interface FeatureItem {
  icon: ReactNode
  title: string
  description: string
}

export interface TestimonialItem {
  quote: string
  author: string
  role: string
}

