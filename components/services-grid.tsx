import { ScrollAnimation } from "./scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardHat, Truck, Mountain, Package, FileText, ArrowRight, Wrench } from "lucide-react"

const services = [
  {
    icon: Wrench,
    title: "Mechanical Maintenance & Services",
    description:
      "We specialize in maintaining industrial equipment and infrastructure to ensure optimal performance and longevity. Our mechanical maintenance services cover all types of industrial machinery and equipment.",
    href: "/services#maintenance",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    icon: HardHat,
    title: "Civil & Structure Works",
    description: "We provide top-notch civil engineering services and structural constructions, from infrastructure development to industrial facilities and building construction.",
    href: "/services#construction",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Package,
    title: "Industrial Supply & Procurement",
    description: "Efficient procurement and supply chain management for all your industrial needs, ensuring timely delivery and quality products for mining and industrial operations.",
    href: "/services#procurement",
    color: "bg-purple-500/10 text-purple-600",
  },
]

export function ServicesGrid() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Our Services</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Comprehensive Solutions for <span className="text-primary">Your Success</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer a wide range of professional services designed to support your operations and drive growth in the
            mining and industrial sectors.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollAnimation key={service.title} delay={index * 100}>
              <Link href={service.href} className="group block h-full">
                <div className="bg-card h-full p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div
                    className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  <div className="flex items-center text-primary font-medium">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </ScrollAnimation>
      </div>
    </section>
  )
}
