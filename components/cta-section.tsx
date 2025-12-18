import { ScrollAnimation } from "./scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Phone, Mail } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/industrial-construction-site-sunset-panoramic.jpg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      <div className="container mx-auto px-4 relative">
        <ScrollAnimation className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Partner with KMS SARL for reliable, professional, and efficient solutions tailored to your industrial needs.
            Let's build something great together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" variant="secondary" className="rounded-full group">
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              <Link href="/projects">View Our Projects</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-white/80">
            <a href="tel:+243123456789" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
              <span>+243 123 456 789</span>
            </a>
            <a href="mailto:info@kmssarl.org" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
              <span>info@kmssarl.org</span>
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
