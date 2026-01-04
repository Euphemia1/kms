export const dynamic = "force-dynamic";

import { query } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { DeleteProjectButton } from "@/components/admin/delete-project-button"

interface Project {
  id: string
  title: string
  description: string
  category: string
  client: string | null
  location: string | null
  status: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

async function getProjects() {
  const projects = await query<Project>(`SELECT id, title, description, category, client, location, status, is_featured, is_published, created_at FROM projects ORDER BY created_at DESC`)
  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your company projects and portfolio</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button asChild>
              <Link href="/admin/projects/new">Create your first project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.is_published ? "default" : "outline"}>
                      {project.is_published ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" /> Draft
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        project.status === "completed"
                          ? "border-green-500 text-green-600"
                          : project.status === "ongoing"
                            ? "border-blue-500 text-blue-600"
                            : "border-yellow-500 text-yellow-600"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Category: {project.category}</span>
                    {project.client && <span>Client: {project.client}</span>}
                    {project.location && <span>Location: {project.location}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
