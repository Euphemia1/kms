"use client"

import { useState } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Briefcase, CheckCircle2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
  requirements: string[] | string // Can be JSON string or parsed array
  responsibilities: string[] | string // Can be JSON string or parsed array
  benefits: string[] | string // Can be JSON string or parsed array
  is_active: boolean
  application_deadline: string | null
  created_at: string
}

export function JobsList({ jobs }: { jobs: Job[] }) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  const scrollToForm = (jobTitle: string) => {
    const formElement = document.getElementById("application-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
      // Dispatch custom event to set the job title
      window.dispatchEvent(new CustomEvent("selectJob", { detail: jobTitle }))
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Open Positions</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">Current Job Openings</h2>
        </ScrollAnimation>

        {jobs.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground">
              No open positions at the moment. Please check back later or send us your resume for future opportunities.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {jobs.map((job, index) => (
              <ScrollAnimation key={job.id} delay={index * 100}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.employment_type}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn("w-5 h-5 transition-transform", expandedJob === job.id && "rotate-180")}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedJob === job.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-border">
                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      {job.requirements && (
                        <>
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <ul className="space-y-2 mb-6">
                            {(Array.isArray(job.requirements) ? job.requirements : [job.requirements]).map((req: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {job.responsibilities && (
                        <>
                          <h4 className="font-semibold mb-2">Responsibilities:</h4>
                          <ul className="space-y-2 mb-6">
                            {(Array.isArray(job.responsibilities) ? job.responsibilities : [job.responsibilities]).map((resp: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      <Button className="rounded-full" onClick={() => scrollToForm(job.title)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
