"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Office",
    details: ["Office Av.Moero,No 13A,Q.Kasombo,C.Manika,Kolwezi", "Lualaba Province, Democratic Republic of Congo"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+243 972 144 161", "+243 823 740 298"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["gfataki.kms@gmail.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Friday: 7:00 AM - 5:00 PM", "Saturday: 7:00 AM - 2:00 PM"],
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Contact Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Let's Start a <span className="text-primary">Conversation</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Have a project in mind or need our services? We'd love to hear from you. Reach out and let's discuss how
              we can help.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <ScrollAnimation>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              </ScrollAnimation>

              {contactInfo.map((item, index) => (
                <ScrollAnimation key={item.title} delay={index * 100}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}

              {/* Map Placeholder */}
              <ScrollAnimation delay={400}>
                <div className="mt-8 rounded-2xl overflow-hidden h-64 bg-muted flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Location Map</p>
                    <p className="text-sm mt-2">Office Av.Moero,No 13A,Q.Kasombo,C.Manika,Kolwezi</p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Need Immediate Assistance?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Our team is available during business hours for urgent inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <a href="tel:+243972144161">
                  <Phone className="mr-2 w-4 h-4" />
                  Call Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <a href="mailto:gfataki.kms@gmail.com">
                  <Mail className="mr-2 w-4 h-4" />
                  Email Us
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </main>
  )
}
