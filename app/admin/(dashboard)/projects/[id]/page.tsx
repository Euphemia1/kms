import { queryOne } from "@/lib/db"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  client: string
  location: string
  start_date: string
  end_date: string
  status: string
  featured_image: string
  gallery: string
  is_featured: boolean
}

async function getProject(id: string) {
  const project = await queryOne<Project>("SELECT * FROM projects WHERE id = ?", [id])
  if (project) {
    return {
      ...project,
      gallery: typeof project.gallery === "string" ? JSON.parse(project.gallery) : project.gallery || [],
    }
  }
  return null
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Update project details</p>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
