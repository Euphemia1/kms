import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT || 3306),
}

// Sign in function
async function signIn(email: string, password: string) {
  const connection = await mysql.createConnection(dbConfig)
  try {
    const [rows]: any = await connection.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    )

    if (!rows.length) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = rows[0]

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!process.env.JWT_SECRET) {
      return { success: false, error: "Server misconfiguration: JWT secret missing" }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return { success: true, token }
  } catch (err) {
    console.error("SignIn error:", err)
    return { success: false, error: "Internal server error" }
  } finally {
    await connection.end()
  }
}

// Set session cookie
async function setSessionCookie(token: string) {
  return `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60}`
}

// POST handler
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("Login attempt:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const result = await signIn(email, password)
    console.log("signIn result:", result)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const cookie = await setSessionCookie(result.token!)
    const res = NextResponse.json({ success: true })
    res.headers.set("Set-Cookie", cookie)

    return res
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
