import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardHat, Package, Wrench, ArrowRight, CheckCircle2 } from "lucide-react"
import { query } from "@/lib/db"
import { ServiceGallery } from "@/components/service-gallery"
import ServicesGrid from "@/components/services-grid"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  featured_image?: string | null
  gallery_images?: string[] | null
  features?: string[] | null
  sort_order: number
  is_active: boolean
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
    
    // Parse gallery_images from JSON string if it exists
    services = services.map((service: any) => {
      let parsedGalleryImages = [];
      let parsedFeatures = [];
      
      try {
        // Check if gallery_images is a string (raw from DB) or already parsed (from API)
        if (service.gallery_images) {
          if (typeof service.gallery_images === 'string') {
            // If it's a string, it might be a JSON string or 'null'/'[]'
            if (service.gallery_images !== 'null' && service.gallery_images !== '[]' && service.gallery_images.trim() !== '') {
              // Check if it's a valid JSON string
              const trimmedValue = service.gallery_images.trim();
              if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
                parsedGalleryImages = JSON.parse(service.gallery_images) || [];
              } else {
                // If it's not a valid JSON array, try to parse it as a stringified array
                parsedGalleryImages = [service.gallery_images];
              }
            }
          } else if (Array.isArray(service.gallery_images)) {
            // If it's already an array (from API), use it directly
            parsedGalleryImages = service.gallery_images;
          }
        }
      } catch (e) {
        console.error('Error parsing gallery_images:', e, 'Value:', service.gallery_images);
        // If parsing fails, try to handle it as a single image URL or empty array
        if (service.gallery_images && typeof service.gallery_images === 'string' && service.gallery_images.startsWith('http')) {
          parsedGalleryImages = [service.gallery_images];
        } else {
          parsedGalleryImages = [];
        }
      }
      
      try {
        // Check if features is a string (raw from DB) or already parsed (from API)
        if (service.features) {
          if (typeof service.features === 'string') {
            if (service.features !== 'null' && service.features !== '[]' && service.features.trim() !== '') {
              // Check if it's a valid JSON string
              const trimmedValue = service.features.trim();
              if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
                parsedFeatures = JSON.parse(service.features) || [];
              } else {
                // If it's not a valid JSON array, try to parse it as a stringified array or split by commas/lines
                try {
                  parsedFeatures = JSON.parse(`[${service.features.split(/[,\n]/).map((f: string) => JSON.stringify(f.trim())).join(',')}]`);
                } catch {
                  parsedFeatures = [service.features];
                }
              }
            }
          } else if (Array.isArray(service.features)) {
            // If it's already an array (from API), use it directly
            parsedFeatures = service.features;
          }
        }
      } catch (e) {
        console.error('Error parsing features:', e, 'Value:', service.features);
        // If parsing fails, try to handle it as a comma-separated string
        if (service.features && typeof service.features === 'string') {
          parsedFeatures = service.features.split(/[,\n]/).map((f: string) => f.trim()).filter((f: string) => f.length > 0);
        } else {
          parsedFeatures = [];
        }
      }
      
      return {
        ...service,
        gallery_images: parsedGalleryImages,
        features: parsedFeatures,
      };
    });
    
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

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {!services || services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">No services available yet.</p>
              <p className="text-sm text-muted-foreground">Check back soon or contact us for more information.</p>
            </div>
          ) : (
            <ServicesGrid services={services} />
          )}
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
