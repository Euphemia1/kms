import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export async function GET() {
  try {
    const services = await query<Service>("SELECT * FROM services WHERE is_active = TRUE ORDER BY sort_order ASC")
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const serviceId = uuidv4();
    await execute(
      `INSERT INTO services (
        id, title, slug, short_description, full_description, icon, sort_order, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceId,
        data.title,
        data.slug,
        data.short_description,
        data.full_description,
        data.icon,
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : true
      ]
    )

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}