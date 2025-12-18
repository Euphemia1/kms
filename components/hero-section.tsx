"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown, Play } from "lucide-react"

// Add CSS for particle animation
const particleStyles = `
  @keyframes pulse {
    0% { opacity: 0.1; transform: scale(1); }
    100% { opacity: 0.3; transform: scale(1.2); }
  }
`

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Inject particle animation styles */}
      <style>{particleStyles}</style>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="parallax-wrapper">
          <img src="/hero-bg-1.jpg" alt="KMS Industrial Operations" className="w-full h-full object-cover object-center scale-110 transition-transform duration-1000" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/30" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${(i * 7) % 100}%`,
              left: `${(i * 13) % 100}%`,
              width: `${(i % 10) + 2}px`,
              height: `${(i % 8) + 2}px`,
              animation: `pulse ${(i % 4) + 2}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <span className="inline-block px-6 py-3 rounded-full bg-accent/25 text-accent text-base font-medium mb-8 backdrop-blur-sm border border-accent/40 shadow-lg">
              Building Excellence Since 2010
            </span>
          </div>

          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-150 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Welcome to <span className="text-accent drop-shadow-lg">KOLWEZI MULTI SERVICES</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mt-3 drop-shadow-md">(K.M.S)</span>
          </h1>

          <p
            className={`text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Your trusted partner for civil engineering, construction, and industrial services in the Democratic Republic of Congo
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg font-semibold group shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-6 text-lg font-semibold bg-white/15 border-white/40 text-white hover:bg-white/25 hover:text-white hover:border-white/60 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/about">
                <Play className="mr-3 w-5 h-5" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-white/20 transition-all duration-1000 delay-700 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {[
              { value: "15+", label: "Years Experience" },
              { value: "200+", label: "Projects Completed" },
              { value: "50+", label: "Expert Team" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2 drop-shadow-lg">{stat.value}</div>
                <div className="text-base text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
        <ChevronDown className="w-10 h-10 text-white/70 drop-shadow-lg" />
      </div>
    </section>
  )
}
