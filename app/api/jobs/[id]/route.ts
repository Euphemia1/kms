import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job = await queryOne("SELECT * FROM job_postings WHERE id = ?", [id])

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
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

    await execute(
      `UPDATE job_postings SET title = ?, slug = ?, department = ?, location = ?, employment_type = ?, experience_level = ?, salary_range = ?, description = ?, requirements = ?, responsibilities = ?, is_active = ? WHERE id = ?`,
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
