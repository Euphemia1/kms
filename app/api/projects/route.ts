import { NextResponse } from "next/server"
import { cookies } from "next/headers"
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
    // Get session - this returns { user, session } or null
    const sessionData = await getSession();
    
    // Debug logs
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("kms_session");
    console.log("Session Cookie:", sessionCookie?.value);
    console.log("Session Data:", sessionData);

    // Check authorization - note the correct path to role
    if (!sessionData || sessionData.user.role !== "admin") {
      return NextResponse.json({ 
        error: "Unauthorized",
        debug: {
          hasSession: !!sessionData,
          role: sessionData?.user?.role
        }
      }, { status: 401 });
    }

    // Get request data
    const data = await request.json();

    // Insert project
    await execute(
      `INSERT INTO projects (
        id, title, slug, description, full_description, category,
        client, location, start_date, end_date, status,
        featured_image, is_featured, is_published, created_by
      )
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.slug,
        data.description,
        data.full_description,
        data.category,
        data.client,
        data.location,
        data.start_date,
        data.end_date,
        data.status,
        data.featured_image,
        data.is_featured,
        data.is_published,
        data.created_by
      ]
    );

    // Revalidate the projects page
    revalidatePath('/projects');
    revalidatePath('/admin/projects');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ 
      error: "Failed to create project",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}