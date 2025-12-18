import { query } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Heart, Zap, Users, Briefcase } from "lucide-react"
import { JobsList } from "@/components/jobs-list"
import { ApplicationForm } from "@/components/application-form"

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage for you and your family" },
  { icon: Zap, title: "Career Growth", description: "Continuous training and advancement opportunities" },
  { icon: Users, title: "Great Team", description: "Work alongside industry experts and professionals" },
  { icon: Briefcase, title: "Competitive Pay", description: "Market-leading salaries and performance bonuses" },
]

interface Job {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  description: string
  requirements: string
  responsibilities: string
}

async function getJobs() {
  // Mock data for jobs
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Mining Engineer",
      slug: "senior-mining-engineer",
      department: "Engineering",
      location: "Kolwezi, Lualaba Province",
      employment_type: "Full-time",
      experience_level: "Senior",
      description: "We are seeking an experienced Senior Mining Engineer to lead our technical operations in mining projects.",
      requirements: [
        "Bachelor's degree in Mining Engineering",
        "Minimum 5 years of experience in mining operations",
        "Proven leadership skills"
      ],
      responsibilities: [
        "Lead mining operations",
        "Supervise junior engineers",
        "Ensure safety compliance",
        "Optimize extraction processes"
      ]
    },
    {
      id: "2",
      title: "Logistics Coordinator",
      slug: "logistics-coordinator",
      department: "Operations",
      location: "Lubumbashi, Haut-Katanga",
      employment_type: "Full-time",
      experience_level: "Mid-level",
      description: "Responsible for coordinating logistics operations for our mining and construction projects.",
      requirements: [
        "Bachelor's degree in Logistics or related field",
        "3+ years of logistics experience",
        "Knowledge of DRC transportation regulations"
      ],
      responsibilities: [
        "Manage transportation schedules",
        "Coordinate with suppliers",
        "Track shipments",
        "Optimize delivery routes"
      ]
    },
    {
      id: "3",
      title: "Construction Project Manager",
      slug: "construction-project-manager",
      department: "Construction",
      location: "Kinshasa",
      employment_type: "Full-time",
      experience_level: "Senior",
      description: "Lead large-scale construction projects from initiation to completion, ensuring quality and timeline adherence.",
      requirements: [
        "Degree in Civil Engineering or Construction Management",
        "PMP certification preferred",
        "7+ years of project management experience"
      ],
      responsibilities: [
        "Plan and execute construction projects",
        "Manage budgets and timelines",
        "Coordinate with stakeholders",
        "Ensure compliance with safety standards"
      ]
    }
  ];
  return jobs;
}

export default async function CareersPage() {
  const jobs = await getJobs()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Careers</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Join Our <span className="text-primary">Growing Team</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Be part of a dynamic team driving industrial development in the Democratic Republic of Congo. We're always
              looking for talented individuals to join us.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Work With Us?</h2>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollAnimation key={benefit.title} delay={index * 100}>
                <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <JobsList jobs={jobs} />

      {/* Application Form */}
      <ApplicationForm jobs={jobs} />

      <Footer />
    </main>
  )
}
