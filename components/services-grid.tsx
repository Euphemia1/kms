"use client";

import { useState } from "react";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HardHat, Package, Wrench, ArrowRight, CheckCircle2, X } from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: string;
  featured_image?: string | null;
  gallery_images?: string[] | null;
  features?: string[] | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case "HardHat": return HardHat;
      case "Package": return Package;
      case "Wrench": return Wrench;
      default: return Wrench;
    }
  };

  const features = selectedService?.features || [
    "Professional service delivery",
    "Quality assurance",
    "Timely completion",
    "Expert consultation",
    "Project management",
    "Technical support",
  ];

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service: Service, index: number) => {
          const IconComponent = getIconComponent(service.icon);
          const serviceFeatures = service.features || [
            "Professional service delivery",
            "Quality assurance",
            "Timely completion",
            "Expert consultation",
            "Project management",
            "Technical support",
          ];
          
          return (
            <ScrollAnimation key={service.id} delay={index * 100}>
              <div 
                className="group cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedService(service);
                  setIsModalOpen(true);
                }}
              >
                {/* Display featured image if available */}
                {service.featured_image && (
                  <div className="mb-4">
                    <img 
                      src={service.featured_image} 
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                                
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.short_description}
                </p>
                                
                <ul className="space-y-2 mb-6">
                  {serviceFeatures.slice(0, 3).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="rounded-full" size="sm">
                  <Link href="/contact">
                    Get a Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </ScrollAnimation>
          );
        })}
      </div>

      {/* Modal for full description */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedService.title}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Display featured image in modal */}
              {selectedService.featured_image && (
                <div className="mb-6">
                  <img 
                    src={selectedService.featured_image} 
                    alt={selectedService.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedService.full_description}</p>
                </div>

                {selectedService.gallery_images && selectedService.gallery_images.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedService.gallery_images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedService.title} - Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-2">
                    {features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}