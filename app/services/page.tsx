import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardHat, Package, Wrench, ArrowRight, CheckCircle2 } from "lucide-react"
import { query } from "@/lib/db"
import { ServiceGallery } from "@/components/service-gallery"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  sort_order: number
  is_active: boolean
  featured_images?: string[]
  created_at: string
  updated_at: string
}

// Fetch services from the API
async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/services`, {
      cache: 'no-store' // Don't cache during build
    });
    
    if (!res.ok) {
      console.error('Failed to fetch services:', res.status, res.statusText);
      return [];
    }
    
    let services = await res.json();
    
    // Parse featured_images from JSON string if it exists
    services = services.map((service: any) => ({
      ...service,
      featured_images: service.featured_images ? (() => {
        try {
          return JSON.parse(service.featured_images);
        } catch (e) {
          console.error('Error parsing featured_images:', e);
          return [];
        }
      })() : []
    }));
    
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  
  // Get the appropriate icon component based on the icon name string
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case "HardHat": return HardHat;
      case "Package": return Package;
      case "Wrench": return Wrench;
      default: return Wrench;
    }
  };
  
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
            {services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              
              // Extract features from the description for now (in a real app, this would come from the API)
              const features = [
                "Professional service delivery",
                "Quality assurance",
                "Timely completion",
                "Expert consultation",
                "Project management",
                "Technical support",
              ];
              
              return (
                <div key={service.id} id={service.id} className="scroll-mt-24">
                  <div
                    className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                  >
                    <ScrollAnimation direction={index % 2 === 0 ? "left" : "right"}>
                      <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                        <ServiceGallery 
                          images={service.featured_images || []} 
                          title={service.title} 
                        />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-16 h-16 bg-accent/20 rounded-2xl -z-10" />
                      </div>
                    </ScrollAnimation>

                    <ScrollAnimation direction={index % 2 === 0 ? "right" : "left"}>
                      <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">{service.short_description}</p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {features.map((feature, i) => (
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
              );
            })}
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
