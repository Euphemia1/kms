import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const jobs = await query("SELECT id, title, slug, department, location, employment_type, experience_level, salary_range, description, requirements, responsibilities, benefits, is_active, featured_video, application_deadline, created_at FROM job_postings ORDER BY created_at DESC")
    
    // Parse JSON fields and handle featured_video
    const processedJobs = jobs.map((job: any) => {
      return {
        ...job,
        requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
        responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities,
        benefits: job.benefits && typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits,
        featured_video: job.featured_video || null
      };
    });
    
    return NextResponse.json(processedJobs)
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

    const jobId = uuidv4();
    
    // Convert objects to JSON strings for JSON columns
    const requirements = typeof data.requirements === 'object' && data.requirements !== null ? JSON.stringify(data.requirements) : data.requirements;
    const responsibilities = typeof data.responsibilities === 'object' && data.responsibilities !== null ? JSON.stringify(data.responsibilities) : data.responsibilities;
    const benefits = typeof data.benefits === 'object' && data.benefits !== null ? JSON.stringify(data.benefits) : data.benefits;
    
    await execute(
  `INSERT INTO job_postings (
    id, title, slug, department, location, employment_type,
    experience_level, salary_range, description, requirements,
    responsibilities, benefits, is_active, application_deadline
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    jobId,
    data.title,
    data.slug,
    data.department,
    data.location,
    data.employment_type,
    data.experience_level,
    data.salary_range,
    data.description,
    requirements,
    responsibilities,
    benefits || null,
    data.is_active,
    data.application_deadline || null
  ]
);

    
    // Revalidate the careers page
    revalidatePath('/careers')
    revalidatePath('/admin/careers')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
