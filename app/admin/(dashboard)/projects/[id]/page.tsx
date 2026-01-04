import { queryOne } from "@/lib/db"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string | null
  category: string
  client: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  status: string
  featured_image: string | null
  featured_video: string | null
  is_featured: boolean
  is_published: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

async function getProject(id: string) {
  const project = await queryOne<Project>(`SELECT id, title, slug, description, full_description, category, client, location, start_date, end_date, status, featured_image, featured_video, is_featured, is_published, created_by, created_at, updated_at FROM projects WHERE id = ?`, [id])
  return project
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
