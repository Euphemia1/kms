"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services#construction", label: "Construction & Engineering" },
      { href: "/services#logistics", label: "Logistics Solutions" },
      { href: "/services#mining", label: "Mining Support" },
      { href: "/services#procurement", label: "Procurement Services" },
      { href: "/services#consulting", label: "Consulting & Contracting" },
    ],
  },
  { href: "/projects", label: "Projects" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5",
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-300 group-hover:scale-105",
                scrolled ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              KMS
            </div>
          </div>
          <div
            className={cn(
              "hidden sm:block transition-colors duration-300",
              scrolled ? "text-foreground" : "text-white",
            )}
          >
            <span className="font-semibold text-lg">Kolwezi Multi Services</span>
            <span className="block text-xs opacity-80">SARL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.href)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : scrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10",
                )}
              >
                {link.label}
                {link.children && <ChevronDown className="w-3 h-3" />}
              </Link>

              {link.children && activeDropdown === link.href && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-fade-in">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button asChild className="ml-4 rounded-full px-6">
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn("lg:hidden p-2 rounded-lg transition-colors", scrolled ? "text-foreground" : "text-white")}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-x-0 top-[72px] bg-background/98 backdrop-blur-lg border-b border-border lg:hidden transition-all duration-300 overflow-hidden",
            isOpen ? "max-h-[calc(100vh-72px)] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-medium transition-colors",
                    pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button asChild className="w-full mt-4 rounded-full">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
