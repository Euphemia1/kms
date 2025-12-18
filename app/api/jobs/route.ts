import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const jobs = await query("SELECT * FROM job_postings ORDER BY created_at DESC")
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
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
      `INSERT INTO job_postings (id, title, slug, department, location, employment_type, experience_level, salary_range, description, requirements, responsibilities, is_active) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      [
        data.title,
        data.slug,
        data.department || null,
        data.location || "Kolwezi, DRC",
        data.employment_type || "full-time",
        data.experience_level || null,
        data.salary_range || null,
        data.description || null,
        JSON.stringify(data.requirements || []),
        JSON.stringify(data.responsibilities || []),
        data.is_active ? 1 : 0,
      ],
    )
    
    // Revalidate the careers page
    revalidatePath('/careers')
    revalidatePath('/admin/careers')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
