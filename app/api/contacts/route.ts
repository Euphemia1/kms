import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"

interface Contact {
  id: string
  full_name: string
  email: string
  phone: string
  company: string
  subject: string
  service_interest: string
  message: string
  status: string
  created_at: string
}

export async function GET() {
  try {
    const contacts = await query<Contact>("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    await execute(
      `INSERT INTO contact_submissions (id, full_name, email, phone, company, subject, service_interest, message) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.full_name,
        data.email,
        data.phone || null,
        data.company || null,
        data.subject || null,
        data.service_interest || null,
        data.message,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
