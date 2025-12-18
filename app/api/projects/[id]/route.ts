import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
  is_published: boolean
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await queryOne<Project>("SELECT * FROM projects WHERE id = ?", [id])

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    await execute(
      `UPDATE projects SET title = ?, slug = ?, description = ?, full_description = ?, category = ?, client = ?, location = ?, start_date = ?, end_date = ?, status = ?, featured_image = ?, is_featured = ?, is_published = ? WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.description || null,
        data.full_description || null,
        data.category,
        data.client || null,
        data.location || null,
        data.start_date || null,
        data.end_date || null,
        data.status,
        data.featured_image || null,
        data.is_featured ? 1 : 0,
        data.is_published ? 1 : 0,
        id,
      ],
    )

    // Revalidate the projects page
    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM projects WHERE id = ?", [id])

    // Revalidate the projects page
    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
