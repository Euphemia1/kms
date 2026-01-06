import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from "lucide-react"

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
]

const services = [
  { href: "/services#construction", label: "Construction & Engineering" },
  { href: "/services#logistics", label: "Logistics Solutions" },
  { href: "/services#mining", label: "Mining Support" },
  { href: "/services#procurement", label: "Procurement Services" },
  { href: "/services#consulting", label: "Consulting" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center font-bold text-xl text-primary-foreground">
                KMS
              </div>
              <div>
                <span className="font-semibold text-lg">Kolwezi Multi Services</span>
                <span className="block text-xs opacity-80">SARL</span>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Your trusted partner for civil engineering, construction, and industrial services in the Democratic
              Republic of Congo.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-background/70 text-sm">
                  Office Av.Moero,No 13A,Q.Kasombo,C.Manika
                  <br />
                  Kolwezi, Lualaba Province
                  <br />
                  Democratic Republic of Congo
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <a href="tel:+243972144161" className="text-background/70 hover:text-primary transition-colors text-sm block">
                    +243 972 144 161
                  </a>
                  <a href="tel:+243823740298" className="text-background/70 hover:text-primary transition-colors text-sm block mt-1">
                    +243 823 740 298
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:gfataki.kms@gmail.com"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  gfataki.kms@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">© {new Date().getFullYear()} KMS SARL. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-background/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-background/50 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
