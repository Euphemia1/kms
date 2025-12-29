
export const dynamic = "force-dynamic";
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Heart, Zap, Users, Briefcase } from "lucide-react"
import { JobsList } from "@/components/jobs-list"
import { ApplicationForm } from "@/components/application-form"
import { unstable_cache } from 'next/cache'

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
  salary_range: string
  description: string
  requirements: string | string[] // Can be JSON string or parsed array
  responsibilities: string | string[] // Can be JSON string or parsed array
  benefits: string | string[] // Can be JSON string or parsed array
  is_active: boolean
  application_deadline: string | null
  created_at: string
}

async function getJobs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache to ensure fresh data
    });
    
    if (!res.ok) {
      console.error('Failed to fetch jobs:', res.status, res.statusText);
      // Return empty array instead of mock data
      return [];
    }
    
    let jobs = await res.json();
    
    // Parse JSON fields if they're stored as JSON strings
    jobs = jobs.map((job: any) => ({
      ...job,
      requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
      responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities,
      benefits: typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits,
    }));
    
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
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
