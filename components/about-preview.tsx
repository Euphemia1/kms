import { ScrollAnimation } from "./scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

const highlights = [
  "DRC Registered & Operated Company",
  "International Quality Standards",
  "Experienced Mining Industry Expertise",
  "Comprehensive Service Portfolio",
]

export function AboutPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollAnimation direction="left">
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/about-team.jpg"
                  alt="KMS Team at Work"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-2xl -z-10" />

              {/* Floating Card */}
              <div className="absolute -bottom-8 left-8 bg-card p-6 rounded-xl shadow-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">15+</span>
                  </div>
                  <div>
                    <div className="font-semibold">Years of Excellence</div>
                    <div className="text-sm text-muted-foreground">Trusted Partner</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="right">
            <div className="space-y-6">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm">About Us</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Who is <span className="text-primary">KOLWEZI MULTI SERVICES?</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                KOLWEZI MULTI SERVICES SARL is a Democratic Republic of Congo registered and operated company. We are an
                established company with our team boasting a vast range of knowledge and experience working with and for
                large national mining companies and private works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our focus is on civil engineering services and constructions, maintenance and services, supply, labour,
                housekeeping and painting, cement block bricks manufacturing, and pavers targeted to the mining and
                industrial sectors within the DRC.
              </p>

              <ul className="space-y-3 py-4">
                {highlights.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" className="rounded-full group">
                <Link href="/about">
                  Discover Our Story
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
