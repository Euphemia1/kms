export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"

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
    const data = await request.json()

    await execute(
      `INSERT INTO job_applications (id, job_id, job_title, full_name, email, phone, cover_letter) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
      [
        data.job_id || null,
        data.job_title || null,
        data.full_name,
        data.email,
        data.phone || null,
        data.cover_letter || null,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
