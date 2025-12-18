import { ScrollAnimation } from "./scroll-animation"
import { Shield, Award, Users, Clock, Target, Zap } from "lucide-react"

const reasons = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Uncompromising commitment to safety practices and quality of work.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Services comparative to international standards for the expanding markets.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Precisely qualified staff employed for each contracted job.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "Committed to keeping customers up to date with market changes.",
  },
  {
    icon: Target,
    title: "Customer Focus",
    description: "Primary focus on customer satisfaction and quality communication.",
  },
  {
    icon: Zap,
    title: "Adaptability",
    description: "Adapting to the ever-changing operating climate with agility.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Our Mission & <span className="text-primary">Commitment</span>
          </h2>
          <p className="text-background/70 text-lg">
            Our mission is to provide quality services that are comparative to international standards for the expanding
            markets within the DRC.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <ScrollAnimation key={reason.title} delay={index * 100}>
              <div className="text-center p-8 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <reason.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-background/60 leading-relaxed">{reason.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
