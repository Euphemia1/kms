import { NextResponse } from "next/server"
import { signOut, clearSessionCookie } from "@/lib/auth"

export async function POST() {
  try {
    await signOut()
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
