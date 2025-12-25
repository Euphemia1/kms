import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardHat, Truck, Mountain, Package, FileText, Wrench, ArrowRight, CheckCircle2 } from "lucide-react"

const services = [
  {
    id: "maintenance",
    icon: Wrench,
    title: "Mechanical Maintenance & Services",
    description:
      "We specialize in maintaining industrial equipment and infrastructure to ensure optimal performance and longevity. Our mechanical maintenance services cover all types of industrial machinery and equipment.",
    features: [
      "Preventive maintenance",
      "Equipment repairs",
      "Mechanical system overhauls",
      "Predictive maintenance",
      "Equipment installation",
      "Performance optimization",
    ],
    image: "/services/maintenance.jpg",
  },
  {
    id: "construction",
    icon: HardHat,
    title: "Civil & Structure Works",
    description:
      "We provide top-notch civil engineering services and structural constructions, from infrastructure development to industrial facilities and building construction.",
    features: [
      "Civil infrastructure development",
      "Building construction",
      "Structural engineering services",
      "Project management",
      "Site preparation and earthworks",
      "Quality assurance and control",
    ],
    image: "/services/construction.jpg",
  },
  {
    id: "procurement",
    icon: Package,
    title: "Industrial Supply & Procurement",
    description:
      "Efficient procurement and supply chain management for all your industrial needs, ensuring timely delivery and quality products for mining and industrial operations.",
    features: [
      "Strategic sourcing",
      "Vendor management",
      "Inventory optimization",
      "Supply chain solutions",
      "Quality inspections",
      "Cost reduction strategies",
    ],
    image: "/services/procurement.jpg",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Our Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Comprehensive Solutions for <span className="text-primary">Every Need</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From construction and engineering to logistics and procurement, we offer a full spectrum of professional
              services tailored to the mining and industrial sectors.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className="scroll-mt-24">
                <div
                  className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <ScrollAnimation direction={index % 2 === 0 ? "left" : "right"}>
                    <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full rounded-2xl shadow-2xl"
                      />
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-accent/20 rounded-2xl -z-10" />
                    </div>
                  </ScrollAnimation>

                  <ScrollAnimation direction={index % 2 === 0 ? "right" : "left"}>
                    <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">{service.description}</p>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="rounded-full" size="lg">
                        <Link href="/contact">
                          Get a Quote
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Need a Custom Solution?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              We understand that every project is unique. Contact us to discuss your specific requirements and get a
              tailored solution.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/contact">
                Contact Our Team
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </main>
  )
}
