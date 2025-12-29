export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

interface Application {
  id: string
  job_id: string
  job_title: string
  full_name: string
  email: string
  phone: string
  cover_letter: string
  status: string
  created_at: string
}

export async function GET() {
  try {
    const applications = await query<Application>("SELECT * FROM job_applications ORDER BY created_at DESC")
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const job_id = formData.get('job_id') as string || null;
    const job_title = formData.get('job_title') as string || null;
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string || null;
    const cover_letter = formData.get('cover_letter') as string || null;
    const resume = formData.get('resume') as File | null;
    
    // Process the file if it exists
    let resume_path: string | null = null;
    if (resume) {
      // In a real implementation, you would upload the file to storage
      // For now, we'll just store the filename
      resume_path = `/uploads/resumes/${resume.name}`;
    }

    const applicationId = uuidv4();
    await execute(
      `INSERT INTO job_applications (id, job_id, job_title, full_name, email, phone, cover_letter, resume_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        job_id,
        job_title,
        full_name,
        email,
        phone,
        cover_letter,
        resume_path,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
