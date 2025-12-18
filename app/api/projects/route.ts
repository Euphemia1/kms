import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  status: string
  is_published: boolean
  created_at: string
}

export async function GET() {
  try {
    const projects = await query<Project>("SELECT * FROM projects ORDER BY created_at DESC")
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await execute(
      `INSERT INTO projects (id, title, slug, description, full_description, category, client, location, start_date, end_date, status, featured_image, is_featured, is_published, created_by) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        session.user.id,
      ],
    )
    
    // Revalidate the projects page
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
