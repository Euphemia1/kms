import { cookies } from "next/headers"
import { queryOne, execute } from "./db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  avatar_url: string | null
}

interface Session {
  id: string
  user_id: string
  token: string
  expires_at: Date
}

const SESSION_COOKIE_NAME = "kms_session"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await execute("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (UUID(), ?, ?, ?)", [
    userId,
    token,
    expiresAt,
  ])

  return token
}

export async function getSession(): Promise<{ user: AdminUser; session: Session } | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) return null

  const session = await queryOne<Session & AdminUser>(
    `SELECT s.*, u.email, u.full_name, u.role, u.avatar_url 
     FROM sessions s 
     JOIN admin_users u ON s.user_id = u.id 
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [sessionToken],
  )

  if (!session) return null

  return {
    user: {
      id: session.user_id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      avatar_url: session.avatar_url,
    },
    session: {
      id: session.id,
      user_id: session.user_id,
      token: session.token,
      expires_at: session.expires_at,
    },
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; token?: string }> {
  const user = await queryOne<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM admin_users WHERE email = ?",
    [email],
  )

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  const validPassword = await verifyPassword(password, user.password_hash)
  if (!validPassword) {
    return { success: false, error: "Invalid email or password" }
  }

  const token = await createSession(user.id)
  return { success: true, token }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    await execute("DELETE FROM sessions WHERE token = ?", [sessionToken])
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
