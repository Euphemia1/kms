import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { AboutPreview } from "@/components/about-preview"
import { ServicesGridHomepage } from "@/components/services-grid"

import { WhyChooseUs } from "@/components/why-choose-us"
import { PartnersSection } from "@/components/partners-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutPreview />

      <WhyChooseUs />
      <PartnersSection />
      <CTASection />
      <Footer />
    </main>
  )
}
