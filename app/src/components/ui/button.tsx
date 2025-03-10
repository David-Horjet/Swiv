import type { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "sm" | "default" | "lg" | "icon"
  className?: string
}

export function Button({ children, variant = "default", size = "default", className, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    outline: "border border-gray-700 bg-transparent hover:bg-gray-800 text-white",
    ghost: "bg-transparent hover:bg-gray-800 text-white",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-500 hover:text-blue-600",
  }

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 py-2 px-4",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  }

  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  )
}

