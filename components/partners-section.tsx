"use client"

import { ScrollAnimation } from "./scroll-animation"
import { useEffect, useState } from "react"

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  partner_type: string
  is_active: boolean
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: "1", name: "Mutanda Mining", logo_url: "/photos/mutanda.jpeg", website_url: "", partner_type: "client", is_active: true },
    { id: "2", name: "Kamoto Copper Company", logo_url: "/photos/kamoto.jpeg", website_url: "", partner_type: "client", is_active: true },
    { id: "3", name: "Kamoa Mining", logo_url: "/photos/kamao.jpeg", website_url: "", partner_type: "client", is_active: true },
  ])

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-4">Our Partners & Clients</h2>
        </ScrollAnimation>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16">
          {partners.map((partner, index) => (
            <ScrollAnimation key={partner.id} delay={index * 100}>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-muted">
                <div className="flex items-center justify-center w-48 h-32 mb-4">
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Create a fallback element with the company name
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center w-full h-full bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20">
                            <span class="text-muted-foreground text-center font-medium px-2">${partner.name}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{partner.name}</h3>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
