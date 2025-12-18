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
              Building the Future of <span className="text-primary">DRC Industries</span>
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
                  <div className="text-4xl font-bold">2010</div>
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

      {/* Leadership Team */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Meet Our Team</h2>
            <p className="text-background/70 mt-4">
              Our experienced leadership team brings decades of combined expertise in mining, construction, and
              industrial services.
            </p>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((person, index) => (
              <ScrollAnimation key={person.name} delay={index * 100}>
                <div className="text-center group">
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={person.image || "/placeholder.svg"}
                      alt={person.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold">{person.name}</h3>
                  <p className="text-primary text-sm mb-2">{person.role}</p>
                  <p className="text-background/60 text-sm">{person.bio}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation direction="left">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm">
                Compliance & Certifications
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Certified Excellence</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We maintain the highest standards of compliance and are certified by leading international and local
                regulatory bodies to ensure quality and safety in all our operations.
              </p>
              <ul className="space-y-4">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full" size="lg">
                <Link href="/contact">
                  Request Certification Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </ScrollAnimation>

            <ScrollAnimation direction="right">
              <div className="grid grid-cols-2 gap-4">
                <img src="/iso-certification-badge-quality-management.jpg" alt="ISO Certification" className="rounded-xl shadow-lg" />
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Safety Certification"
                  className="rounded-xl shadow-lg mt-8"
                />
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Environmental Certification"
                  className="rounded-xl shadow-lg"
                />
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Government Accreditation"
                  className="rounded-xl shadow-lg mt-8"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
