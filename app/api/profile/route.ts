export const runtime = "nodejs";

import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = '06cd73b65cc986d84756ba2a56c07eb1d7cc1b7a2fbd295478a60b6e8f3c9d8a';

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

// GET current admin profile
export async function GET(request: Request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    
    if (!tokenMatch) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = tokenMatch[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    
    console.log('Fetching profile for user:', decoded.email)
    
    const users = await query<AdminUser>(
      "SELECT id, email, role, full_name AS name FROM admin_users WHERE id = ?",
      [decoded.id]
    )
    
    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    console.log('Profile fetched successfully')
    return NextResponse.json({ success: true, user: users[0] })
  } catch (error: any) {
    console.error("Error fetching profile:", error)
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// PUT update admin profile
export async function PUT(request: Request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    
    if (!tokenMatch) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = tokenMatch[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    
    const { name, email, currentPassword, newPassword } = await request.json()
    
    console.log('Updating profile for user:', decoded.email)

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 })
      }

      const users: any = await query(
        "SELECT password_hash FROM admin_users WHERE id = ?",
        [decoded.id]
      )
      
      if (!users.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const valid = await bcrypt.compare(currentPassword, users[0].password_hash)
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      await execute(
        "UPDATE admin_users SET name = ?, email = ?, password_hash = ? WHERE id = ?",
        [name, email, hashedPassword, decoded.id]
      )
    } else {
      // Just update name and email
      await execute(
        "UPDATE admin_users SET name = ?, email = ? WHERE id = ?",
        [name, email, decoded.id]
      )
    }

    console.log('Profile updated successfully')
    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}