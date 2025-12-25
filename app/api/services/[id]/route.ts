import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
  updated_at: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await queryOne<Service>("SELECT * FROM services WHERE id = ?", [id])

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
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
      `UPDATE services SET 
        title = ?, slug = ?, short_description = ?, full_description = ?, 
        icon = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.short_description,
        data.full_description,
        data.icon,
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : true,
        id,
      ],
    )

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM services WHERE id = ?", [id])

    // Revalidate the services page
    revalidatePath('/services')
    revalidatePath('/admin/services')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}