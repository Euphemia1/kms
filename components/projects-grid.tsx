"use client"

import { useState } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string
  category: string
  client: string
  location: string
  status: string
  featured_image: string
  start_date: string
  end_date: string
}

const categories = ["All", "construction", "mining", "logistics", "consulting", "procurement"]

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory)

  const getCategoryLabel = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1)
  }

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
                className="rounded-full"
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryLabel(category)}
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
                  <div className="group cursor-pointer" onClick={() => setSelectedProject(project)}>
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={
                          project.featured_image || "/placeholder.svg?height=400&width=600&query=construction project"
                        }
                        alt={project.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white font-medium flex items-center gap-2">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {getCategoryLabel(project.category)}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            project.status === "completed"
                              ? "bg-green-500 text-white"
                              : project.status === "ongoing"
                                ? "bg-blue-500 text-white"
                                : "bg-yellow-500 text-white"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </span>
                      )}
                      {project.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.start_date).getFullYear()}
                        </span>
                      )}
                    </div>
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
        >
          <div
            className="bg-card max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProject.featured_image || "/placeholder.svg?height=400&width=800&query=construction project"}
              alt={selectedProject.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {getCategoryLabel(selectedProject.category)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full ${
                    selectedProject.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : selectedProject.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedProject.status}
                </span>
                {selectedProject.location && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {selectedProject.location}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
              {selectedProject.client && (
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Client:</strong> {selectedProject.client}
                </p>
              )}
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
    </>
  )
}
