"use client"

import { useState } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string
  category: string
  client: string
  location: string
  start_date: string
  end_date: string
  status: string
  featured_image: string
  is_featured: boolean
}

interface ProjectsPageClientProps {
  projects: Project[]
  stats: Record<string, string>
}

export function ProjectsPageClient({ projects, stats }: ProjectsPageClientProps) {
  const categories = ["All", "construction", "mining", "logistics", "consulting", "procurement"]
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory.toLowerCase())

  return (
    <>
      {/* Filter */}
      <section className="py-8 border-b border-border sticky top-[72px] bg-background/95 backdrop-blur-md z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="rounded-full capitalize"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ScrollAnimation key={project.id} delay={index * 100}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
                    tabIndex={0}
                    role="button"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={
                          project.featured_image ||
                          `/placeholder.svg?height=400&width=600&query=${project.category || "/placeholder.svg"} project`
                        }
                        alt={project.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-background font-medium">View Details</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm capitalize">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-card max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedProject.featured_image ||
                `/placeholder.svg?height=400&width=800&query=${selectedProject.category || "/placeholder.svg"} project`
              }
              alt={selectedProject.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full capitalize">
                  {selectedProject.category}
                </span>
                {selectedProject.location && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {selectedProject.location}
                  </span>
                )}
                {selectedProject.start_date && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedProject.start_date).getFullYear()}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-muted-foreground mb-6">
                {selectedProject.full_description || selectedProject.description}
              </p>
              <div className="flex gap-4">
                <Button asChild className="rounded-full">
                  <Link href="/contact">Request Similar Project</Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${stats.projects_completed || "200"}+`, label: "Projects Completed" },
              { value: `${stats.years_experience || "15"}+`, label: "Years Experience" },
              { value: "50M+", label: "USD Value Delivered" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <ScrollAnimation key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-background/60">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
