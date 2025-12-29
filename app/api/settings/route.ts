export const runtime = "nodejs"; 
import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const settings = await query("SELECT * FROM site_settings")
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    for (const [key, value] of Object.entries(data)) {
      const settingId = uuidv4();
      await execute(
        `INSERT INTO site_settings (id, setting_key, setting_value) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [settingId, key, value as string, value as string],
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
