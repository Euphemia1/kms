import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job: any = await queryOne("SELECT id, title, slug, department, location, employment_type, experience_level, salary_range, description, requirements, responsibilities, benefits, is_active, featured_video, application_deadline, created_at, updated_at FROM job_postings WHERE id = ?", [id])

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    
    // Parse JSON fields and handle featured_video
    const processedJob = {
      ...job,
      requirements: typeof job.requirements === 'string' ? (() => {
        try {
          return JSON.parse(job.requirements);
        } catch (e) {
          console.error('Error parsing requirements:', e);
          return job.requirements;
        }
      })() : job.requirements,
      responsibilities: typeof job.responsibilities === 'string' ? (() => {
        try {
          return JSON.parse(job.responsibilities);
        } catch (e) {
          console.error('Error parsing responsibilities:', e);
          return job.responsibilities;
        }
      })() : job.responsibilities,
      benefits: job.benefits && typeof job.benefits === 'string' ? (() => {
        try {
          return JSON.parse(job.benefits);
        } catch (e) {
          console.error('Error parsing benefits:', e);
          return job.benefits;
        }
      })() : job.benefits,
      featured_video: job.featured_video || null
    };
    
    return NextResponse.json(processedJob)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
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

    // Convert objects to JSON strings for JSON columns
    const requirements = typeof data.requirements === 'object' && data.requirements !== null ? JSON.stringify(data.requirements) : data.requirements;
    const responsibilities = typeof data.responsibilities === 'object' && data.responsibilities !== null ? JSON.stringify(data.responsibilities) : data.responsibilities;
    const benefits = typeof data.benefits === 'object' && data.benefits !== null ? JSON.stringify(data.benefits) : data.benefits;
    
    await execute(
      `UPDATE job_postings SET title = ?, slug = ?, department = ?, location = ?, employment_type = ?, experience_level = ?, salary_range = ?, description = ?, requirements = ?, responsibilities = ?, benefits = ?, application_deadline = ?, is_active = ?, featured_video = ? WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.department || null,
        data.location || "Kolwezi, DRC",
        data.employment_type || "full-time",
        data.experience_level || null,
        data.salary_range || null,
        data.description || null,
        requirements,
        responsibilities,
        benefits || null,
        data.application_deadline || null,
        data.is_active ? 1 : 0,
        data.featured_video || null,
        id,
      ],
    )

    // Revalidate the careers page
    revalidatePath('/careers')
    revalidatePath('/admin/careers')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM job_postings WHERE id = ?", [id])

    // Revalidate the careers page
    revalidatePath('/careers')
    revalidatePath('/admin/careers')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
