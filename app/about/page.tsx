import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Eye, Heart, Award, Users, ArrowRight, Shield, FileCheck } from "lucide-react"

const values = [
  { icon: Shield, title: "Safety", description: "Uncompromising commitment to safety in every operation." },
  { icon: Award, title: "Quality", description: "Delivering excellence that meets international standards." },
  { icon: Heart, title: "Integrity", description: "Honest and transparent in all our business dealings." },
  { icon: Users, title: "Teamwork", description: "Working as a unit to achieve common goals." },
]

const leadership = [
  {
    name: "Gerald Fataki Lusinji",
    role: "Chief Executive Officer",
    image: "/team/gerald.jpeg",
    bio: "Over 20 years of experience in mining and construction industries.",
  },
  {
    name: "Katendi Mwepu",
    role: "Chief Operations Officer",
    image: "/team/katendi.jpeg",
    bio: "Expert in logistics and supply chain management.",
  },
  {
    name: "John Petulo",
    role: "Technical Director",
    image: "/team/john.jpeg",
    bio: "Civil engineering specialist with vast mining sector experience.",
  },
]

const certifications = [
  "ISO 9001:2015 Quality Management",
  "ISO 14001:2015 Environmental Management",
  "OHSAS 18001 Occupational Health & Safety",
  "DRC Ministry of Mines Accreditation",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">About Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              building the future of <span className="text-primary">DRC civil engineering and mechanical engineering services</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Since our establishment, KMS SARL has been at the forefront of civil engineering, construction, and
              industrial services in the Democratic Republic of Congo.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Company History */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation direction="left">
              <div className="relative">
                <img src="/about-hero.jpg" alt="KMS History" className="w-full rounded-2xl shadow-2xl" />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold">2021</div>
                  <div className="text-sm opacity-80">Year Founded</div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  KOLWEZI MULTI SERVICES SARL was founded with a vision to provide world-class engineering and
                  construction services to the growing mining and industrial sectors in the Democratic Republic of
                  Congo.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We are an established company; however, we are not "the new kids on the block" as our team boasts a
                  vast range of knowledge and experience working with and for large national mining companies and
                  private works.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Through ensuring the precisely qualified staff are employed for the required jobs we contract, we have
                  built a reputation for excellence and reliability that spans over a decade.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation delay={0}>
              <div className="bg-card p-10 rounded-2xl border border-border h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to provide quality services that are comparative to international standards for the
                  expanding markets within the DRC. Our primary focus is customer satisfaction followed by good safety
                  practices and quality of work.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              <div className="bg-card p-10 rounded-2xl border border-border h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading provider of engineering, construction, and industrial services in Central Africa,
                  recognized for our commitment to excellence, safety, and sustainable development in the mining sector.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">What We Stand For</h2>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollAnimation key={value.title} delay={index * 100}>
                <div className="text-center p-8 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>



      <Footer />
    </main>
  )
}
